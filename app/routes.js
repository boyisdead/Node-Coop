var Student = require('./models/student');
var Teacher = require('./models/teacher');
var Document = require('./models/document');
var jwt = require('jsonwebtoken');


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
            if (student.password != item.password) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.',
                });
            } else {

                // if student is found and password is right
                // create a token
                var token = jwt.sign({
                    "stu_code": student.stu_code,
                    access_type: "student"
                }, app.get('secretToken'), {
                    expiresInMinutes: 3 // expires in 3 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    display_name: student.stu_code,
                    access_id: student._id,
                    access_type: 'student',
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
            // check if password matches
            if (teacher.password != item.password) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.',
                });
            } else {

                // if teacher is found and password is right
                // create a token
                var token = jwt.sign({
                    "staff_code": teacher.staff_code,
                    access_type: "teacher"
                }, app.get('secretToken'), {
                    expiresInMinutes: 180 // expires in 3 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    display_name: teacher.staff_code,
                    access_id: teacher._id,
                    access_type: 'teacher',
                    token: token
                });
            }
        }
    })
}

function getStudents(res) {
    Student.find(function(err, students) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(students); // return all students in JSON format
    });
};

function createStudent(item, res) {
    var newStudent = new Student({
        stu_code: item.stu_code,
        name_th: item.first_name_th + " " + item.last_name_th,
        name_en: item.first_name_en + " " + item.last_name_en,
        contact_email: item.contact_email,
        tel: item.tel,
        advisor_id: item.advisor,
        sex: item.sex
    });

    newStudent.save(function(err) {
        if (err)
            res.send(err);
        getStudents(res);
    })
};

function delStudent(item, res) {
    Student.remove({
        _id: item
    }, function(err) {
        if (err)
            res.send(err);
        getStudents(res);
    })
};

function getTeacher(res) {
    Teacher.find(function(err, teachers) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(teachers); // return all teachers in JSON format
    });
};

function createTeacher(item, res) {
    var newTeacher = new Teacher({
        staff_code: item.staff_code,
        name_th: item.first_name_th + " " + item.last_name_th,
        name_en: item.first_name_en + " " + item.last_name_en,
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

function delTeacher(item, res) {
    Teacher.remove({
        _id: item
    }, function(err) {
        if (err)
            res.send(err);
        getTeacher(res);
    })
};

function getDocument(res) {
    var query2 = Document.find().sort( { file_name: 1 } );
    var query = Document.aggregate([ { $sort:{owner:1}},{ "$group": {"_id": "$owner", "files": { "$push": { "file_name": "$file_name","file_type": "$file_type","comment": "$comment"}}}}]);
    query2.exec(function(err, documents) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(documents); // return all documents in JSON format
    });
};

function delDocument(item, res) {
    Document.remove({
        _id: item
    }, function(err) {
        if (err)
            res.send(err);
        getDocument(res);
    })
}


module.exports = function(app) {

    // authenticate to obtains token
    app.post('/api/auth', function(req, res) {
        console.log("Hello login");
        if (req.body.type == "student"){
            console.log("Student login");
            studentLogin(req.body, res, app);
        } else if (req.body.type == "teacher") {
            teacherLogin(req.body, res, app);
            console.log("Teacher login");
        } else console.log(req.body.type +" login");
    });

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
    
    // -----------------------------------Student API ----------------------------------------------------
    // get all students
    app.get('/api/students', function(req, res) {
        getStudents(res);
    });

    // create student and send back all students after creation
    app.post('/api/students', function(req, res) {
        createStudent(req.body, res);
    });

    // delete a student
    app.delete('/api/students/:student_id', function(req, res) {
        delStudent(req.params.student_id, res);
    });

    // ---------------------------------- Teacher API ------------------------------------------------------
    // 
    app.get('/api/teachers', function(req, res) {
        getTeacher(res);
    });

    // create teacher and send back all teachers after creation
    app.post('/api/teachers', function(req, res) {
        createTeacher(req.body, res);
    });

    // delete a teacher
    app.delete('/api/teachers/:teacher_id', function(req, res) {
        delTeacher(req.params.teacher_id, res);
    });

    // -----------------------------------Document API ----------------------------------------------------
    // get all students
    app.get('/api/documents', function(req, res) {
        getDocument(res);
    });

    // create student and send back all students after creation
    // app.post('/api/documents', function(req, res) {
    //     createDocument(req.body, res);
    // });

    // delete a student
    app.delete('/api/documents/:document_id', function(req, res) {
        delDocument(req.params.document_id, res);
    });


    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
