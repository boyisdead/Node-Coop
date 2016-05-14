authenticationModule.controller('loginCtrl', ['$scope', '$rootScope', '$cookies', 'jwtHelper', '$uibModal','$log', 'UsersService', function($scope, $rootScope, $cookies, jwtHelper, $uibModal,$log, UsersService) {

    $scope.status = {
        isopen : false
    };

    // $scope.toggleDropdown = function() {
    //     $scope.status.isopen = !$scope.status.isopen;
    // };

    $scope.openRegis = function (){
    	var modalInstance = $uibModal.open({
    		animation: true,
    		templateUrl: 'view/modal/register_modal.html',
    		controller: 'regisStudentCtrl',
    		size: 'md'
    	});
        modalInstance.result.then(function() {
            $log.info('Modal dismissed at: ' + new Date());        });
    };

    $scope.openActivate = function (){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'view/modal/activate_modal.html',
            controller: 'activateCtrl',
            size: 'md'
        });
        modalInstance.result.then(function() {
            $log.info('Modal dismissed at: ' + new Date());        });
    };

    var alreadyLogin;
    if (typeof $rootScope.currentUser != 'undefined')
        alreadyLogin = true;

    $scope.loginVerify = function(item, type) {
        console.log(item, type)
        var errList = "";
        if (item) {
            if (type == '' || type == null) {
                errList += "กรุณาเลือกประเภทผู้ใช้"
            } 
            if(errList != ""){
                swal("ล้มเหลว!", errList, "error")
            } else {
                identifyUser(item, type);
            }
        } else {
            swal("ล้มเหลว!", "กรุณากรอกข้อมูล","error")
        }

    }

    var identifyUser = function(item, type) {
        if (!alreadyLogin) {
            if (item && type) {
                UsersService.get(item, type)
                    .then(function(data) {
                        console.log(data.data);
                        $cookies.put('tokenJWT', data.data.result.token);
                        var tokenPayload = jwtHelper.decodeToken(data.data.result.token);
                        $rootScope.currentUser = tokenPayload;
                        swal({
                            title: "สวัสดี"+$rootScope.currentUser.display_name,
                            type: "success",
                            confirmButtonText: "ปิด"
                        });
                    }, function(data){
                        if(data.status == 401)
                            swal({
                                title: "ล้มเหลว!",
                                text: "ชื่อบัญชีหรือรหัสผ่านไม่ถูกต้อง",
                                type: "error",
                                confirmButtonText: "ปิด"
                            });
                        else if(data.status == 403)
                            swal({
                                title: "ล้มเหลว!",
                                text: "บัญชีที่ใช้มีปัญหา\n" + data.data.message,
                                type: "error",
                                confirmButtonText: "ปิด"
                            });
                        else if(data.status == 500)
                            swal({
                                title: "ล้มเหลว!",
                                text: "มีข้อผิดพลาดบางอย่างเกิดขึ้น\nกรุณาลองอีกครั้งภายหน้า",
                                type: "error",
                                confirmButtonText: "ปิด"
                            });
                    });
            }
        } else { 
        	var msg = "ชื่อผู้ใช้ \n" + $rootScope.currentUser.display_name + "\n ใช่คุณหรือไม่";
            swal({
                    title: "คุณอยู่ใระบบ!",
                    text: msg,
                    type: "error",
                    showCancelButton: true,
                    confirmButtonText: "นี่ฉันเอง",
                    cancelButtonText: "ไม่ใช่ฉัน (ออกจากระบบ)",
                },
                function(isConfirm) {
                    if (!isConfirm)
                        $scope.logout();
                }
            );
        }
    }

    $scope.logout = function() {
        delete $rootScope.currentUser;
        alreadyLogin = false;
        $cookies.remove('tokenJWT');
        console.log("Loged out", $cookies.get('tokenJWT'));
        swal({
                title: "ออกจากระบบ!",
                type: "success",
                confirmButtonText: "ปิด"
               }
        );
    }
}])
