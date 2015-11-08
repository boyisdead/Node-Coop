documentModule.controller('addDocumentCtrl', ['$scope', '$modalInstance','$document', 'DocumentsService', function($scope, $modalInstance,$document, DocumentsService) {


    // CREATE ==================================================================
    // when submitting the add form, send the text to the node API
    console.log("In modal");

    var flow = new Flow({
        target:'/api/upload', 
    });
    var myEl = angular.element(document.querySelector( '#browseBtn' ));
    var flow = new Flow({
    console.log(myEl);

    flow.assignBrowse(myEl, false, true);
    flow.on('fileAdded', function(file, event){
        console.log(file, event);
    });
    flow.on('fileSuccess', function(file,message){
        console.log(file,message);
    });
    flow.on('fileError', function(file, message){
        console.log(file, message);
    });

    $scope.createDocument = function(formData) {
      console.log("Document creating... ");
        // validate the formData to make sure that something is there
        // if form is empty, nothing will happen
        if (formData.owner != undefined) {
            $scope.loading = true;
            // if ($scope.formData.file) {
            //   $scope.upload($scope.formData.file);
            // }
            console.log(flow); 
            //formData.file = $scope.$flow.files;
            console.log(formData.owner);
            console.log(formData);
            // call the create function from our service (returns a promise object)
            DocumentsService.create(formData).success(function(data) {
                $scope.loading = false;
                $scope.formData = {}; // clear the form so our teacher is ready to enter another
                $scope.documents = data; // assign our new list of documents
                $modalInstance.close();
            });
        } else {
           console.log("no owner! ");
        }
    };

    $scope.ok = function() {
        //can return something
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

}]);
