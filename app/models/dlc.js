var mongoose = require('mongoose');

var dlcSchema = mongoose.Schema({
	_id : {type: String},
	title : {type: String, default:'No title'},
	file_path : {type: String, required: [true, "Why there is no file?"]},
	upload_date: {type: Date, default: Date.now},
	uploader : {type: String, required: [true,"File uploader is required."]}
});


module.exports = mongoose.model('Dlc', dlcSchema);