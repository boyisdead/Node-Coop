documentModule.factory('DocumentsService', ['$http', function($http){
	return{
		get : function (){
			return $http.get('/api/documents');
		},
		delete : function (id){
			return $http.delete('/api/documents/' + id);
		}
	};
}])