var Student = require('./models/student');

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

function delStudent(item, res){
	Student.remove({ _id:item },function(err){
		if (err)
			res.send(err);
		getStudents(res);
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
    	delStudent(req.params.student_id,res);
    });

    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
