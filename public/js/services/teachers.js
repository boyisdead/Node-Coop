	// super simple service
	// each function returns a promise object 
	teacherModule.factory('TeachersService', ['$http', function($http) {
	    return {
	        get: function() {
	            return $http.get('/admin/teacher');
	        },
	        create: function(teacherData) {
	        	if (teacherData.title) {
	            	teacherData.name.t_th = teacherData.title.t_th;
	            	teacherData.name.t_en = teacherData.title.t_en;
	            }
	            return $http.post('/admin/teacher', teacherData);
	        },
	        delete: function(id) {
	            return $http.delete('/admin/teacher/' + id);
	        },
	        update: function(teacherData) {
	            if (teacherData.title) {
	                teacherData.name.t_th = teacherData.title.t_th;
	                teacherData.name.t_en = teacherData.title.t_en;
	            }
	            return $http.put('/admin/teacher/', teacherData);
	        },
	        find: function(id, mode) {
	            return $http.get('/admin/teacher/item/' + id + '/mode/' + mode);
	        },
	        pwChange: function(pwData, id) {
	            pwData._id = id;
	            return $http.put('/admin/teacher/pw_change', pwData);
	        }
	    }
	}]);
