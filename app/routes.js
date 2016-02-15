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
    
    app.get('/api/typehead/title_name', function(req, res) {
        OtherController.titleNameTypeAhead(res);
    });

    app.get('/api/typehead/acade_pos', function(req, res) {
        OtherController.acadePosTypeAhead(res);
    });

    app.get('/api/typehead/advisor', function(req, res) {
        TeacherController.TeacherTypeAhead(res);
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
    app.get('/api/students', function(req, res) {
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

    app.get('/api/students/acaYr/:acaYr', function(req, res) {
        if(req.decoded.access_type=="teacher"){ 
            console.log("get all students");
            StudentController.getStudentsByAcaYr(req.params.acaYr, res);
        } else {
            res.status(403).send({
                success: false,
                message: "only Teachers allow in this section."
            });
        }
    });


    app.post('/api/student/id/:id', function(req, res) {
        StudentController.findStudentById(req.params.id, res);
    });

    app.post('/api/student/code/:scode', function(req, res) {
        StudentController.findStudentByCode(req.params.scode, res);
    });

    // create student and send back all students after creation
    app.post('/api/students', function(req, res) {
        console.log("Creating...");
        StudentController.createStudent(req.body, res);
    });

    app.post('/api/students/uploadPicture', upload.single('file'), function(req, res, next) {
        console.log(req.file);
        StudentController.uploadPicture(req, res, next);
    });

    // update a student
    app.put('/api/students', function(req, res) {
        console.log("Updating...");
        StudentController.updateStudent(req.body, res);
    });

    app.put('/api/students/unlock_profile', function(req, res) {
        StudentController.unLockStuProfile(req.body.id, res);
    });

    app.put('/api/students/lock_profile', function(req, res) {
        StudentController.lockStuProfile(req.body.id, res);
    });

    app.put('/api/students/pw_change', function(req, res) {
        StudentController.pwChangeStudent(req.body, res);
    })

    // delete a student
    app.delete('/api/students/:student_id', function(req, res) {
        StudentController.delStudent(req.params.student_id, res);
    });

    app.get('/api/students/acaYrs', function(req, res) {
        StudentController.getAcaYrs(res);
    });
    app.get('/api/documents/acaYrs/:acaYrs', function(req, res) {
        console.log("get Docs of " + req.params.acaYrs);
        StudentController.getDocuments(req.params.acaYrs, res);
    });
    app.get('/api/students/documents/acaYrs/:acaYrs', function(req, res) {
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

    app.get('/api/teachers', function(req, res) {
        TeacherController.getTeacher(res);
    });

    app.get('/api/teachers/item/:item/mode/:mode', function(req, res) {
        TeacherController.findTeacher(req.params.item, req.params.mode, res);
    });

    app.post('/api/teachers', function(req, res) {
        TeacherController.createTeacher(req.body, res);
    });
    // update a teacher
    app.put('/api/teachers', function(req, res) {
        TeacherController.updateTeacher(req.body, res);
    })

    app.put('/api/teachers/pw_change', function(req, res) {
        console.log("pw chng");
        TeacherController.pwChangeTeacher(req.body, res);
    })

    // delete a teacher
    app.delete('/api/teachers/:teacher_id', function(req, res) {
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
    app.get('/api/documents', function(req, res) {
        DocumentController.getDocument(res);
    });


    // upload document
    app.post('/api/documents/upload', upload.single('file'), function(req, res, next) {
        console.log(req.file);
        DocumentController.createDocument(req, res, next);
    });

    // update document
    app.put('/api/documents', function(req, res) {
        DocumentController.updateDocument(req.body, res);
    });

    // delete a document
    app.delete('/api/documents/:document_id', function(req, res) {
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
    app.get('/api/companies', function(req, res) {
        CompanyController.getCompany(res);
    });
    app.get('/api/companies/item/:item/mode/:mode', function(req, res) {
        CompanyController.findCompany(req.params.item, req.params.mode, res);
    });
    app.post('/api/companies', function(req, res) {
        CompanyController.createCompany(req.body, res);
    });
    app.put('/api/companies', function(req, res) {
        CompanyController.updateCompany(req.body, res);
    });
    app.put('/api/companies/contact', function(req, res) {
        CompanyController.updateCompanyContact(req.body, res);
    });
    app.delete('/api/companies/:company_id', function(req, res) {
        CompanyController.delCompany(req.params.company_id, res);
    });

    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
