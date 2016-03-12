var fs = require("fs");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var multer = require('multer');
var upload = multer({
    dest: './public/uploads/'
});
var jwt = require('jsonwebtoken');



var DocumentController = require('./controllers/documentController');
var OtherController = require('./controllers/otherController');
var TeacherController = require('./controllers/teacherController');
var StudentController = require('./controllers/studentController');
var CompanyController = require('./controllers/companyController');
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
    app.post('/api/auth/student', function(req, res) {
        console.log("Student login");
        StudentController.studentLogin(req.body, app.get('secretToken'), app.get('expireTime'), res);
    });

    app.post('/api/auth/teacher', function(req, res) {
        console.log("Teacher login");
        TeacherController.teacherLogin(req.body, app.get('secretToken'), app.get('expireTime'), res);
    });


    //================================ Others ====================================
    //      $$$$$$\ $$$$$$$$\ $$\   $$\ $$$$$$$$\ $$$$$$$\  
    //     $$  __$$\\__$$  __|$$ |  $$ |$$  _____|$$  __$$\ 
    //     $$ /  $$ |  $$ |   $$ |  $$ |$$ |      $$ |  $$ |
    //     $$ |  $$ |  $$ |   $$$$$$$$ |$$$$$\    $$$$$$$  |
    //     $$ |  $$ |  $$ |   $$  __$$ |$$  __|   $$  __$$< 
    //     $$ |  $$ |  $$ |   $$ |  $$ |$$ |      $$ |  $$ |
    //      $$$$$$  |  $$ |   $$ |  $$ |$$$$$$$$\ $$ |  $$ |
    //      \______/   \__|   \__|  \__|\________|\__|  \__|
    //============================================================================
    
    app.get('/typehead/title_name', function(req, res) {
        OtherController.titleNameTypeAhead(res);
    });

    app.get('/typehead/acade_pos', function(req, res) {
        OtherController.acadePosTypeAhead(res);
    });

    app.get('/typehead/advisor', function(req, res) {
        TeacherController.TeacherTypeAhead(res);
    });

    app.post('/register',function(req, res){
        StudentController.studentRegistration(req.body, res);
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

    app.get('/company/:item', function(req, res) {
        console.log("Get company with " + req.params.item);
        CompanyController.findCompanyById(res, req.params.item);
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

    //===================================================================================
    //suspended due to working
    // verify token for every request
    app.use(function(req, res, next) {
        if(req.headers.cookie)
            var cookieToken = req.headers.cookie.substr(9);
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
    // get all students
    app.get('/admin/student', function(req, res) {
        var allow = ["teacher"];
        if(checkPermission(allow, req.decoded.access_type)) {
            StudentController.getStudents(res);
        } else {
            res.status(403).send({
                success: false,
                message: "only Teachers allow in this section."
            });
        }
    });

    app.get('/admin/student/academic_year/:acaYr', function(req, res) {
        console.log("get by acayrs");
        if(req.decoded.access_type=="teacher"){ 
            StudentController.getStudentsByAcaYr(res, req.params.acaYr);
        } else {
            res.status(403).send({
                success: false,
                message: "only Teachers allow in this section."
            });
        }
    });

    app.post('/admin/student/id/:id', function(req, res) {
        StudentController.findStudentById(req.params.id, res);
    });

    app.post('/admin/student/code/:scode', function(req, res) {
        StudentController.findStudentByCode(req.params.scode, res);
    });

    // create student and send back all students after creation
    app.post('/admin/student', function(req, res) {
        console.log("Creating...");
        StudentController.createStudent(req.body, res);
    });

    app.post('/admin/student/uploadPicture', upload.single('file'), function(req, res, next) {
        console.log(req.file);
        StudentController.uploadPicture(req, res, next);
    });

    // update a student
    app.put('/admin/student', function(req, res) {
        console.log("Updating...");
        StudentController.updateStudent(req.body, res);
    });

    app.put('/admin/student/unlock_profile', function(req, res) {
        StudentController.unLockStuProfile(req.body.id, res);
    });

    app.put('/admin/student/lock_profile', function(req, res) {
        StudentController.lockStuProfile(req.body.id, res);
    });

    app.put('/admin/student/pw_change', function(req, res) {
        StudentController.pwChangeStudent(req.body, res);
    })

    // delete a student
    app.delete('/admin/student/:student_id', function(req, res) {
        StudentController.delStudent(req.params.student_id, res);
    });

    app.get('/admin/student/acaYrs', function(req, res) {
        StudentController.getAcaYrs(res);
    });
    app.get('/admin/document/acaYrs/:acaYrs', function(req, res) {
        console.log("get Docs of " + req.params.acaYrs);
        StudentController.getDocuments(req.params.acaYrs, res);
    });
    app.get('/admin/student/document/acaYrs/:acaYrs', function(req, res) {
        console.log("get Docs and Owner of " + req.params.acaYrs);
        StudentController.getDocumentsWithOwner(req.params.acaYrs, res);
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

    app.get('/admin/teacher', function(req, res) {
        TeacherController.getTeacher(res);
    });

    app.get('/admin/teacher/id/:id', function(req, res) {
        TeacherController.findTeacherById(req.params.id, res);
    });

    app.get('/admin/teacher/code/:code', function(req, res) {
        TeacherController.findTeacherByCode(req.params.code, res);
    });

    app.post('/admin/teacher', function(req, res) {
        TeacherController.createTeacher(req.body, res);
    });
    // update a teacher
    app.put('/admin/teacher', function(req, res) {
        TeacherController.updateTeacher(req.body, res);
    })

    app.put('/admin/teacher/pw_change', function(req, res) {
        console.log("pw chng");
        TeacherController.pwChangeTeacher(req.body, res);
    })

    // delete a teacher
    app.delete('/admin/teacher/:teacher_id', function(req, res) {
        TeacherController.delTeacher(req.params.teacher_id, res);
    });

    //============================== Document function API ===============================
    // $$$$$$$\   $$$$$$\   $$$$$$\  $$\   $$\ $$\      $$\ $$$$$$$$\ $$\   $$\ $$$$$$$$\ 
    // $$  __$$\ $$  __$$\ $$  __$$\ $$ |  $$ |$$$\    $$$ |$$  _____|$$$\  $$ |\__$$  __|
    // $$ |  $$ |$$ /  $$ |$$ /  \__|$$ |  $$ |$$$$\  $$$$ |$$ |      $$$$\ $$ |   $$ |   
    // $$ |  $$ |$$ |  $$ |$$ |      $$ |  $$ |$$\$$\$$ $$ |$$$$$\    $$ $$\$$ |   $$ |   
    // $$ |  $$ |$$ |  $$ |$$ |      $$ |  $$ |$$ \$$$  $$ |$$  __|   $$ \$$$$ |   $$ |   
    // $$ |  $$ |$$ |  $$ |$$ |  $$\ $$ |  $$ |$$ |\$  /$$ |$$ |      $$ |\$$$ |   $$ |   
    // $$$$$$$  | $$$$$$  |\$$$$$$  |\$$$$$$  |$$ | \_/ $$ |$$$$$$$$\ $$ | \$$ |   $$ |   
    // \_______/  \______/  \______/  \______/ \__|     \__|\________|\__|  \__|   \__| 
    //====================================================================================

    // get all documents
    app.get('/admin/document', function(req, res) {
        DocumentController.getDocument(res);
    });


    // upload document
    app.post('/admin/document/upload', upload.single('file'), function(req, res, next) {
        console.log(req.file);
        DocumentController.createDocument(req, res, next);
    });

    // update document
    app.put('/admin/document', function(req, res) {
        DocumentController.updateDocument(req.body, res);
    });

    // delete a document
    app.delete('/admin/document/:document_id', function(req, res) {
        DocumentController.delDocument(req.params.document_id, res);
    });
    
    //================================ Company ====================================
    //   ______    ______   __       __  _______    ______   __    __  __      __ 
    //  /      \  /      \ |  \     /  \|       \  /      \ |  \  |  \|  \    /  \
    //  |  $$$$$$\|  $$$$$$\| $$\   /  $$| $$$$$$$\|  $$$$$$\| $$\ | $$ \$$\  /  $$
    //  | $$   \$$| $$  | $$| $$$\ /  $$$| $$__/ $$| $$__| $$| $$$\| $$  \$$\/  $$ 
    //  | $$      | $$  | $$| $$$$\  $$$$| $$    $$| $$    $$| $$$$\ $$   \$$  $$  
    //  | $$   __ | $$  | $$| $$\$$ $$ $$| $$$$$$$ | $$$$$$$$| $$\$$ $$    \$$$$   
    //  | $$__/  \| $$__/ $$| $$ \$$$| $$| $$      | $$  | $$| $$ \$$$$    | $$    
    //   \$$    $$ \$$    $$| $$  \$ | $$| $$      | $$  | $$| $$  \$$$    | $$    
    //    \$$$$$$   \$$$$$$  \$$      \$$ \$$       \$$   \$$ \$$   \$$     \$$                                                                       
    //                                                       
    //=============================================================================

    app.post('/admin/company', function(req, res) {
        var compName = req.body.name.full || "noname";
        console.log("Create " + compName + " company");
        CompanyController.createCompany(res, req.body);
    });
    app.put('/admin/company', function(req, res) {
        var compName = req.body.name.full || "noname";
        console.log("Update " + compName + " company");
        CompanyController.updateCompany(res, req.body);
    });
    app.put('/admin/company/contact', function(req, res) {
        var compName = req.body.name.full || "noname";
        console.log("Update " + compName + " company's contact");
        CompanyController.updateCompanyContact(res, req.body);
    });
    app.delete('/admin/company/:company_id', function(req, res) {
        var compId = req.params.company_id || "noname";
        console.log("Remove " + compId + " company");
        CompanyController.delCompany(res, compId);
    });    

    //================================ Company ====================================
    //   ______   __    __  __    __   ______   __    __  __    __   ______   ________ 
    //  /      \ |  \  |  \|  \  |  \ /      \ |  \  |  \|  \  |  \ /      \ |        \
    // |  $$$$$$\| $$\ | $$| $$\ | $$|  $$$$$$\| $$  | $$| $$\ | $$|  $$$$$$\| $$$$$$$$
    // | $$__| $$| $$$\| $$| $$$\| $$| $$  | $$| $$  | $$| $$$\| $$| $$   \$$| $$__    
    // | $$    $$| $$$$\ $$| $$$$\ $$| $$  | $$| $$  | $$| $$$$\ $$| $$      | $$  \   
    // | $$$$$$$$| $$\$$ $$| $$\$$ $$| $$  | $$| $$  | $$| $$\$$ $$| $$   __ | $$$$$   
    // | $$  | $$| $$ \$$$$| $$ \$$$$| $$__/ $$| $$__/ $$| $$ \$$$$| $$__/  \| $$_____ 
    // | $$  | $$| $$  \$$$| $$  \$$$ \$$    $$ \$$    $$| $$  \$$$ \$$    $$| $$     \
    //  \$$   \$$ \$$   \$$ \$$   \$$  \$$$$$$   \$$$$$$  \$$   \$$  \$$$$$$  \$$$$$$$$                                                                      
    //                                                       
    //=============================================================================

    app.post('/admin/announce', function(req, res) {
        var title = req.body.title || "noname";
        console.log("Create " + title + " news");
        AnnounceController.createAnnounce(res, req.body);
    });
    app.put('/admin/announce', function(req, res) {
        var title = req.body.title || "noname";
        console.log("Update " + title + " news");
        AnnounceController.updateAnnounce(res, req.body);
    });
    app.delete('/admin/announce/:announce_id', function(req, res) {
        var ancId = req.params.announce_id || "noname";
        console.log("Remove " + ancId + " company");
        AnnounceController.delAnnounce(res, ancId);
    });


    //================================ DLC ====================================
    //                      _______   __        ______  
    //                     |       \ |  \      /      \ 
    //                     | $$$$$$$\| $$     |  $$$$$$\
    //                     | $$  | $$| $$     | $$   \$$
    //                     | $$  | $$| $$     | $$      
    //                     | $$  | $$| $$     | $$   __ 
    //                     | $$__/ $$| $$_____| $$__/  \
    //                     | $$    $$| $$     \\$$    $$
    //                      \$$$$$$$  \$$$$$$$$ \$$$$$$                                                                     
    //                                                       
    //=============================================================================

    app.post('/admin/dlc', upload.single('file'), function(req, res, next) {
        console.log(req.file);
        var title = req.body.title || "noname";
        console.log("Create " + title + " dlc");
        DlcController.createDlc(req, res, next);
    });

    app.delete('/admin/dlc/:dlc_id', function(req, res) {
        var ancId = req.params.dlc_id || {};
        console.log("Remove " + ancId);
        DlcController.delDlc(res, ancId);
    });

    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
