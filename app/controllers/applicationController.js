var Application = require('./../models/application');
var objectAssign = require('object-assign');

// Get

var getApplication = function(res, criteria){
    criteria = criteria || {};
    Application.find(criteria,function(err, applications) {
        if (err)
            return res.status(500).send({
                success: false,
                error:err
            }); 
        return res.status(200).send({
            success: true,
            result: applications
        }); 
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
            return res.status(500).send({
                success: false,
                error:err
            }); 
        if(application)
            return res.status(200).send({
                success:true,
                result: {
                    status:true,
                    _id:item
                }
            }); 
        res.status(200).send({
            success:true,
            result: {
                status: false,
                _id:item
            }
        }); 
    });
}

var getStudentAcceptStatus = function(res, item){
    Application.find({student:item,response:true,reply:{$exists:true}},function(err, application) {
        if (err)
            return res.status(500).send({success: false,error: err}); 
        if(application)
            return res.status(200).send({
                success: true,
                result: {
                    status:true,
                    _id:item
                }
            }); 
        return res.status(200).send({
            success:true,
            result:{
                status:false,
                _id:item
            }
        }); 
    });
}

// Create

var createApplication = function(res, item) {
    var newApplication = new Application();
    objectAssign(newApplication, item);
    newApplication.save(function(err) {
        if (err)
            return res.status(500).send({
                success:false, 
                error:err
            });
        return res.status(201).send({success: true});
    });
};

// Update

var updateApplication = function(res, item) {
    Application.findOne({
        _id: item._id
    }, function(err, doc) {
        if (err)
            return res.status(500).send({
                success:false, 
                error:err
            });
        if (!doc) {
            console.log("Not found - not update");
            return res.status(404).send({
                success:false, 
                result:err
            });
        }

        if(item.attachments)
            delete item.attachments;
        objectAssign(doc, item);
        doc.reply_date = new Date;
        console.log(doc.reply_date);
        doc.reply = true;
        doc.save(function(err){
            if (err)
                return res.status(500).send({
                    success:false, 
                    error:err
                });
            return res.status(200).send({
                success:true
            });
        });
    });
};

// Remove

var delApplication = function(res, item) {
    Application.remove({
        _id: item
    }, function(err) {
        if (err)
            return res.status(500).send({
                success:false, 
                error:err
            });
        return res.status(200).send({
            success:true
        });
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
