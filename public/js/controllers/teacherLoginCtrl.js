authenticationModule.controller('teacherLoginCtrl', ['$scope', '$rootScope', '$modalInstance','UsersService' , function($scope, $rootScope, $modalInstance, UsersService){
	console.log("Teacher Modal");
	$scope.test = 55;

	$scope.loginVerify = function (item) {
		console.log("Teacher login");
		console.log(item);
		if(!$rootScope.user){
			if(item){
				item.type = "teacher";
				UsersService.get(item)
				.success(function(data){
					console.log("Success!");
					$scope.login = {};
					$rootScope.user = data;
					$modalInstance.close();
				});
			}
		} else alert("already loged in!");
	}
}])