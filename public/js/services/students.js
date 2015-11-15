	// super simple service
	// each function returns a promise object 
studentModule.factory('StudentsService', ['$http',function($http) {
		return {
			get : function(acaYr) {
				if(typeof acaYr === "undefined" || acaYr == "ทั้งหมด") {
					return $http.get('/api/students');
				} else {
					return $http.get('/api/students/acaYr/' + acaYr);
				}
				
			},
			create : function(studentData) {
				if (studentData.name){
				    studentData.name.t_th =  studentData.title.t_th;
            		studentData.name.t_en =  studentData.title.t_en;
            	}
				return $http.post('/api/students', studentData);
			},
			delete : function(id) {
				return $http.delete('/api/students/' + id);
			},
			update : function(studentData) {
				if (studentData.name){
				    studentData.name.t_th =  studentData.title.t_th;
            		studentData.name.t_en =  studentData.title.t_en;
            	}
				return $http.put('/api/students', studentData);
			},
			find : function(id, mode) {
				criteria = {id : id, mode : mode}
				console.log(criteria);
				return $http.post('/api/students/find', criteria);
			},
			pwChange : function(pwData,id) {
				pwData._id = id;
				return $http.put('/api/students/pw_change',pwData);
			},
			unlockProfile : function(id) {
				var student = {id : id}
				return $http.put('/api/students/unlock_profile', student);
			},
			lockProfile : function(id) {
				var student = {id : id}
				return $http.put('/api/students/lock_profile', student);
			}
		}
	}]);