var mongoose = require('mongoose');

module.exports = mongoose.model('Academic_position',{
	full_en : {type: String, default:''},
    full_th : {type: String, default:''},
  	init_en :{type: String, default:''},
  	init_th : {type: String, default:''}
});
