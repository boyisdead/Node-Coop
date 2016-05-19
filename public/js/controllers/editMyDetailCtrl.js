studentModule.controller('editMyDetailCtrl', ['$scope', '$modalInstance', 'StudentsService', 'OthersService', function($scope, $modalInstance, StudentsService, OthersService) {

    $scope.getMyDetail = function() {
        StudentsService.getMyProfile().success(function(data) {
            $scope.formData = data.result[0];
            $scope.profile_pic =  $scope.formData.profile_pic;
        });
    }

    var getTitleName = function() {
        OthersService.getTitleName().success(function(titledata) {
            $scope.titleNameList = titledata.result;
        });
    };

    var getCompanyName = function() {
        OthersService.getCompany().success(function(data){
            $scope.companyList = data.result;
        });
    };

    $scope.addAptitude = function (item) {
        item = item || {};
        if(item.subject && item.level)
            $scope.formData.aptitudes.push(item);
        $scope.newAptitude = {};
    }

    $scope.removeAptitude = function (index) {
        if(index>-1)
        $scope.formData.aptitudes.splice(index, 1);
    }

    getTitleName();
    getCompanyName();
    $scope.getMyDetail();

    $scope.validateProfileForm = function(msg) {
        var errList = "";
        if (typeof $scope.formData != 'undefined') {

            if (msg.s_fname.$error.required) {
                errList += "ชื่อนักศึกษา ไม่ถูกกรอก\n";
            }
            if (msg.s_lname.$error.required) {
                errList += "นามสกุลนักศึกษา ไม่ถูกกรอก\n";
            }
            if (msg.acaYr.$error.required) {
                errList += "ปีที่สมัคร ไม่ถูกกรอก\n";
            }
            if (msg.gpa.$error.required) {
                errList += "เกรดเฉลี่ย ไม่ถูกกรอก\n";
            }
            if (msg.email.$error.required) {
                errList += "อีเมล์นักศึกษา ไม่ถูกกรอก\n";
            }
            if (errList != "") {
                errorWarning(errList);
            } else {
                if($scope.profile_pic && typeof $scope.profile_pic!='undefined'){
                    uploadPicture();
                }
                updateStudent($scope.formData, false);
            }
        }
    }

    $scope.validateAptitudeForm = function(msg) {
        updateStudent({aptitudes : $scope.formData.aptitudes}, false);
    }

    $scope.validatePreferForm = function(msg) {
        var errList = "";
        if (typeof $scope.formData != 'undefined') {

            if (!($scope.formData.prefered_company.first|| $scope.formData.prefered_company.second|| $scope.formData.prefered_company.third)) {
                errList += "ต้องเลือกสถานประกอบการอย่างน้อย 1 แห่ง\n";
            }
            if (errList != "") {
                errorWarning(errList);
            } else {
                updateStudent({prefered_company : $scope.formData.prefered_company}, false);
            }
        }
    }

    $scope.validateEmcForm = function(msg) {
        var errList = "";
        if (typeof $scope.formData != 'undefined') {

            if (msg.em_ะname.$error.required) {
                errList += "คำนำหน้าชื่อผู้ติดต่อ ไม่ถูกกรอก\n";
            }
            if (msg.em_fname.$error.required) {
                errList += "ชื่อผู้ติดต่อ ไม่ถูกกรอก\n";
            }
            if (msg.em_lname.$error.required) {
                errList += "นามสกุลผู้ติดต่อ ไม่ถูกกรอก\n";
            }
            if (msg.em_relate.$error.required) {
                errList += "ความเกี่ยวข้องกับผู้ติดต่อ ไม่ถูกกรอก\n";
            }
            if (msg.em_tel.$error.required) {
                errList += "เบอร์โทรศัพท์ผู้ติดต่อ ไม่ถูกกรอก\n";
            }
            if (errList != "") {
                errorWarning(errList);
            } else {
                updateStudent({emergency_contact : $scope.formData.emergency_contact}, false);
            }
        }
    }

    $scope.validateForm = function(msg) {
        var errList = "";
        if (typeof $scope.formData != 'undefined') {

            if (msg.s_fname.$error.required) {
                errList += "ชื่อนักศึกษา ไม่ถูกกรอก\n";
            }
            if (msg.s_lname.$error.required) {
                errList += "นามสกุลนักศึกษา ไม่ถูกกรอก\n";
            }
            if (msg.acaYr.$error.required) {
                errList += "ปีที่สมัคร ไม่ถูกกรอก\n";
            }
            if (msg.email.$error.required) {
                errList += "อีเมล์นักศึกษา ไม่ถูกกรอก\n";
            }
            if (msg.em_fname.$error.required) {
                errList += "ชื่อผู้ติดต่อ ไม่ถูกกรอก\n";
            }
            if (msg.em_lname.$error.required) {
                errList += "นามสกุลผู้ติดต่อ ไม่ถูกกรอก\n";
            }
            if (msg.em_relate.$error.required) {
                errList += "ความเกี่ยวข้องกับผู้ติดต่อ ไม่ถูกกรอก\n";
            }
            if (msg.em_tel.$error.required) {
                errList += "เบอร์โทรศัพท์ผู้ติดต่อ ไม่ถูกกรอก\n";
            }
            if (!($scope.formData.prefered_company.first|| $scope.formData.prefered_company.second|| $scope.formData.prefered_company.third)) {
                errList += "ต้องเลือกสถานประกอบการอย่างน้อย 1แห่ง\n";
            }
            if (errList != "") {
                errorWarning(errList);
            } else {
                if($scope.profile_pic&& typeof $scope.profile_pic!='undefined'){
                    uploadPicture();
                }
                updateStudent($scope.formData, true);
            }
        }
    }

    var errorWarning = function (errList){
        if (errList != "") 
            sweetAlert("ฟอร์มไม่ถูกต้อง!", errList, 'error');
    } 

    var uploadPicture = function () {
        StudentsService.updateMyPicture($scope.profile_pic).success(function(data){
        // some kind of alert
            console.log(data);
        });
    }

    var updateStudent = function(updateData, modalClose) {
        console.log("Updating...");
        StudentsService.updateMyProfile(updateData).then(function(data) {
            swal({
                title: "บันทึก!",
                type: "success",
                confirmButtonText: "ปิด"
            });
            if(modalClose) $modalInstance.close();
        }, function (resp){
            console.log(resp);
        });
    };

    $scope.changPw = function(passwordData, id) {
        console.log("chng pw", passwordData, id);
        if (passwordData.newPassword == passwordData.password_confirm) {
            StudentsService.pwChange(passwordData, id).success(function(data) {
                if(data.success) { 
                    swal({
                        title: "ดำเนินการ!",
                        text: "รหัสผ่านถูกเปลี่ยนแล้ว",
                        type: "success",
                        confirmButtonText: "ปิด"
                    });
                } else {
                    swal({
                        title: "ล้มเหลว!",
                        text: data.reason + '(' + data.err_code + ')',
                        type: "error",
                        confirmButtonText: "ปิด"
                    });
                }
            });
        } else {
            swal({
                title: "ล้มเหลว!",
                text: "การยืนยันรหัสผ่านไม่ถูกต้อง!",
                type: "error",
                confirmButtonText: "ปิด"
            });
        }
    }

    $scope.ok = function() {
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

}]);
