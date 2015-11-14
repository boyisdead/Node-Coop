studentModule.controller('editStudentCtrl', ['$scope', '$modalInstance', 'StudentsService', 'OthersService', function($scope, $modalInstance, StudentsService, OthersService) {

    $scope.getStudentData = function() {
        StudentsService.find($scope.params.studentId, 'i').success(function(data) {
            $scope.formData = data;
        });
    }

    var getTitleName = function() {
        OthersService.getTitleName().success(function(titledata) {
            $scope.titleNameList = titledata;
        });
    };
    var getAdvisor = function() {
        OthersService.getAdvisor().success(function(advisors) {
            $scope.advisorList = advisors;
        });
    };

    getTitleName();
    getAdvisor();
    $scope.getStudentData();

    $scope.updateStudent = function() {
        console.log("Updating...");
        StudentsService.update($scope.formData).success(function(data) {
            swal({
                title: "บันทึก!",
                type: "success",
                confirmButtonText: "ปิด"
            });
            $modalInstance.close();
        });
    };

    $scope.changPw = function(passwordData, id) {
        console.log("chng pw", passwordData, id);
        if (passwordData.newPassword == passwordData.password_confirm) {
            StudentsService.pwChange(passwordData, id).success(function(data) {
                swal({
                    title: "ดำเนินการ!",
                    text: data,
                    type: "success",
                    confirmButtonText: "ปิด"
                });
                $modalInstance.close();
            });

        } else {
            swal({
                title: "การยืนยันรหัสผ่านไม่ถูกต้อง!",
                type: "error",
                confirmButtonText: "ปิด"
            });
        }

    }



    $scope.ok = function() {
        //can return something
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

}]);
