var Application = require('./../models/application');
var Student = require('./../models/student');
var Company = require('./../models/company');

var MailController = require('./mailController');
var nodemailer = require("nodemailer");
var objectAssign = require('object-assign');

// Get

var getApplication = function(res, criteria, project, option) {
    criteria = criteria || {};
    project = project || {};
    option = option || {};
    Application.find(criteria, project, option, function(err, applications) {
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
    console.log("create ite : ", item);
    objectAssign(newApplication, item);
    newApplication.save(function(err) {
        if (err)
            return res.status(500).send({
                success:false, 
                error:err
            });
        mailingStudentApplicant(item.student, item.company, item.attachments);
        res.status(201).send({success: true});
    });
};


var mailingStudentApplicant = function(student_id, company_id, attachmentList){
    var attachmentList = attachmentList

    Student.findOne({ 
        _id : student_id 
    },{
        attachments: 1,
        name: 1,
        gpa: 1,
        sex: 1
    }, function(err, studentInfo){
        if(err)
            return res.status(500).send({
                success:false,
                error: err
            })
        if(!studentInfo)
            return res.status(400).send({
                success: false,
                error: {
                    message: "Student doesn't exist."
                }
            })
        var attach = initialAttachment(studentInfo.attachments, attachmentList);
        Company.findOne({
            _id: company_id
        },{
            contact: 1,
            coordinator: 1,
            name: 1
        }, function(err, companyInfo){
            if(err)
                return res.status(500).send({
                    success:false,
                    error: err
                })
            if(!companyInfo)
                return res.status(400).send({
                    success: false,
                    error: {
                        message: "Company doesn't exist."
                    }
                })

            var mailContent = "Student name : " + studentInfo.name.title + studentInfo.name.first + " " + studentInfo.name.last + "\n";
            mailContent = mailContent + "ID : " + student_id + "\n";
            mailContent = mailContent + "GPA : " + studentInfo.gpa + "\n";
            mailContent = mailContent + "Sex : " + studentInfo.sex + "\n";

            var mailOption = { 
                from : "nattawut_k@cmu.ac.th",
                to : companyInfo.contact.email + ', "' + companyInfo.contact.name.first + " " + companyInfo.contact.name.last +'"',
                subject : "Student application",
                text : mailContent,
                attachments : attach
            }
            var mailRes = MailController.sendMail(mailOption);
        })
    });
}

var initialAttachment = function(attachments, needAttachments){
    console.log("init : ",needAttachments);
    var result = [];
    var i = 0; 
    for(var i=0; i<attachments.length; i++){
        console.log("doc"+i+" : " + attachments[i]._id, needAttachments.lastIndexOf(attachments[i]._id));
        if(needAttachments.lastIndexOf(attachments[i]._id.toString())>=0){
            var newItem= {};
            newItem.filename = attachments[i].file_name,
            newItem.path = "./public/" + attachments[i].file_path.substr(2);
            newItem.contentType = "application/pdf"
            result.push(newItem);
            console.log(newItem)
        }
    }
    console.log("att : ", result);
    return result;
}

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
