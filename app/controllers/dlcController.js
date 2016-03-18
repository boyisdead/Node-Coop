var Dlc = require('./../models/dlc');
var Counter = require('./../models/counter');
var fs = require("fs");
var objectAssign = require('object-assign');

var getFileExtension = function(filename) {
    return '.' + filename.substr(filename.lastIndexOf('.') + 1);
}

var numToLengthString = function(num, length) {
    var newNum = "" + num.toString();
    while (newNum.length < length) {
        newNum = "0" + newNum;
    }
    return newNum;
}

var autoPrefixId = function(prefix, max, numLong) {
    var new_id = prefix.concat(numToLengthString(max, numLong));
    console.log(new_id);
    return new_id;
};

var getDlc = function(res, criteria) {
    criteria = criteria || {};
    Dlc.find(criteria, function(err, dlcs) {
        if (err)
            res.send(err)
        if(!dlcs || typeof dlcs[0] == "undefined") {
            res.status(204).send({
                success : true,
                message : "No Teacher was found."
            });
        } else if(dlcs.length<=1){
            res.status(200).send({
                data : dlcs[0],
                success : true,
                message : "Here you go."
            });
        } else {
            res.status(200).send({
                data : dlcs,
                success : true,
                message : "Here you go."
            });
        }
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

    Counter.findOneAndUpdate({ _id: "dlcs" }, { $inc: { "seq": 1 } }, function (err, doc) {
        if (err) return res.send(err); 
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
                if (err)
                    res.send(err);
                res.json({ success: true });
            });
        });
        src.on('error', function(err) {
            res.send(err);
        });
        fs.unlinkSync(tmp_path);
    });
}

var delDlc = function(res, item) {
    
    Dlc.findOne({_id: item}, function (err, doc){
        if(err)
            res.status(500).send({
                success: false,
                message: "Something went wrong while retrieving. try again."
            })
        if(!doc)
            res.status(200).send({
                success: false,
                message: "File not exist."
            })
        else {
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
                    res.status(200).send({
                        success: false,
                        message: "Something went wrong while removing. try again.",
                        err :err
                    });
                else
                    res.status(200).send({
                        success: true,
                        message: "Dlc removed."
                    });
            });
        }
    })    
}

module.exports = {
    'getDlc': getDlc,
    'findDlcById': findDlcById,
    'createDlc': createDlc,
    'delDlc': delDlc
}
