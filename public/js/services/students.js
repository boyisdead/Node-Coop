	// super simple service
	// each function returns a promise object 
	studentModule.factory('StudentsService', ['$http', 'Upload', function($http, Upload) {
	    return {
	        get: function(acaYr) {
	            if (typeof acaYr === "undefined" || acaYr == "ทั้งหมด") {
	            	console.log("getAllStu");
	                return $http.get('/coopsys/v1/student');
	            } else {
	            	console.log("getStu",acaYr);
	                return $http.get('/coopsys/v1/student/academic_year/' + acaYr);
	            }

	        },
	        getStudentAttachment: function(id) {
	            return $http.get('/coopsys/v1/student/'+ id +'/attachment');
	        },
	        create: function(studentData) {
	            return $http.post('/coopsys/v1/student', studentData);
	        },
	        uploadPicture: function(file,id) {
	        	console.log("upload picture...");
	            return Upload.upload({
	                url: '/coopsys/v1/student/'+ id +'/upload_profile_picture',
	                method: 'POST',
	                file: file
	            });

	        },
	        delete: function(id) {
	            return $http.delete('/coopsys/v1/student/' + id);
	        },
	        update: function(studentData) {
	            return $http.put('/coopsys/v1/student', studentData);
	        },
	        find: function(id) {
	            console.log("get" + id);
	            return $http.get('/coopsys/v1/student/' + id);
	        },
	        pwChange: function(pwData, id) {
	            pwData._id = id;
	            return $http.put('/coopsys/v1/change_password', pwData);
	        },
	        regisStudent : function(studentData) {
	        	return $http.post('/coopsys/v1/register',studentData);
	        }
	    }
	}]);
