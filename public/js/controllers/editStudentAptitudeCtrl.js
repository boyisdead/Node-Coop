studentModule.controller('editStudentAptitudeCtrl', ['$scope', '$modalInstance', 'StudentsService', function($scope, $modalInstance, StudentsService) {

    $scope.getStudentData = function() {
        StudentsService.find($scope.params.studentId).success(function(data) {
            $scope.formData = data.result[0];
        });
    }

    $scope.getStudentData();

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

    $scope.validateForm = function(msg) {
        updateStudent();    
    }
    var updateStudent = function() {
        console.log("Updating...");
        StudentsService.update($scope.formData).success(function() {
            swal({
                title: "บันทึก!",
                type: "success",
                confirmButtonText: "ปิด"
            });
            $modalInstance.close();
        });
    };
    $scope.ok = function() {
        //can return something
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

}]);
