var mongoose = require('mongoose');

module.exports = mongoose.model('Teacher', {
	staff_code :{type : String, default: ''}, 
	password : {type : String, default: ''},
	name_en : {type : String, default: ''},
	name_th : {type : String, default: ''},
	contact_email : {type : String, default: ''},
	tel : {type : String, default: ''},
	sex : {type : String, default: ''},
});