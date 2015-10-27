studentModule.controller('studentCtrl', ['$scope', '$http', '$uibModal','$log','StudentsService', function($scope, $http, $uibModal, $log, StudentsService) {

    $scope.formData = {};
    $scope.loading = true;

    // GET =====================================================================
    // when landing on the page, get all students and show them
    // use the service to get all the students
    StudentsService.get()
        .success(function(data) {
            $scope.students = data;
            $scope.loading = false;
        });

    // DELETE ==================================================================
    // delete a student after click it
    $scope.deleteStudent = function(id) {
        $scope.loading = true;

        StudentsService.delete(id)
            // if successful creation, call our get function to get all the new students
            .success(function(data) {
                $scope.loading = false;
                $scope.students = data; // assign our new list of students
            });
    };

    $scope.openAddStudent = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'view/modal/add_student_modal.html',
            controller: 'addStudentCtrl',
            backdrop: false,
            size: 'lg'
        });

        modalInstance.result.then(function() {
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);
