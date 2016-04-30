studentModule.controller('editStudentPreferCtrl', ['$scope', '$modalInstance', 'StudentsService', 'OthersService', function($scope, $modalInstance, StudentsService, OthersService) {

    $scope.getStudentData = function() {
        StudentsService.find($scope.params.studentId).success(function(data) {
            $scope.formData = data.result[0].prefered_company;
        });
    }

    var getCompanyName = function() {
        OthersService.getCompany().success(function(data){
            $scope.companyList = data.result;
        });
    };

    getCompanyName();
    $scope.getStudentData();

    $scope.validateForm = function(msg) {
        var errList = "";
        if (typeof $scope.formData != 'undefined') {

            if (!($scope.formData.first || $scope.formData.second || $scope.formData.third)) {
                errList += "ชื่อสถานประกอบการ ไม่ถูกกรอก\n";
            }
            if (errList != "") {
                sweetAlert("ฟอร์มไม่ถูกต้อง!", errList, 'error');
            } else {
                updateStudent();
            }
        }
    }

    var updateStudent = function() {
        console.log("Updating...");
        StudentsService.update({_id:$scope.params.studentId, prefered_company : $scope.formData}).success(function(data) {
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
