documentModule.factory('DocumentsService', ['$http','Upload', function($http,Upload){
	return{
		get : function (){
			return $http.get('/admin/document/acaYrs/all');
		},
		delete : function (id){
			return $http.delete('/admin/document/' + id);
		}
	};
}])