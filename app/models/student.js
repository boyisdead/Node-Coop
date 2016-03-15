var mongoose = require('mongoose');
var default_profile_picture = require('../../config/setting').default_profile_picture;
var this_year  = new Date().getFullYear() + 543;

var studentSchema = mongoose.Schema({
    "_id": { type: String, default: '' },
    "name": {
        "first": { type: String, default: '' },
        "last": { type: String, default: '' },
        "title": { type: String, default: '' }
    },
    "advisor_id": { type: String, default: '' },
    "sex": { type: String, default: '', enum : ['M','F'] },
    "password": { type: String, default: '' },
    "academic_year": { type: String, default: '' },
    "status": {type: Boolean, default: false},
    "contact": {
        "tel": { type: String, default: '' },
        "email": { type: String, default: '' },
        "address": { type: String, default: '' }
    },
    "emergency_contact": {
        "name": { type: String, default: '' },
        "relationship": { type: String, default: '' },
        "tel": { type: String, default: '' },
        "address": { type: String, default: '' }
    },
    "aptitudes": [{ 
            "subject": { type: String, default: '' },
            "level": { type: Number, 
                min:[1,"Why bother mention it if it below 1?"], 
                max:[5,"Five stars ranking, boy."] 
            }
    }],
    "profile_picture": { type: String, default: default_profile_picture },
    "documuents": [{
        "file_name": { type: String, default: '' },
        "file_location": { type: String, default: '' },
        "file_type": { type: String, default: '' },
        "comment": { type: String, default: '' },
        "status": { type: Boolean, default: false },
        "reviewed": { type: Boolean, default: false },
        "description": { type: String, default: '' }
    }]
});

module.exports = mongoose.model('Student', studentSchema);
