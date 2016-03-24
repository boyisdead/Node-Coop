mainModule.service('loginModal', [ '$uibModal','$log', '$rootScope', function ($uibModal, $log, $rootScope) {

  function assignCurrentUser (user) {
    $rootScope.currentUser = user;
    return user;
  }

  return function() {
    var modalInstance = $uibModal.open({
      templateUrl: 'view/modal/login_modal.html',
      controller: 'loginCtrl',
      animation :true
    })

    modalInstance.result.then(function(){

	}, function(){
		$log.info('Modal dismissesd at: ' + new Date());
	});

    return modalInstance.result.then(assignCurrentUser);
  };

}]);