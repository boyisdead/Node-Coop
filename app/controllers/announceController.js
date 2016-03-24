var Announce = require('./../models/announce');
var Counter = require('./../models/counter');
var objectAssign = require('object-assign');

// Misc

var numToLengthString = function(num, length){
    var newNum = "" + num.toString();
    while(newNum.length<length){
        newNum = "0" + newNum;
    }
    return newNum;
}

var autoPrefixId = function(prefix, max, numLong){
    var new_id = prefix.concat(numToLengthString(max,numLong));
    console.log(new_id);
    return new_id;
};


// Get

var getAnnounce = function(res, criteria){
    criteria = criteria || {};
    Announce.find(criteria,function(err, announces) {
        if (err)
            res.send(err)
        res.json(announces); 
    });
};

var findAnnounceById = function(res, item) {
    getAnnounce(res, {"_id": item});    
};

// Create

var createAnnounce = function(res, item) {
    var msg;
    var newAnnounce = new Announce();
    Counter.findOneAndUpdate({_id:"announces"},{$inc:{"seq":1 }}, function (err, cntr) {
        if (err) return res.send(err); // Space Ghost is a talk show host.
        newAnnounce._id  = autoPrefixId("ANC", cntr.seq, 3);
        objectAssign(newAnnounce, item);
        newAnnounce.save(function(err) {
            if (err)
                msg = {success:false,err:err};
            else
                msg = {success:true};
            res.json(msg);
        })
    });
};

// Update

var updateAnnounce = function(res, item, announcer) {
    Announce.findOne({
        _id: item._id
    }, function(err, doc) {
        if (doc != null) {
            objectAssign(doc, item);
            doc.announcer = announcer;
            doc.annouce_date = Date.now();
            doc.save();
        } else console.log("Not found - not update");

        if (err)
            res.send(err);
        res.json({success:true});
    });
};

// Remove

var delAnnounce = function(res, item) {
    Announce.remove({
        _id: item
    }, function(err) {
        if (err)
            res.send(err);
        else
            res.json({success:true});
    })
};

module.exports = {
	'getAnnounce': getAnnounce,
    'findAnnounceById': findAnnounceById,
	'createAnnounce': createAnnounce,
	'updateAnnounce': updateAnnounce,
	'delAnnounce': delAnnounce,
};
