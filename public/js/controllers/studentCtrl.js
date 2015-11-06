studentModule.controller('studentCtrl', ['$scope', '$http', '$uibModal','$log','StudentsService', function($scope, $http, $uibModal, $log, StudentsService) {

    $scope.loading = true;

    $scope.students = []
        ,$scope.currentPage = 1
        ,$scope.numPerPage = 10
        ,$scope.maxSize = 5;

    // GET =====================================================================
    // when landing on the page, get all students and show them
    // use the service to get all the students
    var getStudent = function () {
        StudentsService.get()
        .success(function(data) {
            $scope.students = data;
            $scope.loading = false;
        });
    }

    getStudent();
    

    // DELETE ==================================================================
    // delete a student after click it
    $scope.deleteStudent = function(id) {

        //sweet alert here
        swal({
            title: "คุณแน่ใจหรือ?",
            text: "การกระทำนี้ไม่สามารถกู้ข้อมูลคืนได้",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "ใช่, ลบข้อมูลนักเรียนนี้!",
            cancelButtonText: "ยกเลิก",
            closeOnConfirm: false,
            closeOnCancel:false,
            html: false
        }, function(isConfirm){
            if(isConfirm) {
                $scope.loading = true;
                StudentsService.delete(id)
                // if successful creation, call our get function to get all the new students
                .success(function(data) {
                    $scope.loading = false;
                    $scope.students = data; // assign our new list of students
                });
                swal("ลบ!","ข้อมูลนักศึกษานี้ถูกลบออกแล้ว","success");
            } else {
                swal("ยกเลิก", "","error");
            }
        });
    };

    $scope.openAddStudent = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'view/modal/add_student_modal.html',
            controller: 'addStudentCtrl',
            size: 'lg'
        });

        modalInstance.result.then(function() {
            $log.info('Modal dismissed at: ' + new Date());
            getStudent();
        });
    };
}]);
