authenticationModule.controller('teacherLoginCtrl', ['$scope', '$rootScope' , function($scope, $rootScope){
	console.log("Teacher Modal");
	$scope.test = 55;

	$scope.logIn = function (item) {
		console.log("Teacher login");
		console.log(item);
	}
}])