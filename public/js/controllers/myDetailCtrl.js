studentModule.controller('myDetailCtrl', ['$scope', '$rootScope', '$http', '$uibModal', '$log', '$location', '$anchorScroll', 'StudentsService', 'DocumentsService','OthersService', function($scope, $rootScope, $http, $uibModal, $log, $location, $anchorScroll, StudentsService, DocumentsService,OthersService) {

    var getMyDetail = function() {
        $scope.loading = true;
        
        StudentsService.getMyProfile()
            .success(function(data) {
                $scope.myDetail = data.result[0];
                $scope.loading = false;  
            }).error(function(err){
                console.log("no success", err);
            });
    }

    getMyDetail();

    $scope.openEditMyProfile = function() {
        var scope = $rootScope.$new();
        scope.params = {
            studentId: $rootScope.currentUser.access_id
        };
        var modalInstance = $uibModal.open({
            scope: scope,
            size: 'lg',
            animation: true,
            templateUrl: 'view/modal/edit_myprofile_modal.html',
            controller: 'editMyDetailCtrl'
        });

        modalInstance.result.then(function(data) {
            $log.info('Modal dismissed at: ' + new Date());
            getMyDetail();
        }, function(data){
        	$log.info('Modal dismissed at: ' + new Date());
            getMyDetail();
        });
    };

    //////////////////////////////////////////////////////////////////////////
    //  Attachment part
    //////////////////////////////////////////////////////////////////////////

    $scope.loading = true;
    
    $scope.myAttachments = []
        ,$scope.currentPage = 1
        ,$scope.numPerPage = 10
        ,$scope.maxSize = 5;


    var getMyAttachment = function () {
        DocumentsService.getMyAttach().then(function(data) {
            console.log("Attachments data retrieving success.");
            console.log("data : " , data);
            $scope.myAttachments = data.data.result;
            $scope.currentViewAttach = false
            $scope.loading = false;
            $scope.totalMyAttachments = $scope.myAttachments.length;
        }, function (data) {


        });
    }

    getMyAttachment();

    $scope.deleteMyAttachment = function(id) {

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
                $scope.loading = true;
                DocumentsService.deleteMyAttach(id).success(function(data) {
                    $scope.loading = false;
                    console.log(data);
                    swal("สำเร็จ!","ไฟล์ถูกลบแล้ว","success");
                }).then(function(data){
                    console.log("then", data);
                    getMyAttachment();
                }, function errorCallback(response){
                    console.log(response);
                    if(response.status == 404)
                        swal("ผิดพลาด!","ไม่มีไฟล์นี้","error");
                });
            } else {
                swal("ยกเลิก", " ","error");
            }
        });
    };

    $scope.openAddAttachment = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'view/modal/add_my_attachment_modal.html',
            controller: 'addMyAttachmentCtrl'
        });

        modalInstance.result.then(function() {
            $log.info('Modal dismissed at: ' + new Date());
            getMyAttachment();
        });
    }

    $scope.openEditAttachment = function(id) {
        console.log(id)
        var scope = $rootScope.$new();
            scope.params = {
            attachmentId: id
        };
        var modalInstance = $uibModal.open({
            scope: scope,
            animation: true,
            size: 'sm',
            templateUrl: 'view/modal/edit_my_attachment_modal.html',
            controller: 'editMyAttachmentCtrl'
        });

        modalInstance.result.then(function(data) {
            $log.info('Modal dismissed at: ' + new Date());
            console.log("data : ", data);
            if(typeof data !='undefined' && data){
                swal(data);
                console.log("call swal");
            }
            getMyAttachment();
        });
    };

    $scope.viewAttach = function(id){
        DocumentsService.findMyAttach(id).success(function(data){
            if(data.success){
                $scope.currentViewAttach = data.result[0] || data.result;
                $location.hash('detail');
                // call $anchorScroll()
                $anchorScroll();
            }
        });
    }	
}])