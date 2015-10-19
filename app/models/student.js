var mongoose = require('mongoose');

module.exports = mongoose.model('Student', {
	name_en : {type : String, default: ''},
	name_th : {type : String, default: ''}
});