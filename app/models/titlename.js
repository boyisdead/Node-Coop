var mongoose = require('mongoose');

var titleNameSchema = mongoose.Schema({
	_id : {type : String, default: ''},
   	th : {type : String, default: ''},
   	en : {type : String, default: ''}
});

module.exports = mongoose.model('Title_name', titleNameSchema);