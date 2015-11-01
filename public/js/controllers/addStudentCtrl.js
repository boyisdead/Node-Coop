teacherModule.controller('addStudentCtrl', ['$scope', '$modalInstance','StudentsService', function($scope, $modalInstance, StudentsService) {

	
    // CREATE ==================================================================
    // when submitting the add form, send the text to the node API

    $scope.createStudent = function() {

        // validate the formData to make sure that something is there
        // if form is empty, nothing will happen
        if ($scope.formData.stu_code != undefined) {
            $scope.loading = true;

            // call the create function from our service (returns a promise object)
            StudentsService.create($scope.formData)

            // if successful creation, call our get function to get all the new students
            .success(function(data) {
                $scope.loading = false;
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.students = data; // assign our new list of students
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