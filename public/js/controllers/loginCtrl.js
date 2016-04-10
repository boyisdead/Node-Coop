authenticationModule.controller('loginCtrl', ['$scope', '$rootScope', '$cookies', 'jwtHelper', 'UsersService', function($scope, $rootScope, $cookies, jwtHelper, UsersService) {


    // $scope.openTeacherLogin = function (){
    // 	console.log("teacher");
    // 	var modalInstance = $uibModal.open({
    // 		animation: true,
    // 		templateUrl: 'view/modal/teacher_login_modal.html',
    // 		controller: 'teacherLoginCtrl',
    // 		size: 'md'
    // 	});

    // 	modalInstance.result.then(function(){

    // 	}, function(){
    // 		$log.info('Modal dismissesd at: ' + new Date());
    // 	});
    // };
    var alreadyLogin;
    if (typeof $rootScope.currentUser != 'undefined')
        alreadyLogin = true;

    $scope.loginVerify = function(item) {
        if (item) {
            if (item.username.length < 6) {
                alert("at least 6 characters require for username");
            } else if (item.password.length < 4) {
                alert("at least 4 characters require for password");
            } else if ($scope.loginType == '' || $scope.loginType == null) {
                alert("please choose login type");
            } else {
                identifyUser(item);
            }
        } else {
            alert("Please fill something");
        }

    }

    var identifyUser = function(item) {

        if (!alreadyLogin) {
            if (item&&$scope.loginType) {
                UsersService.get(item, $scope.loginType)
                    .success(function(data) {
                        console.log(data);
                        if(data.success){
                            $cookies.put('tokenJWT', data.result.token);
                            var tokenPayload = jwtHelper.decodeToken(data.result.token);
                            $rootScope.currentUser = tokenPayload;
                            swal({
                                title: "สวัสดี"+$rootScope.currentUser.display_name,
                                type: "success",
                                confirmButtonText: "ปิด"
                            });
                        } else {
                            swal({
                                title: "ล้มเหลว!",
                                text: "ชื่อบัญชีหรือรหัสผ่านไม่ถูกต้อง",
                                type: "error",
                                confirmButtonText: "ปิด"
                            });
                        }
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
