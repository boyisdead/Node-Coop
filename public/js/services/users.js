// authenticationModule.factory('UsersService', ['$http', function($http){
// 	return {
// 		get : function(loginData){
// 			console.log("in factory");
// 			console.log(loginData);
// 			return $http.post('/api/auth');
// 		}
// 	}
// }]);

authenticationModule.factory('UsersService', ['$http', function($http){
	return {
			get : function(loginData,loginType) {
				console.log("in factory");
				console.log(loginData);
				if(loginType=="teacher"){
					return $http.post('/coopsys/v1/login/teacher',loginData);
				}
				if(loginType=="student"){
					return $http.post('/coopsys/v1/login/student',loginData);
				}
			}
		}
}]);