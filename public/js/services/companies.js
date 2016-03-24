companyModule.factory('CompaniesService', ['$http', function($http){
	return{
		get :  function(){
			return $http.get('/company');
		},
		delete :  function(id){
			return $http.delete('/admin/company/'+id);
		},
		create : function (companyData) {
			return $http.post('/admin/company', companyData);
		},
		update : function(companyData) {
			return $http.put('/admin/company', companyData);
		},
		find : function(id) {
			return $http.get('/company/' + id);
		}
	};
}])