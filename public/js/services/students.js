	// super simple service
	// each function returns a promise object 
studentModule.factory('StudentsService', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/students');
			},
			create : function(studentData) {
				return $http.post('/api/students', studentData);
			},
			delete : function(id) {
				return $http.delete('/api/students/' + id);
			},
			update : function(studentData) {
				return $http.put('/api/students/', studentData);
			},
			find : function(id, mode) {
				return $http.get('/api/students/item/' + id + '/mode/' + mode);
			},
			pwChange : function(pwData,id) {
				pwData._id = id;
				return $http.put('/api/students/pw_change',pwData);
			}
		}
	}]);