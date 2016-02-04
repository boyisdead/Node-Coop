var mongoose = require('mongoose');

var academicPositionSchema = mongoose.Schema({
	full_en : {type: String, default:''},
    full_th : {type: String, default:''},
  	init_en :{type: String, default:''},
  	init_th : {type: String, default:''}
});

module.exports = mongoose.model('Academic_position', academicPositionSchema);
