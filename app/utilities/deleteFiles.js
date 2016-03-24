var fs = require("fs");

var deleteFiles = function (files, callback){
    var i = files.length;
    files.forEach(function(filepath){
        fs.unlink(filepath, function(err) {
            i--;
            if (err) {
                callback(err);
                return;
            } else if (i <= 0) {
                callback(null);
            }
        });
    });
}
module.exports = {
    "deleteFiles" : deleteFiles
};