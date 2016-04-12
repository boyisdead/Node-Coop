var Teacher = require('./../models/teacher');
var Counter = require('./../models/counter');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
var objectAssign = require('object-assign');
var fs = require("fs");

var deleteFiles = require('./../utilities/deleteFiles').deleteFiles;
var getFileExtension = require('./../utilities/misc').getFileExtension;
var numToLengthString = require('./../utilities/misc').numToLengthString;
var autoPrefixId = require('./../utilities/misc').autoPrefixId;
var company_picture_dir = require('../../config/setting').company_picture_dir;

var default_profile_picture = require('../../config/setting').default_profile_picture;
var profile_picture_dir = require('../../config/setting').profile_picture_dir;

var teacherLogin = function(res, item, secretToken,expireTime) {
    console.log("find Teacher with : " + item.username);
    Teacher.findOne({
        "_id": item.username
    }, function(err, teacher) {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Something went wrong while retrieving. try again.",
                error : err
            })
        if (!teacher) 
            return res.status(401).send({
                success: false,
                message: 'Authentication failed. Wrong Username.',
            });
            // check if password matches
        if (!passwordHash.verify(item.password, teacher.password)) 
            return res.status(401).send({
                success: false,
                message: 'Authentication failed. Wrong password.',
            });
        var token = jwt.sign({
            "display_name": teacher.academic_pos + " " +teacher.name.first,
            "access_type": "teacher",
            "access_id": teacher._id,
            "success": true,
        }, secretToken, {
            expiresInMinutes: expireTime // expires in 1/2 hour
        });
        return res.status(200).send({
            success: true,
            result: {
                token : token
            }
        })
    })
}

var getTeacher = function(res, criteria, project, option) {
    criteria = criteria || {};
    project = project || {};
    option = option || {};
    Teacher.find(criteria, project, option, function(err, teachers) {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Something went wrong while retrieving. try again.",
                error : err,
            });
        return res.status(200).send({
            result : teachers,
            success : true
        });
    });
};

var findTeacherById = function(res, item) {
    getTeacher(res, { _id: item });
};

var createTeacher = function(res, item) {
    Counter.findOneAndUpdate({_id:"teachers"},{ $inc : { "seq": 1 }}, function(err, doc){
        var newTeacher = new Teacher();
        objectAssign(newTeacher, item);
        newTeacher.password = passwordHash.generate(item.password);
        newTeacher._id = autoPrefixId("PS", doc.seq, 4);
        newTeacher.save(function(err){
            if(err)
                return res.status(201).send({
                    error : err,
                    message : "Something went wrong! try again.",
                    success : false
                });

            return res.status(201).send({
                success: true,
                message: "Account has been created."
            });
        });
    });
};

var updateTeacher = function(res, item) {
    Teacher.findOne({
        _id: item._id
    }, function(err, doc) {
        if (err)
            return res.status(500).send({success: false, error: err});
        if (!doc) 
            return res.status(500).send({success: false, error: err});
        console.log(item);
        if(item.contact)
            objectAssign(doc.contact, item.contact);
        if(item.name)
            objectAssign(doc.name, item.name);
        objectAssign(doc, item);
        if (typeof item.password != 'undefined')
            doc.password = passwordHash.generate(item.password);
        console.log(doc);
        doc.save(function(err){
            if (err)
                return res.status(500).send({success: false, error: err});
            return res.status(200).send({success: true});
        });
    });
}

var uploadPicture = function(res, id, item){

    if(!item)
        return res.status(400).send({
            success: false,
            error: "No picture provided."
        })

    console.log("file teacher: " , item, id);
    var tmp_path = item.path;

    var new_file_name = item.filename + getFileExtension(item.originalname);
    var target_path = profile_picture_dir + new_file_name;
    console.log("file name: " + new_file_name);
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream( './public' + target_path);
    src.pipe(dest);
    src.on('end', function() {
        Teacher.findOne({
            _id: id
        }, function(err,doc){
            if(err) {
                fs.unlinkSync(tmp_path);
                return res.status(500).send({
                    success: false,
                    error: err,
                    message: "Something went wrong while retrieving. try again"
                })
            }
            if (!doc){
                fs.unlinkSync(tmp_path);
                return res.status(404).send({
                    success: false,
                    message: "Account not found - not update"
                })
            }

            var old_file = doc.profile_picture.replace('./','./public/');
            var newProfile  = '.' + target_path;
            console.log("saving picture path...", newProfile, old_file);
            if (old_file != default_profile_picture) {
                fs.unlink(old_file, function(err) {
                    if(err)
                        console.log(err)
                    console.log("file deleted");
                });
            }
            Teacher.findOneAndUpdate({_id: id},{profile_picture: newProfile}, function(err){
                if(err){
                    fs.unlinkSync(tmp_path);
                    return res.status(500).send({
                        success: false,
                        error: err,
                        message: "Something went wrong while retrieving. try again"
                    })
                }
                fs.unlinkSync(tmp_path);
                return res.status(200).send({
                    success: true,
                    message: "Profile picture updated."
                })
            });
        });
    });
    src.on('error', function(err) {
        fs.unlinkSync(tmp_path);
        return res.status(500).send({
            success: false,
            error: err,
            message: "Something went wrong while retrieving. try again"
        })
    });
};


var pwChangeTeacher = function(res, item) {
    Teacher.findOne({
        _id: item._id
    }, function(err, doc) {
        if(err){
            return res.status(500).send({
                success: false,
                error: err,
                message: "Something went wrong while retrieving. try again"
            })
        }
        if (!doc) {
            return res.status(404).send({
                success: false,
                message: "Account not found."
            })
        }
        console.log("Change password from %s to %s (in db is %s).", item.oldPassword, item.newPassword);
        if (passwordHash.verify(item.oldPassword, doc.password)) {
            doc.password = passwordHash.generate(item.newPassword);
            doc.save(function(err){
                if(err)
                    return res.status(500).send({
                        success: false,
                        error: err,
                        message: "Something went wrong while retrieving. try again" 
                    })
                return res.status(200).send({
                    success: true,
                    message: "Password changed."
                })
            });
        } else {
            return res.status(400).send({
                success: false,
                message:"Old password not match."
            })
        }
    });
}

var delTeacher = function(res, item) {
    Teacher.findOne({
        _id: item
    }, function(err, doc) {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Something went wrong while removing. try again.",
                error :err
            });
        if (!doc)
            return res.status(404).send({
                success: false,
                error: "Account not found"
            });
        // remove profile picture
        if(doc.profile_picture != default_profile_picture){
            var remainFile = [];
            remainFile.push(doc.profile_picture.replace('./','./public/'));
            console.log(remainFile);
            deleteFiles(remainFile, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('all files removed');
                }
            });
        }
        Teacher.findOneAndRemove({"_id": item}, function(err, doc){
            if(err)
                return res.status(500).send({
                    success: false,
                    message: "Something went wrong while removing. try again.",
                    err :err
                });
            return res.status(200).send({
                success: true,
                message: "Account removed."
            });
        });
    })
};

var TeacherTypeAhead = function(res){
    Teacher.find(function(err, teacher) {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Something went wrong while retrieving. try again.",
                error :err
            });
        return res.status(200).send({
            success: true,
            result: teacher
        });
    })
    .sort('-_id')
    .select('_id first_name_th last_name_th');
}

module.exports = {
    'teacherLogin': teacherLogin,
    'getTeacher': getTeacher,
    'findTeacherById': findTeacherById,
    'createTeacher': createTeacher,
    'updateTeacher': updateTeacher,
    'uploadPicture': uploadPicture,
    'pwChangeTeacher': pwChangeTeacher,
    'delTeacher': delTeacher,
    'TeacherTypeAhead': TeacherTypeAhead
}