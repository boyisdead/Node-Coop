companyModule.controller('companyCtrl', ['$scope', '$rootScope','$uibModal', '$log','CompaniesService', function($scope, $rootScope, $uibModal, $log, CompaniesService){
    
    $scope.companies = []
        ,$scope.currentPage = 1
        ,$scope.numPerPage = 10
        ,$scope.maxSize = 5;


    var getCompany = function () {
        $scope.loading = true;
        CompaniesService.get().success(function(data) {
            console.log("Companies data retrieving success.");
            console.log(data);
            $scope.companies = data;
            $scope.loading = false;
        });
    }

    getCompany();

    $scope.deleteCompany = function(id) {

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
                CompaniesService.delete(id).success(function(data) {
                    console.log(data);
                    if(data.success)
                    	swal("สำเร็จ!","ไฟล์ถูกลบแล้ว","success");
                    else
                    	swal("ล้มเหลว!", data,"error");
                }).then(function(data){
                    console.log("then");
                    getCompany();
                });
            } else {
                swal("ยกเลิก", " ","error");
            }
        });
    };

    $scope.openAddCompany = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'view/modal/add_company_modal.html',
            controller: 'addCompanyCtrl'
        });

        modalInstance.result.then(function() {
            $log.info('Modal dismissed at: ' + new Date());
            getCompany();
        });
    }


}])