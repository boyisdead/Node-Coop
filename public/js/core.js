var mainModule = angular.module('coopEdAssist', [

    'ui.router',
    'ui.bootstrap',


    'coopEdAssist.home',
    'coopEdAssist.student',
    'coopEdAssist.teacher',
    'coopEdAssist.authentication',
    'coopEdAssist.document',

    'ng-sweet-alert',
    // 'flow',
    // 'angular-jwt',

    
]);

var homeModule = angular.module('coopEdAssist.home', []);
var studentModule = angular.module('coopEdAssist.student', []);
var teacherModule = angular.module('coopEdAssist.teacher', []);
var authenticationModule = angular.module('coopEdAssist.authentication', []);
var documentModule = angular.module('coopEdAssist.document', []);


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
        });

    // flowFactoryProvider.defaults = {
    //     target: '/upload',
    //     permanentErrors:[404, 500, 501],
        
    // };

    // jwtInterceptorProvider.tokenGetter = ['myService', function(myService) {
    //     //myService.doSomething();
    //     return localStorage.getItem('id_token');
    // }];

    //$httpProvider.interceptors.push('jwtInterceptor');
});

mainModule.run(function($rootScope,$state, loginModal) {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;
        var accessType = toState.data.accessType;

        if (requireLogin && typeof $rootScope.currentUser === 'undefined' ) {
            event.preventDefault();
            swal({
                title:"กรุณาเข้าสู่ระบบ!",
                type:"error",
                showCancelButton: true,
                confirmButtonText:"เข้าสู่ระบบ",
                cancelButtonText: "หน้าแรก",
            },
                function(isConfirm){
                    if(isConfirm)
                        $state.go('login');
                    else
                        $state.go('home');
                }
            );
        } else {
            if(accessType != $rootScope.currentUser.accessType && accessType != "any" ){
                event.preventDefault();
                swal({
                    title:"เข้าไม่ได้!",
                    text:"คุณไม่ได้รับอนุญาตให้เข้าถึงหน้านี้!", 
                    type:"error",
                    confirmButtonText:"ตกลง",
                });                
            }
        }
    });
});
