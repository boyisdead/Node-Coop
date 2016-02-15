var Teacher = require('./../models/teacher');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
var objectAssign = require('object-assign');

var teacherLogin = function(item, secretToken,expireTime, res) {
    console.log("find Teacher with : " + item.username);
    Teacher.findOne({
        "staff_code": item.username
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
                    "display_name": teacher.staff_code,
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

var getTeacher = function(res) {
    Teacher.find(function(err, teachers) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
        res.json(teachers); // return all teachers in JSON format
    });
};

var findTeacher = function(item, mode, res) {
    if (mode == 'i') {
        Teacher.findOne({
            _id: item
        }, function(err, teachers) {
            console.log("id", item, err, teachers);
            if (err)
                res.send(err)
            res.json(teachers); // return all teachers in JSON format
        });
    } else if (mode == 'c') {
        Teacher.findOne({
            "staff_code": item
        }, function(err, teachers) {
            console.log("code", item, err, teachers);
            if (err)
                res.send(err)
            res.json(teachers); // return all teachers in JSON format
        });
    }
};

var createTeacher = function(item, res) {
    Teacher.findOne({
        staff_code: item.staff_code
    },function(not_found,doc){
        if(not_found){
            var newTeacher = new Teacher();
            objectAssign(newTeacher,item);
            newTeacher.password=  passwordHash.generate(item.password);
            newTeacher.save(function(err) {
            if (err)
                res.send(err);
            getTeacher(res);
            })
        } else {
            res.json({
                success: false,
                message: 'Duplicated staff code.'
            });
        }
    });
    
};

var updateTeacher = function(item, res) {
    Teacher.findOne({
        _id: item._id
    }, function(err, doc) {
        if (doc != null) {
            objectAssign(doc,item);
            if (typeof item.password != 'undefined')
                doc.password = passwordHash.generate(item.password);

            doc.save();
        } else console.log("Not found - not update");

        if (err)
            res.send(err);
        getTeacher(res);
    });
}


var pwChangeTeacher = function(item, res) {
    console.log("param item", item);
    Teacher.findOne({
        _id: item._id
    }, function(err, doc) {
        if (doc != null) {

            console.log(item.oldPassword, item.newPassword, doc.password);
            console.log(passwordHash.generate(item.oldPassword));

            if (passwordHash.verify(item.oldPassword, doc.password)) {
                doc.password = passwordHash.generate(item.newPassword);
                doc.save();
                msg = "Password changed";
            } else msg = "Old password not match";

        } else msg = "Id not found - not update";

        if (err)
            res.send(err);
        res.json(msg);
    });
}

var delTeacher = function(item, res) {
    Teacher.remove({
        _id: item
    }, function(err) {
        if (err)
            res.send(err);
        getTeacher(res);
    })
};

var TeacherTypeAhead = function(res){
    Teacher.find(function(err, acadePos) {
        if (err)
            res.send(err)
        res.json(acadePos);
    })
    .sort('-staff_code')
    .select('staff_code first_name_th last_name_th');
}

module.exports = {
    'teacherLogin': teacherLogin,
    'getTeacher': getTeacher,
    'findTeacher': findTeacher,
    'createTeacher': createTeacher,
    'updateTeacher': updateTeacher,
    'pwChangeTeacher': pwChangeTeacher,
    'delTeacher': delTeacher,
    'TeacherTypeAhead': TeacherTypeAhead
}