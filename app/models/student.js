var mongoose = require('mongoose');

var studentSchema = mongoose.Schema({
	stu_code :{type : String, default: ''}, 
	name : {
		t_th : { type : String, default: '' },
		f_th : { type : String, default: '' },
		l_th : { type : String, default: '' },
		t_en : { type : String, default: '' },
		f_en : { type : String, default: '' },
		l_en : { type : String, default: '' }
	},
	contact_email : {type : String, default: ''},
	tel : {type : String, default: ''},
	advisor_id : {type : String, default: ''},
	sex : {type : String, default: ''},
	password : {type : String, default: ''},
	academic_year : {type : String, default: ''},
	profileLock : {type:Boolean, default: false},
	status : {
		"profile":  {type : Boolean, default: false},
		"document":  {type : Boolean, default: false},
		"apply":  {type : Boolean, default: false},
		"accept":  {type : Boolean, default: false},
	},
	profile_picture : {type : String, default: './uploads/pictures/profile/default.png'},
	documuents : [{
		file_name: {type : String, default: ''},
		file_location : {type : String, default: ''},
		file_type : {type : String, default: ''},
		comment : {type : String, default: ''},
		status : {type : Boolean, default: false},
		reviewed : {type : Boolean, default: false},
		description : {type : String, default: ''}
	}]
});

module.exports = mongoose.model('Student', studentSchema);