authenticationModule.controller('loginCtrl', ['$scope', '$uibModal', '$log', '$rootScope', function($scope, $uibModal, $log, $rootScope){
	
	$scope.openStudentLogin = function (){
		console.log("student");

	};

	$scope.openTeacherLogin = function (){
		console.log("teacher");
		$rootScope.abc = 15;
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'view/modal/teacher_login_modal.html',
			controller: 'teacherLoginCtrl',
			size: 'md'
		});

		modalInstance.result.then(function(){

		}, function(){
			$log.info('Modal dismissesd at: ' + new Date());
		});
	};
}])