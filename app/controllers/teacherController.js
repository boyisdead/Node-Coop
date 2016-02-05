var Teacher = require('./../models/teacher');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');

var teacherLogin = function(item, res, app) {
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
            console.log("Guesing...");
            console.log(teacher.password);
            console.log(passwordHash.generate(teacher.password));
            console.log(item.password);

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
                }, app.get('secretToken'), {
                    expiresInMinutes: 30 // expires in 1/2 hour
                });
                console.log(token);
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
    var newTeacher = new Teacher({
        staff_code: item.staff_code,
        password: passwordHash.generate(item.password),
        acade_pos: {
            full_th: item.acade_pos.full_th,
            full_en: item.acade_pos.full_en,
            init_th: item.acade_pos.init_th,
            init_en: item.acade_pos.init_en
        },
        name: {
            t_th: item.name.t_th,
            f_th: item.name.f_th,
            l_th: item.name.l_th,
            t_en: item.name.t_en,
            f_en: item.name.f_en,
            l_en: item.name.l_en,
        },
        contact_email: item.contact_email,
        tel: item.tel,
        sex: item.sex,
    });

    newTeacher.save(function(err) {
        if (err)
            res.send(err);
        getTeacher(res);
    })
};

var updateTeacher = function(item, res) {
    Teacher.findOne({
        _id: item._id
    }, function(err, doc) {
        if (doc != null) {
            if (item.name) {
                if (typeof item.name.f_th != 'undefined')
                    doc.name.f_th = item.name.f_th;
                if (typeof item.name.l_th != 'undefined')
                    doc.name.l_th = item.name.l_th;
                if (typeof item.name.f_en != 'undefined')
                    doc.name.f_en = item.name.f_en;
                if (typeof item.name.l_en != 'undefined')
                    doc.name.l_en = item.name.l_en;
                if (typeof item.name.t_th != 'undefined')
                    doc.name.t_th = item.name.t_th;
                if (typeof item.name.t_en != 'undefined')
                    doc.name.t_en = item.name.t_en;
            }
            if (item.acade_pos) {
                if (typeof item.acade_pos.init_en != 'undefined')
                    doc.acade_pos.init_en = item.acade_pos.init_en;
                if (typeof item.acade_pos.init_th != 'undefined')
                    doc.acade_pos.init_th = item.acade_pos.init_th;
                if (typeof item.acade_pos.full_en != 'undefined')
                    doc.acade_pos.full_en = item.acade_pos.full_en;
                if (typeof item.acade_pos.full_th != 'undefined')
                    doc.acade_pos.full_th = item.acade_pos.full_th;
            }
            if (typeof item.sex != 'undefined')
                doc.sex = item.sex;
            if (typeof item.tel != 'undefined')
                doc.tel = item.tel;
            if (typeof item.contact_email != 'undefined')
                doc.contact_email = item.contact_email;

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