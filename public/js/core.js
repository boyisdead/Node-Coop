var mainModule = angular.module('coopEdAssist', [

    'ui.router',
    'ui.bootstrap',


    'coopEdAssist.home',
    'coopEdAssist.student',
    'coopEdAssist.teacher',
    'coopEdAssist.authentication',
    'coopEdAssist.document',

    'ng-sweet-alert',
    'flow',

    
]);

var homeModule = angular.module('coopEdAssist.home', []);
var studentModule = angular.module('coopEdAssist.student', []);
var teacherModule = angular.module('coopEdAssist.teacher', []);
var authenticationModule = angular.module('coopEdAssist.authentication', []);
var documentModule = angular.module('coopEdAssist.document', []);


mainModule.config(function($stateProvider, $urlRouterProvider, flowFactoryProvider) {

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
                requireLogin: false,
                accessType: 'teacher'
            }
        })
        .state('studentList', {
            url: "/student",
            templateUrl: "view/student_page.html",
            controller: "studentCtrl",
            data: {
                // just for now
                requireLogin: false,
                accessType: 'teacher'
            }
        })
        .state('studentDetail', {
            url: "/student_detail",
            templateUrl: "view/student_detail_page.html",
            controller: "studentDetailCtrl",
            data: {
                // just for now
                requireLogin: false,
                accessType: 'student'
            }
        })
        .state('documentList', {
            url: "/document",
            templateUrl: "view/document_page.html",
            controller: "documentCtrl",
            data: {
                // just for now
                requireLogin: false,
                accessType: 'teacher'
            }
        });

    flowFactoryProvider.defaults = {
        target: '/upload',
        permanentErrors:[404, 500, 501],
        
    };
});

mainModule.run(function($rootScope,$state, loginModal) {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;

        if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
            event.preventDefault();
            alert("Log in first!");
            $state.go('login');
            // get me a login modal!
            // loginModal()
            //     .then(function() {
            //         return $state.go(toState.name, toParams);
            //     })
            //     .catch(function() {
            //         return $state.go('home');
            //     });
            //alert("Log in first!");
        } else {

        }
    });
});
