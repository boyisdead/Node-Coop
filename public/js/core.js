var mainModule = angular.module('coopEdAssist', [

	'ui.router',


	'coopEdAssist.home',
	'coopEdAssist.student'

]);

var homeModule = angular.module('coopEdAssist.home',[]);
var studentModule = angular.module('coopEdAssist.student', []);



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

});