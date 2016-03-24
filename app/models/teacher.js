var mongoose = require('mongoose');
var default_profile_picture = require('../../config/setting').default_profile_picture;

var teacherSchema = mongoose.Schema({
	_id :{type : String, default: ''}, 
	password : {type : String, required: true},
	profile_picture : {type : String, default : default_profile_picture},
	academic_pos: {type : String, default: ''},
    name : {
    	title : { type : String, default: '' },
		first : { type : String, required: true },
		last : { type : String, default: '' }
    },
    contact : { 
    	email : {type : String, required: true, index: { unique: true }},
		tel : {type : String, default: ''}
	},
	sex : {type : String, default: ''}
});

module.exports = mongoose.model('Teacher', teacherSchema);