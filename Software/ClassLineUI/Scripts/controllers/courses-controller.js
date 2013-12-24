
function CoursesController($scope, $rootScope, $location, DataService, $q, sharedProperties) {

	$scope.$on('handleBroadcast', function() {
		$scope.IPValue = sharedProperties.IPValue;
		$scope.Course = sharedProperties.Course;
		$scope.currentCourse = $scope.Course;
		if (sharedProperties.Data != null)
		{
			$scope.nextCourse = sharedProperties.Data.courses[sharedProperties.Data.courses.indexOf($scope.Course)+1];
		}
		
		$scope.Lecture = sharedProperties.Lecture;
	});   

	
	
	$scope.update = function(chosenCourse) {
	
		$scope.currentCourse = chosenCourse;
		sharedProperties.setCourse(chosenCourse);
		var promise = sharedProperties.getState(sharedProperties.Data);
		promise.then(function(data) 
		{
			var location = data.courses.indexOf(chosenCourse);
			$scope.nextCourse = data.courses[location+1];
			$scope.prevCourse = data.courses[location-1];
		});
		
	}
	
	$scope.updatePrev = function(chosenCourse) {
		if ($scope.prevCourse == undefined)
		{
			// Do nothing
		}
		else
		{
			$scope.update(chosenCourse);
		}
		
	}
	
	$scope.updateNext = function(chosenCourse) {
		if ($scope.nextCourse == undefined)
		{
			// Do nothing
		}
		else
		{
			$scope.update(chosenCourse);
		}
		
	}
	
	if (sharedProperties.Course != null)
	{
		$scope.currentCourse = sharedProperties.Course;
	}
	
	
	if ($scope.currentCourse && $scope.currentCourse.Image.length < 50)
	{
		$scope.currentCourse.Image = "images/128x128/noImage.png";
	}   
	if ($scope.prevCourse && $scope.prevCourse.Image.length < 50)
	{
		$scope.prevCourse.Image = "images/128x128/noImage.png";
	}   
	if ($scope.nextCourse && $scope.nextCourse.Image.length < 50)
	{
		$scope.nextCourse.Image = "images/128x128/noImage.png";
	} 
	else if ($scope.currentCourse != null)
	{
		$scope.prevCourse = sharedProperties.Data.courses[sharedProperties.Data.courses.indexOf($scope.currentCourse)-1];
		$scope.nextCourse = sharedProperties.Data.courses[sharedProperties.Data.courses.indexOf($scope.currentCourse)+1];
	}	
	

		
		$scope.selectCourse = function() {
			sharedProperties.setCourse($scope.currentCourse);
			$scope.IPValue = sharedProperties.IPValue;
			var havePermission = window.webkitNotifications.checkPermission();
			if (havePermission == 0) {
				// 0 is PERMISSION_ALLOWED
				if ($scope.IPValue.IP == '')
				{
					var imageUri = 'Images/64x64/user_warning.png';
					var textBody = 'No IP Selected - Please connect to server';
					var notification = window.webkitNotifications.createNotification(
					imageUri,
					'Action Notification',
					textBody
					);
				
					notification.onclick = function () {
						notification.close();
					}
					notification.show();
				}
			} else 
			{
				window.webkitNotifications.requestPermission();
			}
			$location.url('/lectures');  	
	};
	
	  	  
/*$scope.addCourse = function() {
	  	DataService.getClasses().then(function(data) {
			  	$scope.newCourse = {
					"Id": $scope.currentCourse.Id,
		            "Image": "",
		            "Lecturer": $scope.currentCourse.Lecturer,
		            "Name" : $scope.currentCourse.Name,
					lectures: []
			  };
	  		data.courses.push($scope.newCourse);
	  		DataService.save();
	  	});
	  }; */
  
}
