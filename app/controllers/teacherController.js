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
        if (err)
            res.send(err);
        if (!teacher) {
            res.json({
                success: false,
                message: 'Authentication failed. Teacher not found.',
                obj: item,
                tar_obj: teacher
            });
        } else if (teacher) {
            // check if password matches
            if (!passwordHash.verify(item.password, teacher.password)) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.',
                });
            } else {
                var token = jwt.sign({
                    "display_name": teacher.academic_pos + " " +teacher.name.first,
                    "access_type": "teacher",
                    "access_id": teacher._id,
                    "success": true,
                }, secretToken, {
                    expiresInMinutes: expireTime // expires in 1/2 hour
                });
                res.json({
                    token: token
                });
            }
        }
    })
}

var getTeacher = function(res, criteria, projection) {
    criteria = criteria || {};
    projection = projection || {};
    Teacher.find(criteria, projection, function(err, teachers) {
        if(err)
            res.status(400).send({
                success: false,
                message: "Something went wrong while retrieving. try again.",
                err : err,
            });
        if(!teachers || typeof teachers[0] == "undefined") {
            res.status(204).send({
                success : true,
                message : "No Teacher was found."
            });
        } else {
            res.status(200).send({
                data : teachers,
                success : true,
                message : "Here you go."
            });
        }
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
            if(!err){
                res.status(201).send({
                    success: true,
                    message: "Account has been created."
                });
            } else {
                res.json({
                    err: err,
                    message : "Something went wrong! try again.",
                    success : false
                });
            }
        });
    });
};

var updateTeacher = function(res, item) {
    Teacher.findOne({
        _id: item._id
    }, function(err, doc) {
        if (doc != null) {
            objectAssign(doc.contact, item.contact);
            objectAssign(doc.name, item.name);
            objectAssign(doc, item);
            if (typeof item.password != 'undefined')
                doc.password = passwordHash.generate(item.password);
            doc.save();
        } else console.log("Account not found - not update");

        if (err)
            res.status(500).send({success:false,err:err});
        res.status(200).send({success:true});
    });
}

var uploadPicture = function(res, id, item){

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
                res.status(500).send({
                    success: false,
                    err: err,
                    message: "Something went wrong while retrieving. try again"
                })
            } else if (doc){
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
                Teacher.findOneAndUpdate({_id : id},{profile_picture:newProfile},function(err){
                    if(err){
                        res.status(500).send({
                            success: false,
                            err: err,
                            message: "Something went wrong while retrieving. try again"
                        })
                    } else {
                        res.status(200).send({
                            success: true,
                            message: "Profile picture updated."
                        })
                    }
                });
               
            } else {
                res.status(200).send({
                    success: false,
                    message: "Account not found - not update"
                })
            }
        });
    });
    src.on('error', function(err) {
        res.status(500).send({
            success: false,
            err: err,
            message: "Something went wrong while retrieving. try again"
        })
    });
    fs.unlinkSync(tmp_path);
};


var pwChangeTeacher = function(res, item) {
    Teacher.findOne({
        _id: item._id
    }, function(err, doc) {
        if (doc != null) {
            console.log("Change password from %s to %s (in db is %s).", item.oldPassword, item.newPassword);
            if (passwordHash.verify(item.oldPassword, doc.password)) {
                doc.password = passwordHash.generate(item.newPassword);
                doc.save();
                msg = "Password changed";
            } else msg = "Old password not match";

        } else msg = "Account not found - not update";

        if (err)
            res.send(err);
        res.json(msg);
    });
}

var delTeacher = function(res, item) {
    Teacher.findOne({
        _id: item
    }, function(err, doc) {
        if (err) 
            res.send(err);
        else if (!doc)
            res.send({success:false});
        else if(doc.profile_picture!=default_profile_picture){
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
            Teacher.findOneAndRemove({"_id": item}, function(err, doc){
                if(err)
                    res.status(200).send({
                        success: false,
                        message: "Something went wrong while removing. try again.",
                        err :err
                    });
                else
                    res.status(200).send({
                        success: true,
                        message: "Account removed."
                    });
            });
        }
    })
};

var TeacherTypeAhead = function(res){
    Teacher.find(function(err, teacher) {
        if (err)
            res.send(err)
        res.json(teacher);
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