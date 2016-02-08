documentModule.factory('DocumentsService', ['$http','Upload', function($http,Upload){
	return{
		get : function (){
			return $http.get('/api/students/documents/acaYrs/all');
		},
		delete : function (id){
			return $http.delete('/api/documents/' + id);
		}
	};
}])