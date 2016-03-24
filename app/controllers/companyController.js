var Company = require('./../models/company');
var Counter = require('./../models/counter');
var Contact = require('./../models/contact');
var objectAssign = require('object-assign');
var fs = require("fs");

var deleteFiles = require('./../utilities/deleteFiles').deleteFiles;
var getFileExtension = require('./../utilities/misc').getFileExtension;
var numToLengthString = require('./../utilities/misc').numToLengthString;
var autoPrefixId = require('./../utilities/misc').autoPrefixId;
var company_picture_dir = require('../../config/setting').company_picture_dir;

// Misc

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
        if(err)
            res.status(500).send({
                success: false,
                message: "Something went wrong while retrieving. try again."
            })
        else if(!doc)
            res.status(200).send({
                success: false,
                message: "Company not exist."
            })
        else { 
            var newContact = new Company();
            if(item) { 
                objectAssign(doc, item);
                doc.save();
                res.status(200).send({
                    success: true,
                    message: ""
                })   
            } else {
                res.status(400).send({
                    success: false,
                    message: "No contact info provided."
                })   
            }
        }
    });
}

var updateCompanyContact = function(res, owner, item){
    console.log("Contact ", item);
    Company.findOne({
        _id: owner
    }, function(err, doc) {
        if(err)
            res.status(500).send({
                success: false,
                message: "Something went wrong while retrieving. try again."
            })
        else if(!doc)
            res.status(200).send({
                success: false,
                message: "File not exist."
            })
        else {
            var newContact = new Company().contact;
            if(item) { 
                objectAssign(newContact, item);
                doc.contact = newContact;
                doc.save();
                res.status(200).send({
                    success: true,
                    message: ""
                })   
            } else {
                res.status(400).send({
                    success: false,
                    message: "No contact info provided."
                })   
            }
        }
    })
};

var updateCompanyCoor = function(res, owner, item){
    console.log("Contact ", item);
    Company.findOne({
        _id: owner
    }, function(err, doc) {
        if(err)
            res.status(500).send({
                success: false,
                message: "Something went wrong while retrieving. try again."
            })
        else if(!doc)
            res.status(200).send({
                success: false,
                message: "File not exist."
            })
        else {
            var newCoor = new Company().coordinator;
            if(item) { 
                objectAssign(newCoor, item);
                doc.coordinator = newCoor;
                doc.save();
                res.status(200).send({
                    success: true,
                    message: ""
                })   
            } else {
                res.status(400).send({
                    success: false,
                    message: "No contact info provided."
                })   
            }
        }
    })
};

// Remove
var delCompany = function(res, item) {
    Company.findOne({_id: item}, function (err, doc){
        if(err)
            res.status(500).send({
                success: false,
                message: "Something went wrong while retrieving. try again."
            })
        if(!doc)
            res.status(200).send({
                success: false,
                message: "File not exist."
            })
        else {

            var remainFiles = [];
            while(doc.picture.length>0){
                var nextFile = doc.picture.pop().file_path;
                console.log(nextFile);
                remainFiles.push(nextFile.replace('./','./public/'));
            }

            console.log("sending : ", remainFiles);
            deleteFiles(remainFiles, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('all files removed');
                }
            });

            Company.findOneAndRemove({"_id": item}, function(err, doc){
                if(err)
                    res.status(200).send({
                        success: false,
                        message: "Something went wrong while removing. try again.",
                        err :err
                    });
                else
                    res.status(200).send({
                        success: true,
                        message: "Company removed."
                    });
            });
        }
    })     
};

var addCompanyPicture = function(res, file, item, owner){

    var tmp_path = file.path;
    var new_file_name = file.filename + getFileExtension(file.originalname);
    var target_path = company_picture_dir + new_file_name;
    console.log("file name: " + new_file_name);
    item.file_path = '.' + target_path;
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream( './public' + target_path);
    src.pipe(dest);
    src.on('end', function() {
        fs.unlinkSync(tmp_path);
        console.log("Picture uploaded");
        Company.findOneAndUpdate({_id: owner}, {$addToSet:{picture : item}}, function (err) {
            res.status(200).send({
                success: true,
                message: "Picture uploaded."
            })
        })
    });
    src.on('error', function(err) {
        fs.unlinkSync(tmp_path);
        res.status(500).send({
            success: false,
            err: err,
            message: "Something went wrong while retrieving. try again"
        })
    });
}

var delCompanyPicture = function (res, owner, item) {
    Company.findOne({"_id": owner , "picture._id":item}, {_id:0,"picture.$":1}, function (err, doc){
        if(err)
            res.status(500).send({
                success: false,
                message: "Something went wrong while retrieving. try again."
            })
        if(!doc)
            res.status(200).send({
                success: false,
                message: "File not exist."
            })
        else {
            var picture_path = doc.picture[0].file_path.replace('./','./public/') || "";
            fs.stat(picture_path, function(err, stats) {
                if(typeof stats != 'undefined'){
                    if(stats.isFile())
                        fs.unlinkSync(picture_path),function (err) {
                            if (err) throw err;
                        }
                    console.log("Deleted - " + picture_path);
                } else {
                    console.log("File not exist - "+ picture_path);
                }
            });
            Company.findOneAndUpdate({"_id": owner, "picture._id":item},{$pull:{"picture":{"_id":item}}}, function(err, doc){
                console.log(doc);
                if(err)
                    res.status(200).send({
                        success: false,
                        message: "Something went wrong while removing. try again.",
                        err :err
                    });
                else
                    res.status(200).send({
                        success: true,
                        message: "Picture removed."
                    });
            });
        }
    }) 
}

module.exports = {
	'getCompany': getCompany,
    'findCompanyById': findCompanyById,
	'createCompany': createCompany,
    'addCompanyPicture': addCompanyPicture,
	'updateCompany': updateCompany,
	'updateCompanyContact': updateCompanyContact,
    'updateCompanyCoor': updateCompanyCoor,
	'delCompany': delCompany,
    'delCompanyPicture':delCompanyPicture,
    'getPartCompany': getPartCompany,
    'getCompanyByArea': getCompanyByArea

};
