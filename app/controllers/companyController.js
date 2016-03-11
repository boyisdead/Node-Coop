var Company = require('./../models/company');
var Counter = require('./../models/counter');
var objectAssign = require('object-assign');

var getCompany = function(res){
    Company.find(function(err, companies) {
        if (err)
            res.send(err)
        res.json(companies); 
    });
};
var getPartCompany = function (res) {
    Company.find({
        "participate_now" : true
    },function(err,docs){
        if(!err){
            res.status(200).send({
                success: true,
                message: "Here!",
                data: docs
            });
        } else {
            res.send(err);
        }
    });
}
var getCompanyByArea = function(areas, res) {
    Company.find({
        area: { $in : areas }
    },function(err,docs){
        if(!err){
            res.status(200).send({
                success: true,
                message: "Here!",
                data: docs
            });
        } else {
            res.send(err);
        }
    });
}

var findCompanyById = function(code, res) {
    Company.findOne({
        s_index: code
    }, function(err, company) {
        if (err)
            res.send(err)
        res.json(company);
    });
};

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

var createCompany = function(item, res) {

    var msg;
    var new_s_index;
    var newCompany = new Company();
    Counter.findOneAndUpdate({_id:"companies"},{$inc:{"seq":1 }}, function (err, esb) {
        if (err) return res.send(err); // Space Ghost is a talk show host.
        console.log(esb);
        newCompany._id  = autoPrefixId("ESB", esb.seq, 3);
        objectAssign(newCompany, item)
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

var updateCompany = function(item, res) {
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

var updateCompanyContact = function(item, res){
    Company.findOne({
        _id: item._id
    }, function(err, doc) {
        if (doc != null) {
            if(item.contact)
                doc.contact = item.contact;
        }
    })
};

var delCompany = function(item, res) {
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
