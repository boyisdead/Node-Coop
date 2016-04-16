var fs = require("fs");
// var multipart = require('connect-multiparty');
// var multipartMiddleware = multipart();
var multer = require('multer');
var upload = multer({
    dest: './public/uploads/'
});
var jwt = require('jsonwebtoken');
var allow;


var OtherController = require('./controllers/otherController');
var TeacherController = require('./controllers/teacherController');
var StudentController = require('./controllers/studentController');
var CompanyController = require('./controllers/companyController');
var ApplicationController = require('./controllers/applicationController');
var AnnounceController = require('./controllers/announceController');
var DlcController = require('./controllers/dlcController');
    
var checkPermission = function(allow_types,access_type){
    if(allow_types.indexOf(access_type)>=0)
        return true
}

                                //================================ Routes ====================================
                                //       $$$$$$$\   $$$$$$\  $$\   $$\ $$$$$$$$\ $$$$$$$$\  $$$$$$\  
                                //       $$  __$$\ $$  __$$\ $$ |  $$ |\__$$  __|$$  _____|$$  __$$\ 
                                //       $$ |  $$ |$$ /  $$ |$$ |  $$ |   $$ |   $$ |      $$ /  \__|
                                //       $$$$$$$  |$$ |  $$ |$$ |  $$ |   $$ |   $$$$$\    \$$$$$$\  
                                //       $$  __$$< $$ |  $$ |$$ |  $$ |   $$ |   $$  __|    \____$$\ 
                                //       $$ |  $$ |$$ |  $$ |$$ |  $$ |   $$ |   $$ |      $$\   $$ |
                                //       $$ |  $$ | $$$$$$  |\$$$$$$  |   $$ |   $$$$$$$$\ \$$$$$$  |
                                //       \__|  \__| \______/  \______/    \__|   \________| \______/ 
                                //=============================================================================
module.exports = function(app) {

    // authenticate to obtains token
    app.post('/coopsys/v1/login/student', function(req, res) {
        console.log("Student login");
        StudentController.studentLogin(res, req.body, app.get('secretToken'), app.get('expireTime'));
    });

    app.post('/coopsys/v1/login/teacher', function(req, res) {
        console.log("Teacher login");
        TeacherController.teacherLogin(res, req.body, app.get('secretToken'), app.get('expireTime'));
    });


    //================================ Others ====================================
    //  __    __   ______         ________   ______   __    __  ________  __    __ 
    // |  \  |  \ /      \       |        \ /      \ |  \  /  \|        \|  \  |  \
    // | $$\ | $$|  $$$$$$\       \$$$$$$$$|  $$$$$$\| $$ /  $$| $$$$$$$$| $$\ | $$
    // | $$$\| $$| $$  | $$         | $$   | $$  | $$| $$/  $$ | $$__    | $$$\| $$
    // | $$$$\ $$| $$  | $$         | $$   | $$  | $$| $$  $$  | $$  \   | $$$$\ $$
    // | $$\$$ $$| $$  | $$         | $$   | $$  | $$| $$$$$\  | $$$$$   | $$\$$ $$
    // | $$ \$$$$| $$__/ $$         | $$   | $$__/ $$| $$ \$$\ | $$_____ | $$ \$$$$
    // | $$  \$$$ \$$    $$         | $$    \$$    $$| $$  \$$\| $$     \| $$  \$$$
    //  \$$   \$$  \$$$$$$           \$$     \$$$$$$  \$$   \$$ \$$$$$$$$ \$$   \$$
    //=============================================================================
    
    app.get('/coopsys/v1/typehead/title_name', function(req, res) {
        OtherController.titleNameTypeAhead(res);
    });

    app.get('/coopsys/v1/typehead/academic_position', function(req, res) {
        OtherController.acadePosTypeAhead(res);
    });

    app.get('/coopsys/v1/typehead/adviser', function(req, res) {
        TeacherController.TeacherTypeAhead(res);
    });

    app.post('/coopsys/v1/register',function(req, res){
        StudentController.studentRegistration(res, req.body);
    });

    app.get('/coopsys/v1/teacher', function(req, res) {
        var sort = req.query.sort || "_id";
        var limit = req.query.limit || {};
        var skip = req.query.skip || req.query.offset || 0;
        var option = { "sort": sort, "limit": limit, "skip": skip};
        delete req.query.sort;
        delete req.query.limit;
        delete req.query.skip; delete req.query.offset;
        TeacherController.getTeacher(res, req.query || {}, undefined, option);
    });

    app.get('/coopsys/v1/teacher/:id', function(req, res) {
        TeacherController.findTeacherById(res, req.params.id);
    });

    app.get('/coopsys/v1/company', function(req, res) {
        console.log("Get all company");
        var sort = req.query.sort || "_id";
        var limit = req.query.limit || {};
        var skip = req.query.skip || req.query.offset || 0;
        var option = { "sort": sort, "limit": limit, "skip": skip};
        delete req.query.sort;
        delete req.query.limit;
        delete req.query.skip; delete req.query.offset;
        CompanyController.getCompany(res, req.query || {}, undefined, option);
    });

    app.get('/coopsys/v1/company/participating', function(req, res) {
        console.log("Get participating company");
        CompanyController.getPartCompany(res);
    });

    app.get('/coopsys/v1/company/area/:area', function(req, res) {
        console.log("Get company by area with " + req.params.area);
        CompanyController.getCompanyByArea(res, req.params.area);
    });

    app.get('/coopsys/v1/company/:id', function(req, res) {
        console.log("Get company with " + req.params.id);
        CompanyController.findCompanyById(res, req.params.id);
    });

    app.get('/coopsys/v1/announce', function(req, res) {
        console.log("Get all announce");
        var sort = req.query.sort || "_id";
        var limit = req.query.limit || {};
        var skip = req.query.skip || req.query.offset || 0;
        var option = { "sort": sort, "limit": limit, "skip": skip};
        delete req.query.sort;
        delete req.query.limit;
        delete req.query.skip; delete req.query.offset;
        AnnounceController.getAnnounce(res, req.query || {}, undefined, option);
    });

    app.get('/coopsys/v1/announce/:item', function(req, res) {
        console.log("Get announce with " + req.params.item);
        AnnounceController.findAnnounceById(res, req.params.item);
    });

    app.get('/coopsys/v1/dlc', function(req, res) {
        console.log("Get all DLC");        
        var sort = req.query.sort || "_id";
        var limit = req.query.limit || {};
        var skip = req.query.skip || req.query.offset || 0;
        var option = { "sort": sort, "limit": limit, "skip": skip};
        delete req.query.sort;
        delete req.query.limit;
        delete req.query.skip; delete req.query.offset;
        DlcController.getDlc(res, req.query || {}, undefined, option);
    });

    app.get('/coopsys/v1/dlc/:id', function(req, res) {
        console.log("Get DLC by id");
        DlcController.findDlcById(res, req.params.id);
    });

    //===================================================================================
    //suspended due to working
    // verify token for every request
    app.use(function(req, res, next) {
        if(req.headers.cookie)
            var cookieToken = req.headers.cookie.substr(9) || {};
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'] || cookieToken;
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, app.get('secretToken'), function(err, decoded) {
                if (err) {
                    console.log(err);
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.',
                        error: err
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                error: 'No token provided.'
            });

        }
    });

    //========================================================================================
    //  __    __  __    __  ______  __     __  ________  _______    ______    ______   __       
    // |  \  |  \|  \  |  \|      \|  \   |  \|        \|       \  /      \  /      \ |  \      
    // | $$  | $$| $$\ | $$ \$$$$$$| $$   | $$| $$$$$$$$| $$$$$$$\|  $$$$$$\|  $$$$$$\| $$      
    // | $$  | $$| $$$\| $$  | $$  | $$   | $$| $$__    | $$__| $$| $$___\$$| $$__| $$| $$      
    // | $$  | $$| $$$$\ $$  | $$  | $$   | $$| $$  \   | $$    $$ \$$    \ | $$    $$| $$      
    // | $$  | $$| $$\$$ $$  | $$   \$$   / $$| $$$$$   | $$$$$$$\ _\$$$$$$\| $$$$$$$$| $$      
    // | $$__/ $$| $$ \$$$$ _| $$_   \$$ / $$ | $$_____ | $$  | $$|  \__| $$| $$  | $$| $$_____ 
    //  \$$    $$| $$  \$$$|   $$ \   \$$$$$  | $$     \| $$  | $$ \$$    $$| $$  | $$| $$     \
    //   \$$$$$$  \$$   \$$ \$$$$$$    \$$$    \$$$$$$$$ \$$   \$$  \$$$$$$  \$$   \$$ \$$$$$$$$
    //========================================================================================
    app.use(function(req, res, next) {
        allow = ["teacher","student"];
        if(checkPermission(allow, req.decoded.access_type)){
            next();
        } else  res.status(403).send({success:false, error:"Unauthurized"});
    });

    app.put('/coopsys/v1/change_password', function(req, res) {
        if(req.decoded.access_type == allow[0]){ 
            console.log(allow, req.decoded.access_type);
            TeacherController.pwChangeTeacher(res, req.body);
        } else if (req.decoded.access_type==allow[1]) {
            StudentController.pwChangeStudent(res, req.body);
        } else {
            res.status(403).send({
                success: false,
                error: "only " + allow + " allow in this section."
            });
        }
    })

    // View Self profile
    app.get('/coopsys/v1/myprofile', function(req, res) {
        var allow = ["teacher","student"];
        var item = req.decoded.access_id;
        if(req.decoded.access_type == allow[0]){ 
            TeacherController.findTeacherById(res, item);
        } else if (req.decoded.access_type==allow[1]) {
            StudentController.findStudentById(res, item);
        } else {
            res.status(403).send({
                success: false,
                error: "only " + allow + " allow in this section."
            });
        }
    });

    // View Self profile
    app.put('/coopsys/v1/myprofile/picture', upload.single('file'),function(req, res) {
        var allow = ["teacher","student"];
        var item = req.decoded.access_id;
        if(req.file){
            console.log("decoded",req.decoded);
            if(req.decoded.access_type == allow[0]){ 
                TeacherController.uploadPicture(res, item, req.file);
            } else if (req.decoded.access_type==allow[1]) {
                StudentController.uploadPicture(res, item, req.file);
            } else {
                res.status(403).send({
                    success: false,
                    error: "only " + allow + " allow in this section."
                });
            }
        } else {
            res.status(400).send({
                    success: false,
                    error: "File not provided"
                });
        }
    });

    // Edit Self profile
    app.put('/coopsys/v1/myprofile', function(req, res) {
        var allow = ["teacher","student"];
        req.body._id = req.decoded.access_id;
        if(req.decoded.access_type == allow[0]){ 
            TeacherController.updateTeacher(res, req.body);
        } else if (req.decoded.access_type==allow[1]) {
            console.log("student", req.body);
            StudentController.updateStudent(res, req.body);
        } else {
            res.status(403).send({
                success: false,
                error: "only " + allow + " allow in this section."
            });
        }
    });
    app.post('/coopsys/v1/myprofile/picture', upload.single('file'), function(req, res) {
        var allow = ["teacher","student"];
        var id = req.decoded.access_id;
        if(req.decoded.access_type == allow[0]){ 
            TeacherController.uploadPicture(res, id, req.file);
        } else if (req.decoded.access_type==allow[1]) {
            StudentController.uploadPicture(res, id, req.file);
        } else {
            res.status(403).send({
                success: false,
                error: "only " + allow + " allow in this section."
            });
        }
    });

    // Del Self profile
    app.delete('/coopsys/v1/myprofile', function(req, res) {
        var allow = ["teacher","student"];
        var item = req.decoded.access_id;
        if(req.decoded.access_type == allow[0]){ 
            TeacherController.delTeacher(res, item);
        } else if (req.decoded.access_type==allow[1]) {
            StudentController.delStudent(res, item);
        } else {
            res.status(403).send({
                success: false,
                error: "only " + allow + " allow in this section."
            });
        }
    });

    //=================================================================================
    //  $$$$$$\ $$$$$$$$\ $$\   $$\ $$$$$$$\  $$$$$$$$\ $$\   $$\ $$$$$$$$\ 
    // $$  __$$\\__$$  __|$$ |  $$ |$$  __$$\ $$  _____|$$$\  $$ |\__$$  __|
    // $$ /  \__|  $$ |   $$ |  $$ |$$ |  $$ |$$ |      $$$$\ $$ |   $$ |   
    // \$$$$$$\    $$ |   $$ |  $$ |$$ |  $$ |$$$$$\    $$ $$\$$ |   $$ |   
    //  \____$$\   $$ |   $$ |  $$ |$$ |  $$ |$$  __|   $$ \$$$$ |   $$ |   
    // $$\   $$ |  $$ |   $$ |  $$ |$$ |  $$ |$$ |      $$ |\$$$ |   $$ |   
    // \$$$$$$  |  $$ |   \$$$$$$  |$$$$$$$  |$$$$$$$$\ $$ | \$$ |   $$ |   
    //  \______/   \__|    \______/ \_______/ \________|\__|  \__|   \__|  
    //=================================================================================

    // Get the token owner's adviser
    app.get('/coopsys/v1/myadviser', function (req, res) {
        StudentController.getMyAdviser(res, req.decoded.access_id);
    });

    // Get the token owner's job
    app.get('/coopsys/v1/myjob', function (req, res) {
        StudentController.getStudents(res, {_id: req.decoded.access_id}, { job:1 });
    });

    // Get the token owner's status
    app.get('/coopsys/v1/mystatus', function (req, res) {
        StudentController.getStudents(res, {_id: req.decoded.access_id}, {status:1});
    });

    // Get the token owner's apply status
    app.get('/coopsys/v1/mystatus/apply', function (req, res) {
        ApplicationController.getStudentApplyStatus(res, req.decoded.access_id);
    });

    // Get the token owner's accept status
    app.get('/coopsys/v1/mystatus/accept', function (req, res) {
        ApplicationController.getStudentAcceptStatus(res, req.decoded.access_id);
    });

    // Get the token owner's attachments
    app.get('/coopsys/v1/myattach', function (req, res) {
        StudentController.getStudentAttachments(res, {_id: req.decoded.access_id});
    });

    // Get the token owner's a specific attachment
    app.get('/coopsys/v1/myattach/:id', function (req, res) {
        StudentController.findAttachmentById(res, req.params.id);
    });

    // app.put('/coopsys/v1/myprofile', function (req, res){
    //     StudentController.updateStudent(res, req.body);
    // })
    // Creat the token owner's a attachment
    app.post('/coopsys/v1/myattach', upload.single('file'), function (req, res) {
        console.log("create my attach");
        StudentController.createAttachment(res, req.file, req.body, req.decoded.access_id);
    });

    // Edit the token owner's attachment
    app.put('/coopsys/v1/myattach', function (req, res) {
        StudentController.uploadAttachment(res, req.body);
    });

    // Delete the token owner's a specific attachment
    app.delete('/coopsys/v1/myattach/:id', function (req, res) {
        StudentController.delAttachment(res, req.params.id, req.decoded.access_id);
    });

    app.get('/coopsys/v1/myprefer', function (req, res) {
        StudentController.getStudents(res, {_id: req.decoded.access_id}, { prefered_company:1 });
    });

    // Set the token owner's company preferrence
    app.put('/coopsys/v1/myprefer', function (req, res) {
        StudentController.changePreferedCompany(res, req.decoded.access_id, req.body);
    });

    //================================================================================
    // $$$$$$$$\ $$$$$$$$\  $$$$$$\   $$$$$$\  $$\   $$\ $$$$$$$$\ $$$$$$$\  
    // \__$$  __|$$  _____|$$  __$$\ $$  __$$\ $$ |  $$ |$$  _____|$$  __$$\ 
    //    $$ |   $$ |      $$ /  $$ |$$ /  \__|$$ |  $$ |$$ |      $$ |  $$ |
    //    $$ |   $$$$$\    $$$$$$$$ |$$ |      $$$$$$$$ |$$$$$\    $$$$$$$  |
    //    $$ |   $$  __|   $$  __$$ |$$ |      $$  __$$ |$$  __|   $$  __$$< 
    //    $$ |   $$ |      $$ |  $$ |$$ |  $$\ $$ |  $$ |$$ |      $$ |  $$ |
    //    $$ |   $$$$$$$$\ $$ |  $$ |\$$$$$$  |$$ |  $$ |$$$$$$$$\ $$ |  $$ |
    //    \__|   \________|\__|  \__| \______/ \__|  \__|\________|\__|  \__|
    //================================================================================

    app.use(function(req, res, next) {
        allow = "teacher";
        if(checkPermission(allow,req.decoded.access_type)){
            next();
        } else  res.status(403).send({success:false, error:"Unauthurized"});
    });

    // ================================= Self ========================================
     
    



    // ============================ Student ==========================================
    
    
    // get all students
    app.get('/coopsys/v1/student', function(req, res) {
        if(checkPermission(allow, req.decoded.access_type)) {
            var sort = req.query.sort || "_id";
            var limit = req.query.limit || {};
            var skip = req.query.skip || req.query.offset || 0;
            var option = { "sort": sort, "limit": limit, "skip": skip};
            delete req.query.sort;
            delete req.query.limit;
            delete req.query.skip; delete req.query.offset;
            console.log(req.query, option);
            StudentController.getStudents(res, req.query || {}, undefined, option);
        } else {
            res.status(403).send({
                success: false,
                error: "only Teachers allow in this section."
            });
        }
    });

    // Get student in specific academic year
    app.get('/coopsys/v1/student/academic_year/:acaYr', function(req, res) {
        var allow = ["teacher"];
        if(checkPermission(allow, req.decoded.access_type)) {
            StudentController.getStudentByAcaYr(res, req.params.acaYr);
        } else {
            res.status(403).send({
                success: false,
                error: "only Teachers allow in this section."
            });
        }
    });

    // Find Student with ID
    app.get('/coopsys/v1/student/:id', function(req, res) {
        StudentController.findStudentById(res, req.params.id);
    });

    // create a student
    app.post('/coopsys/v1/student', function(req, res) {
        console.log("Creating...");
        StudentController.createStudent(res, req.body);
    });

    // 
    app.post('/coopsys/v1/student/:student_id/upload_profile_picture', upload.single('file'), function(req, res, next) {
        console.log(req.file);
        StudentController.uploadPicture(res, req.params.student_id, req.file);
    });

    // update a student
    app.put('/coopsys/v1/student', function(req, res) {
        console.log("Updating...");
        StudentController.updateStudent(res, req.body);
    });

    // delete a student
    app.delete('/coopsys/v1/student/:student_id', function(req, res) {
        StudentController.delStudent(res, req.params.student_id);
    });

    // Get academic year available
    app.get('/coopsys/v1/typehead/academic-years', function(req, res) {
        StudentController.getAcaYrs(res);
    });

    // Get all attachment of owners who are in specific academic year
    app.get('/coopsys/v1/attachment/', function(req, res) {
        console.log("get all Attachment");
        var sort = req.query.sort;
        var limit = req.query.limit;
        var skip = req.query.skip || req.query.offset || 0;
        var option = { "sort": sort, "skip": skip};
        if (typeof limit != "undefined")
            option.limit = limit;
        delete req.query.sort;
        delete req.query.limit;
        delete req.query.skip; delete req.query.offset;
        console.log(req.query, option);
        StudentController.getAttachments(res, req.query || {}, undefined, option);
    });
    // Get all attachment of owners who are in specific academic year
    app.get('/coopsys/v1/attachment/acaYrs/:acaYrs', function(req, res) {
        console.log("get Docs of " + req.params.acaYrs);
        StudentController.getAttachments(res, {academic_year : req.params.acaYrs});
    });

    // Get all attachments of all students in specific academic year
    app.get('/coopsys/v1/student/attachment/acaYrs/:acaYrs', function(req, res) {
        console.log("get Docs and Owner of " + req.params.acaYrs);
        StudentController.getAttachmentsWithOwner(res, req.params.acaYrs);
    });

    app.get('/coopsys/v1/student/:owner/attachment', function(req, res) {
        StudentController.getStudentAttachments(res, req.params.owner);
    });

    app.get('/coopsys/v1/attachment/:id', function(req, res) {
        StudentController.findAttachmentById(res, req.params.id);
    });

    app.post('/coopsys/v1/attachment/:owner', upload.single('file'), function (req, res) {
        console.log("create an attach");
        StudentController.createAttachment(res, req.file, req.body, req.params.owner ||req.body.owner);
    });

    app.put('/coopsys/v1/attachment/', function (req, res) {
        console.log("update an attach");
        StudentController.updateAttachment(res, req.body);
    });

    app.put('/coopsys/v1/attachment/:attach_id/approve', function (req, res) {
        console.log("approve an attach");
        StudentController.apprroveAttachment(res, req.params.attach_id);
    });

    app.put('/coopsys/v1/attachment/:attach_id/decline', function (req, res) {
        console.log("approve an attach");
        StudentController.declineAttachment(res, req.params.attach_id);
    });

    // Delete the token owner's a specific attachment
    app.delete('/coopsys/v1/attachment/:attach_id', function (req, res) {
        StudentController.delAttachment(res, req.params.id);
    });

    // app.put('/coopsys/v1/student/unlock_profile', function(req, res) {
    //     StudentController.unLockStuProfile(res, req.body.id);
    // });

    // app.put('/coopsys/v1/student/lock_profile', function(req, res) {
    //     StudentController.lockStuProfile(res, req.body.id);
    // });


    // ================================= Teacher ==========================================

    app.post('/coopsys/v1/teacher', function(req, res) {
        console.log("Creating teacher");
        TeacherController.createTeacher(res, req.body);
    });
    // update a teacher
    app.put('/coopsys/v1/teacher', function(req, res) {
        TeacherController.updateTeacher(res, req.body);
    })
    // delete a teacher
    app.delete('/coopsys/v1/teacher/:teacher_id', function(req, res) {
        TeacherController.delTeacher(res, req.params.teacher_id);
    });

    //================================== Document ======================================


// ========================= Old document management =================================
    // // get all documents
    // app.get('/coopsys/v1/document', function(req, res) {
    //     DocumentController.getDocument(res);
    // });

    // // upload document
    // app.post('/coopsys/v1/document/upload', upload.single('file'), function(req, res, next) {
    //     console.log(req.file);
    //     DocumentController.createDocument(req, res, next);
    // });

    // // update document
    // app.put('/coopsys/v1/document', function(req, res) {
    //     DocumentController.updateDocument(req.body, res);
    // });

    // // delete a document
    // app.delete('/coopsys/v1/document/:document_id', function(req, res) {
    //     DocumentController.delDocument(req.params.document_id, res);
    // });
    // 
// ====================================================================================
    
    //================================ Company ====================================
    
    // Create a company
    app.post('/coopsys/v1/company', function(req, res) {
        var compName = req.body.name.full || "noname";
        console.log("Create " + compName + " company");
        CompanyController.createCompany(res, req.body);
    });

    // Edit a company
    app.put('/coopsys/v1/company', function(req, res) {
        CompanyController.updateCompany(res, req.body);
    });

    // Delete a company
    app.delete('/coopsys/v1/company/:company_id', function(req, res) {
        var comp_id = req.params.company_id || "noname";
        console.log("Remove " + comp_id + " company");
        CompanyController.delCompany(res, comp_id);
    });  

    app.post('/coopsys/v1/company/picture/:id', upload.single('file'), function(req, res) {
        CompanyController.addCompanyPicture(res, req.file, req.body, req.params.id);
    });

    // Delete a single picture in specific company
    app.delete('/coopsys/v1/company/:company_id/picture/:picture_id', function(req, res) {
        var comp_id = req.params.company_id;
        var picture_id = req.params.picture_id;
        CompanyController.delCompanyPicture(res, comp_id, picture_id);
    });   

    // Update a contact of specific company
    app.put('/coopsys/v1/company/:company_id/contact/', function(req, res) {
        var comp_id = req.params.company_id;
        CompanyController.updateCompanyContact(res, comp_id, req.body);
    });

    // Update a contact of specific company
    app.delete('/coopsys/v1/company/:company_id/contact/', function(req, res) {
        var comp_id = req.params.company_id;
        CompanyController.updateCompanyContact(res, comp_id, {});
    });   

    // Update a contact of specific company
    app.put('/coopsys/v1/company/:company_id/coordinator/', function(req, res) {
        var comp_id = req.params.company_id;
        CompanyController.updateCompanyCoor(res, comp_id, req.body);
    });

    // Update a contact of specific company
    app.delete('/coopsys/v1/company/:company_id/coordinator/', function(req, res) {
        var comp_id = req.params.company_id;
        CompanyController.updateCompanyCoor(res, comp_id, {});
    });  

    //================================ Application ====================================
    
    // Get all application
    app.get('/coopsys/v1/application', function(req, res) {
        console.log("Get all applications");  
        var sort = req.query.sort || "_id";
        var limit = req.query.limit || {};
        var skip = req.query.skip || req.query.offset || 0;
        var option = { "sort": sort, "limit": limit, "skip": skip};
        delete req.query.sort;
        delete req.query.limit;
        delete req.query.skip; delete req.query.offset;
        ApplicationController.getApplication(res, req.query || {}, undefined, option);
    });
        // Get all application of specific student
    app.get('/coopsys/v1/application/student/:student_id', function(req, res) {
        var stu_id = req.params.student_id || "noname";
        console.log("Get application of " + "student " + stu_id);
        ApplicationController.getApplicationByStudent(res, stu_id);
    });
        // Get all application of specific company
    app.get('/coopsys/v1/application/company/:company_id', function(req, res) {
        var comp_id = req.params.company_id || "noname";
        console.log("Get application of " + comp_id + " company");
        ApplicationController.getApplicationByCompany(res, comp_id);
    });
        // Get all unreply application
    app.get('/coopsys/v1/application/unreply', function(req, res) {
        console.log("Get all unreply applications");
        ApplicationController.getApplicationUnreply(res);
    });

    // Get a specific application
    app.get('/coopsys/v1/application/:applica_id', function(req, res) {
        var app_id = req.params.applica_id || "noname";
        console.log("Get " +  app_id + " application");
        ApplicationController.findApplicationById(res, app_id);
    });
    
    // Create an application
    app.post('/coopsys/v1/application', function(req, res) {
        var title = req.body.student || "noname";
        console.log("Create " + title + " application");
        ApplicationController.createApplication(res, req.body);
    });

    // Edit an application
    app.put('/coopsys/v1/application', function(req, res) {
        var title = req.body.student || "noname";
        console.log("Update " + title + " application");
        ApplicationController.updateApplication(res, req.body);
    });

    // Delete an application
    app.delete('/coopsys/v1/application/:application_id', function(req, res) {
        var app_id = req.params.application_id || "noname";
        console.log("Remove " + app_id + " application");
        ApplicationController.delApplication(res, app_id);
    });


    //================================ Announcement ====================================
    
    // Create an announcement
    app.post('/coopsys/v1/announce', function(req, res) {
        var title = req.body.title || "noname";
        console.log("Create " + title + " news");
        AnnounceController.createAnnounce(res, req.body);
    });

    // Edit an announcement
    app.put('/coopsys/v1/announce', function(req, res) {
        var title = req.body.title || "noname";
        console.log("Update " + title + " news");
        AnnounceController.updateAnnounce(res, req.body, req.decoded.display_name);
    });

    // Delete an announcement
    app.delete('/coopsys/v1/announce/:announce_id', function(req, res) {
        var anc_id = req.params.announce_id || "noname";
        console.log("Remove " + anc_id + " company");
        AnnounceController.delAnnounce(res, anc_id);
    });


    //================================ DLC ====================================

    // Create a DLC
    app.post('/coopsys/v1/dlc', upload.single('file'), function(req, res, next) {
        console.log(req.file);
        var title = req.body.title || "noname";
        console.log("Create " + title + " dlc");
        DlcController.createDlc(res, req);
    });

    // Delete a DLC
    app.delete('/coopsys/v1/dlc/:dlc_id', function(req, res) {
        var dlc_id = req.params.dlc_id || {};
        console.log("Remove " + dlc_id);
        DlcController.delDlc(res, dlc_id);
    });

    // application -------------------------------------------------------------
    app.get('/v1/coopsys*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
