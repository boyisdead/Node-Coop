studentModule.controller('studentCtrl', ['$scope','$http','StudentsService', function($scope, $http, StudentsService) {
	
		$scope.formData = {};
		$scope.loading = true;

		// GET =====================================================================
		// when landing on the page, get all students and show them
		// use the service to get all the students
		StudentsService.get()
			.success(function(data) {
				$scope.students = data;
				$scope.loading = false;
			});

		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createStudent = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.text != undefined) {
				$scope.loading = true;

				// call the create function from our service (returns a promise object)
				StudentsService.create($scope.formData)

					// if successful creation, call our get function to get all the new students
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.students = data; // assign our new list of students
					});
			}
		};

		// DELETE ==================================================================
		// delete a student after checking it
		$scope.deleteStudent = function(id) {
			$scope.loading = true;

			StudentsService.delete(id)
				// if successful creation, call our get function to get all the new students
				.success(function(data) {
					$scope.loading = false;
					$scope.students = data; // assign our new list of students
				});
		};
	}]);