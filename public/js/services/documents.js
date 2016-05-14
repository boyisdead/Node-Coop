documentModule.factory('DocumentsService', ['$http','Upload', function($http,Upload){
	return{
		create : function (docData) {
			return $http.post('coopsys/v1/attachment/' + docData.owner);
		},
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
		},
		createMyAttach : function (docData) {
			return $http.post('/coopsys/v1/myattach', docData);
		},
		getMyAttach : function () {
			return $http.get('/coopsys/v1/myattach');
		},
		findMyAttach : function (id) {
			return $http.get('/coopsys/v1/myattach/' + id);
		},
		updateMyAttach : function (docData) {
			return $http.put('/coopsys/v1/myattach', docData);
		},
		deleteMyAttach : function (id) {
			return $http.delete('/coopsys/v1/myattach/' + id);
		}
	};
}])