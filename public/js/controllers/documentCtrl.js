documentModule.controller('documentCtrl', ['$scope','$uibModal','$log', 'DocumentsService', function($scope,$uibModal,$log, DocumentsService) {
    $scope.loading = true;
    $scope.documents = []
        ,$scope.currentPage = 1
        ,$scope.numPerPage = 10
        ,$scope.maxSize = 5;

    $scope.items = ["AA","BB","CC","DD","EE",];

    DocumentsService.get()
        .success(function(data) {
            console.log("Documents data retrieving success.");
            console.log(data);
            $scope.documents = data;
            $scope.loading = false;
        });

    $scope.deleteDocument = function(id) {

        $scope.loading = true;
        DocumentsService.delete(id).success(function(data) {
            $scope.documents = data;
            $scope.loading = false;
        });
    };

    $scope.openAddDocument = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'view/modal/add_document_modal.html',
            controller: 'addStudentCtrl',
            size: 'lg'
        });

        modalInstance.result.then(function() {
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

}])
