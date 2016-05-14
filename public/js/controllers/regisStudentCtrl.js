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

            if($scope.formData.name.title=="นาย"){
                $scope.formData.sex = "ชาย";
            } else if ($scope.formData.name.title == "นาง" || $scope.formData.name.title == "นางสาว"){
                $scope.formData.sex = "หญิง";
            } else {
                errList += "คำนำหน้าชื่อ ไม่ถูกต้อง\n";
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
            StudentsService.regisStudent($scope.formData).then(function(data) {
                $scope.loading = false;
                    sweetAlert("เสร็จสิ้น!", "กรุณารอรับรหัสยืนยันทางอีเมล์ที่ระบุ", 'success');
                $modalInstance.close({success:true});
            }, function(data){
                console.log(data);
                if(data.status==400)
                    sweetAlert("เกิดข้อผิดพลาด!", "ข้อมูลการสมัครไม่ถูกต้อง กรุณาลองอีกครั้ง\n"+ data.data.message || data.data.error, 'error');
                else if(data.status==500)
                    sweetAlert("เกิดข้อผิดพลาด!", "เซิร์ฟเวอร์ขัดข้อง กรุณาลองอีกครั้งภายหน้า\n"+ data.data.message || data.data.error, 'error');
            });
        }
    };
    
    $scope.ok = function () {
    //can return something
    $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);