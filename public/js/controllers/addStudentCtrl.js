teacherModule.controller('addStudentCtrl', ['$scope', '$modalInstance','StudentsService','OthersService', function($scope, $modalInstance, StudentsService, OthersService) {

	
    // CREATE ==================================================================
    // when submitting the add form, send the text to the node API

    $scope.createStudent = function() {

        // validate the formData to make sure that something is there
        // if form is empty, nothing will happen
        if ($scope.formData.stu_code != undefined) {
            $scope.loading = true;
            $scope.formData.name.t_th =  $scope.formData.name.t.title_th;
            $scope.formData.name.t_en =  $scope.formData.name.t.title_en;
            console.log($scope.formData);
            // call the create function from our service (returns a promise object)
            StudentsService.create($scope.formData)

            // if successful creation, call our get function to get all the new students
            .success(function(data) {
                $scope.loading = false;
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.students = data; // assign our new list of students
                $modalInstance.close();
            });
        }
    };

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

    $scope.ok = function () {
  	//can return something
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);