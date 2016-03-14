var Teacher = require('./../models/teacher');
var Counter = require('./../models/counter');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
var objectAssign = require('object-assign');

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

var teacherLogin = function(item, secretToken,expireTime, res) {
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

var findTeacher = function(item, res) {
    getTeacher(res, { _id: item });
};

var createTeacher = function(item, res) {
    Teacher.findOne({
        email: item.email
    },function(err,doc){
        if(!doc){
            console.log("valid email");
            Counter.findOneAndUpdate({_id:"teachers"},{ $inc : { "seq": 1 }}, function(err, doc){
                 console.log("Teacher number : " + doc.seq);
                var newTeacher = new Teacher();
                objectAssign(newTeacher,item);
                newTeacher.password=  passwordHash.generate(item.password);
                newTeacher._id = autoPrefixId("PS", doc.seq, 4);
                newTeacher.save(function(err) {
                    if (err)
                        res.send(err);
                    res.json({ success: true });
                });
            });
        } else {
            res.json({
                success: false,
                message: 'Duplicated email.'
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
        res.json({success:true});
    });
}


var pwChangeTeacher = function(item, res) {
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
        res.json({success:true});
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
    'findTeacher': findTeacher,
    'createTeacher': createTeacher,
    'updateTeacher': updateTeacher,
    'pwChangeTeacher': pwChangeTeacher,
    'delTeacher': delTeacher,
    'TeacherTypeAhead': TeacherTypeAhead
}