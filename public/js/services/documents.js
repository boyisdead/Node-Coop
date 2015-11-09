documentModule.factory('DocumentsService', ['$http', function($http){
	return{
		get : function (){
			return $http.get('/api/documents');
		},
		create : function (documentData){
			console.log("create",documentData);
			return $http.post('/api/documents/upload/', documentData);
		},
		create_2 : function (documentData){
			console.log("create_2", documentData);
			return $http.post('/upload/', documentData);
		},
		delete : function (id){
			return $http.delete('/api/documents/' + id);
		}
	};
}])