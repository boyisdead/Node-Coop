var mongoose = require('mongoose');

var counterSchema = mongoose.Schema=({
    _id: {type: String},
    seq: {type: Number} 
});

module.exports = mongoose.model('Counter', counterSchema);

