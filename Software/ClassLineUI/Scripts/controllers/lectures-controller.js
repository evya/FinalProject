
function LecturesController($scope, $rootScope, $location, DataService, sharedProperties) {

	$scope.$on('handleBroadcast', function() {
		$scope.IPValue = sharedProperties.IPValue;
		$scope.Course = sharedProperties.Course;
		$scope.Lecture = sharedProperties.Lecture;
	});   

	$scope.lectures = $scope.Course.Lectures;
	if (sharedProperties.Lecture != null)
	{
		$scope.currentLecture = sharedProperties.Lecture;
	}
	else
	{
		$scope.currentLecture =  $scope.lectures[0];
	}
	
	$scope.nextLecture = $scope.lectures[1];
	if ($scope.currentLecture != null)
	{
		$scope.prevLecture = $scope.lectures[$scope.lectures.indexOf($scope.currentLecture)-1];
		$scope.nextLecture = $scope.lectures[$scope.lectures.indexOf($scope.currentLecture)+1];
	}	
	
	
	$scope.update = function(chosenLecture) {
		$scope.currentLecture = chosenLecture;
		sharedProperties.setLecture(chosenLecture);
		var promise = sharedProperties.getState($scope.lectures);
		promise.then(function(data) 
		{
			var location = data.indexOf(chosenLecture);
			$scope.nextLecture = data[location+1];
			$scope.prevLecture = data[location-1];
		});
		
	}
	
	$scope.updatePrev = function(chosenLecture) {
		if ($scope.prevLecture == undefined)
		{
			// Do nothing
		}
		else
		{
			$scope.update(chosenLecture);
		}
		
	}
	
	$scope.updateNext = function(chosenLecture) {
		if ($scope.nextLecture == undefined)
		{
			// Do nothing
		}
		else
		{
			$scope.update(chosenLecture);
		}
		
	}
	
	
	
	if ($scope.currentLecture && $scope.currentLecture.Image.length < 50)
	{
		$scope.currentLecture.Image = "images/128x128/noImage.png";
	}   
	if ($scope.prevLecture && $scope.prevLecture.Image.length < 50)
	{
		$scope.prevLecture.Image = "images/128x128/noImage.png";
	}   
	if ($scope.nextLecture && $scope.nextLecture.Image.length < 50)
	{
		$scope.nextLecture.Image = "images/128x128/noImage.png";
	}  
	
	
	
	$scope.selectLecture = function() {
		sharedProperties.setLecture($scope.currentLecture);
		$location.url('/snapshots');
	};

}



