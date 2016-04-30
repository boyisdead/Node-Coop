var mainModule = angular.module('coopEdAssist', [

    'ui.router',
    'ui.bootstrap',
    'ngCookies',
    'ngMessages',
    'angular-jwt',
    'ngFileUpload',


    'coopEdAssist.home',
    'coopEdAssist.student',
    'coopEdAssist.teacher',
    'coopEdAssist.authentication',
    'coopEdAssist.document',
    'coopEdAssist.company',
    'coopEdAssist.application',

    'ng-sweet-alert',

]);

var homeModule = angular.module('coopEdAssist.home', []);
var studentModule = angular.module('coopEdAssist.student', []);
var teacherModule = angular.module('coopEdAssist.teacher', []);
var authenticationModule = angular.module('coopEdAssist.authentication', []);
var documentModule = angular.module('coopEdAssist.document', []);
var companyModule = angular.module('coopEdAssist.company', []);
var applicationModule = angular.module('coopEdAssist.application', []);


mainModule.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("home");

    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "view/home_page.html",
            controller: "homeCtrl",
            data: {
                // just for now
                requireLogin: false,
                accessType: 'any'
            }
        })
        .state('login', {
            url: "/login",
            templateUrl: "view/login_page.html",
            controller: "loginCtrl",
            data: {
                // just for now
                requireLogin: false,
                accessType: 'any'
            }
        })
        .state('teacherList', {
            url: "/teacher",
            templateUrl: "view/teacher_page.html",
            controller: "teacherCtrl",
            data: {
                // just for now
                requireLogin: true,
                accessType: 'teacher'
            }
        })
        .state('studentList', {
            url: "/student",
            templateUrl: "view/student_page.html",
            controller: "studentCtrl",
            data: {
                // just for now
                requireLogin: true,
                accessType: 'teacher'
            }
        })
        .state('studentDetail', {
            url: "/student_detail",
            templateUrl: "view/student_detail_page.html",
            controller: "studentDetailCtrl",
            data: {
                // just for now
                requireLogin: true,
                accessType: 'student'
            }
        })
        .state('documentList', {
            url: "/document",
            templateUrl: "view/document_page.html",
            controller: "documentCtrl",
            data: {
                // just for now
                requireLogin: true,
                accessType: 'teacher'
            }
        })
        .state('companyList', {
            url: "/company",
            templateUrl: "view/company_page.html",
            controller: "companyCtrl",
            data: {
                // just for now
                requireLogin: true,
                accessType: 'teacher'
            }
        })
        .state('applicationList', {
            url: "/application",
            templateUrl: "view/application_page.html",
            controller: "applicationCtrl",
            data: {
                // just for now
                requireLogin: true,
                accessType: 'teacher'
            }
        });



    // jwtInterceptorProvider.tokenGetter = ['myService', function(myService) {
    //     //myService.doSomething();
    //     return localStorage.getItem('id_token');
    // }];

    //$httpProvider.interceptors.push('jwtInterceptor');
});

mainModule.run(function($rootScope, $state, $cookies, jwtHelper) {

    var token = $cookies.get('tokenJWT');
    console.log(token);
    if (token && typeof token !== 'undefined') {
        if (jwtHelper.isTokenExpired(token)) {
            console.log("Expired!");
            $cookies.remove('tokenJWT');
            delete $rootScope.currentUser;
        } else {
            $rootScope.currentUser = jwtHelper.decodeToken(token);
            console.log($rootScope.currentUser);
        }
    }
    console.log("Hello!");

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        var token = $cookies.get('tokenJWT');
        var requireLogin = toState.data.requireLogin;
        var accessType = toState.data.accessType;

        console.log("on", $rootScope.currentUser);

        if (requireLogin) {
            if (token && typeof $rootScope.currentUser !== 'undefined') { //user has logon
                if (jwtHelper.isTokenExpired(token)) {
                    event.preventDefault();
                    console.log("Expired");
                    $cookies.remove('tokenJWT');
                    delete $rootScope.currentUser;
                    swal({
                            title: "หมดเวลา!",
                            text: "ระยะเวลาเข้าสู่ระบบของคุณหมดอายุ\nกรุณาเข้าสู่ระบบใหม่อีกครั้ง",
                            type: "error",
                            showCancelButton: true,
                            confirmButtonText: "เข้าสู่ระบบ",
                            cancelButtonText: "หน้าแรก",
                        },
                        function(isConfirm) {
                            if (isConfirm)
                                $state.go('login');
                            else
                                $state.go('home');
                        }
                    );
                } else {
                    if (accessType != 'any') {
                        if (typeof $rootScope.currentUser.access_type !== 'undefined') {
                            if ($rootScope.currentUser.access_type != accessType) {
                                event.preventDefault();
                                console.log("Access denied!");
                                swal({
                                    title: "เข้าไม่ได้!",
                                    text: "คุณไม่ได้รับอนุญาตให้เข้าถึงหน้านี้!",
                                    type: "error",
                                    confirmButtonText: "ตกลง",
                                });
                            }
                        } else { // there's somthing wrong try re-log-in
                            swal({
                            title: "ผิดพลาด!",
                            text: "มีบางอย่างผิดพลาด\nกรุณาเข้าสู่ระบบใหม่อีกครั้ง",
                            type: "error",
                            showCancelButton: true,
                            confirmButtonText: "เข้าสู่ระบบ",
                            cancelButtonText: "หน้าแรก",
                        },
                        function(isConfirm) {
                            if (isConfirm)
                                $state.go('login');
                            else
                                $state.go('home');
                        }
                    );
                        }
                    }
                }
            } else { // user ont logon
                event.preventDefault();
                console.log("Stranger!");
                swal({
                    title: "กรุณาเข้าสู่ระบบ!",
                    type: "error",
                    showCancelButton: true,
                    confirmButtonText: "เข้าสู่ระบบ",
                    cancelButtonText: "หน้าแรก",
                }, function(isConfirm) {
                    if (isConfirm)
                        $state.go('login');
                    else
                        $state.go('home');
                });
            }
        }
    });
});
