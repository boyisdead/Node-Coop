mainModule.factory('OthersService', ['$http', function($http){
	return{
		getTitleName : function (){
			return $http.get('/coopsys/v1/typehead/title_name');
		},
		getAcadePos : function (){
			return $http.get('/coopsys/v1/typehead/academic_position');
		},
		getAdvisor : function (){
			return $http.get('/coopsys/v1/typehead/adviser');
		},
		getAcaYrs : function() {
			return $http.get('/coopsys/v1/typehead/academic-years');
		},
		getCompany : function() {
			return $http.get('/coopsys/v1/typehead/company');
		}
	};
}])