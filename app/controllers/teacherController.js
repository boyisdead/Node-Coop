var Teacher = require('./../models/teacher');
var Counter = require('./../models/counter');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
var objectAssign = require('object-assign');
var fs = require("fs");

var default_profile = './uploads/pictures/profile/default.png';

var numToLengthString = function(num, length) {
    var newNum = "" + num.toString();
    while (newNum.length < length) {
        newNum = "0" + newNum;
    }
    return newNum;
}

var autoPrefixId = function(prefix, max, numLong) {
    var new_id = prefix.concat(numToLengthString(max, numLong));
    console.log(new_id);
    return new_id;
};

function deleteFiles(files, callback){
    var i = files.length;
    files.forEach(function(filepath){
        fs.unlink(filepath, function(err) {
            i--;
            if (err) {
                callback(err);
                return;
            } else if (i <= 0) {
                callback(null);
            }
        });
    });
}

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

var uploadPicture = function(res, item, next){
    var tmp_path = item.file.path;
    var time_stamp = Date.now();
    console.log(tmp_path, time_stamp);
    console.log("Creating...", item.body);

    var new_file_name = item.file.filename + time_stamp + getFileExtension(item.file.originalname);
    var target_path = '/uploads/pictures/profile/' + new_file_name;
    console.log("file name: " + new_file_name);
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream( './public' + target_path);
    src.pipe(dest);
    src.on('end', function() {
        Teacher.findOne({
            _id: item.body._id
        }, function(err,doc){
            console.log(doc);
            if (doc!=null){
                console.log("saving picture path...");
                doc.profile_picture ='.' + target_path;
                doc.save();
                res.json({success:true});
            } else {
                res.send(err);
            }
        });
    });
    src.on('error', function(err) {
        res.json({success:false});
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
        else if(doc.profile_picture!=default_profile){
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
    'pwChangeTeacher': pwChangeTeacher,
    'delTeacher': delTeacher,
    'TeacherTypeAhead': TeacherTypeAhead
}