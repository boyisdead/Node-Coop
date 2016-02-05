var Company = require('./../models/company');

var getCompany = function(res){
    Company.find(function(err, companies) {
        if (err)
            res.send(err)
        res.json(companies); 
    });
};

// function findCompany(item, mode, res) {
//     Company.findOne({
//         "name"."full" : item
//     }, function(err, companies) {
//         console.log("code", item, err, companies);
//         if (err)
//             res.send(err)
//         res.json(companies); // return all companies in JSON format
//     });
// };
// 

var findCompany = function(item, mode, res) {
    if (mode == 'i') {
        Company.findOne({
            _id: item
        }, function(err, company) {
            console.log("id", item, err, company);
            if (err)
                res.send(err)
            res.json(company);
        });
    } else if (mode == 'c') {
        Company.findOne({
            "s_index": item
        }, function(err, company) {
            console.log("code", item, err, company);
            if (err)
                res.send(err)
            res.json(company);
        });
    }
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
            if (item.name) {
                if (typeof item.name.full != 'undefined')
                    doc.name.full = item.name.full;
                if (typeof item.name.init != 'undefined')
                    doc.name.init = item.name.init;
            }
            if(item.contact){
                doc.contact = item.contact;
                // if(item.contact.name){
                //     if (typeof item.contact.name.f_th != 'undefined')
                //         doc.contact.name.f_th = item.contact.name.f_th;
                //     if (typeof item.contact.name.l_th != 'undefined')
                //         doc.contact.name.l_th = item.contact.name.l_th;
                //     if (typeof item.contact.name.t_th != 'undefined')
                //         doc.contact.name.t_th = item.contact.name.t_th;
                //     if (typeof item.contact.name.f_en != 'undefined')
                //         doc.contact.name.f_en = item.contact.name.f_en;
                //     if (typeof item.contact.name.l_en != 'undefined')
                //         doc.contact.name.l_en = item.contact.name.l_en;
                //     if (typeof item.contact.name.t_en != 'undefined')
                //         doc.contact.name.t_en = item.contact.name.t_en;
                // }
                // if (typeof item.contact.pos != 'undefined')
                //     doc.contact.pos = item.contact.pos;
                // if (typeof item.contact.tel != 'undefined')
                //     doc.contact.tel = item.contact.tel;
                // if (typeof item.contact.email != 'undefined')
                //     doc.contact.email = item.contact.email;
            }

            if(item.coordinator)
                doc.coordinator = item.coordinator;

            if (typeof item.part_year != 'undefined')
                doc.part_year = item.part_year;
            if (typeof item.tel != 'undefined')
                doc.tel = item.tel;
            if (typeof item.fax != 'undefined')
                doc.fax = item.fax;
            if (typeof item.email != 'undefined')
                doc.email = item.email;
            if (typeof item.website != 'undefined')
                doc.website = item.website;

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
	'findCompany': findCompany,
	'createCompany': createCompany,
	'updateCompany': updateCompany,
	'updateCompanyContact': updateCompanyContact,
	'delCompany': delCompany

};
