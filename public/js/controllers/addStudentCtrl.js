teacherModule.controller('addStudentCtrl', ['$scope', '$modalInstance','StudentsService','OthersService', function($scope, $modalInstance, StudentsService, OthersService) {

    var getTitleName = function() {
        OthersService.getTitleName().success(function(titledata){
            $scope.titleNameList = titledata;
        });
    };

    var getAdvisor = function() {
        OthersService.getAdvisor().success(function(advisors){
            $scope.advisorList = advisors;
        });
    };

    getTitleName();
    getAdvisor();

    $scope.createStudent = function() {
        if ($scope.formData.stu_code != undefined) {
            $scope.loading = true;
            StudentsService.create($scope.formData).success(function(data) {
                $scope.loading = false;
                $modalInstance.close();
            });
        }
    };

    $scope.sexChange = function () {
        if ($scope.formData.title._id == 1)
            $scope.formData.sex = "ชาย";
        else 
            $scope.formData.sex = "หญิง";
    }

    $scope.ok = function () {
  	//can return something
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);