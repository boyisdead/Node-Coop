var mongoose = require('mongoose');

var applicationSchema = mongoose.Schema({
        "student": { type: String, required: true},
        "attachments": [{ type: String}],
        "company": { 
            "name" : { type: String },
            "_id" : { type: String, required: true },
        },
        "mail_text" : { type : String },
        "apply_date": { type: Date, default: Date.now, required: true },
        "reply_date": { type: Date },
        "reply" : { type: Boolean, default: false, required: true},
        "response": { type: Boolean },
        "detail": { type: String }
    });

applicationSchema.pre('save', function(next) {
    if(typeof this.response!="undefined"){ 
        this.reply = true;
        if(!this.reply_date)
            this.reply_date = Date.now;
    } else {
        delete this.reply_date;
        this.reply = false;
    }
    next();
});

module.exports = mongoose.model('Application', applicationSchema);