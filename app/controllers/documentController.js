var Document = require('./../models/document');
var Student = require('./../models/student');
var fs = require("fs");

var getFileExtension = function(filename){
    return '.' + filename.substr(filename.lastIndexOf('.') + 1);
}

var getDocument = function(res) {
    var query = Document.find().sort({
        file_name: 1
    });
    var queryGroup = Document.aggregate([{
        $sort: {owner: 1}
    }, {"$group": {
        "_id": "$owner",
        "files": {
            "$push": {
                "file_name": "$file_name",
                "file_type": "$file_type", 
                "comment": "$comment"}
            }
        }
    }]);

    query.exec(function(err, documents) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json({success:true,data:documents}); // return all documents in JSON format
    });
};

var createDocument = function(item, res, next) {
    var tmp_path = item.file.path;
    var time_stamp = Date.now();
        console.log(tmp_path,time_stamp);
    console.log("Creating...", item.body);

    var new_file_name = item.body.owner.substring(0, 2) + item.body.owner.substring(5, 9) + item.body.file_type.substring(0, 2).toUpperCase() + "_" + time_stamp + getFileExtension(item.file.originalname);
    // // var target_path = './uploads/documents/' + item.file.originalname;
    var target_path = '/uploads/documents/' + new_file_name;
    console.log("file name: " + new_file_name);
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream('./public'+target_path);
    src.pipe(dest);
    src.on('end', function() {
        console.log('end');
        var newDocument = new Document({
            owner: item.body.owner,
            file_name: new_file_name,
            file_location: '.'+target_path,
            file_type: item.body.file_type,
            description: item.body.description
        });
        newDocument.save(function(err) {
            if (err)
                res.send(err);
            res.json({success:true});
        });
    });
    src.on('error', function(err) {
        res.send(err);
        getDocument(res);
    });
    fs.unlinkSync(tmp_path);
}

var updateDocument = function(item, res) {
    Document.findOne({
        _id: item._id
    }, function(err, doc) {
        doc.status = item.status;
        doc.comment = item.comment;
        doc.save();

        if (err)
            res.send(err);
        else
            getDocument(res);
    });
}

var delDocument = function(item, res) {
    var msg;
    Document.findOneAndRemove({
        _id :item
    }, function(err, doc){
        doc_location = './public'+doc.file_location.substr(2);
        console.log("doc loc:",doc_location);
        if(doc){
            fs.stat(doc_location, function(err, stats) {
                if(typeof stats != 'undefined'){
                    console.log("File : ", stats);
                    console.log("File : ", stats.isFile());
                    fs.unlink(doc_location),function (err) {
                        if (err) throw err;
                    }
                    msg = {success:true};
                    console.log("Deleted - " + doc_location);
                } else {
                    console.log("File not exist - "+ doc_location);
                    msg = {success:false,reason:"File not exist",err_code:50};
                }
            });
        } else {
            msg = {success:false,reason:"Document not found - " + item ,err_code:44};
        }
        if(err)
            res.send(err);
        else
            res.json(msg);
    });
}

module.exports = {
	'getDocument': getDocument,
	'createDocument': createDocument,
	'updateDocument': updateDocument,
	'delDocument': delDocument
}