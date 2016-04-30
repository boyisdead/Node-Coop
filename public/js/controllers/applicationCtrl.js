applicationModule.controller('applicationCtrl', ['$scope', '$rootScope','$uibModal', '$log' ,'ApplicationsService', function($scope, $rootScope, $uibModal, $log, ApplicationsService){
    
    $scope.applications = []
        ,$scope.currentPage = 1
        ,$scope.numPerPage = 10
        ,$scope.maxSize = 5;


    var getApplication = function () {
        $scope.loading = true;
        ApplicationsService.get().success(function(data) {
            console.log("applications data retrieving success.");
            console.log(data);
            $scope.applications = data.result;
            $scope.loading = false;
        });
    }

    $scope.sortField = "company.name";
    getApplication();

    $scope.order = function (field){
        $scope.sortField = field;
        $scope.reverse = ($scope.sortField === field) ? !$scope.reverse : false;
    }

    $scope.deleteApplication = function(id) {
        //sweet alert here
        swal({
            title: "คุณแน่ใจหรือ?",
            text: "การกระทำนี้ไม่สามารถกู้ข้อมูลคืนได้",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "ใช่, ลบเอกสารนี้!",
            cancelButtonText: "ยกเลิก",
            closeOnConfirm: false,
            closeOnCancel:false,
            html: false
        }, function(isConfirm){
            if(isConfirm) {
                ApplicationsService.delete(id).success(function(data) {
                    console.log(data);
                    if(data.success)
                    	swal("สำเร็จ!","ไฟล์ถูกลบแล้ว","success");
                    else
                    	swal("ล้มเหลว!", data,"error");
                }).then(function(data){
                    console.log("then");
                    getApplication();
                });
            } else {
                swal("ยกเลิก", " ","error");
            }
        });
    };

    $scope.openAddApplication = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'view/modal/add_application_modal.html',
            controller: 'addApplicationCtrl'
        });

        modalInstance.result.then(function() {
            $log.info('Modal dismissed at: ' + new Date());
            getApplication();
        });
    }

    $scope.openEditApplication = function(id) {
        var scope = $rootScope.$new();
            scope.params = {
            application_id: id
        };
        var modalInstance = $uibModal.open({
            scope: scope,
            animation: true,
            templateUrl: 'view/modal/edit_application_modal.html',
            controller: 'editApplicationCtrl'
        });

        modalInstance.result.then(function() {
            $log.info('Modal dismissed at: ' + new Date());
            getApplication();
        });
    }


}])