studentModule.controller('addStudentCtrl', ['$scope', '$modalInstance','StudentsService','OthersService', function($scope, $modalInstance, StudentsService, OthersService) {

    var allowPwChange = false;

    var getTitleName = function() {
        OthersService.getTitleName().success(function(titledata){
            $scope.titleNameList = titledata;
        });
    };

    var getAdvisor = function() {
        OthersService.getAdvisor().success(function(advisors){
            $scope.advisorList = advisors;
        });
    };

    getTitleName();
    getAdvisor();

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

            if (msg.th_name_first.$error.required) {
                errList += "ชื่อภาษาไทย ไม่ถูกกรอก\n";
            }
            if (msg.th_name_last.$error.required) {
                errList += "นามสกุลภาษาไทย ไม่ถูกกรอก\n";
            }
            if (msg.en_name_first.$error.required) {
                errList += "ชื่อภาษาอังกฤษ ไม่ถูกกรอก\n";
            }
            if (msg.en_name_last.$error.required) {
                errList += "นามสกุลภาษาอังกฤษ ไม่ถูกกรอก\n";
            }

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
                console.log("aaa");
                createStudent();
            }
        }

    }

    var createStudent = function() {
        if ($scope.formData.stu_code != undefined) {
            $scope.loading = true;
            StudentsService.create($scope.formData).success(function(data) {
                $scope.loading = false;
                //upload picture here
                StudentsService.uploadPicture($scope.profile_pic,data._id).success(function(data2){
                    // some kind of alert
                    console.log(data2);
                });
                console.log($scope.formData.academic_year);
                $modalInstance.close($scope.formData.academic_year);
            });
        }
    };

    $scope.sexChange = function () {
        if ($scope.formData.title._id == 1)
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