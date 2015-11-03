documentModule.controller('documentCtrl', ['$scope', 'DocumentsService', function($scope, DocumentsService) {
    $scope.loading = true;
    $scope.documents = []
        ,$scope.currentPage = 1
        ,$scope.numPerPage = 2
        ,$scope.maxSize = 5;

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
    }

}])
