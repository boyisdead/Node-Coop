applicationModule.controller('editApplicationCtrl', ['$scope','$modalInstance', 'ApplicationsService', 'OthersService', function($scope, $modalInstance, ApplicationsService, OthersService){
	
	$scope.getApplicationData = function() {
        console.log($scope.params.application_id);
        ApplicationsService.find($scope.params.application_id).success(function(data) {
            $scope.formData = data.result[0];
        });
    }

    var getCompanyName = function() {
        OthersService.getCompany().success(function(data){
            $scope.companyList = data.result;
        });
    };

    $scope.openApplyDate = function() {
        $scope.apply_date_popup = true;
    };

    $scope.openReplyDate = function() {
        $scope.reply_date_popup = true;
    };

    var updateApplication = function() {
        console.log("Updating...", $scope.formData);
        ApplicationsService.update($scope.formData).success(function(data) {
            swal({
                title: "บันทึก!",
                type: "success",
                confirmButtonText: "ปิด"
            });
            $modalInstance.close();
        });
    };

    $scope.getApplicationData();
    getCompanyName();
    $scope.apply_date_popup = false;
    $scope.reply_date_popup = false;
    $scope.dateOption = {
        "placement":"top-right" 
    }

    $scope.validateForm = function (msg) {
        if (typeof $scope.formData != 'undefined') {
            updateApplication();
        }
    }


    $scope.ok = function() {
        //can return something
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}])