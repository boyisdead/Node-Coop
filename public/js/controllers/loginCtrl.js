authenticationModule.controller('loginCtrl', ['$scope', '$rootScope','UsersService', function($scope, $rootScope,UsersService){
	

	// $scope.openTeacherLogin = function (){
	// 	console.log("teacher");
	// 	var modalInstance = $uibModal.open({
	// 		animation: true,
	// 		templateUrl: 'view/modal/teacher_login_modal.html',
	// 		controller: 'teacherLoginCtrl',
	// 		size: 'md'
	// 	});

	// 	modalInstance.result.then(function(){

	// 	}, function(){
	// 		$log.info('Modal dismissesd at: ' + new Date());
	// 	});
	// };

	$scope.loginVerify = function (item){
		if(item){
			if (item.username.length < 6){
				alert("at least 6 characters require for username");
			} else if (item.password.length  < 4){
				alert("at least 4 characters require for password");
			} else if (item.type  == '' || item.type  == null) {
				alert("please choose login type");
			} else {
				identifyUser(item);
			}
		} else {
			alert("Please fill something");
		}

	}

	var identifyUser = function (item) {
		var alreadyLogin;
		if (typeof $rootScope.currentUser !== 'undefined') 
			alreadyLogin =  $rootScope.currentUser.success;

		if(!alreadyLogin){
			if(item){
				UsersService.get(item)
				.success(function(data){
					console.log("Success!");
					$scope.login = {};
					$rootScope.currentUser = data;
				});
			}
		} else alert("คุณอยู่ในระบบ");
	}

	$scope.logout = function () {
		$rootScope.currentUser = {};
		alert("ออกจากระบบสำเร็จ");
	}
}])