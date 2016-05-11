studentModule.controller('myDetailCtrl', ['$scope', '$rootScope', '$http', '$uibModal', '$log', 'StudentsService', 'OthersService', function($scope, $rootScope, $http, $uibModal, $log, StudentsService, OthersService) {

    var getMyDetail = function() {
        $scope.loading = true;
        
        StudentsService.getMyProfile()
            .success(function(data) {
                $scope.myDetail = data.result[0];
                $scope.loading = false;  
            }).error(function(err){
                console.log("no success", err);
            });
    }

    getMyDetail();

    $scope.openEditMyProfile = function() {
        var scope = $rootScope.$new();
        scope.params = {
            studentId: $rootScope.currentUser.access_id
        };
        var modalInstance = $uibModal.open({
            scope: scope,
            size: 'lg',
            animation: true,
            templateUrl: 'view/modal/edit_myprofile_modal.html',
            controller: 'editMyDetailCtrl'
        });

        modalInstance.result.then(function(data) {
            $log.info('Modal dismissed at: ' + new Date());
            getMyDetail();
        }, function(data){
        	$log.info('Modal dismissed at: ' + new Date());
            getMyDetail();
        });
    };
	
}])