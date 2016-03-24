authenticationModule.controller('teacherLoginCtrl', ['$scope', '$rootScope', '$modalInstance','UsersService' , function($scope, $rootScope, $modalInstance, UsersService){

	$scope.loginVerify = function (item) {
		console.log("Teacher login");
		console.log(item);
		if(!$rootScope.currentUser){
			if(item){
				item.type = "teacher";
				UsersService.get(item)
				.success(function(data){
					console.log("Success!");
					$scope.login = {};
					$rootScope.currentUser = data;
					$modalInstance.close();
				});
			}
		} else alert("already loged in!");
	}
	
}])