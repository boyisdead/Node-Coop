companyModule.controller('addCompanyCtrl', ['$scope', '$modalInstance', 'CompaniesService', function($scope, $modalInstance, CompaniesService){

    var formData = {};

    $scope.validateForm = function(msg) {
        var errList = "";
        if (typeof $scope.formData != 'undefined') {

        	if (msg.compName.$error.required) {
                errList += "ชื่อสถานประกอบการ ไม่ถูกกรอก\n";
            }

            
            if (msg.tel.$error.minlength) {
                errList += "เบอร์โทรศัพท์ สั้นเกินไป\n";
            }
            
            if (msg.fax.$error.required) {
                errList += "เบอร์โทรเสาร ไม่ถูกกรอก\n";
            }

            if (errList != "") {
                sweetAlert("ฟอร์มไม่ถูกต้อง!", errList, 'error');
            } else {
                console.log("aaa");
                createCompany();
            }
        }

    }

    var createCompany = function() {
        $scope.loading = true;
        if($scope.formData.tel.tail)
        	$scope.formData.tel =  $scope.formData.tel + '-' +  $scope.formData.tel.tail; 
        if($scope.formData.fax.tail)
        	$scope.formData.fax =  $scope.formData.fax + '-' +  $scope.formData.fax.tail; 
        CompaniesService.create($scope.formData).success(function(data) {
            sweetAlert("สำเร็จ", "สถานประกอบการ" + $scope.formData.name.full + " ถูกเพิ่มแล้ว", "success");
            $scope.loading = false;
            $modalInstance.close();
        });
    }

    $scope.ok = function() {
        //can return something
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}])