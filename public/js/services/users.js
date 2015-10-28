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
			get : function(loginData) {
				console.log("in factory");
				console.log(loginData);
				return $http.post('/api/auth',loginData);
			}
		}
}]);