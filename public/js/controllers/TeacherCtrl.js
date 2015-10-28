teacherModule.controller('teacherCtrl', ['$scope', '$http', '$uibModal','$log','TeachersService', function($scope, $http, $uibModal, $log, TeachersService) {

    $scope.formData = {};
    $scope.loading = true;

    // GET =====================================================================
    // when landing on the page, get all teachers and show them
    // use the service to get all the teachers
    TeachersService.get()
        .success(function(data) {
            $scope.teachers = data;
            $scope.loading = false;
        });

    // DELETE ==================================================================
    // delete a teacher after click it
    $scope.deleteTeacher = function(id) {
        $scope.loading = true;

        TeachersService.delete(id)
            // if successful creation, call our get function to get all the new teachers
            .success(function(data) {
                $scope.loading = false;
                $scope.teachers = data; // assign our new list of teachers
            });
    };

    $scope.openAddTeacher = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'view/modal/add_teacher_modal.html',
            controller: 'addTeacherCtrl',
        });

        modalInstance.result.then(function() {
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}])