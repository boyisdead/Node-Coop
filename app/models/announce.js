var mongoose = require('mongoose');

var announceSchema = mongoose.Schema({
    _id : {type: String},
    title : {type: String},
    detail: {type: String, default:''},
    annouce_date : {type: Date, default: Date.now},
    announcer : {type: String, required:true}
});

module.exports = mongoose.model('Announce', announceSchema);










