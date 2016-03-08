var Company = require('./../models/company');
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

var easyAutoId = function(prefix, max, numLong){
    var newMax = max+1;
    var new_id = prefix.concat(newMax.toString());
    while(new_id.length < numLong){
        new_id = new_id.slice(0,new_id.length-1) + "0" + newMax;
    }
    return new_id;
};

var createCompany = function(item, res) {

    var msg;
    var new_s_index;
    var query = Company.findOne();
    query.select('s_index');
    query.limit(1);
    query.sort('-s_index');

    query.exec(function (err, esb) {
        if (err) return handleError(err); // Space Ghost is a talk show host.
        new_s_index  = easyAutoId("ESB", parseInt(esb.s_index.substr(3,3)), 6);
    })

    if(typeof item.name.init == 'undefined')
        item.name.init = new_s_index;

    var newCompany = new Company({
        name : {
                full : item.name.full,
                init : item.name.init
        },
        part_year: item.part_year,
        tel: item.tel,
        fax: item.fax,
        email: item.email,
        website: item.website,
        address: item.address,
        s_index: new_s_index
    });
    if(item.contact)
        newCompany.contact = item.contact;
    if(item.coordinator)
        newCompany.coordinator = item.coordinator;

    newCompany.save(function(err) {
        if (err)
            msg = {success:false,err:err};
        else
            msg = {success:true};
        res.json(msg);
    })
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
