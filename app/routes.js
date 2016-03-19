var fs = require("fs");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var multer = require('multer');
var upload = multer({
    dest: './public/uploads/'
});
var jwt = require('jsonwebtoken');
var allow;



var DocumentController = require('./controllers/documentController');
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
    app.post('/login/student', function(req, res) {
        console.log("Student login");
        StudentController.studentLogin(res, req.body, app.get('secretToken'), app.get('expireTime'));
    });

    app.post('/login/teacher', function(req, res) {
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
    
    app.get('/typehead/title_name', function(req, res) {
        OtherController.titleNameTypeAhead(res);
    });

    app.get('/typehead/academic_position', function(req, res) {
        OtherController.acadePosTypeAhead(res);
    });

    app.get('/typehead/adviser', function(req, res) {
        TeacherController.TeacherTypeAhead(res);
    });

    app.post('/register',function(req, res){
        StudentController.studentRegistration(res, req.body);
    });

    app.get('/teacher', function(req, res) {
        TeacherController.getTeacher(res);
    });

    app.get('/teacher/:id', function(req, res) {
        TeacherController.findTeacherById(res, req.params.id);
    });

    app.get('/company', function(req, res) {
        console.log("Get all company");
        CompanyController.getCompany(res);
    });

    app.get('/company/participating', function(req, res) {
        console.log("Get participating company");
        CompanyController.getPartCompany(res);
    });

    app.get('/company/area/:area', function(req, res) {
        console.log("Get company by area with " + req.params.area);
        CompanyController.getCompanyByArea(res, req.params.area);
    });

    app.get('/company/:id', function(req, res) {
        console.log("Get company with " + req.params.id);
        CompanyController.findCompanyById(res, req.params.id);
    });

    app.get('/announce', function(req, res) {
        console.log("Get all announce");
        AnnounceController.getAnnounce(res);
    });

    app.get('/announce/:item', function(req, res) {
        console.log("Get announce with " + req.params.item);
        AnnounceController.findAnnounceById(res, req.params.item);
    });

    app.get('/dlc', function(req, res) {
        console.log("Get all DLC");
        DlcController.getDlc(res);
    });

    app.get('/dlc/:id', function(req, res) {
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
                message: 'No token provided.'
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
        if(checkPermission(allow,req.decoded.access_type)){
            next();
        } else  res.status(403).send({success:false,message:"Unauthurized"});
    });

    app.put('/change_password', function(req, res) {
        if(req.decoded.access_type == allow[0]){ 
            console.log(allow, req.decoded.access_type);
            TeacherController.pwChangeTeacher(res, req.body);
        } else if (req.decoded.access_type==allow[1]) {
            StudentController.pwChangeStudent(res, req.body);
        } else {
            res.status(403).send({
                success: false,
                message: "only " + allow + " allow in this section."
            });
        }
    })

    // View Self profile
    app.get('/myprofile', function(req, res) {
        var allow = ["teacher","student"];
        var item = req.decoded.access_id;
        if(req.decoded.access_type == allow[0]){ 
            TeacherController.findTeacherById(res, item);
        } else if (req.decoded.access_type==allow[1]) {
            StudentController.findStudentById(res, item);
        } else {
            res.status(403).send({
                success: false,
                message: "only " + allow + " allow in this section."
            });
        }
    });


    // Edit Self profile
    app.put('/myprofile', function(req, res) {
        var allow = ["teacher","student"];
        var item = req.decoded.access_id;
        if(req.decoded.access_type == allow[0]){ 
            TeacherController.updateTeacher(res, item);
        } else if (req.decoded.access_type==allow[1]) {
            StudentController.updateStudent(res, item);
        } else {
            res.status(403).send({
                success: false,
                message: "only " + allow + " allow in this section."
            });
        }
    });

    // Del Self profile
    app.delete('/myprofile', function(req, res) {
        var allow = ["teacher","student"];
        var item = req.decoded.access_id;
        if(req.decoded.access_type == allow[0]){ 
            TeacherController.delTeacher(res, item);
        } else if (req.decoded.access_type==allow[1]) {
            StudentController.delStudent(res, item);
        } else {
            res.status(403).send({
                success: false,
                message: "only " + allow + " allow in this section."
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
    app.get('/myadviser', function (req, res) {
        StudentController.getMyAdviser(res, req.decoded.access_id);
    });

    // Get the token owner's job
    app.get('/myjob', function (req, res) {
        StudentController.getStudents(res, {_id: req.decoded.access_id}, { job:1 });
    });

    // Get the token owner's status
    app.get('/mystatus', function (req, res) {
        StudentController.getStudents(res, {_id: req.decoded.access_id}, {status:1});
    });

    // Get the token owner's apply status
    app.get('/mystatus/apply', function (req, res) {
        ApplicationController.getStudentApplyStatus(res, req.decoded.access_id);
    });

    // Get the token owner's accept status
    app.get('/mystatus/accept', function (req, res) {
        ApplicationController.getStudentAcceptStatus(res, req.decoded.access_id);
    });

    // Get the token owner's attachments
    app.get('/myattach', function (req, res) {
        StudentController.getStudentAttachments(res, {_id: req.decoded.access_id});
    });

    // Get the token owner's a specific attachment
    app.get('/myattach/:id', function (req, res) {
        StudentController.findAttachmentById(res, req.params.id);
    });

    // Creat the token owner's a attachment
    app.post('/myattach', upload.single('file'), function (req, res) {
        console.log("create my attach");
        StudentController.createAttachment(res, req.file, req.body, req.decoded.access_id);
    });

    // Edit the token owner's attachment
    app.put('/myattach', function (req, res) {
        res.status(200).send({success:true});
    });

    // Delete the token owner's a specific attachment
    app.delete('/myattach/:id', function (req, res) {
        StudentController.delAttachment(res, req.params.id, req.decoded.access_id);
    });

    // Set the token owner's company preferrence
    app.put('/myprefer', function (req, res) {
        res.status(200).send({success:true});
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
        } else  res.status(403).send({success:false,message:"Unauthurized"});
    });

    // ================================= Self ========================================
     
    



    // ============================ Student ==========================================
    
    
    // get all students
    app.get('/student', function(req, res) {
        if(checkPermission(allow, req.decoded.access_type)) {
            StudentController.getStudents(res);
        } else {
            res.status(403).send({
                success: false,
                message: "only Teachers allow in this section."
            });
        }
    });

    // Get student in specific academic year
    app.get('/student/academic_year/:acaYr', function(req, res) {
        var allow = ["teacher"];
        if(checkPermission(allow, req.decoded.access_type)) {
            StudentController.getStudentByAcaYr(res, req.params.acaYr);
        } else {
            res.status(403).send({
                success: false,
                message: "only Teachers allow in this section."
            });
        }
    });

    // Find Student with ID
    app.get('/student/:id', function(req, res) {
        StudentController.findStudentById(res, req.params.id);
    });

    // create a student
    app.post('/student', function(req, res) {
        console.log("Creating...");
        StudentController.createStudent(res, req.body);
    });

    // 
    app.post('/student/upload_myprofile_picture', upload.single('file'), function(req, res, next) {
        console.log(req.file);
        StudentController.uploadPicture(res, req, next);
    });

    // update a student
    app.put('/student', function(req, res) {
        console.log("Updating...");
        StudentController.updateStudent(res, req.body);
    });

    // delete a student
    app.delete('/student/:student_id', function(req, res) {
        StudentController.delStudent(res, req.params.student_id);
    });

    // Get academic year available
    app.get('/student/acaYrs', function(res, req) {
        StudentController.getAcaYrs(res);
    });

    // Get all attachment of owners who are in specific academic year
    app.get('/attachment/', function(req, res) {
        console.log("get all Attachment");
        StudentController.getAttachments(res);
    });
    // Get all attachment of owners who are in specific academic year
    app.get('/attachment/acaYrs/:acaYrs', function(req, res) {
        console.log("get Docs of " + req.params.acaYrs);
        StudentController.getAttachments(res, req.params.acaYrs);
    });

    // Get all attachments of all students in specific academic year
    app.get('/student/attachment/acaYrs/:acaYrs', function(req, res) {
        console.log("get Docs and Owner of " + req.params.acaYrs);
        StudentController.getAttachmentsWithOwner(res, req.params.acaYrs);
    });

    app.post('/attachment', upload.single('file'), function (req, res) {
        console.log("create an attach");
        StudentController.createAttachment(res, req.file, req.body, req.body.owner);
    });

    app.put('/attachment', function (req, res) {
        console.log("create an attach");
        StudentController.updateAttachment(res, req.body);
    });

    // Delete the token owner's a specific attachment
    app.delete('/attachment/:id', function (req, res) {
        StudentController.delAttachment(res, req.params.id);
    });

    // app.put('/student/unlock_profile', function(req, res) {
    //     StudentController.unLockStuProfile(res, req.body.id);
    // });

    // app.put('/student/lock_profile', function(req, res) {
    //     StudentController.lockStuProfile(res, req.body.id);
    // });


    // ================================= Teacher ==========================================

    app.post('/teacher', function(req, res) {
        console.log("Creating teacher");
        TeacherController.createTeacher(res, req.body);
    });
    // update a teacher
    app.put('/teacher', function(req, res) {
        TeacherController.updateTeacher(res, req.body);
    })
    // delete a teacher
    app.delete('/teacher/:teacher_id', function(req, res) {
        TeacherController.delTeacher(res, req.params.teacher_id);
    });

    //================================== Document ======================================


// ========================= Old document management =================================
    // // get all documents
    // app.get('/document', function(req, res) {
    //     DocumentController.getDocument(res);
    // });

    // // upload document
    // app.post('/document/upload', upload.single('file'), function(req, res, next) {
    //     console.log(req.file);
    //     DocumentController.createDocument(req, res, next);
    // });

    // // update document
    // app.put('/document', function(req, res) {
    //     DocumentController.updateDocument(req.body, res);
    // });

    // // delete a document
    // app.delete('/document/:document_id', function(req, res) {
    //     DocumentController.delDocument(req.params.document_id, res);
    // });
    // 
// ====================================================================================
    
    //================================ Company ====================================
    
    // Create a company
    app.post('/company', function(req, res) {
        var compName = req.body.name.full || "noname";
        console.log("Create " + compName + " company");
        CompanyController.createCompany(res, req.body);
    });

    // Edit a company
    app.put('/company', function(req, res) {
        var compName = req.body.name.full || "noname";
        console.log("Update " + compName + " company");
        CompanyController.updateCompany(res, req.body);
    });

    // Update contact of specific company
    app.put('/company/contact', function(req, res) {
        var comp_id = req.body._id || "noname";
        console.log("Update " + comp_id + " company's contact");
        CompanyController.updateCompanyContact(res, req.body);
    });

    // Delete a company
    app.delete('/company/:company_id', function(req, res) {
        var comp_id = req.params.company_id || "noname";
        console.log("Remove " + comp_id + " company");
        CompanyController.delCompany(res, comp_id);
    });    

    //================================ Application ====================================
    
    // Get all application
    app.get('/application', function(req, res) {
        console.log("Get all applications");
        ApplicationController.getApplication(res);
    });
        // Get all application of specific student
    app.get('/application/student/:student_id', function(req, res) {
        var stu_id = req.params.student_id || "noname";
        console.log("Get application of " + "student " + stu_id);
        ApplicationController.getApplicationByStudent(res, stu_id);
    });
        // Get all application of specific company
    app.get('/application/company/:company_id', function(req, res) {
        var comp_id = req.params.company_id || "noname";
        console.log("Get application of " + comp_id + " company");
        ApplicationController.getApplicationByCompany(res, comp_id);
    });
        // Get all unreply application
    app.get('/application/unreply', function(req, res) {
        console.log("Get all unreply applications");
        ApplicationController.getApplicationUnreply(res);
    });

    // Get a specific application
    app.get('/application/:applica_id', function(req, res) {
        var app_id = req.params.applica_id || "noname";
        console.log("Get " +  app_id + " application");
        ApplicationController.findApplicationById(res, app_id);
    });
    
    // Create an application
    app.post('/application', function(req, res) {
        var title = req.body.student || "noname";
        console.log("Create " + title + " application");
        ApplicationController.createApplication(res, req.body);
    });

    // Edit an application
    app.put('/application', function(req, res) {
        var title = req.body.student || "noname";
        console.log("Update " + title + " application");
        ApplicationController.updateApplication(res, req.body);
    });

    // Delete an application
    app.delete('/application/:application_id', function(req, res) {
        var app_id = req.params.application_id || "noname";
        console.log("Remove " + app_id + " application");
        ApplicationController.delApplication(res, app_id);
    });


    //================================ Announcement ====================================
    
    // Create an announcement
    app.post('/announce', function(req, res) {
        var title = req.body.title || "noname";
        console.log("Create " + title + " news");
        AnnounceController.createAnnounce(res, req.body);
    });

    // Edit an announcement
    app.put('/announce', function(req, res) {
        var title = req.body.title || "noname";
        console.log("Update " + title + " news");
        AnnounceController.updateAnnounce(res, req.body);
    });

    // Delete an announcement
    app.delete('/announce/:announce_id', function(req, res) {
        var anc_id = req.params.announce_id || "noname";
        console.log("Remove " + anc_id + " company");
        AnnounceController.delAnnounce(res, anc_id);
    });


    //================================ DLC ====================================

    // Create a DLC
    app.post('/dlc', upload.single('file'), function(req, res, next) {
        console.log(req.file);
        var title = req.body.title || "noname";
        console.log("Create " + title + " dlc");
        DlcController.createDlc(res, req);
    });

    // Delete a DLC
    app.delete('/dlc/:dlc_id', function(req, res) {
        var dlc_id = req.params.dlc_id || {};
        console.log("Remove " + dlc_id);
        DlcController.delDlc(res, dlc_id);
    });

    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
