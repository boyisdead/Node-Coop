var Dlc = require('./../models/dlc');
var Counter = require('./../models/counter');
var fs = require("fs");
var objectAssign = require('object-assign');

var getFileExtension = require('./../utilities/misc').getFileExtension;
var numToLengthString = require('./../utilities/misc').numToLengthString;
var autoPrefixId = require('./../utilities/misc').autoPrefixId;

var getDlc = function(res, criteria, project, option) {
    criteria = criteria || {};
    project = project || {};
    option = option || {};
    Dlc.find(criteria, project, option, function(err, dlcs) {
        if (err)
            return res.status(500).send({
                success : false,
                error : err
            });
        return res.status(200).send({
            result : dlcs,
            success : true,
            message : "Here you go.",
            meta : {
                limit : option.limit,
                skip : option.skip,
                total : dlcs.length
            }
        });
    });
};

var findDlcById = function (res, item) {
    getDlc(res, {_id:item});
}

var createDlc = function(res, item) {
    var tmp_path = item.file.path;
    var destination_folder = '/uploads/dlcs/';
    var time_stamp = Date.now();
    var newDlc = new Dlc();

    Counter.findOneAndUpdate({ _id: "dlcs" }, {$inc: { "seq": 1 } }, function (err, doc) {
        if (err) return res.status(500).send({success: false, error: err}); 
        var new_file_name = item.body.title.replace(/ /g,"_").toLowerCase() + getFileExtension(item.file.originalname);
        var target_path = destination_folder + new_file_name;
        console.log("new file name ",new_file_name);
        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream('./public' + target_path);
        objectAssign(newDlc, item.body);
        newDlc._id = autoPrefixId("DLC", doc.seq, 3);
        newDlc.file_path = '.'+target_path;
        console.log("new file: " + newDlc);

        src.pipe(dest);
        src.on('end', function() {
            newDlc.save(function(err) {
                if (err) return res.status(500).send({success: false, error: err}); 
            });
        });
        src.on('error', function(err) {
           return res.status(500).send({success: false, error: err});
        });
        fs.unlinkSync(tmp_path);
        return res.status(201).send({success: true}); 
    });
}

var delDlc = function(res, item) {
    
    Dlc.findOne({_id: item}, function (err, doc){
        if(err)
            return res.status(500).send({
                success: false,
                message: "Something went wrong while retrieving. try again."
            })
        if(!doc)
            return res.status(404).send({
                success: false,
                message: "File not exist."
            })
        console.log("doc in findOne : ",doc);
        var file_path = doc.file_path.replace('./','./public/');
        console.log("doc loc:", file_path);
        fs.stat(file_path, function(err, stats) {
            if(typeof stats != 'undefined'){
                console.log("File : ", stats);
                console.log("File : ", stats.isFile());
                if(stats.isFile())
                    fs.unlink(file_path),function (err) {
                        if (err) throw err;
                    }
                console.log("Deleted - " + file_path);
            } else {
                console.log("File not exist - "+ file_path);
            }
        });
        Dlc.findOneAndRemove({"_id": item}, function(err, doc){
            if(err)
                return res.status(500).send({
                    success: false,
                    message: "Something went wrong while removing. try again.",
                    err :err
                });
            return res.status(200).send({
                success: true,
                message: "Dlc removed."
            });
        });
        
    })
}

module.exports = {
    'getDlc': getDlc,
    'findDlcById': findDlcById,
    'createDlc': createDlc,
    'delDlc': delDlc
}
