var app = angular.module('app', ['ngResource', 'ui.bootstrap']);

app.factory('sharedProperties', function($rootScope, $q) {
    var sharedService = {};
	
    //sharedService.IPValue = { IP: 'localhost'};
    sharedService.IPValue = { IP: '10.241.1.106'};
	sharedService.Course = null;
	sharedService.Lecture = null;	
	
	sharedService.Data = null;	
    
	
	sharedService.getState = function(getValue){
          var deferred = $q.defer();

          setTimeout(function(){
		  $rootScope.$apply(function(){
			deferred.resolve(getValue);
		  });
		}, 20);

          return deferred.promise;
       };

		sharedService.setData = function(value) {
            this.Data = value;
        };
		
		sharedService.setCourse = function(value) {
            this.Course = value;
			this.broadcastItem();
        };
		
		sharedService.setLecture = function(value) {
            this.Lecture = value;
			this.broadcastItem();
        };
		
		sharedService.setIP = function(value) {
            if (value == null)
			    this.IPValue.IP = '';
			else
			    this.IPValue.IP = value;
			this.broadcastItem();
        };
		
		sharedService.broadcastItem = function() {
			$rootScope.$broadcast('handleBroadcast');
		};
		
        return sharedService;
});



app.config(function($routeProvider, $httpProvider) {
	$routeProvider.when('/courses', {templateUrl: 'templates/courses.html', controller: 'CoursesController'});
	$routeProvider.when('/lectures', {templateUrl: 'templates/lectures.html', controller: 'LecturesController'});
	$routeProvider.when('/snapshots', {templateUrl: 'templates/snapshots.html', controller: 'SnapshotsController'});
    $routeProvider.otherwise({redirectTo: '/courses'});
    // Enabling CORS
    $httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
	
}).run(function(DataService, sharedProperties) {

	


});
