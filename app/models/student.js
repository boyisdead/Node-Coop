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
    "gpa" : { type : Number },
    "date_of_birth" : { type : Date },
    "adviser_id": { type: String, default: '' },
    "sex": { type: String, default: '', enum : ['M','F','male','female','ชาย','หญิง'] },
    "password": { type: String, default: '' },
    "academic_year": { type: String, default: this_year },
    "status": {type: Boolean, default: false},
    "contact": {
        "tel": { type: String, default: '' },
        "email": { type: String, default: '' , required : true },
        "address": { type: String, default: '' }
    },
    "prefered_company" : {
        "first": { type: String, default: '' },
        "second": { type: String, default: '' },
        "third": { type: String, default: '' }
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
    "attachments": [{
        "file_name": { type: String, default: "Noname" },
        "file_path": { type: String, default: "Missing" },
        "file_type": { type: String, default: "Other"},
        "comment": { type: String, default: '' },
        "status": { type: Boolean, default: false }, // is approved or not 
        "reviewed": { type: Boolean, default: false }, // has approved or not
        "description": { type: String, default: '' }
    }],
    "job" : {
        "status": {type : String, enum: ["active", "inactive", "suspend", "finished"], default:"inactive"},
        "company" : {type : String, default: '' },
        "work_site" : {type : String, default: '' },
        "position" : {type : String, default: '' }, 
        "report_date" : {type : Date }, 
        "launch_date" : {type : Date },
        "finish_date" : {type : Date }, 
        "welfares" : [{type : String, default: '' }],
        "payment": {
            "method" : {type : String, default: ''},
            "period" : {type : String, default: ''}, 
            "amount_per_period" : {type : String, default: ''} 
        },
        "note" : {type : String, default: '' }
    }
});

studentSchema.pre('save', function(next) {
    if(this.sex=='M' || this.sex.toLowerCase() == 'male')
        this.sex = "ชาย";
    else if(this.sex=='F' || this.sex.toLowerCase() == 'female')
        this.sex = "หญิง";
    next();
});

module.exports = mongoose.model('Student', studentSchema);
