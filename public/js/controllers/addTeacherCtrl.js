teacherModule.controller('addTeacherCtrl', ['$scope', '$modalInstance','TeachersService', 'OthersService', function($scope, $modalInstance, TeachersService, OthersService) {

	
    // CREATE ==================================================================
    // when submitting the add form, send the text to the node API

    $scope.createTeacher = function() {

        // validate the formData to make sure that something is there
        // if form is empty, nothing will happen
        if ($scope.formData.staff_code != undefined) {
            $scope.loading = true;
            TeachersService.create($scope.formData)

            // if successful creation, call our get function to get all the new teachers
            .success(function(data) {
                $scope.loading = false;
                $scope.formData = {}; // clear the form so our teacher is ready to enter another
                $scope.teachers = data; // assign our new list of teachers
                $modalInstance.close();
            });
        }
    };

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

    $scope.ok = function () {
  	//can return something
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);