teacherModule.controller('teacherCtrl', ['$scope', '$uibModal','$log','TeachersService', function($scope, $uibModal, $log, TeachersService) {

    $scope.loading = true;

    $scope.teachers = []
        ,$scope.currentPage = 1
        ,$scope.numPerPage = 10
        ,$scope.maxSize = 5;

    // GET =====================================================================
    // when landing on the page, get all teachers and show them

    var getTeacher = function () {
        TeachersService.get().success(function(data) {
            $scope.teachers = data;
            $scope.loading = false;
            console.log($scope.teachers);
        });
    } 

    getTeacher();

    // DELETE ==================================================================
    // delete a teacher after click it
    $scope.deleteTeacher = function(id) {

        swal({
            title: "คุณแน่ใจหรือ?",
            text: "การกระทำนี้ไม่สามารถกู้ข้อมูลคืนได้",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "ใช่, ลบข้อมูลอาจารย์นี้!",
            cancelButtonText: "ยกเลิก",
            closeOnConfirm: false,
            closeOnCancel: false,
            html: false
        }, function(isConfirm){
            if(isConfirm) {
                $scope.loading = true;
                TeachersService.delete(id).success(function(data) {
                    $scope.loading = false;
                    $scope.teachers = data; // assign our new list of teachers
                });
                swal("ลบ!","ข้อมูลนี้ถูกลบออกแล้ว","success");
            } else {
                swal("ยกเลิก", " ","error");
            }
        });
    };

    $scope.openAddTeacher = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'view/modal/add_teacher_modal.html',
            controller: 'addTeacherCtrl',
        });

        modalInstance.result.then(function() {
            $log.info('Modal dismissed at: ' + new Date());
            getTeacher();
        });
    };
}])