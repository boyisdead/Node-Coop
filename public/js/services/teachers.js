	// super simple service
	// each function returns a promise object 
teacherModule.factory('TeachersService', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/teachers');
			},
			create : function(teacherData) {
				console.log("before post " + teacherData);
				return $http.post('/api/teachers', teacherData);
			},
			delete : function(id) {
				return $http.delete('/api/teachers/' + id);
			},
			update : function(teacherData) {
				return $http.put('/api/teachers/', teacherData);
			},
			find : function(id, mode) {
				return $http.get('/api/teachers/item/' + id + '/mode/' + mode);
			}
		}
	}]);