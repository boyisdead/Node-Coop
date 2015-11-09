teacherModule.controller('editTeacherCtrl', ['$scope', '$modalInstance','TeachersService', function($scope, $modalInstance, TeachersService) {

    $scope.getTeacherData = function() {
        TeachersService.find($scope.params.teacherId,'i').success(function(data){
            console.log(data);
            $scope.teacherData = data;
            $scope.formData = data;
            console.log($scope.teacherData);
        });
    }

    $scope.getTeacherData();

    $scope.updateTeacher = function() {
        console.log("Updating...");
        // validate the formData to make sure that something is there
        // if form is empty, nothing will happen
        if (true) {
            TeachersService.update($scope.formData)
            .success(function(data) {
                alert("บันทึกแล้ว");
                $scope.getTeacherData();
            });
        }
    };


  $scope.ok = function () {
  	//can return something
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);