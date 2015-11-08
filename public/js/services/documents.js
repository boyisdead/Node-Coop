documentModule.factory('DocumentsService', ['$http', function($http){
	return{
		get : function (){
			return $http.get('/api/documents');
		},
		create : function (documentData){
			console.log(documentData);
			return $http.post('/api/documents/upload/', documentData);
		},
		delete : function (id){
			return $http.delete('/api/documents/' + id);
		}
	};
}])