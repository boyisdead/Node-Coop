var Student = require('./../models/student');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
var fs = require("fs");
var objectAssign = require('object-assign');

var getFileExtension = function(filename){
    return '.' + filename.substr(filename.lastIndexOf('.') + 1);
}

var getAcaYrs = function(res){
    var queryGroup = Student.distinct("academic_year");
    queryGroup.exec(function(err, acaYrs) {
        if (err)
            res.status(200).send({
                success: false,
                message: "Something went wrong while retrieving. try again.",
                err : err
            });
        if (!acaYrs || typeof acaYrs[0] == "undefined")
            res.status(204).send({
                success : true,
                message : "No Academic Year was found."
            });
        res.status(200).send({
            data : acaYrs,
            success: true,
            message: "Here you go."
        });
    });
};

var studentLogin = function(item, secretToken, expireTime, res) {
    console.log("find Student with : " + item.username);
    Student.findOne({
        "stu_code": item.username
    }, function(err, student) {
        if (err)
            res.send(err);
        if (!student) {
            res.status(404).send({
                success: false,// not found
                message: 'Authentication failed. No Student was found.'
            });
        } else if (student) {
            // check if password matches
            if (!passwordHash.verify(item.password, student.password)) {
                res.status(403).send({
                    success: false, // wrong password
                    message: 'Authentication failed. Invalid password.',
                });
            } else {
                var token = jwt.sign({
                    "display_name": student.stu_code,
                    "access_type": "student",
                    "access_id": student._id
                }, secretToken, {
                    expiresInMinutes: expireTime
                });
                console.log(token);
                res.status(200).send({
                    success : true,
                    message : "Login successful, token retrieved.",
                    token: token
                });
            }
        }
    })
}

var getStudents = function(res, criteria, project) {
    criteria = criteria || {};
    project = project || {};
    Student.find(criteria, project, function(err, docs){
        if(err)
            res.status(400).send({
                success: false,
                message: "Something went wrong while retrieving. try again.",
                err : err,
            });
        if(!docs || typeof docs[0] == "undefined") {
            res.status(204).send({
                success : true,
                message : "No Student was found."
            });
        } else {
            res.status(200).send({
                data : docs,
                success : true,
                message : "Here you go."
            });
        }
    });
};

var getStudentsByAcaYr = function(res, academic_year) {
    var criteria = { "academic_year": academic_year } || {};
    var project = { stu_code: 1, name: 1, status: 1 };
    console.log(criteria, project);
    getStudents(res, criteria, project);
};

var findStudentById = function(id, res) {
    getStudents(res, { _id: id });
};

var findStudentByCode = function(stu_code, res) {
    getStudents(res, {  "stu_code": stu_code});
};

var studentRegistration = function (item, res) { // wait for mailing module
    Student.findOne({
        stu_code: item.stu_code
    },function(err, doc){
        if(!doc){
            var newStudent = new Student();
            objectAssign(newStudent, item);
            newStudent.password = passwordHash.generate(item.password);
            newStudent.save(function(err){
                if(!err){
                    res.status(201).send({
                        success: true,
                        message: "Your account has been created."
                    });
                }
                res.send(err);
            });
        } else {
            res.status(200).send({
                success: false,
                message: "Duplicate student code."
            });
        }
    });
}

var createStudent = function(item, res) {
    Student.findOne({
        "stu_code": item.stu_code
    },function(err, doc){
        if(!doc){
            var newStudent = new Student();
            objectAssign(newStudent, item);
            newStudent.password = passwordHash.generate(item.password);
            newStudent.save(function(err){
                if(!err){
                    res.status(201).send({
                        success: true,
                        message: "Account has been created."
                    });
                }
                res.json({
                    err: err,
                    message : "Something went wrong! try again.",
                    success : false
                });
            });
        } else {
            res.status(200).send({
                success: false,
                message: "Duplicate student code."
            });
        }
    });
};

var updateStudent = function(item, res) {
    if (typeof item.password != 'undefined')
        item.password = passwordHash.generate(item.password);

    Student.findOne({
        _id: item._id
    }, function(err, doc){
        if(err)
            res.status(200).send({
                success: false,
                message: "Something went wrong while finding Student. try again.",
                err : err
            });
        if(doc){
            objectAssign(doc,item);
            doc.save(function (err){
                if(err){
                    res.status(200).send({
                        success: false,
                        message: "Something went wrong while saving Student. try again.",
                        err : err
                    });
                }
                res.status(200).send({
                    success : true,
                    message: "Student updated."
                });
            });
        } else {
            res.status(404).send({
                success: false,
                message: "No Student was found."
            });
        }
    });
};

var lockStuProfile = function(id, res){  // set up a lock on student status

    Student.findOne({
        _id: id
    }, function(err, doc) {
        console.log(doc);
        if (doc != null) {
            doc.status.profile = true;
            if(typeof doc.name == 'undefined'){
                if (typeof doc.name.f_th == 'undefined' || doc.name.f_th == '')
                    doc.status.profile = false; 
                if (typeof doc.name.l_th == 'undefined' || doc.name.l_th == '')
                    doc.status.profile = false; 
                if (typeof doc.name.f_en == 'undefined' || doc.name.f_en == '')
                    doc.status.profile = false; 
                if (typeof doc.name.l_en == 'undefined' || doc.name.l_en == '')
                    doc.status.profile = false; 
                if (typeof doc.name.t_en == 'undefined' || doc.name.t_en == '')
                    doc.status.profile = false; 
                if (typeof doc.name.t_th == 'undefined' || doc.name.t_th == '')
                    doc.status.profile = false; 
            }
            if (typeof doc.academic_year == 'undefined'|| doc.academic_year == '')
                doc.status.profile = false; 
            if (typeof doc.sex == 'undefined' || doc.sex == '')
                doc.status.profile = false; 
            // if (typeof doc.advisor_id == 'undefined' || doc.advisor_id == '')
            //     doc.status.profile = false; 
            if (typeof doc.tel == 'undefined' || doc.tel == '')
                doc.status.profile = false; 
            if (typeof doc.contact_email == 'undefined' || doc.contact_email == '')
                doc.status.profile = false; 
            if (typeof doc.password == 'undefined' || doc.password == '')
                doc.status.profile = false; 

            if (doc.status.profile){
                doc.profileLock = true;
                msg = {success:true};
            } else {
                doc.profileLock = false;
                msg = {success:false,reason:"Profile's not complete.",err_code:40};
            }

            doc.save();
        } else {
            console.log("Not found - status not set",id);
            msg = {success:false,reason:"Profile's not found.",err_code:44};
        }

        if (err)
            res.send(err);
        else 
            res.json(msg);
    });
};

var unLockStuProfile = function(id, res){  

    Student.findOne({
        _id: id
    }, function(err, doc) {
        if (doc != null) {
            doc.profileLock = false;
            doc.status.profile = false;
            msg = {success:true};
            doc.save();
        } else {
            msg = {success:false,reason:"Student not found",err_code:44};
        }
        if (err)
            res.send(err);
        else
            res.json(msg);
    });
};

var uploadPicture = function(item, res, next){
    var tmp_path = item.file.path;
    var time_stamp = Date.now();
        console.log(tmp_path,time_stamp);
    console.log("Creating...", item.body);

    var new_file_name = item.file.filename + time_stamp + getFileExtension(item.file.originalname);
    var target_path = '/uploads/pictures/profile/' + new_file_name;
    console.log("file name: " + new_file_name);
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream( './public' + target_path);
    src.pipe(dest);
    src.on('end', function() {
        Student.findOne({
            _id: item.body.student_id
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

var pwChangeStudent = function(item, res) {
    Student.findOne({
        _id: item._id
    }, function(err, doc) {
        if (doc != null) {
            if (passwordHash.verify(item.oldPassword, doc.password)) {
                doc.password = passwordHash.generate(item.newPassword);
                doc.save();
                msg = {success:true, message: "Password changed."};
            } else
                res.status(403).send({success:false, message:"Invalid old-password."});
        } else {
            res.status(403).send({success:false, message:"No Student was found."});
        }
        if (err)
            msg.err = err;
        res.status(200).send(msg);
    });
};

var delStudent = function(item, res) {
    Student.findOneAndRemove({
        _id: item
    }, function(err, doc) {
        if (!doc)
            res.status(404).send({
                success: false,
                message: "Student does not exist."
            });
        if(err)
            res.status(200).send({
                success: false,
                message: "Something went wrong while removing. try again.",
                err :err
            });
        res.status(200).send({
            success: true,
            message: "Student removed."
        });
    })
};

var getDocuments = function (academic_year, res){
    var criteria;

    if (academic_year != "" && typeof academic_year != "undefined" && academic_year != "all"){
        criteria = academic_year;
    } else {
        criteria = {$ne:""}
    }

    Student.aggregate([
        {$project:{_id:0,documents:1}}, 
        {$match:{"documents":{$exists:true}}}
    ])
    .unwind("documents")
    .exec(function(err,docs){
        if(err)
            res.send(err);
        res.json(docs);
    });
}
//   My new Documents Query
//   Model
// .aggregate({ $match: { age: { $gte: 21 }}})
// .unwind('tags')
// .exec(callback)
//db.students.aggregate([{$unwind:"$documents"},{$match:{"documents":{$exists:true}}},{$project:{documents:1}}]).pretty()


var getDocumentsWithOwner = function(academic_year, res) {
    var criteria;

    if (academic_year != "" && typeof academic_year != "undefined" && academic_year != "all"){
        criteria = academic_year;
    } else {
        criteria = {$ne:""}
    }

    Student.find({
        "academic_year": criteria,
        "documents":{$exists:true}
    },{documents:1,name:1},function(err,docs){
        if (err)
            res.send(err)
        res.json(docs)
    });
};

module.exports = {
	'studentLogin': studentLogin,
	'getStudents': getStudents,
	'getStudentsByAcaYr': getStudentsByAcaYr,
    'findStudentById': findStudentById,
    'findStudentByCode': findStudentByCode,
	'createStudent': createStudent,
	'updateStudent': updateStudent,
	'lockStuProfile': lockStuProfile,
	'unLockStuProfile': unLockStuProfile,
	'uploadPicture': uploadPicture,
	'pwChangeStudent': pwChangeStudent,
	'delStudent': delStudent,
	'getAcaYrs': getAcaYrs,
    'getDocuments': getDocuments,
    'getDocumentsWithOwner': getDocumentsWithOwner,
    'studentRegistration': studentRegistration

}