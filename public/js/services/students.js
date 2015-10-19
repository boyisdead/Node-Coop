	// super simple service
	// each function returns a promise object 
studentModule.factory('StudentsService', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/students');
			},
			create : function(studentData) {
				console.log("before post " + studentData.text);
				return $http.post('/api/students', studentData);
			},
			delete : function(id) {
				return $http.delete('/api/students/' + id);
			}
		}
	}]);