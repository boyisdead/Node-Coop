documentModule.factory('DocumentsService', ['$http','Upload', function($http,Upload){
	return{
		get : function (){
			return $http.get('/coopsys/v1/attachment');
		},
		find : function (id){
			return $http.get('/coopsys/v1/attachment/'+ id);
		},
		delete : function (id){
			return $http.delete('/admin/document/' + id);
		}
	};
}])