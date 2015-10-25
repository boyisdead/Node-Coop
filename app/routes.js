var Student = require('./models/student');
var Teacher = require('./models/teacher');

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
}

function getTeacher(res) {
    Teacher.find(function(err, teachers) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(teachers); // return all teachers in JSON format
    });
};

function findTeacher(item, res) {
    Teacher.findOne({
        staff_code: item.staff_code
    }, function(err, teacher) {
        if (err)
            res.send(err);
        if (!teacher) {
            res.json({
                success: false,
                message: 'Authentication failed. Teacher not found.'
            });
        } else if (teacher) {

            // check if password matches
            if (teacher.password != item.password) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            } else {

                // if teacher is found and password is right
                // create a token
                var token = jwt.sign(teacher, app.get('secretToken'), {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }
    })
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
}

module.exports = function(app) {

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




    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
