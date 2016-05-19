studentModule.controller('editStudentCtrl', ['$scope', '$modalInstance', 'StudentsService', 'OthersService', function($scope, $modalInstance, StudentsService, OthersService) {

    $scope.getStudentData = function() {
        StudentsService.find($scope.params.studentId).success(function(data) {
            $scope.formData = data.result[0];
        });
    }

    var getTitleName = function() {
        OthersService.getTitleName().success(function(titledata) {
            $scope.titleNameList = titledata.result;
        });
    };
    // var getAdvisor = function() {
    //     OthersService.getAdvisor().success(function(advisors) {
    //         $scope.advisorList = advisors.result;
    //     });
    // };

    getTitleName();
    // getAdvisor();
    $scope.getStudentData();

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
                updateStudent({
                    _id : $scope.formData._id,
                    name: $scope.formData.name, 
                    contact: $scope.formData.contact,
                    gpa: $scope.formData.gpa,
                    academic_year : $scope.formData.academic_year
                }, false);
            }
        }
    }

    $scope.validateEmcForm = function(msg) {
        var errList = "";
        if (typeof $scope.formData != 'undefined') {

            if (msg.em_tname.$error.required) {
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
                updateStudent({_id: $scope.formData._id ,emergency_contact : $scope.formData.emergency_contact}, false);
            }
        }
    }

    var updateStudent = function(updateData, modalClose) {
        console.log("Updating..."); 
        StudentsService.update(updateData).then(function(data) {
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

    var uploadPicture = function () {
        StudentsService.uploadPicture($scope.profile_pic, $scope.formData._id).success(function(data){
        // some kind of alert
            console.log(data);
        });
    }

    $scope.changPw = function(passwordData, id) {
        console.log("chng pw", passwordData, id);
        if (passwordData.newPassword == passwordData.password_confirm) {
            StudentsService.update({_id: id, password: passwordData.newPassword }).success(function(data) {
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
                    $modalInstance.close();
            });
        } else {
            swal({
                title: "การยืนยันรหัสผ่านไม่ถูกต้อง!",
                type: "error",
                confirmButtonText: "ปิด"
            });
        }
    }

    var errorWarning = function (errList){
        if (errList != "") 
            sweetAlert("ฟอร์มไม่ถูกต้อง!", errList, 'error');
    } 

    $scope.ok = function() {
        //can return something
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

}]);
