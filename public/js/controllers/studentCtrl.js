studentModule.controller('studentCtrl', ['$scope', '$rootScope', '$http', '$uibModal', '$log', 'StudentsService', 'OthersService', function($scope, $rootScope, $http, $uibModal, $log, StudentsService, OthersService) {

    var getAcaYrs = function () {
        OthersService.getAcaYrs().success(function(data){
            $scope.acaYrs = data;
            $scope.acaYrs.sort(function(a,b){return b-a});
            $scope.acaYrs.splice(0,0,"ทั้งหมด");
            console.log($scope.acaYrs);
            if(typeof $scope.academicYear == 'undefined')
                $scope.academicYear = $scope.acaYrs[1];
            getStudent($scope.academicYear);
        });
    }

    $scope.students = [], $scope.currentPage = 1, $scope.numPerPage = 10, $scope.maxSize = 5;

    // GET =====================================================================
    // when landing on the page, get all students and show them
    // use the service to get all the students
    var getStudent = function(acaYr) {
        $scope.loading = true;
        StudentsService.get(acaYr)
            .success(function(data) {
                $scope.students = data;
                $scope.loading = false;
        });
    }

    getAcaYrs();

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
            closeOnCancel: false,
            html: false
        }, function(isConfirm) {
            if (isConfirm) {
                $scope.loading = true;
                StudentsService.delete(id)
                    // if successful creation, call our get function to get all the new students
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.students = data; // assign our new list of students
                    });
                swal("ลบ!", "ข้อมูลนักศึกษานี้ถูกลบออกแล้ว", "success");
            } else {
                swal("ยกเลิก", "", "error");
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

        modalInstance.result.then(function(newCreateYr) {
            $log.info('Modal dismissed at: ' + new Date());
            console.log(newCreateYr);
            $scope.academicYear = newCreateYr;
            getAcaYrs();
        });
    };

    $scope.openEditStudent = function(id) {
        var scope = $rootScope.$new();
        scope.params = {
            studentId: id
        };
        var modalInstance = $uibModal.open({
            scope: scope,
            animation: true,
            templateUrl: 'view/modal/edit_student_modal.html',
            controller: 'editStudentCtrl',
            size: 'lg'
        });

        modalInstance.result.then(function() {
            $log.info('Modal dismissed at: ' + new Date());
            getStudent($scope.academicYear);
        });
    };

    $scope.openEditAcademicYear = function() {
        console.log("open modal");
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'view/modal/edit_acayr_modal.html',
            controller: 'changeAcaYrCtrl',
            size: 'sm',
            resolve: {
                items: function() {
                    return $scope.acaYrs;
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.academicYear = selectedItem;
            $log.info('Modal dismissed at: ' + new Date());
            getStudent($scope.academicYear);
            console.log($scope.academicYear);
            console.log($scope.acaYrs);
        });
    }

    $scope.unlockProfile = function(id){
        StudentsService.unlockProfile(id).success(function(data){
            if(data.success) {
                swal({
                    type: 'success',
                    title : "Unlock!"
                });
            }
            getStudent($scope.academicYear);
        });
    }
}]);
