var mainModule = angular.module('coopEdAssist', [

	'ui.router',
	'ui.bootstrap',


	'coopEdAssist.home',
	'coopEdAssist.student',
	'coopEdAssist.teacher',
	'coopEdAssist.authentication'

]);

var homeModule = angular.module('coopEdAssist.home',[]);
var studentModule = angular.module('coopEdAssist.student', []);
var teacherModule = angular.module('coopEdAssist.teacher', []);
var authenticationModule = angular.module('coopEdAssist.authentication',[]);


mainModule.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise("home");

	$stateProvider
		.state('home',{
			url:"/home",
			templateUrl: "view/home_page.html",
			controller: "homeCtrl"
		})
		.state('student',{
			url:"/student",
			templateUrl: "view/student_page.html",
			controller: "studentCtrl"
		})
		.state('login',{
			url:"/login",
			templateUrl: "view/login_page.html",
			controller: "loginCtrl"
		})
		.state('teacher',{
			url:"/teacher",
			templateUrl: "view/teacher_page.html",
			controller: "teacherCtrl"
		})

});