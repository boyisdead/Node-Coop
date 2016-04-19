documentModule.controller('documentCtrl', ['$scope','$uibModal','$log', '$location', '$anchorScroll', 'DocumentsService', function($scope,$uibModal,$log, $location, $anchorScroll, DocumentsService) {
    $scope.loading = true;
    
    $scope.students = []
        ,$scope.currentPage = 1
        ,$scope.numPerPage = 5
        ,$scope.maxSize = 5;

    var sumDocuments = function (owners) {
        var counter=0;
        for(var i=0;i<owners.length;i++){
            counter+=owners[i].documents.length;
        }
        console.log("all documents : " + counter);
        return counter;
    }


    var getDocument = function () {
        DocumentsService.get().success(function(data) {
            console.log("Documents data retrieving success.");
            console.log("data : " , data);
            $scope.documents = data.result;
            // $scope.documents = data.map(function(obj){
            //     return obj.documents;
            // });
            console.log("after map : " , $scope.documents);
            console.log("first doc : " , $scope.documents[0]);
            $scope.loading = false;
            $scope.totalDouments = $scope.documents.length;
        });
    }

    getDocument();

    $scope.deleteDocument = function(id) {

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
                DocumentsService.delete(id).success(function(data) {
                    $scope.documents = data;
                    $scope.loading = false;
                    console.log(data);
                    swal("สำเร็จ!","ไฟล์ถูกลบแล้ว","success");
                }).then(function(data){
                    console.log("then");
                    getDocument();
                });
            } else {
                swal("ยกเลิก", " ","error");
            }
        });
    };

    $scope.openAddDocument = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'view/modal/add_document_modal.html',
            controller: 'addDocumentCtrl'
        });

        modalInstance.result.then(function() {
            $log.info('Modal dismissed at: ' + new Date());
            getDocument();
        });
    }

    $scope.viewAttach = function(id){
        DocumentsService.find(id).success(function(data){
            if(data.success){
                $scope.currentViewAttach = data.result[0] || data.result;
                $location.hash('detail');
                // call $anchorScroll()
                $anchorScroll();
            }
        });
    }

}])
