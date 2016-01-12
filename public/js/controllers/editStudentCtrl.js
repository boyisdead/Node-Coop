studentModule.controller('editStudentCtrl', ['$scope', '$modalInstance', 'StudentsService', 'OthersService', function($scope, $modalInstance, StudentsService, OthersService) {

    $scope.getStudentData = function() {
        StudentsService.find($scope.params.studentId, 'i').success(function(data) {
            $scope.formData = data;
        });
    }

    var getTitleName = function() {
        OthersService.getTitleName().success(function(titledata) {
            $scope.titleNameList = titledata;
        });
    };
    var getAdvisor = function() {
        OthersService.getAdvisor().success(function(advisors) {
            $scope.advisorList = advisors;
        });
    };

    getTitleName();
    getAdvisor();
    $scope.getStudentData();

    $scope.validateForm = function(msg) {
        var errList = "";
        if (typeof $scope.formData != 'undefined') {

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
            // // advisor remove
            // if (msg.advisor.$error.required) {
            //     errList += "รหัสอาจารย์ที่ปรึกษา ไม่ถูกกรอก\n";
            // }

            if (errList != "") {
                sweetAlert("ฟอร์มไม่ถูกต้อง!", errList, 'error');
            } else {
                console.log("aaa");
                updateStudent();
            }
        }

    }

    var updateStudent = function() {
        console.log("Updating...");
        StudentsService.update($scope.formData).success(function(data) {
            swal({
                title: "บันทึก!",
                type: "success",
                confirmButtonText: "ปิด"
            });
            $modalInstance.close();
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

    $scope.lockStudent = function (id) {
        var msg;
        swal({
            title:"ล็อคข้อมูล",
            text:"ข้อมูลนักศึกษาจะถูกตรวจสอบความครบถ้วนเพื่อยืนยันสถานะ",
            type:"warning",
            showCancelButton: true,   
            confirmButtonText: "ตรวจสอบและล็อคข้อมูลนี้",   
            cancelButtonText: "ยกเลิก",
            closeOnConfirm: false,
            closeOnCancel: false
        },function(isConfirm){
            if(isConfirm){
                StudentsService.lockProfile(id).success(function(data){
                    if(data.success){
                        msg = {
                            title:"สำเร็จ!",
                            text:"ข้อมูลนี้ถูกตรวจสอบและล็อคแล้ว",
                            type:"success",
                            confirmButtonText:"ปิด"
                        };
                    } else {
                        msg = {
                            title:"ล้มเหลว!",
                            text:"มีบางอย่างผิดพลาด",
                            type:"error",
                            confirmButtonText:"ปิด"
                        };
                    }
                    $modalInstance.close(msg);
                });
            } else {
                msg = {
                    title:"ยกเลิก!",
                    text:"",
                    type:"error",
                    confirmButtonText:"ปิด"
                };
                $modalInstance.close(msg);
            }
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
