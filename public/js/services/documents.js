documentModule.factory('DocumentsService', ['$http','Upload', function($http,Upload){
	return{
		get : function (){
			return $http.get('/coopsys/v1/attachment');
		},
        update: function(docData) {
            return $http.put('/coopsys/v1/attachment', docData);
        },
		approve : function(id){
			return $http.get('/coopsys/v1/attachment/'+ id + '/approve');
		},
		decline : function(id){
			return $http.get('/coopsys/v1/attachment/'+ id + '/decline');
		},
		find : function (id){
			return $http.get('/coopsys/v1/attachment/'+ id);
		},
		delete : function (id){
			return $http.delete('/coopsys/v1/attachment/'+ id);
		}
	};
}])