var Application = require('./../models/application');
var objectAssign = require('object-assign');

// Get

var getApplication = function(res, criteria){
    criteria = criteria || {};
    Application.find(criteria,function(err, applications) {
        if (err)
            res.send(err)
        res.json(applications); 
    });
};

var getApplicationByStudent = function(res, item){
	getApplication(res, {"student":item});
};

var getApplicationByCompany = function(res, item){
	getApplication(res, {"company":item});
};

var getApplicationUnreply = function(res, item){
	getApplication(res, {"reply":false});
};

var findApplicationById = function(res, item) {
    getApplication(res, {"_id": item});    
};

// Create

var createApplication = function(res, item) {
    var msg;
    var newApplication = new Application();
    objectAssign(newApplication, item);
    newApplication.save(function(err) {
        if (err)
            msg = {success:false,err:err};
        else
            msg = {success:true};
        res.json(msg);
    });
};

// Update

var updateApplication = function(res, item) {
    Application.findOne({
        _id: item._id
    }, function(err, doc) {
        if (doc != null) {
        	if(item.attachments)
        		delete item.attachments;
            objectAssign(doc, item);
            doc.reply_date = new Date;
            console.log(doc.reply_date);
            doc.reply = true;
            doc.save();
        } else console.log("Not found - not update");

        if (err)
            res.send(err);
        res.json({success:true});
    });
};

// Remove

var delApplication = function(res, item) {
    Application.remove({
        _id: item
    }, function(err) {
        if (err)
            res.send(err);
        else
            res.json({success:true});
    })
};

module.exports = {
	'getApplication': getApplication,
	'getApplicationByStudent': getApplicationByStudent,
	'getApplicationByCompany': getApplicationByCompany,
	'getApplicationUnreply': getApplicationUnreply,
    'findApplicationById': findApplicationById,
	'createApplication': createApplication,
	'updateApplication': updateApplication,
	'delApplication': delApplication,
};
