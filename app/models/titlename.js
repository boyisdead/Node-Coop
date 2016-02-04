var mongoose = require('mongoose');

var titleNameSchema = mongoose.Schema({
	_id : {type : String, default: ''},
   	title_th : {type : String, default: ''},
   	title_en : {type : String, default: ''}
});

module.exports = mongoose.model('Title_name', titleNameSchema);