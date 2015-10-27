var Student = require('./models/student');

function getStudents(res){
	Student.find(function(err, students) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(students); // return all students in JSON format
		});
};

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all students
	app.get('/api/students', function(req, res) {

		// use mongoose to get all students in the database
		getStudents(res);
	});

	// create student and send back all students after creation
	app.post('/api/students', function(req, res) {

		// create a student, information comes from AJAX request from Angular
		Student.create({
			stu_code : req.body.stu_code,
			name_th : req.body.first_name_th + " " + req.body.last_name_th,
			name_en : req.body.first_name_en + " " + req.body.last_name_en,
			contact_email : req.body.contact_email,
			tel : req.body.tel,
			advisor_id : req.body.advisor,
			sex : req.body.sex

		}, function(err, student) {
			if (err)
				res.send(err);

			// get and return all the students after you create another
			getStudents(res);
		});

	});

	// delete a student
	app.delete('/api/students/:student_id', function(req, res) {
		Student.remove({
			_id : req.params.student_id
		}, function(err, student) {
			if (err)
				res.send(err);

			getStudents(res);
		});
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};