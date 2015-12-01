companyModule.factory('CompaniesService', ['$http', function($http){
	return{
		get :  function(){
			return $http.get('/api/companies');
		},
		delete :  function(id){
			return $http.delete('/api/companies/'+id);
		},
		create : function (companyData) {
			return $http.post('/api/companies', companyData);
		},
		update : function(companyData) {
			return $http.put('/api/companies', companyData);
		},
		find : function(id, mode) {
			return $http.get('/api/companies/item/' + id + '/mode/' + mode);
		},
	};
}])