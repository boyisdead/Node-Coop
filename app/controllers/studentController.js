var Student = require('./../models/student');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');

var studentLogin = function(item, res, app) {
    console.log("find Student with : " + item.username);
    Student.findOne({
        "stu_code": item.username
    }, function(err, student) {
        if (err)
            res.send(err);
        if (!student) {
            res.json({
                success: false,
                err_code : 11, // not found
                message: 'Authentication failed. Student not found.',
                obj: item,
                tar_obj: student
            });
        } else if (student) {
            // check if password matches
            if (!passwordHash.verify(item.password, student.password)) {
                res.json({
                    success: false,
                    err_code : 12, // wrong password
                    message: 'Authentication failed. Wrong password.',
                });
            } else {
                var token = jwt.sign({
                    "display_name": student.stu_code,
                    "access_type": "student",
                    "access_id": student._id,
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

var getStudents = function(res) {
    console.log("get student list");
    var query = Student.find().sort({
        stu_code: 1
    });

    query.exec(function(err, students) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(students); // return all students in JSON format
    });
};

var getStudentsByAcaYr = function(academic_year, res) {
    // console.log("get student by acaYr");
    // var query = Student.find({ academic_year : acaYr }).sort({
    //     stu_code: 1
    // });

    // query.exec(function(err, students) {

    //     // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    //     if (err)
    //         res.send(err)

    //     res.json(students); // return all students in JSON format
    // });

    var criteria;

    if (academic_year != "" && typeof academic_year != "undefined" && academic_year != "all"){
        criteria = academic_year;
    } else {
        criteria = {$ne:""}
    }

    console.log(criteria);

    Student.find({
        "academic_year": criteria
    },{stu_code:1,name:1,status:1},function(err,students){
        if (err)
            res.send(err)
        res.json(students)
    });
};

var findStudent = function(data, res) {
    console.log(data);
    if (data.mode == 'i') {
        Student.findOne({
            _id: data.id
        }, function(err, students) {
            console.log(students);
            if (err)
                res.send(err)
            res.json(students);
        });
    } else if (data.mode == 'c') {
        Student.findOne({
            "stu_code": data.id
        }, function(err, students) {
            console.log(students);
            if (err)
                res.send(err)
            res.json(students);
        });
    }
};

var createStudent = function(item, res) {
    var newStudent = new Student({
        stu_code: item.stu_code,
        name: {
            t_th: item.name.t_th,
            f_th: item.name.f_th,
            l_th: item.name.l_th,
            t_en: item.name.t_en,
            f_en: item.name.f_en,
            l_en: item.name.l_en
        },
        contact_email: item.contact_email,
        tel: item.tel,
        advisor_id: item.advisor_id,
        sex: item.sex,
        academic_year : item.academic_year,
        password: passwordHash.generate(item.password) // random pass algo here 
    });

    newStudent.save(function(err) {
        if (err) {
            res.send(err);
        } else {
            data = {id:newStudent.stu_code,mode:'c'};
            findStudent(data,res);
            // res.json({success:true});
        }
    })
};

var updateStudent = function(item, res) {
    Student.findOne({
        _id: item._id
    }, function(err, doc) {
        if (doc != null) {
            console.log(doc);
            //for initiate new format
            if (item.name) {
                if (typeof item.name.f_th != 'undefined')
                    doc.name.f_th = item.name.f_th;
                if (typeof item.name.l_th != 'undefined')
                    doc.name.l_th = item.name.l_th;
                if (typeof item.name.f_en != 'undefined')
                    doc.name.f_en = item.name.f_en;
                if (typeof item.name.l_en != 'undefined')
                    doc.name.l_en = item.name.l_en;
                if (typeof item.name.t_en != 'undefined')
                    doc.name.t_en = item.name.t_en;
                if (typeof item.name.t_th != 'undefined')
                    doc.name.t_th = item.name.t_th;
            }

            if (typeof item.sex != 'undefined')
                doc.sex = item.sex;
            if (typeof item.advisor_id != 'undefined')
                doc.advisor_id = item.advisor_id;
            if (typeof item.tel != 'undefined')
                doc.tel = item.tel;
            if (typeof item.contact_email != 'undefined')
                doc.contact_email = item.contact_email;
            console.log(doc.contact_email);
            if (typeof item.password != 'undefined')
                doc.password = passwordHash.generate(item.password);

            doc.profileLock = false;
            doc.save();
            msg= {success:true};
        } else {
            msg= {success:false,reason:"Student not found",err_code:44};
        }

        if (err)
            res.send(err);
        else
            res.json(msg);
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
            console.log("status : " ,doc.status);
            console.log(doc.status.profile);
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

var uploadPicture = function(item,res,next){
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
                msg = {success:true};
            } else
                msg = {success:false,reason:"Invalid old-password",err_code:41};
        } else {
            msg = {success:false,reason:"Student not found",err_code:44};
        }

        if (err)
            res.send(err);
        else 
            res.json(msg);
    });
};

var delStudent = function(item, res) {
    Student.remove({
        _id: item
    }, function(err) {
        if (err)
            res.send(err);
        getStudents(res);
    })
};

var getAcaYrs = function(res){
    var queryGroup = Student.distinct("academic_year");
    queryGroup.exec(function(err, acaYrs) {
        if (err)
            res.send(err)

        res.json(acaYrs);
    });
};

var getDocuments = function(academic_year, res) {
    var criteria;

    if (academic_year != "" && typeof academic_year != "undefined" && academic_year != "all"){
        criteria = academic_year;
    } else {
        criteria = {$ne:""}
    }

    Student.find({
        "academic_year": criteria,
        "documents":{$exists:true}
    },{stu_code:1,name:1,documents:1},function(err,documents){
        if (err)
            res.send(err)
        res.json(documents)
    });
};

module.exports = {
	'studentLogin': studentLogin,
	'getStudents': getStudents,
	'getStudentsByAcaYr': getStudentsByAcaYr,
	'findStudent': findStudent,
	'createStudent': createStudent,
	'updateStudent': updateStudent,
	'lockStuProfile': lockStuProfile,
	'unLockStuProfile': unLockStuProfile,
	'uploadPicture': uploadPicture,
	'pwChangeStudent': pwChangeStudent,
	'delStudent': delStudent,
	'getAcaYrs': getAcaYrs,
    'getDocuments': getDocuments

}