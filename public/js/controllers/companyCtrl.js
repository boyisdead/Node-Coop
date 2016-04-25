companyModule.controller('companyCtrl', ['$scope', '$rootScope','$uibModal', '$log' , '$location', '$anchorScroll', 'CompaniesService', function($scope, $rootScope, $uibModal, $log, $location, $anchorScroll, CompaniesService){
    
    $scope.companies = []
        ,$scope.currentPage = 1
        ,$scope.numPerPage = 10
        ,$scope.maxSize = 5;


    var getCompany = function () {
        $scope.loading = true;
        CompaniesService.get().success(function(data) {
            console.log("Companies data retrieving success.");
            console.log(data);
            $scope.companies = data.result;
            $scope.currentViewCompany = false;
            $scope.loading = false;
        });
    }

    $scope.viewCompany = function(id){
        CompaniesService.find(id).success(function(data){
            console.log("view: ",data, data.success)
            if(data.success){
                $scope.currentViewCompany = data.result[0] || data.result;
                console.log("view: ",$scope.currentViewCompany )
                $location.hash('detail');
                $anchorScroll();
            }
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

    $scope.openEditCompany = function(id) {
        var scope = $rootScope.$new();
            scope.params = {
            company_id: id
        };
        var modalInstance = $uibModal.open({
            scope: scope,
            animation: true,
            templateUrl: 'view/modal/edit_company_modal.html',
            controller: 'editCompanyCtrl'
        });

        modalInstance.result.then(function() {
            $log.info('Modal dismissed at: ' + new Date());
            getCompany();
        });
    }

    $scope.openEditCompanyContact = function(id) {
        var scope = $rootScope.$new();
            scope.params = {
            company_id: id
        };
        var modalInstance = $uibModal.open({
            scope: scope,
            animation: true,
            templateUrl: 'view/modal/edit_company_contact_modal.html',
            controller: 'editCompanyCtrl'
        });

        modalInstance.result.then(function() {
            $log.info('Modal dismissed at: ' + new Date());
            getCompany();
        });
    }

    $scope.openEditCompanyCoordinator = function(id) {
        var scope = $rootScope.$new();
            scope.params = {
            company_id: id
        };
        var modalInstance = $uibModal.open({
            scope: scope,
            animation: true,
            templateUrl: 'view/modal/edit_company_coordinator_modal.html',
            controller: 'editCompanyCtrl'
        });

        modalInstance.result.then(function() {
            $log.info('Modal dismissed at: ' + new Date());
            getCompany();
        });
    }


}])