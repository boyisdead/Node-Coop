applicationModule.factory('ApplicationsService', ['$http', function($http){
	return{
		get :  function(){
			return $http.get('/coopsys/v1/application');
		},
		delete :  function(id){
			return $http.delete('/coopsys/v1/application/'+id);
		},
		create : function (applicationData) {
			return $http.post('/coopsys/v1/application', applicationData);
		},
		update : function(applicationData) {
			return $http.put('/coopsys/v1/application', applicationData);
		},
		find : function(id) {
			return $http.get('/coopsys/v1/application/' + id);
		}
	};
}])