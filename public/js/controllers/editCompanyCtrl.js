companyModule.controller('editCompanyCtrl', ['$scope','$modalInstance', 'CompaniesService', function($scope, $modalInstance, CompaniesService){
	
	var getCompanyData = function() {
        CompaniesService.find($scope.params.company_id).success(function(data) {
            $scope.formData = data.result[0];
        })
    }

    getCompanyData();

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

    var updateCompanyContact = function() {
        console.log("Updating...", $scope.formData);
        CompaniesService.updateContact($scope.formData).success(function(data) {
            swal({
                title: "บันทึก!",
                type: "success",
                confirmButtonText: "ปิด"
            });
            $modalInstance.close();
        });
    };


    $scope.validateContactForm = function (msg) {

        var errList = "";
        console.log("msg",msg);
        if (typeof $scope.formData != 'undefined') {
            if(msg.name_first.$error.required || msg.name_last.$error.required)
                errList += "ชื่อ หรือ นามสกุลผู้ติดต่อ ไม่ถูกกรอก\n";
            if(msg.telephone.$error.required)
                errList += "เบอร์โทรศัพท์ ไม่ถูกกรอก\n";
            if(msg.email.$error.required)
                errList += "อีเมล์ ไม่ถูกกรอก\n";
            if (errList != "") {
                sweetAlert("ฟอร์มไม่ถูกต้อง!", errList, 'error');
            } else {
                updateCompanyContact();
            }
        }
    }

    var updateCompanyCoordinator = function() {
        console.log("Updating...");
        CompaniesService.updateCoordinator($scope.formData).success(function(data) {
            swal({
                title: "บันทึก!",
                type: "success",
                confirmButtonText: "ปิด"
            });
            $modalInstance.close();
        });
    };

    $scope.validateCoordinatorForm = function (msg) {

        var errList = "";
        if (typeof $scope.formData != 'undefined') {
            if(msg.name_first.$error.required || msg.name_last.$error.required)
                errList += "ชื่อ หรือ นามสกุลผู้ติดต่อ ไม่ถูกกรอก\n";
            if(msg.telephone.$error.required)
                errList += "เบอร์โทรศัพท์ ไม่ถูกกรอก\n";
            if(msg.email.$error.required)
                errList += "อีเมล์ ไม่ถูกกรอก\n";
            if (errList != "") {
                sweetAlert("ฟอร์มไม่ถูกต้อง!", errList, 'error');
            } else {
                updateCompanyCoordinator();
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