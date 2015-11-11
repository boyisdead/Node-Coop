var mongoose = require('mongoose');

module.exports = mongoose.model('Company',{
	name : {
		full : {type: String, default:''},
		init : {type: String, default:''}
	},
	part_year: {type: String, default:''},
  contact: {
    name: {
      f_th: {type: String, default:''},
      l_th: {type: String, default:''},
      t_th: {type: String, default:''},
      f_en: {type: String, default:''},
      l_en: {type: String, default:''},
      t_en: {type: String, default:''}
    },
    pos: {type: String, default:''},
    tel: {type: String, default:''},
    email: {type: String, default:''}
  },
  coordinator: {
    name: {
      f_th: {type: String, default:''},
      l_th: {type: String, default:''},
      t_th: {type: String, default:''},
      f_en: {type: String, default:''},
      l_en: {type: String, default:''},
      t_en: {type: String, default:''}
    },
    pos: {type: String, default:''},
    tel: {type: String, default:''},
    email: {type: String, default:''}
  },
  tel: {type: String, default:''},
  fax: {type: String, default:''},
  email: {type: String, default:''},
  website: {type: String, default:''}
});










