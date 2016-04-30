studentModule.controller('regisStudentCtrl', ['$scope', '$modalInstance','StudentsService','OthersService', function($scope, $modalInstance, StudentsService, OthersService) {


    var getTitleName = function() {
        OthersService.getTitleName().success(function(titledata){
            $scope.titleNameList = titledata.result;
        });
    };

    getTitleName();

    $scope.validateForm = function(msg) {
        var errList = "";
        if (typeof $scope.formData != 'undefined') {

            if (msg.acaYr.$error.required) {
                errList += "ปีที่สมัคร ไม่ถูกกรอก\n";
            }

            if (msg.scode.$error.required) {
                errList += "รหัสประจำตัว ไม่ถูกกรอก\n";
            } else if (msg.scode.$error.minlength) {
                errList += "รหัสประจำตัว สั้นเกินไป\n";
            }

            if (msg.tname.$error.required) {
                errList += "คำนำหน้าชื่อ ไม่ถูกเลือก\n";
            }

            if (msg.first_name.$error.required) {
                errList += "ชื่อ ไม่ถูกกรอก\n";
            }
            if (msg.last_name.$error.required) {
                errList += "นามสกุล ไม่ถูกกรอก\n";
            }
            if (msg.gpa.$error.required) {
                errList += "เกรดเฉลี่ย ไม่ถูกกรอก\n";
            } else if(gpa>4.00||gpa<1.5)
                errList += "เกรดเฉลี่ย ไม่ถูกต้อง"

            if (msg.conMail.$error.required) {
                errList += "ปีที่สมัคร ไม่ถูกกรอก\n";
            } else if(msg.conMail.$error.email){
                errList += "รูปแบบอีเมล์ไม่ถูกต้อง\n";
            }
            // // advisor  remove
            // if (msg.advisor.$error.required) {
            //     errList += "รหัสอาจารย์ที่ปรึกษา ไม่ถูกกรอก\n";
            // }

            if (msg.password.$error.required) {
                errList += "รหัสผ่าน ไม่ถูกกรอก\n";
            } else if (msg.password.$error.minlength) {
                errList += "รหัสผ่านสั้นเกินไป\n";
            }

            if ($scope.formData.password != $scope.formData.password_confirm) {
                errList += "การยืนยันรหัสผ่านไม่ถูกต้อง\n";
            }

            if (errList != "") {
                sweetAlert("ฟอร์มไม่ถูกต้อง!", errList, 'error');
            } else {
                regisStudent();
            }
        }

    }

    var regisStudent = function() {
        if ($scope.formData._id != undefined) {
            $scope.loading = true;
            StudentsService.regisStudent($scope.formData).success(function(data) {
                $scope.loading = false;
                $modalInstance.close({success:true});
            });
        }
    };

    $scope.sexChange = function () {
        if ($scope.formData.name.title._id == 1)
            $scope.formData.sex = "ชาย";
        else 
            $scope.formData.sex = "หญิง";
    }

    $scope.ok = function () {
    //can return something
    $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);