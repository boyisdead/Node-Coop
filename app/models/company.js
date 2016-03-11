var mongoose = require('mongoose');

var companySchema = mongoose.Schema=({
    _id : {type: String},
    name : {
        full : {type: String, default:''},
        init : {type: String, default:''}
    },
    part_year: {type: String, default:''},
    contact: {
        name: {
            first: {type: String, default:''},
            last: {type: String, default:''},
            title: {type: String, default:'คุณ'}
        },
        position: {type: String, default:''},
        tel: {type: String, default:''},
        email: {type: String, default:''}
    },
    coordinator: {
        name: {
            first: {type: String, default:''},
            last: {type: String, default:''},
            title: {type: String, default:'คุณ'}
        },
        position: {type: String, default:''},
        tel: {type: String, default:''},
        email: {type: String, default:''}
    },
    tel: {type: String, default:''},
    fax: {type: String, default:''},
    email: {type: String, default:''},
    website: {type: String, default:''},
    address:{type:String, default:''},
    area: {type:String, default:''},
    status: {type:Boolean, default: true}
});

module.exports = mongoose.model('Company', companySchema);










