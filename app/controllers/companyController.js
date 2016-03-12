var Company = require('./../models/company');
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

var getCompany = function(res, criteria, projection){
    criteria = criteria || {};
    projection = projection || {"name":1, "status":1, "website":1, "area":1};
    Company.find(criteria,projection,function(err, companies) {
        if (err)
            res.send(err)
        res.json(companies); 
    });
};

var getPartCompany = function (res) {
    var criteria = {"active" : true};
    getCompany(res, criteria);
}

var getCompanyByArea = function(res, areas) {
    var criteria = {"area": { $in : areas }};
    getCompany(res, criteria);
}

var findCompanyById = function(res, code) {
    var criteria = {"_id": code};
    var projection = {};
    getCompany(res, criteria, projection);    
};

// Create

var createCompany = function(res, item) {
    var msg;
    var new_s_index;
    var newCompany = new Company();
    Counter.findOneAndUpdate({_id:"companies"},{$inc:{"seq":1 }}, function (err, esb) {
        if (err) return res.send(err); // Space Ghost is a talk show host.
        console.log(esb);
        newCompany._id  = autoPrefixId("ESB", esb.seq, 3);
        objectAssign(newCompany, item);
        console.log(newCompany);
        newCompany.save(function(err) {
            if (err)
                msg = {success:false,err:err};
            else
                msg = {success:true};
            res.json(msg);
        })
    });
};

// Update

var updateCompany = function(res, item) {
    Company.findOne({
        _id: item._id
    }, function(err, doc) {
        if (doc != null) {
            objectAssign(doc, item);
            doc.save();
        } else console.log("Not found - not update");

        if (err)
            res.send(err);
        getCompany(res);
    });
};

var updateCompanyContact = function(res, item){
    Company.findOne({
        _id: item._id
    }, function(err, doc) {
        if (doc != null) {
            if(item.contact)
                doc.contact = item.contact;
        }
    })
};

var addCompanyPicture = function(res){

}

// Remove

var delCompany = function(res, item) {
    Company.remove({
        _id: item
    }, function(err) {
        if (err)
            res.send(err);
        else
            res.json({success:true});
    })
};

module.exports = {
	'getCompany': getCompany,
    'findCompanyById': findCompanyById,
	'createCompany': createCompany,
	'updateCompany': updateCompany,
	'updateCompanyContact': updateCompanyContact,
	'delCompany': delCompany,
    'getPartCompany': getPartCompany,
    'getCompanyByArea': getCompanyByArea

};
