	// super simple service
	// each function returns a promise object 
	teacherModule.factory('TeachersService', ['$http', function($http) {
	    return {
	        get: function() {
	            return $http.get('/api/teachers');
	        },
	        create: function(teacherData) {
	        	if (teacherData.title) {
	            	teacherData.name.t_th = teacherData.title.t_th;
	            	teacherData.name.t_en = teacherData.title.t_en;
	            }
	            return $http.post('/api/teachers', teacherData);
	        },
	        delete: function(id) {
	            return $http.delete('/api/teachers/' + id);
	        },
	        update: function(teacherData) {
	            if (teacherData.title) {
	                teacherData.name.t_th = teacherData.title.t_th;
	                teacherData.name.t_en = teacherData.title.t_en;
	            }
	            return $http.put('/api/teachers/', teacherData);
	        },
	        find: function(id, mode) {
	            return $http.get('/api/teachers/item/' + id + '/mode/' + mode);
	        },
	        pwChange: function(pwData, id) {
	            pwData._id = id;
	            return $http.put('/api/teachers/pw_change', pwData);
	        }
	    }
	}]);
