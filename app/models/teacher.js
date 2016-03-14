var mongoose = require('mongoose');

var teacherSchema = mongoose.Schema({
	_id :{type : String, default: ''}, 
	password : {type : String, default: ''},
	academic_pos: {type : String, default: ''},
    name : {
    	title : { type : String, default: '' },
		first : { type : String, default: '' },
		last : { type : String, default: '' }
    },
	email : {type : String, default: ''},
	tel : {type : String, default: ''},
	sex : {type : String, default: ''},
});

module.exports = mongoose.model('Teacher', teacherSchema);