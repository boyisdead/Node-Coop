homeModule.controller('homeCtrl', ['$scope', function($scope){
	$scope.t = 5;

	$scope.documents = [{ 
			name: "AAAA",
			type: "resume",
			status: "ready" 
		},{ 
			name: "BBBB",
			type: "resume",
			status: "denied" 
		},{ 
			name: "CCCC",
			type: "resume",
			status: "wait" 
		},{ 
			name: "DDDD",
			type: "resume",
			status: "ready" 
		}
	];
	
}]);