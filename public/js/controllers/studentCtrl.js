studentModule.controller('studentCtrl', ['$scope', '$rootScope', '$http', '$uibModal', '$log', '$location', '$anchorScroll', 'StudentsService', 'OthersService', function($scope, $rootScope, $http, $uibModal, $log, $location, $anchorScroll, StudentsService, OthersService) {

    var getAcaYrs = function () {
        console.log("get academic year");
        OthersService.getAcaYrs().success(function(data){
            $scope.acaYrs = data.result;
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
        $scope.currentViewStudent = false;
        StudentsService.get(acaYr)
            .success(function(data) {
                $scope.students = data.result;
                $scope.loading = false;  
            }).error(function(err){
                console.log("no success", err);
            });
    }
    getAcaYrs();
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
            closeOnCancel: false,
        }, function(isConfirm) {
            if (isConfirm) {
                $scope.loading = true;
                StudentsService.delete(id)
                    // if successful creation, call our get function to get all the new students
                    .success(function() {
                        getStudent($scope.academicYear);
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
            controller: 'addStudentCtrl'
        });

        modalInstance.result.then(function(res) {
            $log.info('Modal dismissed at: ' + new Date());
            if(res.success){
                swal("สำเร็จ!", "สร้างนักศึกษาแล้ว", "success");
            }
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
            size: 'lg',
            animation: true,
            templateUrl: 'view/modal/edit_student_modal.html',
            controller: 'editStudentCtrl'
        });

        modalInstance.result.then(function(data) {
            $log.info('Modal dismissed at: ' + new Date());
            console.log("data : ", data);
            if(typeof data !='undefined' && data){
                swal(data);
                console.log("call swal");
            }
            getStudent($scope.academicYear);
        });
    };

    $scope.openEditStudentJob = function(id) {
        var scope = $rootScope.$new();
        scope.params = {
            studentId: id
        };
        var modalInstance = $uibModal.open({
            scope: scope,
            size: 'lg',
            animation: true,
            templateUrl: 'view/modal/edit_student_job_modal.html',
            controller: 'editStudentJobCtrl'
        });

        modalInstance.result.then(function(data) {
            $log.info('Modal dismissed at: ' + new Date());
            console.log("data : ", data);
            if(typeof data !='undefined' && data){
                swal(data);
                console.log("call swal");
            }
            getStudent($scope.academicYear);
            $scope.currentViewStudent = false;
        });
    };

    $scope.openEditStudentPrefer = function(id) {
        var scope = $rootScope.$new();
        scope.params = {
            studentId: id
        };
        var modalInstance = $uibModal.open({
            scope: scope,
            size: 'lg',
            animation: true,
            templateUrl: 'view/modal/edit_student_prefer_modal.html',
            controller: 'editStudentPreferCtrl'
        });

        modalInstance.result.then(function(data) {
            $log.info('Modal dismissed at: ' + new Date());
            console.log("data : ", data);
            if(typeof data !='undefined' && data){
                swal(data);
                console.log("call swal");
            }
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
                    title : "สำเร็จ!",
                    text: "ปลดล็อคข้อมูลนักศึกษา",
                });
            }
            getStudent($scope.academicYear);
        });
    }

    $scope.viewStudent = function(id){
        StudentsService.find(id).success(function(data){
            if(data.success){
                $scope.currentViewStudent = data.result[0] || data.result;

                $location.hash('detail');

                // call $anchorScroll()
                $anchorScroll();
            }
        });
    }
}]
);
