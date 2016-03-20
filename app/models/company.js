var mongoose = require('mongoose');
var this_year = new Date().getFullYear()+543;

var companySchema = mongoose.Schema({
    _id : {type: String},
    name : {
        full : {type: String, default:'', required: [true, "No company name? Then leave."]},
        initial : {type: String, default:''}
    },
    part_year: {type: String, default: this_year},
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
    active: {type:Boolean, default: true},
    picture : [{
        file_path : {type: String},
        description : {type: String}
    }]
});
module.exports = mongoose.model('Company', companySchema);