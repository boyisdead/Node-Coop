var mongoose = require('mongoose');

var teacherSchema = mongoose.Schema({
    contact: {
        name: {
            first: {type: String, default:''},
            last: {type: String, default:''},
            title: {type: String, default:'คุณ'}
        },
        position: {type: String, default:''},
        tel: {type: String, default:''},
        email: {type: String, default:''}
    }
}, {_id : false});

module.exports = mongoose.model('Contact', teacherSchema);