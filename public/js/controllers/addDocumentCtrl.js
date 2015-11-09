documentModule.controller('addDocumentCtrl', ['$scope', '$modalInstance', 'DocumentsService', function($scope, $modalInstance, DocumentsService) {


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

    $scope.uploadFileSuccess = function ( $file, $message, $flow){
        console.log("Success e");
        console.log( $file, $message, $flow);
    }

    $scope.uploadFileAdded = function ( $file, $event, $flow ){
        console.log("Added e");
        console.log($file, $event, $flow );
        $flow.upload();
    } 

    $scope.ok = function() {
        //can return something
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

}]);
