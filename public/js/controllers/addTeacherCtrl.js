teacherModule.controller('addTeacherCtrl', ['$scope', '$modalInstance', 'TeachersService', 'OthersService', function($scope, $modalInstance, TeachersService, OthersService) {

    var getTitleName = function() {
        OthersService.getTitleName().success(function(titledata) {
            $scope.titleNameList = titledata;
            console.log($scope.titleNameList[0].title_th);
        });
    };
    var getAcadePos = function() {
        OthersService.getAcadePos().success(function(posdata) {
            $scope.acadePosList = posdata;
        });
    };

    getAcadePos();
    getTitleName();
    var formData = {};

    $scope.sexChange = function() {
        if ($scope.formData.title._id == 1)
            $scope.formData.sex = "ชาย";
        else
            $scope.formData.sex = "หญิง";
    }

    $scope.validateForm = function(msg) {
        var errList = "";
        if (typeof $scope.formData != 'undefined') {
            if (msg.staffCode.$error.required) {
                errList += "รหัสประจำตัว ไม่ถูกกรอก\n";
            } else if (msg.staffCode.$error.minlength) {
                errList += "รหัสประจำตัว สั้นเกินไป\n";
            }

            if (msg.titleName.$error.required) {
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

            if (msg.acaPos.$error.required) {
                errList += "ตำแหน่งทางวิชาการ ไม่ถูกกรอก\n";
            }

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
                createTeacher();
            }
        }

    }


    var showAlert = function(message) {
        sweetAlert("ฟอร์มไม่ถูกต้อง!", message, 'error');
    }


    var createTeacher = function() {
        $scope.loading = true;
        TeachersService.create($scope.formData).success(function(data) {
            sweetAlert("สำเร็จ", "อาจารย์" + $scope.formData.name.f_th + " ถูกเพิ่มแล้ว", "success");
            $scope.loading = false;
            $modalInstance.close();
        });
    }

    $scope.ok = function() {
        //can return something
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

}]);
