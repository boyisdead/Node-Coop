var mongoose = require('mongoose');

module.exports = mongoose.model('Teacher', {
	staff_code :{type : String, default: ''}, 
	password : {type : String, default: ''},
	acade_pos : { 
		full_th: {type : String, default: ''},
    	full_en: {type : String, default: ''},
    	init_th: {type : String, default: ''},
    	init_en: {type : String, default: ''}
    },
		acade_pos_full_th: {type : String, default: ''},
    	acade_pos_full_en: {type : String, default: ''},
    	acade_pos_init_th: {type : String, default: ''},
    	acade_pos_init_en: {type : String, default: ''},
    name : {
    	t_th : { type : String, default: '' },
		f_th : { type : String, default: '' },
		l_th : { type : String, default: '' },
		t_th : { type : String, default: '' },
		f_en : { type : String, default: '' },
		l_en : { type : String, default: '' }
    },
	contact_email : {type : String, default: ''},
	tel : {type : String, default: ''},
	sex : {type : String, default: ''},
});