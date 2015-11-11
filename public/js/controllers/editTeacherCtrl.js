teacherModule.controller('editTeacherCtrl', ['$scope', '$modalInstance', 'TeachersService', 'OthersService', function($scope, $modalInstance, TeachersService, OthersService) {

    $scope.getTeacherData = function() {
        TeachersService.find($scope.params.teacherId, 'i').success(function(data) {
            $scope.formData = data;
        });
    }

    var getAcadePos = function() {
        OthersService.getAcadePos().success(function(posdata) {
            $scope.acadePosList = posdata;
        });
    };

    var getTitleName = function() {
        OthersService.getTitleName().success(function(titledata) {
            $scope.titleNameList = titledata;
        });
    };

    getTitleName();
    getAcadePos();
    $scope.getTeacherData();

    $scope.updateTeacher = function() {
        console.log("Updating...");
        TeachersService.update($scope.formData).success(function(data) {
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
            TeachersService.pwChange(passwordData, id).success(function(data) {
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
