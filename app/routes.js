var Student = require('./models/student');
var Teacher = require('./models/teacher');
var Document = require('./models/document');
var Title_name = require('./models/titlename');
var Acade_pos = require('./models/acadepos');
var Company = require('./models/company');

var jwt = require('jsonwebtoken');
var fs = require("fs");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var flow = require('./../flow-node.js')('tmp');
var multer = require('multer');
var upload = multer({
    dest: './uploads/documents/'
});
var passwordHash = require('password-hash');

//============================ Authenticate function API ==============================
function studentLogin(item, res, app) {
    console.log("find Student with : " + item.username);
    Student.findOne({
        "stu_code": item.username
    }, function(err, student) {
        if (err)
            res.send(err);
        if (!student) {
            res.json({
                success: false,
                message: 'Authentication failed. Student not found.',
                obj: item,
                tar_obj: student
            });
        } else if (student) {
            // check if password matches
            if (!passwordHash.verify(item.password, student.password)) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.',
                });
            } else {

                // if student is found and password is right
                // create a token
                var token = jwt.sign({
                    "stu_code": student.stu_code,
                    
                }, app.get('secretToken'), {
                    expiresInMinutes: 3 // expires in 3 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    display_name: student.stu_code,
                    access_type: "student",
                    access_id: student._id,
                    token: token
                });
            }
        }
    })
}

function teacherLogin(item, res, app) {
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

                // if teacher is found and password is right
                // create a token
                var token = jwt.sign({
                    "staff_code": teacher.staff_code,
                    
                }, app.get('secretToken'), {
                    expiresInMinutes: 180 // expires in 3 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    display_name: teacher.staff_code,
                    access_id: teacher._id,
                    access_type: "teacher",
                    token: token
                });
            }
        }
    })
}

//============================ Student function API ==============================
//  $$$$$$\ $$$$$$$$\ $$\   $$\ $$$$$$$\  $$$$$$$$\ $$\   $$\ $$$$$$$$\ 
// $$  __$$\\__$$  __|$$ |  $$ |$$  __$$\ $$  _____|$$$\  $$ |\__$$  __|
// $$ /  \__|  $$ |   $$ |  $$ |$$ |  $$ |$$ |      $$$$\ $$ |   $$ |   
// \$$$$$$\    $$ |   $$ |  $$ |$$ |  $$ |$$$$$\    $$ $$\$$ |   $$ |   
//  \____$$\   $$ |   $$ |  $$ |$$ |  $$ |$$  __|   $$ \$$$$ |   $$ |   
// $$\   $$ |  $$ |   $$ |  $$ |$$ |  $$ |$$ |      $$ |\$$$ |   $$ |   
// \$$$$$$  |  $$ |   \$$$$$$  |$$$$$$$  |$$$$$$$$\ $$ | \$$ |   $$ |   
//  \______/   \__|    \______/ \_______/ \________|\__|  \__|   \__|  
//=================================================================================

function getStudents(res) {
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

function findStudent(item, mode, res) {
    if (mode == 'i') {
        Student.findOne({
            _id: item
        }, function(err, students) {
            if (err)
                res.send(err)
            res.json(students);
        });
    } else if (mode == 'c') {
        Student.findOne({
            "stu_code": item
        }, function(err, students) {
            if (err)
                res.send(err)
            res.json(students);
        });
    }
};

function createStudent(item, res) {
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
        password: passwordHash.generate(item.password) // random pass algo here 
    });

    newStudent.save(function(err) {
        if (err) {
            res.send(err);
        }
        getStudents(res);
    })
};

// function updateStudent(item, res){
//     var condition = {_id:item._id },
//         update = { 
//             sex: item.sex,
//             advisor_id: item.advisor_id,
//             tel: item.tel,
//             contact_email: item.contact_email,
//             name_th: item.name_th,
//             name_en: item.name_en,
//         },
//         option = { multi:true };
//     Student.update(condition, update, option, callback);
// }

function updateStudent(item, res) {
    console.log("update item with ");
    console.log(item);
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
            doc.save();
        } else console.log("Not found - not update");

        if (err)
            res.send(err);
        getStudents(res);
    });
}

function pwChangeStudent(item, res) {
    console.log("param item", item);
    Student.findOne({
        _id: item._id
    }, function(err, doc) {
        if (doc != null) {

            console.log(item.oldPassword, item.newPassword, doc.password);
            console.log(passwordHash.generate(item.oldPassword));

            if (passwordHash.verify(item.oldPassword, doc.password)) {
                doc.password = passwordHash.generate(item.newPassword);
                doc.save();
                msg = "Password changed";
            } else
                msg = "Old password not match";
        } else
            msg = "Id not found - not update";

        if (err)
            res.send(err);
        res.json(msg);
    });
}


function delStudent(item, res) {
    Student.remove({
        _id: item
    }, function(err) {
        if (err)
            res.send(err);
        getStudents(res);
    })
};

//============================ Teacher function API ==============================
// $$$$$$$$\ $$$$$$$$\  $$$$$$\   $$$$$$\  $$\   $$\ $$$$$$$$\ $$$$$$$\  
// \__$$  __|$$  _____|$$  __$$\ $$  __$$\ $$ |  $$ |$$  _____|$$  __$$\ 
//    $$ |   $$ |      $$ /  $$ |$$ /  \__|$$ |  $$ |$$ |      $$ |  $$ |
//    $$ |   $$$$$\    $$$$$$$$ |$$ |      $$$$$$$$ |$$$$$\    $$$$$$$  |
//    $$ |   $$  __|   $$  __$$ |$$ |      $$  __$$ |$$  __|   $$  __$$< 
//    $$ |   $$ |      $$ |  $$ |$$ |  $$\ $$ |  $$ |$$ |      $$ |  $$ |
//    $$ |   $$$$$$$$\ $$ |  $$ |\$$$$$$  |$$ |  $$ |$$$$$$$$\ $$ |  $$ |
//    \__|   \________|\__|  \__| \______/ \__|  \__|\________|\__|  \__|
//================================================================================

function getTeacher(res) {
    Teacher.find(function(err, teachers) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(teachers); // return all teachers in JSON format
    });
};

function findTeacher(item, mode, res) {
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

function createTeacher(item, res) {
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

function updateTeacher(item, res) {
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


function pwChangeTeacher(item, res) {
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

function delTeacher(item, res) {
    Teacher.remove({
        _id: item
    }, function(err) {
        if (err)
            res.send(err);
        getTeacher(res);
    })
};

//============================== Document function API ===============================
// $$$$$$$\   $$$$$$\   $$$$$$\  $$\   $$\ $$\      $$\ $$$$$$$$\ $$\   $$\ $$$$$$$$\ 
// $$  __$$\ $$  __$$\ $$  __$$\ $$ |  $$ |$$$\    $$$ |$$  _____|$$$\  $$ |\__$$  __|
// $$ |  $$ |$$ /  $$ |$$ /  \__|$$ |  $$ |$$$$\  $$$$ |$$ |      $$$$\ $$ |   $$ |   
// $$ |  $$ |$$ |  $$ |$$ |      $$ |  $$ |$$\$$\$$ $$ |$$$$$\    $$ $$\$$ |   $$ |   
// $$ |  $$ |$$ |  $$ |$$ |      $$ |  $$ |$$ \$$$  $$ |$$  __|   $$ \$$$$ |   $$ |   
// $$ |  $$ |$$ |  $$ |$$ |  $$\ $$ |  $$ |$$ |\$  /$$ |$$ |      $$ |\$$$ |   $$ |   
// $$$$$$$  | $$$$$$  |\$$$$$$  |\$$$$$$  |$$ | \_/ $$ |$$$$$$$$\ $$ | \$$ |   $$ |   
// \_______/  \______/  \______/  \______/ \__|     \__|\________|\__|  \__|   \__| 
//====================================================================================

function getDocument(res) {
    var query = Document.find().sort({
        file_name: 1
    });
    var queryGroup = Document.aggregate([{$sort: {owner: 1}}, {"$group": {"_id": "$owner","files": {"$push": {"file_name": "$file_name","file_type": "$file_type", "comment": "$comment"}}}}]);
    query.exec(function(err, documents) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(documents); // return all documents in JSON format
    });
};

function createDocument(item, res) {
    console.log(item.file);
    var tmp_path = item.file.path;
    var time_stamp = new Date().getTime() - 1440000000000;
    console.log("Creating...");

    // flow.post(req, function(status, filename, original_filename, identifier){
    //     console.log('POST', status, original_filename, identifier);
    //     res.send(200, {
    //             // NOTE: Uncomment this funciton to enable cross-domain request.
    //             //'Access-Control-Allow-Origin': '*'
    //     });
    // });

    var new_file_name = item.body.owner.substring(0, 2) + item.body.owner.substring(5, 9) + item.body.file_type.substring(0, 2).toUpperCase() + "_" + time_stamp + "." + item.file.originalname.substr(item.file.originalname.lastIndexOf('.') + 1);
    // var target_path = './uploads/documents/' + item.file.originalname;
    var target_path = './uploads/documents/' + new_file_name;

    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', function() {
        var newDocument = new Document({
            owner: item.body.owner,
            file_name: new_file_name,
            file_location: target_path,
            file_type: item.body.file_type,
            status: item.body.status,
            description: item.body.description
        });
        newDocument.save(function(err) {
            if (err)
                res.send(err);
            getDocument(res);
        });
    });


    src.on('error', function(err) {
        res.send(err);
        getDocument(res);
    });
    fs.unlinkSync(tmp_path);
}

function updateDocument(item, res) {
    Document.findOne({
        _id: item._id
    }, function(err, doc) {
        doc.status = item.status;
        doc.comment = item.comment;
        doc.save();

        if (err)
            res.send(err);
        else
            getDocument(res);
    });
}

function delDocument(item, res) {
    Document.remove({
        _id: item
    }, function(err) {
        if (err)
            res.send(err);
        getDocument(res);
    })
}

//================================ Company ====================================
//   ______    ______   __       __  _______    ______   __    __  __      __ 
//  /      \  /      \ |  \     /  \|       \  /      \ |  \  |  \|  \    /  \
//  |  $$$$$$\|  $$$$$$\| $$\   /  $$| $$$$$$$\|  $$$$$$\| $$\ | $$ \$$\  /  $$
//  | $$   \$$| $$  | $$| $$$\ /  $$$| $$__/ $$| $$__| $$| $$$\| $$  \$$\/  $$ 
//  | $$      | $$  | $$| $$$$\  $$$$| $$    $$| $$    $$| $$$$\ $$   \$$  $$  
//  | $$   __ | $$  | $$| $$\$$ $$ $$| $$$$$$$ | $$$$$$$$| $$\$$ $$    \$$$$   
//  | $$__/  \| $$__/ $$| $$ \$$$| $$| $$      | $$  | $$| $$ \$$$$    | $$    
//   \$$    $$ \$$    $$| $$  \$ | $$| $$      | $$  | $$| $$  \$$$    | $$    
//    \$$$$$$   \$$$$$$  \$$      \$$ \$$       \$$   \$$ \$$   \$$     \$$                                                                       
//                                                       
//=============================================================================

function getCompany(res){
    Company.find(function(err, companies) {
        if (err)
            res.send(err)
        res.json(companies); 
    });
}

// function findCompany(item, mode, res) {
//     Company.findOne({
//         "name"."full" : item
//     }, function(err, companies) {
//         console.log("code", item, err, companies);
//         if (err)
//             res.send(err)
//         res.json(companies); // return all companies in JSON format
//     });
// };

function createCompany(item, res) {
    var newCompany = new Company({
        name : {
            full : item.name.full,
            init : item.name.init
        },
        part_year: item.part_year,
        tel: item.tel,
        fax: item.fax,
        email: item.email,
        website: item.website
    });
    if(item.contact)
        newCompany.contact = item.contact;
    if(item.coordinator)
        newCompany.coordinator = item.coordinator;

    newCompany.save(function(err) {
        if (err)
            res.send(err);
        getCompany(res);
    })
};

function updateCompany(item, res) {
    Company.findOne({
        _id: item._id
    }, function(err, doc) {
        if (doc != null) {
            if (item.name) {
                if (typeof item.name.full != 'undefined')
                    doc.name.full = item.name.full;
                if (typeof item.name.init != 'undefined')
                    doc.name.init = item.name.init;
            }
            if(item.contact){
                doc.contact = item.contact;
                // if(item.contact.name){
                //     if (typeof item.contact.name.f_th != 'undefined')
                //         doc.contact.name.f_th = item.contact.name.f_th;
                //     if (typeof item.contact.name.l_th != 'undefined')
                //         doc.contact.name.l_th = item.contact.name.l_th;
                //     if (typeof item.contact.name.t_th != 'undefined')
                //         doc.contact.name.t_th = item.contact.name.t_th;
                //     if (typeof item.contact.name.f_en != 'undefined')
                //         doc.contact.name.f_en = item.contact.name.f_en;
                //     if (typeof item.contact.name.l_en != 'undefined')
                //         doc.contact.name.l_en = item.contact.name.l_en;
                //     if (typeof item.contact.name.t_en != 'undefined')
                //         doc.contact.name.t_en = item.contact.name.t_en;
                // }
                // if (typeof item.contact.pos != 'undefined')
                //     doc.contact.pos = item.contact.pos;
                // if (typeof item.contact.tel != 'undefined')
                //     doc.contact.tel = item.contact.tel;
                // if (typeof item.contact.email != 'undefined')
                //     doc.contact.email = item.contact.email;
            }

            if(item.coordinator)
                doc.coordinator = item.coordinator;

            if (typeof item.part_year != 'undefined')
                doc.part_year = item.part_year;
            if (typeof item.tel != 'undefined')
                doc.tel = item.tel;
            if (typeof item.fax != 'undefined')
                doc.fax = item.fax;
            if (typeof item.email != 'undefined')
                doc.email = item.email;
            if (typeof item.website != 'undefined')
                doc.website = item.website;

            doc.save();
        } else console.log("Not found - not update");

        if (err)
            res.send(err);
        getCompany(res);
    });
}

function updateCompanyContact(item, res){
    Company.findOne({
        _id: item._id
    }, function(err, doc) {
        if (doc != null) {
            if(item.contact)
                doc.contact = item.contact;
        }
    })
}

function delDocument(item, res) {
    Company.remove({
        _id: item
    }, function(err) {
        if (err)
            res.send(err);
        getCompany(res);
    })
}

//================================ Routes ====================================
//       $$$$$$$\   $$$$$$\  $$\   $$\ $$$$$$$$\ $$$$$$$$\  $$$$$$\  
//       $$  __$$\ $$  __$$\ $$ |  $$ |\__$$  __|$$  _____|$$  __$$\ 
//       $$ |  $$ |$$ /  $$ |$$ |  $$ |   $$ |   $$ |      $$ /  \__|
//       $$$$$$$  |$$ |  $$ |$$ |  $$ |   $$ |   $$$$$\    \$$$$$$\  
//       $$  __$$< $$ |  $$ |$$ |  $$ |   $$ |   $$  __|    \____$$\ 
//       $$ |  $$ |$$ |  $$ |$$ |  $$ |   $$ |   $$ |      $$\   $$ |
//       $$ |  $$ | $$$$$$  |\$$$$$$  |   $$ |   $$$$$$$$\ \$$$$$$  |
//       \__|  \__| \______/  \______/    \__|   \________| \______/ 
//=============================================================================
module.exports = function(app) {

    // authenticate to obtains token
    app.post('/api/auth', function(req, res) {
        console.log("Hello login");
        if (req.body.type == "student") {
            console.log("Student login");
            studentLogin(req.body, res, app);
        } else if (req.body.type == "teacher") {
            teacherLogin(req.body, res, app);
            console.log("Teacher login");
        } else console.log(req.body.type + " login");
    });

    //===================================================================================
    //suspended due to working
    // verify token for every request
    // app.use(function(req, res, next) {

    //     // check header or url parameters or post parameters for token
    //     var token = req.body.token || req.query.token || req.headers['x-access-token'];

    //     // decode token
    //     if (token) {
    //         // verifies secret and checks exp
    //         jwt.verify(token, app.get('secretToken'), function(err, decoded) {
    //             if (err) {
    //                 return res.json({
    //                     success: false,
    //                     message: 'Failed to authenticate token.'
    //                 });
    //             } else {
    //                 // if everything is good, save to request for use in other routes
    //                 req.decoded = decoded;
    //                 next();
    //             }
    //         });

    //     } else {

    //         // if there is no token
    //         // return an error
    //         return res.status(403).send({
    //             success: false,
    //             message: 'No token provided.'
    //         });

    //     }
    // });
    //====================================================================================

    // -----------------------------------Student routes ----------------------------------------------------
    // get all students
    app.get('/api/students', function(req, res) {
        getStudents(res);
    });

    app.get('/api/students/item/:item/mode/:mode', function(req, res) {
        findStudent(req.params.item, req.params.mode, res);
    });

    // create student and send back all students after creation
    app.post('/api/students', function(req, res) {
        console.log("Creating...");
        createStudent(req.body, res);
    });

    // update a student
    app.put('/api/students', function(req, res) {
        console.log("Updating...");
        updateStudent(req.body, res);
    });

    app.put('/api/students/pw_change', function(req, res) {
        pwChangeStudent(req.body, res);
    })

    // delete a student
    app.delete('/api/students/:student_id', function(req, res) {
        delStudent(req.params.student_id, res);
    });

    // ---------------------------------- Teacher routes ------------------------------------------------------
    // 
    app.get('/api/teachers', function(req, res) {
        getTeacher(res);
    });

    app.get('/api/teachers/item/:item/mode/:mode', function(req, res) {
        findTeacher(req.params.item, req.params.mode, res);
    });

    app.post('/api/teachers', function(req, res) {
        createTeacher(req.body, res);
    });
    // update a teacher
    app.put('/api/teachers', function(req, res) {
        updateTeacher(req.body, res);
    })

    app.put('/api/teachers/pw_change', function(req, res) {
        console.log("pw chng");
        pwChangeTeacher(req.body, res);
    })

    // delete a teacher
    app.delete('/api/teachers/:teacher_id', function(req, res) {
        delTeacher(req.params.teacher_id, res);
    });

    // -----------------------------------Document routes ----------------------------------------------------
    // get all documents
    app.get('/api/documents', function(req, res) {
        getDocument(res);
    });

    // upload document
    app.post('/api/documents/upload', upload.single('attachFile'), function(req, res, next) {
        console.log(req.body);
        createDocument(req, res, next);
    });

    app.post('/upload', function(req, res) {
        console.log("post upload");
        flow.post(req, function(status, filename, original_filename, identifier) {
            console.log('POST', status, original_filename, identifier);
            var stream = fs.createWriteStream(filename);
            flow.write(identifier, stream);
            res.send(200, {
                // NOTE: Uncomment this funciton to enable cross-domain request.
                //'Access-Control-Allow-Origin': '*'
            });
        });
    });

    // Handle cross-domain requests
    // NOTE: Uncomment this funciton to enable cross-domain request.
    /*
    app.options('/upload', function(req, res){
        console.log('OPTIONS');
        res.send(true, {
            'Access-Control-Allow-Origin': '*'
        }, 200);
    });
    */

    app.get('/upload', function(req, res) {
        console.log("get upload");
        flow.get(req, function(status, filename, original_filename, identifier) {
            console.log('GET', status);

            res.send(200, (status == 'found' ? 200 : 404));
        });

    });

    // update document
    app.put('/api/documents', function(req, res) {
        updateDocument(req.body, res);
    })

    // delete a document
    app.delete('/api/documents/:document_id', function(req, res) {

        delDocument(req.params.document_id, res);
    });
    
    // ----------------------------------- Company --------------------------------------- 
    app.get('/api/companies', function(req, res) {
        getCompany(res);
    });
    app.post('/api/companies', function(req, res) {
        createCompany(req.body, res);
    });
    app.put('/api/companies', function(req, res) {
        updateCompany(req.body, res);
    });
    app.put('/api/companies/contact', function(req, res) {
        updateCompanyContact(req.body, res);
    });


    // -----------------------------------Other  routes ----------------------------------------------------
    app.get('/api/typehead/title_name', function(req, res) {
        Title_name.find(function(err, titleName) {
            if (err)
                res.send(err)
            res.json(titleName);
        });
    });

    app.get('/api/typehead/acade_pos', function(req, res) {
        Acade_pos.find(function(err, acadePos) {
            if (err)
                res.send(err)
            res.json(acadePos);
        });
    });

    app.get('/api/typehead/advisor', function(req, res) {

        Teacher.find(function(err, acadePos) {
                if (err)
                    res.send(err)
                res.json(acadePos);
            })
            .sort('-staff_code')
            .select('staff_code first_name_th last_name_th');
    });

    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
