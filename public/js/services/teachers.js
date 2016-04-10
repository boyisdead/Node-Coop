	// super simple service
	// each function returns a promise object 
	teacherModule.factory('TeachersService', ['$http', function($http) {
	    return {
	        get: function() {
	            return $http.get('/coopsys/v1/teacher');
	        },
	        create: function(teacherData) {
	        	if (teacherData.title) {
	            	teacherData.name.t_th = teacherData.title.t_th;
	            	teacherData.name.t_en = teacherData.title.t_en;
	            }
	            return $http.post('/coopsys/v1/teacher', teacherData);
	        },
	        delete: function(id) {
	            return $http.delete('/coopsys/v1/teacher/' + id);
	        },
	        update: function(teacherData) {
	            if (teacherData.title) {
	                teacherData.name.t_th = teacherData.title.t_th;
	                teacherData.name.t_en = teacherData.title.t_en;
	            }
	            return $http.put('/coopsys/v1/teacher/', teacherData);
	        },
	        find: function(id, mode) {
	            return $http.get('/coopsys/v1/teacher/' + id );
	        },
	        pwChange: function(pwData, id) {
	            pwData._id = id;
	            return $http.put('/coopsys/v1/teacher/pw_change', pwData);
	        }
	    }
	}]);
