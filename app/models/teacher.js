var mongoose = require('mongoose');

module.exports = mongoose.model('Teacher', {
	staff_code :{type : String, default: ''}, 
	password : {type : String, default: ''},
	acade_pos_full_th: {type : String, default: ''},
    acade_pos_full_en: {type : String, default: ''},
    acade_pos_init_th: {type : String, default: ''},
    acade_pos_init_en: {type : String, default: ''},
    title_name_th: {type : String, default: ''},
    title_name_en: {type : String, default: ''},
	first_name_en : {type : String, default: ''},
	last_name_en : {type : String, default: ''},
	first_name_th : {type : String, default: ''},
	last_name_th : {type : String, default: ''},
	contact_email : {type : String, default: ''},
	tel : {type : String, default: ''},
	sex : {type : String, default: ''},
});