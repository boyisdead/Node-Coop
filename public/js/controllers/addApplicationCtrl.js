applicationModule.controller('addApplicationCtrl', ['$scope','$modalInstance', 'ApplicationsService', 'StudentsService', 'OthersService', function($scope, $modalInstance, ApplicationsService, StudentsService, OthersService){
	
    $scope.formData = {};
    $scope.formData.attachments = [];
    $scope.showAttach = [];

    var getCompanyName = function() {
        OthersService.getCompany().success(function(data){
            $scope.companyList = data.result;
        });
    };

    var getStudentData = function() {
        StudentsService.get().success(function(data) {
            $scope.studentList = data.result;
            console.log("student: ", $scope.studentList)
        });
    }

    $scope.openApplyDate = function() {
        $scope.apply_date_popup = true;
    };

    $scope.openReplyDate = function() {
        $scope.reply_date_popup = true;
    };

    getCompanyName();
    getStudentData();
    $scope.apply_date_popup = false;
    $scope.reply_date_popup = false;

    $scope.dateOption = {
        "popup-placement":"top-right" 
    }

    $scope.addAttach = function (item) {
        delete $scope.newAttach;
        $scope.formData.attachments.push(item._id);
        $scope.showAttach.push(item.file_name);
    }

    $scope.removeAttach = function (index) {
        $scope.formData.attachments.splice(index, 1);
        $scope.showAttach.splice(index, 1);
    }

    $scope.getStudentAttach = function(id) {
        StudentsService.getStudentAttachment(id).success(function(data) {
            $scope.attachList = data.result;
        });
    }

    var createApplication = function() {
        console.log("Creating...", $scope.formData);
        ApplicationsService.create($scope.formData).success(function(data) {
            swal({
                title: "บันทึก!",
                type: "success",
                confirmButtonText: "ปิด"
            });
            $modalInstance.close();
        });
    };

    $scope.validateForm = function (msg) {

        var errList = "";
        if (typeof $scope.formData != 'undefined') {

            if (msg.student.$error.required) {
                errList += "นักศึกษา ไม่ถูกกรอก\n";
            }
            if (msg.company.$error.required) {
                errList += "ชื่อสถานประกอบ ไม่ถูกกรอก\n";
            }
            if (msg.apply_date.$error.required) {
                errList += "วันที่ส่งใบสมัคร ไม่ถูกกรอก\n";
            }
            if (errList != "") {
                sweetAlert("ฟอร์มไม่ถูกต้อง!", errList, 'error');
            } else {
                createApplication();
            }
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