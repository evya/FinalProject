function SnapshotsController($scope, $rootScope, $http, DataService, sharedProperties) {


	$scope.$on('handleBroadcast', function() {
		$scope.IPValue = sharedProperties.IPValue;
		$scope.Course = sharedProperties.Course;
		$scope.Lecture = sharedProperties.Lecture;
	});   
	
	$scope.snapshots = $scope.Lecture.Snapshots;
	$scope.currentSnapshot = $scope.snapshots[0];
	$scope.nextSnapshot = $scope.snapshots[1];
	
	$scope.SnapshotNumber = $scope.snapshots.length+1;
	$scope.IP = sharedProperties.IPValue.IP;

	//if ($scope.currentSnapshot != null )
	//{
	//	$scope.comments = $scope.currentSnapshot.comments;
	//}
	
	
	$scope.update = function(chosenSnapshot) {
		$scope.currentSnapshot = chosenSnapshot;
		var promise = sharedProperties.getState($scope.snapshots);
		promise.then(function(data) 
		{
			var location = data.indexOf(chosenSnapshot);
			$scope.nextSnapshot = data[location+1];
			$scope.prevSnapshot = data[location-1];
			//$scope.comments = $scope.currentSnapshot.comments;
		});
		
	}
	
	$scope.updatePrev = function(chosenSnapshot) {
		if ($scope.prevSnapshot == undefined)
		{
			// Do nothing
		}
		else
		{
			$scope.update(chosenSnapshot);
		}
		
	}
	
	$scope.updateNext = function(chosenSnapshot) {
		if ($scope.nextSnapshot == undefined)
		{
			// Do nothing
		}
		else
		{
			$scope.update(chosenSnapshot);
		}
		
	}
	
	if ($scope.currentSnapshot && $scope.currentSnapshot.Image.length < 50)
	{
		$scope.currentSnapshot.Image = "images/128x128/noImage.png";
	}   
	if ($scope.prevSnapshot && $scope.prevSnapshot.Image.length < 50)
	{
		$scope.prevSnapshot.Image = "images/128x128/noImage.png";
	}   
	if ($scope.nextSnapshot && $scope.nextSnapshot.Image.length < 50)
	{
		$scope.nextSnapshot.Image = "images/128x128/noImage.png";
	}  
	
	
	$scope.capture = function() {
		
		//$http.get('http://' + $scope.IP + ':8733/ClassLineService/GetScreenshot').success(function(data) {
			$http.get('http://' + $scope.IP + '/ClassLineService/GetScreenshot').success(function(data) {
			var imageData = "data:image/png;base64," + angular.fromJson(data);
			var comment = $scope.currentSnapshot.comments;
			if ($scope.index != 0) {
				console.log("Saving previous one");
				$scope.prevSnapshot = $scope.currentSnapshot;
				} else{};
			$scope.captureImageSource = imageData;
			$scope.SnapshotNumber++;
			$scope.currentSnapshot = {
				Comments: comment,
				Image: imageData,
				Number: $scope.SnapshotNumber
			}
			$scope.snapshots.push($scope.currentSnapshot);
			$scope.index++;
			showNotification();
		}).error(function(error) {
			console.log("Error capturing file : " + error);
		});	
	};
	
	
	$scope.removeSnapshot = function (){
		console.log("Data is : \n" + sharedProperties.Data);

	};


	
  /*<!--++======================================================-->	
	<!--===================== Notification handler =============-->
	<!--========================================================-->*/	
	
	function showNotification() {
	
			var creationTime = new Date(),
			creationMessage = creationTime.toLocaleString();
			
			var havePermission = window.webkitNotifications.checkPermission();
			if (havePermission == 0) {
				// 0 is PERMISSION_ALLOWED
				var imageUri = 'Images/64x64/Camera.png';
				var title = $scope.Course.Name + "\n Lecture #" + $scope.Lecture.Number + "Snap #" + $scope.SnapshotNumber;
				var textBody = 'Capture succeeded at : ' + creationMessage;
				var notification = window.webkitNotifications.createNotification(
					imageUri,
					title,
					textBody
				);
				
				notification.onclick = function () {
					notification.close();
				}
				notification.show();
			  } 
			  else 
			  {
				  window.webkitNotifications.requestPermission();
			  }
	}

}






	

