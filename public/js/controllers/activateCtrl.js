studentModule.controller('activateCtrl', ['$scope', '$modalInstance','UsersService', function($scope, $modalInstance, UsersService) {

    $scope.activateAccount = function (){
        console.log("checking...")
        var errList = "";
        if ($scope.activation) {
            if ($scope.activation._id == '' || $scope.activation._id == null) {
                errList += "รหัสนักศึกษา ไม่ถูกกรอก"
            } 
            if ($scope.activation.code == '' || $scope.activation.code == null) {
                errList += "รหัสยืนยัน ไม่ถูกกรอก"
            } 
            if(errList != ""){
                swal("ล้มเหลว!", errList, "error")
            } else {
                UsersService.activateStudentAccount($scope.activation._id, $scope.activation.code).then(function(data){
                    swal("สำเร็จ!", "บัญชีได้รับการยืนยันแล้ว", "success")
                    $modalInstance.close();
                }, function (data){
                    swal("ล้มเหลว!", data.data.message || data.data.error, "success")
                    $modalInstance.close();
                })
            }
        } else {
            swal("ล้มเหลว!", "กรุณากรอกข้อมูล","error")
        }
    }
    
    $scope.ok = function () {
    //can return something
    $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);