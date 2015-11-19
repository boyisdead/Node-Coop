documentModule.controller('addDocumentCtrl', ['$scope','Upload', '$modalInstance', 'DocumentsService', function($scope, Upload, $modalInstance, DocumentsService) {


    // CREATE ==================================================================
    // when submitting the add form, send the text to the node API
    console.log("In modal");
    $scope.formData = {};

    $scope.createDocument = function (e,formData) {
        console.log("Document creating... ");
         console.log($scope.formData.owner);
         console.log(formData.owner);
        // validate the formData to make sure that something is there
        // if form is empty, nothing will happen
        if ($scope.formData.owner != undefined) {

            e.upload();
            // call the create function from our service (returns a promise object)
            // DocumentsService.create_2(formData).success(function(data) {
            //     $scope.loading = false;
            //     $scope.formData = {}; // clear the form so our teacher is ready to enter another
            //     $scope.documents = data; // assign our new list of documents
            //     $modalInstance.close();
            // });
        } else {
           console.log("no owner! ");
        }
    };

    // upload on file select or drop
    $scope.upload = function (file) {
        console.log(file);
        Upload.upload({
            url: '/api/documents/upload',
            method: 'POST',
            fields : {'owner' : $scope.formData.owner, 'description': $scope.formData.description, 'file_type' : $scope.formData.file_type },
            file: file
        }).then(function (resp) {
            console.log('Success' , resp.config, resp.success);
            //console.log('Success ' + resp.config.attachFile.name + 'uploaded. Response: ' , resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' , progressPercentage);
            //console.log('progress: ' + progressPercentage + '% ' + evt.config.attachFile.name);
        });
    };

    $scope.ok = function() {
        //can return something
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

}]);
