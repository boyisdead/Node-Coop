var Student = require('./../models/student');
var Teacher = require('./../models/teacher');
var Counter = require('./../models/counter');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
var fs = require("fs");
var objectAssign = require('object-assign');
var ObjectId = require('mongoose').Types.ObjectId; 

var default_profile = './uploads/pictures/profile/default.png';

var getFileExtension = function(filename){
    return '.' + filename.substr(filename.lastIndexOf('.') + 1);
}

var numToLengthString = function(num, length) {
    var newNum = "" + num.toString();
    while (newNum.length < length) {
        newNum = "0" + newNum;
    }
    return newNum;
}

var autoPrefixId = function(prefix, max, numLong) {
    var new_id = prefix.concat(numToLengthString(max, numLong));
    console.log(new_id);
    return new_id;
};

function deleteFiles(files, callback){
    var i = files.length;
    files.forEach(function(filepath){
        fs.unlink(filepath, function(err) {
            i--;
            if (err) {
                callback(err);
                return;
            } else if (i <= 0) {
                callback(null);
            }
        });
    });
}

var getAcaYrs = function(res){
    var queryGroup = Student.distinct("academic_year");
    queryGroup.exec(function(err, acaYrs) {
        if (err)
            return res.status(200).send({
                success: false, 
                message: "Something went wrong while retrieving. try again.", 
                error : err
            });
        if (!acaYrs || typeof acaYrs[0] == "undefined")
            return res.status(204).send({
                success : true, 
                message : "No Academic Year was found."
            });
        return res.status(200).send({
            result : acaYrs, 
            success: true, 
            message: "Here you go."
        });
    });
};

var studentLogin = function(res, item, secretToken, expireTime) {
    console.log("find Student with : " + item.username);
    Student.findOne({
        "_id": item.username
    }, function(err, student) {
        if (err)
            return res.status(500).send(err);
        if (!student) 
            return res.status(404).send({
                success: false, // not found
                message: 'Authentication failed. No Account was found.'
            });
        // check if password matches
        if (!passwordHash.verify(item.password, student.password)) {
            return res.status(403).send({
                success: false, // wrong password
                message: 'Authentication failed. Invalid password.', 
            });
        } else {
            var token = jwt.sign({
                "display_name": student.name.first, 
                "access_type": "student", 
                "access_id": student._id
            }, secretToken, {
                expiresInMinutes: expireTime
            });
            return res.status(200).send({
                success : true, 
                message : "Login successful, token retrieved.", 
                result: { token : token }
            });
        }
    })
}

var getStudents = function(res, criteria, project, option) {
    criteria = criteria || {};
    project = project || { name: 1, profile_picture: 1, status: 1, sex: 1 };
    option = option || {};
    Student.find(criteria, project, function(err, docs){
        if(err)
            return res.status(500).send({
                success: false, 
                message: "Something went wrong while retrieving. try again.", 
                error: err, 
            });
        if(!docs || typeof docs[0] == "undefined") {
            return res.status(404).send({
                success : false, 
                message : "No Student was found."
            });
        } 
        return res.status(200).send({
            result : docs, 
            success : true, 
            message : "Here you go."
        });
        
    });
};

var getStudentByAcaYr = function(res, academic_year) {
    var criteria = { "academic_year": academic_year } || {};
    var projection = { name: 1, status: 1 };
    console.log(criteria, projection);
    getStudents(res, criteria, projection);
};

var findStudentById = function(res, id) {
    getStudents(res, { _id: id }, {});
};

var getMyAdviser = function(res, id) {
    console.log("Get adviser of %s", id);
    Student.findOne({_id: id}, { adviser_id: 1 }, function(err, student){
        if(err)
            return res.status(500).send({
                success: false, 
                message: "Something went wrong while retrieving. try again.", 
                error: err, 
            });
        if(!student || typeof student == "undefined") 
            return res.status(404).send({
                success : false, 
                message : "This Account no longer exists an database."
            });
        console.log("Adviser of %s is ", id);
        console.log(student.adviser_id);
        Teacher.find({_id: student.adviser_id}, function (err, doc){
            if(err)
                return res.status(500).send({
                    success: false, 
                    message: "Something went wrong while retrieving. try again.", 
                    error: err, 
                });
            if(!doc || typeof doc[0] == "undefined") {
                return res.status(404).send({
                    success : false, 
                    message : "No Teacher was found."
                });
            } else if(doc.length <= 1){
                return res.status(200).send({
                    result : doc[0], 
                    success : true, 
                    message : "Here you go."
                });
            } else {
                return res.status(200).send({
                    result : doc, 
                    success : true, 
                    message : "Here you go."
                });
            }
        });
    });
};

var studentRegistration = function (res, item) { // wait for mailing module
    Student.findOne({
        _id: item._id
    }, function(err, doc){
        if(err)
            return res.status(500).send({
                success: false, 
                message: "Something went wrong while retrieving. try again.", 
                error: err, 
            });
        if(!doc){
            var newStudent = new Student();
            objectAssign(newStudent, item);
            newStudent.password = passwordHash.generate(item.password);
            newStudent.save(function(err){
                if(!err){
                    return res.status(201).send({
                        success: true, 
                        message: "Your account has been created."
                    });
                }
                return res.send(err);
            });
        } else {
            return res.status(400).send({
                success: false, 
                message: "Duplicate student code."
            });
        }
    });
}

var createStudent = function(res, item) {
    Student.findOne({
        "_id": item._id
    }, function(err, doc){
        if(err)
            return res.status(500).send({
                success: false, 
                message: "Something went wrong while retrieving. try again.", 
                error: err, 
            });
        if(!doc){
            var newStudent = new Student();
            objectAssign(newStudent, item);
            newStudent.password = passwordHash.generate(item.password);
            newStudent.save(function(err){
                if(!err){
                    return res.status(201).send({
                        success: true, 
                        message: "Account has been created."
                    });
                } else {
                    return res.status(500).send({
                        error: err, 
                        message : "Something went wrong! try again.", 
                        success : false
                    });
                }
            });
        } else {
            return res.status(400).send({
                success: false, 
                error: "Duplicate student code."
            });
        }
    });
};

var updateStudent = function(res, item) {
    if (typeof item.password != 'undefined')
        item.password = passwordHash.generate(item.password);

    Student.findOne({
        _id: item._id
    }, function(err, doc){
        if(err)
            return res.status(500).send({
                success: false, 
                message: "Something went wrong while finding Student. try again.", 
                error: err
            });
        if(doc){            
            if(item.name){
                objectAssign(doc.name, item.name);
                delete item.name;
            }
            if(item.emergency_contact){
                objectAssign(doc.emergency_contact, item.emergency_contact);
                delete item.emergency_contact;
            }
            if(item.contact){
                objectAssign(doc.contact, item.contact);
                delete item.contact;
            }
            if(item.aptitudes){
                delete item.aptitudes;
            }
            if(item.documuents){
                delete item.documuents;
            }

            objectAssign(doc, item);
            doc.save(function (err){
                if(err){
                    return res.status(200).send({
                        success: false, 
                        message: "Something went wrong while saving Student. try again.", 
                        error: err
                    });
                }
                return res.status(200).send({
                    success : true, 
                    message: "Student updated."
                });
            });
        } else {
            return res.status(404).send({
                success: false, 
                message: "No Student was found."
            });
        }
    });
};

var changePreferredCompany = function (res, owner, item) {
    if (item){    
        Student.findOne({_id: owner}, function(err, doc){
            if(err)
                return res.status(500).send({
                    success: false, 
                    message: "Something went wrong while finding Student. try again.", 
                    error: err
                });
            if(doc){            
                var preferred = new Student().preferred_company;
                objectAssign(preferred, item);
                doc.save();
                return res.status(200).send({
                    success : true, 
                    message: "Preferred companies updated."
                });
            } else {
                return res.status(404).send({
                    success: false, 
                    message: "No Student was found."
                });
            }
        })
    } else {
        return res.status(400).send({
            success: false, 
            message: "No prefered companies provided."
        });
    }
}

var uploadPicture = function(res, id, item){
    if(item.file)
        return res.status(400).send({
            success: false, 
            message: "No picture provided."
        });

    var tmp_path = item.file.path;
    var time_stamp = Date.now();
        console.log(tmp_path, time_stamp);
    console.log("Creating...", item.body);

    var new_file_name = item.file.filename + time_stamp + getFileExtension(item.file.originalname);
    var target_path = '/uploads/pictures/profile/' + new_file_name;
    console.log("file name: " + new_file_name);
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream( './public' + target_path);
    src.pipe(dest);
    src.on('end', function() {
        Student.findOne({
            _id: item.body.student_id
        }, function(err, doc){
            if(err)
                return res.status(500).send({
                    success: false, 
                    message: "Something went wrong while retrieving. try again.", 
                    error: err, 
                });
            console.log(doc);
            if (doc){
                console.log("saving picture path...");
                doc.profile_picture ='.' + target_path;
                doc.save(function(err){
                    if(err)
                        return res.status(500).send({
                            success: false, 
                            message: "Something went wrong while retrieving. try again.", 
                            error: err, 
                        });
                    return res.status(200).send({
                        success: true
                    });
                });
                
            } else {
                return res.status(404).send({
                    success: false, 
                    message: "No Student was found."
                });
            }
        });
    });
    src.on('error', function(err) {
        return res.json({success: false});
    });
    fs.unlinkSync(tmp_path);
};

var pwChangeStudent = function(res, item) {
    Student.findOne({
        _id: item._id
    }, function(err, doc) {
        if(err){
            return res.status(500).send({
                success: false, 
                error: err, 
                message: "Something went wrong while retrieving. try again"
            })
        }
        if (!doc) {
            return res.status(404).send({
                success: false, 
                message: "Account not found."
            })
        }
        console.log("Change password from %s to %s (in db is %s).", item.oldPassword, item.newPassword);
        if (passwordHash.verify(item.oldPassword, doc.password)) {
            doc.password = passwordHash.generate(item.newPassword);
            doc.save(function(err){
                if(err)
                    return res.status(500).send({
                        success: false, 
                        error: err, 
                        message: "Something went wrong while retrieving. try again" 
                    })
                return res.status(200).send({
                    success: true, 
                    message: "Password changed."
                })
            });
        } else {
            return res.status(400).send({
                success: false, 
                message: "Old password not match."
            })
        }
    });
};

var delStudent = function(res, item) {
    Student.findOne({_id: item}, function (err, doc){
        if(err)
            return res.status(500).send({
                success: false, 
                message: "Something went wrong while retrieving. try again.", 
                error: err
            })
        if(!doc)
            return res.status(404).send({
                success: false, 
                error: "File not exist."
            })
        console.log("doc in findOne : ", doc);
        if (doc.profile_picture != default_profile) {
            deleteFiles(doc.profile_picture.replace('./', './public/'), function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('all files removed');
                }
            });
        }

        var remainFiles = [];
        while(doc.attachments.length>0){
            var nextFile = doc.attachments.pop().file_path;
            console.log(nextFile);
            remainFiles.push(nextFile.replace('./', './public/'));
        }

        console.log("sending : ", doc.attachments);
        deleteFiles(remainFiles, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log('all files removed');
            }
        });

        Student.findOneAndRemove({"_id": item}, function(err, doc){
            if(err)
                return res.status(500).send({
                    success: false, 
                    message: "Something went wrong while removing. try again.", 
                    error: err
                });
            else
                return res.status(204).send({
                    success: true, 
                    message: "Student removed."
                });
        });
        
    })     
};

var getAttachments = function (res, academic_year){
    academic_year = academic_year || {$ne: ""};
    var result = [];
    console.log(academic_year);
    Student.aggregate([
        {$project: {attachments: 1, academic_year: 1}}, 
        {$match: {"attachments": {$exists: true}, "academic_year": academic_year}}
    ])
    .unwind("attachments")
    .exec(function(err, docs){
        if(err)
            return res.status(500).send({
                success: false, 
                message: "Something went wrong while removing. try again.", 
                error: err
            });
        while (docs.length>=1){
            result.push(docs.pop().attachments);
        }
        return res.status(200).send({
            success: true, 
            result: result, 
            message: "Here you go."
        });
    });
}

var getStudentAttachments = function (res, item){
    if(!item){
        return res.status(401).send({success: false, message: "No student id in token."});
    } else {
        Student.findOne({_id: item}, {attachments: 1}, function(err, docs){
            if(err)
                return res.status(500).send({
                    success: false, 
                    message: "Something went wrong while removing. try again.", 
                    error: err
                });
            return res.status(200).send({
                success: true, 
                result: docs.attachments, 
                message: "Here you go."
            });
        });
    }
}

var findAttachmentById = function (res, item){
    var newItem = new ObjectId(item);
    Student.findOne({"attachments._id": newItem}, {attachments: 1}, function(err, doc){
        if(err)
            return res.status(500).send({
                success: false, 
                message: "Something went wrong while removing. try again.", 
                error: err
            });
        return res.status(200).send({
            success: true, 
            result: doc.attachments[0], 
            message: "Here you go."
        });
    });
}

var createAttachment = function (res, file, attachment, student){

    student = student || attachment.owner || -1;
    console.log("old file: " , attachment, file, student);
    if(student == -1) {
        return res.status(400).send({
            success: false, 
            error: "No attachment owner provided."
        });
    }
    var tmp_path = file.path;
    var destination_folder = '/uploads/attachments/';

    Counter.findOneAndUpdate({_id: "attachments"}, {$inc: {seq: 1}}, function(err, cnt){
        if(err){
            fs.unlinkSync(tmp_path);
            return res.status(500).send({
                success: false, 
                message: "Something went wrong while removing. try again.", 
                error: err
            });
        }
        var new_file_name = autoPrefixId("AT", cnt.seq, 6) + "_" + attachment.file_name.replace(/ /g, "_").toLowerCase() + getFileExtension(file.originalname);
        var target_path = destination_folder + new_file_name;
        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream('./public' + target_path);

        attachment.file_path = '.'+target_path;

        console.log("new file name: " , new_file_name);
        console.log("new file: " , attachment);
        src.pipe(dest);
        src.on('end', function() {
            Student.findOneAndUpdate({"_id": student}, { $addToSet: {"attachments": attachment}}, function(err, doc){
                //console.log("doc", doc);
                if(err) {
                    fs.unlinkSync(tmp_path);
                    return res.status(500).send({
                        success: false, 
                        message: "Something went wrong while removing. try again.", 
                        error: err
                    });
                }
                fs.unlinkSync(tmp_path);
                return res.status(201).send({
                    success: true, 
                    message: "Attachment created."
                });
            });
        });
        src.on('error', function(err) {
            fs.unlinkSync(tmp_path);
            return res.status(500).send({
                success: false, 
                message: "Something went wrong while removing. try again.", 
                error: err
            });
        });
    })
}

var updateAttachment = function (res, attachment) {
    if(attachment && typeof attachment != "undefined"){
        Student.findOneAndUpdate({"attachments._id": attachment._id}, { 
            $set: {
                "attachments.$.file_name": attachment.file_name, 
                "attachments.$.file_type": attachment.file_type, 
                "attachments.$.comment": attachment.comment, 
                "attachments.$.status": attachment.status, 
                "attachments.$.reviewed": attachment.reviewed, 
                "attachments.$.description": attachment.description
            }
        }, function(err, doc){
            if(err)
                return res.status(500).send({
                    success: false, 
                    message: "Something went wrong while removing. try again.", 
                    error: err
                });
            else 
                return res.status(200).send({
                    success: true, 
                    message: "Attachment updated."
                });
        });
    }
}

var delAttachment = function (res, item, student){
    student = student || {$ne: ''};
    var newItem = new ObjectId(item);
    console.log(student, newItem);

    Student.findOne({"_id": student , "attachments._id": newItem}, {_id: 0, "attachments.$": 1}, function (err, doc){
        if(err)
            return res.status(500).send({
                success: false, 
                message: "Something went wrong while retrieving. try again."
            })
        if(!doc)
            return res.status(404).send({
                success: false, 
                error: "File not exist."
            })
        else {
            console.log("doc in findOne : ", doc);
            var att_path = doc.attachments[0].file_path.replace('./', './public/');
            console.log("doc loc: ", att_path);
            fs.stat(att_path, function(err, stats) {
                if(typeof stats != 'undefined'){
                    console.log("File : ", stats);
                    console.log("File : ", stats.isFile());
                    if(stats.isFile())
                        fs.unlink(att_path), function (err) {
                            if (err) throw err;
                        }
                    console.log("Deleted - " + att_path);
                } else {
                    console.log("File not exist - "+ att_path);
                }
            });
            Student.findOneAndUpdate({"_id": student, "attachments._id": newItem}, {$pull: {"attachments": {"_id": newItem}}}, function(err, doc){
                console.log(doc);
                if(err)
                    return res.status(500).send({
                        success: false, 
                        message: "Something went wrong while removing. try again.", 
                        error: err
                    });
                else
                    return res.status(200).send({
                        success: true, 
                        message: "Attachment removed."
                    });
            });
        }
    })    
}

var getAttachmentsWithOwner = function(res, academic_year) {
    academic_year = academic_year || {"$ne": ""};

    if (academic_year == "all"){
        academic_year = {$ne: ""}
    }

    Student.find({
        "academic_year": academic_year, 
        "attachments": {$exists: true}
    }, {attachments: 1, name: 1}, function(err, docs){
        if(err)
            return res.status(500).send({
                success: false, 
                message: "Something went wrong while removing. try again.", 
                error: err
            });
        return res.status(200).send({
            success: true, 
            message: "Attachment removed.",
            result: docs
        });
    });
};

module.exports = {
	'studentLogin': studentLogin, 
	'getStudents': getStudents, 
	'getStudentByAcaYr': getStudentByAcaYr, 
    'findStudentById': findStudentById, 
    'getMyAdviser': getMyAdviser, 
	'createStudent': createStudent, 
	'updateStudent': updateStudent, 
	// 'lockStuProfile': lockStuProfile, 
	// 'unLockStuProfile': unLockStuProfile, 
	'uploadPicture': uploadPicture, 
	'pwChangeStudent': pwChangeStudent, 
	'delStudent': delStudent, 
	'getAcaYrs': getAcaYrs, 
    'getAttachments': getAttachments, 
    'getStudentAttachments': getStudentAttachments, 
    'getAttachmentsWithOwner': getAttachmentsWithOwner, 
    'findAttachmentById': findAttachmentById, 
    'createAttachment': createAttachment, 
    'updateAttachment': updateAttachment, 
    'delAttachment': delAttachment, 
    'studentRegistration': studentRegistration

}