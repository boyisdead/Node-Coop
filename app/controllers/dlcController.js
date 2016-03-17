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
        res.json(dlcs);
    });
};

var findDlc = function (res, item) {
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
    var msg;
    Dlc.findOneAndRemove({
        _id: item
    }, function(err, doc) {
        doc_location = './public' + doc.file_location.substr(2);
        console.log("doc loc:", doc_location);
        if (doc) {
            fs.stat(doc_location, function(err, stats) {
                if (typeof stats != 'undefined') {
                    console.log("File : ", stats);
                    console.log("File : ", stats.isFile());
                    fs.unlink(doc_location),
                        function(err) {
                            if (err) throw err;
                        }
                    msg = { success: true };
                    console.log("Deleted - " + doc_location);
                } else {
                    console.log("Content not exist - " + doc_location);
                    msg = { success: false, reason: "Content not exist", err_code: 50 };
                }
            });
        } else {
            msg = { success: false, reason: "Content not found - " + item, err_code: 44 };
        }
        if (err)
            res.send(err);
        else
            res.json(msg);
    });
}

module.exports = {
    'getDlc': getDlc,
    'findDlc': findDlc,
    'createDlc': createDlc,
    'delDlc': delDlc
}
