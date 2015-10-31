var mongoose = require('mongoose');

module.exports = mongoose.model('Student', {
	stu_code :{type : String, default: ''}, 
	name_en : {type : String, default: ''},
	name_th : {type : String, default: ''},
	contact_email : {type : String, default: ''},
	tel : {type : String, default: ''},
	advisor_id : {type : String, default: ''},
	sex : {type : String, default: ''},
	password : {type : String, default: ''},
	status : {
		"profile":  {type : Boolean, default: false},
		"document":  {type : Boolean, default: false},
		"apply":  {type : Boolean, default: false},
		"accept":  {type : Boolean, default: false},
	}
});