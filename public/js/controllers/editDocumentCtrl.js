documentModule.controller('editDocumentCtrl', ['$scope', '$modalInstance', 'DocumentsService', 'OthersService', function($scope, $modalInstance, DocumentsService, OthersService) {

    $scope.getDocumentData = function() {
        DocumentsService.find($scope.params.documentId).success(function(data) {
            $scope.formData = data.result[0];
        });
    }
    $scope.getDocumentData();

    $scope.validateForm = function(msg) {
        var errList = "";
        if (typeof $scope.formData != 'undefined') {

            if (msg.fileType.$error.required) {
                errList += "ประเภทของเอกสาร ไม่ถูกกรอก\n";
            }
            if ($scope.formData.desc=''&&$scope.formData.file_type=="Certificate") {
                errList += "คำอธิบาย ไม่ถูกกรอก\n";
            }
            if (errList != "") {
                sweetAlert("ฟอร์มไม่ถูกต้อง!", errList, 'error');
            } else {
                updateDocument();
            }
        }
    }
    var updateDocument = function() {
        console.log("Updating...");
        $scope.formData.reviewed = true; 
        DocumentsService.update($scope.formData).success(function(data) {
            swal({
                title: "บันทึก!",
                type: "success",
                confirmButtonText: "ปิด"
            });
            $modalInstance.close();
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
