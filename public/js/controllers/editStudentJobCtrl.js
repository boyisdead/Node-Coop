studentModule.controller('editStudentJobCtrl', ['$scope', '$modalInstance', 'StudentsService', 'OthersService', function($scope, $modalInstance, StudentsService, OthersService) {

    $scope.getStudentData = function() {
        StudentsService.find($scope.params.studentId).success(function(data) {
            $scope.formData = data.result[0];
            if(!!$scope.formData.job)
                $scope.welfares = $scope.formData.job.welfares.toString();
        });
    }

    var getAdvisor = function() {
        OthersService.getAdvisor().success(function(advisors) {
            $scope.advisorList = advisors.result;
        });
    };

    var getCompanyName = function() {
        OthersService.getCompany().success(function(data){
            $scope.companyList = data.result;
        });
    };

    $scope.openReportDate = function() {
        $scope.report_date_popup = true;
    };

    $scope.openLaunchDate = function() {
        $scope.launch_date_popup = true;
    };

    $scope.openFinishDate = function() {
        $scope.finish_date_popup = true;
    };

    $scope.report_date_popup = false;
    $scope.launch_date_popup = false;
    $scope.finish_date_popup = false;

    $scope.dateOption = {
        "popup-placement":"top-right" 
    }

    getAdvisor();
    getCompanyName();
    $scope.getStudentData();

    $scope.validateJobForm = function(msg) {
        var errList = "";
        if (typeof $scope.formData != 'undefined') {

            if (msg.company.$error.required) {
                errList += "ชื่อสถานประกอบการ ไม่ถูกกรอก\n";
            }
            if (errList != "") {
                sweetAlert("ฟอร์มไม่ถูกต้อง!", errList, 'error');
            } else {
                updateStudent();
            }
        }
    }

    var updateStudent = function() {
        console.log("Updating...");
        $scope.formData.job.welfares = $scope.welfares.split(",");
        for (var i = 0; i <  $scope.formData.job.welfares.length; i++)
            $scope.formData.job.welfares[i] =  $scope.formData.job.welfares[i].trim();
        StudentsService.update($scope.formData).success(function(data) {
            swal({
                title: "บันทึก!",
                type: "success",
                confirmButtonText: "ปิด"
            });
            $modalInstance.close();
        });
    };

    $scope.ok = function() {
        //can return something
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

}]);
