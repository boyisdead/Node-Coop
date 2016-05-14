var Announce = require('./../models/announce');
var Counter = require('./../models/counter');
var objectAssign = require('object-assign');

// Misc
var numToLengthString = require('./../utilities/misc').numToLengthString;
var autoPrefixId = require('./../utilities/misc').autoPrefixId;


// Get

var getAnnounce = function(res, criteria, project, option) {
    criteria = criteria || {};
    project = project || {};
    option = option || {};
    Announce.find(criteria, project, option, function(err, announces) {
        if (err)
            return res.status(500).send({
                error:err,
                success: false
            });
        res.status(200).send({
            success: true,
            result: announces,
            message: "Here you go.",
            meta : {
                limit : option.limit,
                skip : option.skip,
                total : announces.length
            }
        }); 
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
        if (err) return res.status(500).send(err); // maybe collections counter is missing
        newAnnounce._id  = autoPrefixId("ANC", cntr.seq, 3);
        objectAssign(newAnnounce, item);
        newAnnounce.save(function(err) {
            if (err)
                return res.status(500).send({success:false,error:err});
            return res.status(200).send({success:true});
        })
    });
};

// Update

var updateAnnounce = function(res, item, announcer) {
    Announce.findOne({
        _id: item._id
    }, function(err, doc) {
        if (err)
            return res.status(500).send(err);
        if (doc) {
            objectAssign(doc, item);
            doc.announcer = announcer;
            doc.annouce_date = Date.now();
            doc.save();        
            return res.status(200).send({success:true});
        } else { 
            console.log("Not found - not update");
            return res.status(400).send({success:false,error:err});
        }
    });
};

// Remove

var delAnnounce = function(res, item) {
    Announce.remove({
        _id: item
    }, function(err) {
        if (err)
            return res.status(500).send({success:false,error:err});
        res.status(200).send({success:true});
    })
};

module.exports = {
	'getAnnounce': getAnnounce,
    'findAnnounceById': findAnnounceById,
	'createAnnounce': createAnnounce,
	'updateAnnounce': updateAnnounce,
	'delAnnounce': delAnnounce,
};
