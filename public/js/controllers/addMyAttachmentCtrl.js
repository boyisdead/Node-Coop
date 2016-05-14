documentModule.controller('addMyAttachmentCtrl', ['$scope','Upload', '$modalInstance', 'DocumentsService', function($scope, Upload, $modalInstance, DocumentsService) {

    console.log("In modal");
    $scope.formData = {};

    $scope.validateForm = function (msg){
        var errList = "";
        if (typeof $scope.formData != 'undefined') {
            if (msg.file.$error.required) {
                errList += "ไม่มีเอกสารที่เลือก\n";
            }

            if (!msg.file.$valid) {
                errList += "เอกสารไม่ถูกต้อง\n";
            }

            if (msg.fileType.$error.required) {
                errList += "ประเภทเอกสารไม่ถูกเลือก ไม่ถูกเลือก\n";
            }

            if (msg.desc.$error.required) {
                if($scope.formData.file_type=="Certificate")
                    errList += "ใบรับรองต้องมีคำอธิบาย\n";
            }

            if (errList != "") {
                sweetAlert("ฟอร์มไม่ถูกต้อง!", errList, 'error');
            } else {
                console.log("aaa");
                upload($scope.formData.attachFile, $scope.formData.owner);
            }
        }
    }

    // upload on file select or drop
    var upload = function (file) {
        Upload.upload({
            url: '/coopsys/v1/myattach/',
            method: 'POST',
            fields : {
                'description': $scope.formData.description, 
                'file_type' : $scope.formData.file_type 
            },
            file: file
        }).then(function (resp) {
            console.log('Success' , resp.config, resp.success);
            swal({
                title:"สำเร็จ",
                type:"success",
                text:"เอกสารได้ถูกเพิ่มแล้ว",
                confirmButtonText:"ปิด",
            });
            $modalInstance.close();
            //console.log('Success ' + resp.config.attachFile.name + 'uploaded. Response: ' , resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
            swal("ล้มเหลว!", "เกิดข้อผิดพลาดบางอย่าง กรุณาลองอีกครั้งภายหน้า\n" + resp.data.error || resp.status ,"error")
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
