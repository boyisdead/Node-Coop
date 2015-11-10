teacherModule.controller('editTeacherCtrl', ['$scope', '$modalInstance','TeachersService','OthersService', function($scope, $modalInstance, TeachersService, OthersService) {

    $scope.getTeacherData = function() {
        TeachersService.find($scope.params.teacherId,'i').success(function(data){
            console.log(data);
            $scope.teacherData = data;
            $scope.formData = data;
            console.log($scope.teacherData);
        });
    }

    var getAcadePos = function() {
        OthersService.getAcadePos().success(function(posdata){
            $scope.acadePosList = posdata;
        });
    };

    var getTitleName = function() {
        OthersService.getTitleName().success(function(titledata){
            $scope.titleNameList = titledata;
        });
    };

    getTitleName();
    getAcadePos();
    $scope.getTeacherData();

    $scope.updateTeacher = function() {
        console.log("Updating...");
        // validate the formData to make sure that something is there
        // if form is empty, nothing will happen
        TeachersService.update($scope.formData).success(function(data) {
            alert("บันทึกแล้ว");
            $modalInstance.close();
        });
    };

    $scope.changPw = function (passwordData, id) {
        console.log("chng pw",passwordData,id);
        if(passwordData.newPassword==passwordData.password_confirm){
            TeachersService.pwChange(passwordData,id).success(function(data) {
                alert(data);
                $modalInstance.close();
            });
        } else alert("การยืนยันรหัสผ่านใหม่ไม่ถูกต้อง");
              
    }


    $scope.ok = function () {
  	 //can return something
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);