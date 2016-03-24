companyModule.controller('editCompanyCtrl', ['$scope','$modalInstance', 'CompaniesService', function($scope, $modalInstance, CompaniesService){
	
	var getCompanyData = function() {
        CompaniesService.find($scope.params.company_id, 'i').success(function(data) {
            $scope.formData = data;
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