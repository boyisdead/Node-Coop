companyModule.controller('editCompanyCtrl', ['$scope','$modalInstance', 'CompaniesService', function($scope, $modalInstance, CompaniesService){
	
	var getCompanyData = function() {
        CompaniesService.find($scope.params.company_id).success(function(data) {
            $scope.formData = data.result[0];
            $scope.formData.tel.head = $scope.formData.tel.substr(0,$scope.formData.tel.lastIndexOf('-'));
            $scope.formData.tel.tail = $scope.formData.tel.substr($scope.formData.tel.lastIndexOf('-')+1); 
            $scope.formData.fax.head = $scope.formData.fax.substr(0,$scope.formData.fax.lastIndexOf('-'));
            $scope.formData.fax.tail = $scope.formData.fax.substr($scope.formData.fax.lastIndexOf('-')+1); 
            console.log($scope.formData.tel,$scope.formData.tel.head,$scope.formData.fax,$scope.formData.fax.lastIndexOf('-'));
        });
    }

    var updateCompany = function() {
        console.log("Updating...");
        CompaniesService.update($scope.formData).success(function(data) {
            swal({
                title: "บันทึก!",
                type: "success",
                confirmButtonText: "ปิด"
            });
            $modalInstance.close();
        });
    };

    getCompanyData();

    $scope.validateForm = function (msg) {

        var errList = "";
        if (typeof $scope.formData != 'undefined') {

            if (msg.compName.$error.required) {
                errList += "ชื่อสถานประกอบ ไม่ถูกกรอก\n";
            }
            if (msg.address.$error.required) {
                errList += "ที่อยู่สถานประกอบการ ไม่ถูกกรอก\n";
            }


            if (errList != "") {
                sweetAlert("ฟอร์มไม่ถูกต้อง!", errList, 'error');
            } else {
                updateCompany();
            }
        }
    }


    $scope.ok = function() {
        //can return something
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}])