var mongoose = require('mongoose');

module.exports = mongoose.model('Student', {
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
	status : {
		"profile":  {type : Boolean, default: false},
		"document":  {type : Boolean, default: false},
		"apply":  {type : Boolean, default: false},
		"accept":  {type : Boolean, default: false},
	}
});