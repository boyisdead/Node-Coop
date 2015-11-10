teacherModule.controller('addTeacherCtrl', ['$scope', '$modalInstance','TeachersService', 'OthersService', function($scope, $modalInstance, TeachersService, OthersService) {

    var getTitleName = function() {
        OthersService.getTitleName().success(function(titledata){
            $scope.titleNameList = titledata;
            console.log($scope.titleNameList[0].title_th);
        });
    };
    var getAcadePos = function() {
        OthersService.getAcadePos().success(function(posdata){
            $scope.acadePosList = posdata;
        });
    };

    getAcadePos();
    getTitleName()

    $scope.sexChange = function () {
        if ($scope.formData.title._id == 1)
            $scope.formData.sex = "ชาย";
        else 
            $scope.formData.sex = "หญิง";
    }

    $scope.createTeacher = function() {
        if ($scope.formData.staff_code != undefined) {
            $scope.loading = true;
            TeachersService.create($scope.formData).success(function(data) {
                $scope.loading = false;
                $modalInstance.close();
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