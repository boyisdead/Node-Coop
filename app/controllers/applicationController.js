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

var getStudentApplyStatus = function(res, item){
    Application.find({student:item,apply_date:{$exists:true}},function(err, application) {
        if (err)
            res.send(err)
        if(application)
            res.status(200).send({success:true,status:true}); 
        else
            res.status(200).send({success:true,status:false}); 
    });
}

var getStudentAcceptStatus = function(res, item){
    Application.find({student:item,response:true,reply:{$exists:true}},function(err, application) {
        if (err)
            res.send(err)
        if(application)
            res.status(200).send({success:true,status:true}); 
        else
            res.status(200).send({success:true,status:false}); 
    });
}

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
    'getStudentApplyStatus': getStudentApplyStatus,
    'getStudentAcceptStatus': getStudentAcceptStatus,
	'createApplication': createApplication,
	'updateApplication': updateApplication,
	'delApplication': delApplication,
};
