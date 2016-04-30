companyModule.factory('CompaniesService', ['$http', function($http){
	return{
		get :  function(){
			return $http.get('/coopsys/v1/company');
		},
		delete :  function(id){
			return $http.delete('/coopsys/v1/company/'+id);
		},
		create : function (companyData) {
			return $http.post('/coopsys/v1/company', companyData);
		},
		update : function(companyData) {
			return $http.put('/coopsys/v1/company', companyData);
		},
		updateContact : function(companyData) {
			return $http.put('/coopsys/v1/company/'+ companyData._id+ '/contact', companyData.contact);
		},
		updateCoordinator : function(companyData) {
			return $http.put('/coopsys/v1/company/'+ companyData._id+ '/coordinator', companyData.coordinator);
		},
		find : function(id) {
			return $http.get('/coopsys/v1/company/' + id);
		}
	};
}])