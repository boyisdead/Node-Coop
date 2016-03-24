mainModule.factory('OthersService', ['$http', function($http){
	return{
		getTitleName : function (){
			return $http.get('/typehead/title_name');
		},
		getAcadePos : function (){
			return $http.get('/typehead/acade_pos');
		},
		getAdvisor : function (){
			return $http.get('/typehead/advisor');
		},
		getAcaYrs : function() {
			return $http.get('/admin/student/acaYrs');
		}
	};
}])