var mongoose = require('mongoose');

module.exports = mongoose.model('Document', {
	owner :{type : String, default: ''}, 
	file_name: {type : String, default: ''},
	file_location : {type : String, default: ''},
	file_type : {type : String, default: ''},
	comment : {type : String, default: ''},
	status : {type : Boolean, default: false}
});