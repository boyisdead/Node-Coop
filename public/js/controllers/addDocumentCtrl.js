documentModule.controller('addDocumentCtrl', ['$scope', '$modalInstance','DocumentsService', function($scope, $modalInstance, DocumentsService) {

	
    // CREATE ==================================================================
    // when submitting the add form, send the text to the node API

    $scope.createDocument = function() {

        // validate the formData to make sure that something is there
        // if form is empty, nothing will happen
        if ($scope.formData.owner != undefined) {
            $scope.loading = true;

            // call the create function from our service (returns a promise object)
            DocumentsService.create($scope.formData)

            // if successful creation, call our get function to get all the new documents
            .success(function(data) {
                $scope.loading = false;
                $scope.formData = {}; // clear the form so our teacher is ready to enter another
                $scope.documents = data; // assign our new list of documents
            });
        }
    };


  $scope.ok = function () {
  	//can return something
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);