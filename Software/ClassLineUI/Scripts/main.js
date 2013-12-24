/*=================================================================================================*/
/*====================================== Main Controller Controller ===============================*/
/*=================================================================================================*/

function MainController($scope, $rootScope, DataService, $location, sharedProperties) {

	$scope.autoSave = false;	
	$scope.File = DataService.GetFile();
	$scope.IPValue = sharedProperties.getState(sharedProperties.IPValue);
	
	$scope.setChange = function($event) {
		var checkbox = $event.target;
		checkbox.checked ? $scope.autoSave=true : $scope.autoSave=false;
	};
	
	
	
	$scope.openFile = function() {
			sharedProperties.setCourse(null);
			sharedProperties.setLecture(null);
		var promise = DataService.loadClassesFromFile();	
		promise.then(function(data) 
		{
			$scope.classes = data;
			
			sharedProperties.setData(data);
			sharedProperties.setCourse(data.courses[0]);
			
			var havePermission = window.webkitNotifications.checkPermission();
			if (havePermission == 0) {
				// 0 is PERMISSION_ALLOWED
				var imageUri = $scope.classes.Image; // 'Images/64x64/done.png';
				var textBody = 'Student Name : ' + $scope.classes.Name + "\nStudent ID : " + $scope.classes.StudentID;
				var notification = window.webkitNotifications.createNotification(
				imageUri,
				'File Open Successful',
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
			$location.url('/courses');  
		});		
	};
	
	$scope.saveFile = function() {
		if ($scope.autoSave) {
			DataService.save();
		} else {
			DataService.saveAs();
			$scope.File = DataService.GetFile();
		}
	};
	
	$scope.$watch(function(){return $location.url();}, function(newValue) {
		$scope.prevUrl = $scope.url;
		$scope.url = newValue;
	});
	
	$scope.setIP = function(newValue) {
		sharedProperties.setIP(newValue);
		var havePermission = window.webkitNotifications.checkPermission();
			if (havePermission == 0) {
				// 0 is PERMISSION_ALLOWED
				var imageUri = 'Images/64x64/done.png';
				var textBody = 'IP set successfully to : ' + newValue;
				var notification = window.webkitNotifications.createNotification(
				imageUri,
				'SUCCESS',
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
	
	$scope.NavCourses = function() {
		$scope.Course = sharedProperties.Course;
		sharedProperties.setCourse($scope.Course);
		$location.url('/Courses'); 
	};
	
	$scope.NavLectures = function() {
		$scope.Lecture = sharedProperties.Lecture;
		$location.url('/lectures'); 
	};
		
	$scope.$on('handleBroadcast', function() {
		$scope.IPValue = sharedProperties.IPValue;
		$scope.Course = sharedProperties.Course;
		$scope.Lecture = sharedProperties.Lecture;
	});   
	
	MainController.$inject = ['$scope', 'sharedProperties'];
}


/*===========================================================================================*/