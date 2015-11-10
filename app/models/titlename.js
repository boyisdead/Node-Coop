var mongoose = require('mongoose');

module.exports = mongoose.model('Title_name', {
	_id : {type : String, default: ''},
   	title_th : {type : String, default: ''},
   	title_en : {type : String, default: ''}
});