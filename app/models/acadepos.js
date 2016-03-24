var mongoose = require('mongoose');

var academicPositionSchema = mongoose.Schema({
	full : {
		en : {type: String, default:''},
	    th : {type: String, default:''}
	},
  	initial : { 
  		en : {type: String, default:''},
  	  	th : {type: String, default:''}
  	}
});

module.exports = mongoose.model('Academic_position', academicPositionSchema);