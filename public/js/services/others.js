mainModule.factory('OthersService', ['$http', function($http){
	return{
		getTitleName : function (){
			return $http.get('/api/typehead/title_name');
		},
		getAcadePos : function (){
			return $http.get('/api/typehead/acade_pos');
		},
		getAdvisor : function (){
			return $http.get('/api/typehead/advisor');
		},
		getAcaYrs : function() {
			return $http.get('/api/acaYrs');
		}
	};
}])