var mongoose = require('mongoose');

var documentSchema = mongoose.Schema({
	file_name: {type : String, default: ''},
	file_location : {type : String, default: ''},
	file_type : {type : String, default: ''},
	comment : {type : String, default: ''},
	status : {type : Boolean, default: false},
	description : {type : String, default: ''}
});

module.exports = mongoose.model('Document', documentSchema);