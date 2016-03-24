var mongoose = require('mongoose');

var applicationSchema = mongoose.Schema({
        "student": { type: String, required: true},
        "attachments": [{ type: String}],
        "company": { type: String, required: true},
        "apply_date": { type: Date, default: Date.now },
        "reply_date": { type: Date },
        "reply" : { type: Boolean, default: false },
        "response": { type: Boolean },
        "detail": { type: String }
    });

module.exports = mongoose.model('Application', applicationSchema);