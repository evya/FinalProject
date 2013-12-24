'use strict';

angular.module('app').service('DataService', function($location, $resource, $q, $rootScope) {
	
	var that = this;
	
	var fileName;
	
	var fileEntry = null;
	
	var deferred;
	
	var data;
	
	that.GetFile = function(){
		return fileEntry;
	};

	function errorHandler(e) {
	  var msg = "";
	
	  switch (e.code) {
	    case FileError.QUOTA_EXCEEDED_ERR:
	    msg = "QUOTA_EXCEEDED_ERR";
	    break;
	    case FileError.NOT_FOUND_ERR:
	    msg = "NOT_FOUND_ERR";
	    break;
	    case FileError.SECURITY_ERR:
	    msg = "SECURITY_ERR";
	    break;
	    case FileError.INVALID_MODIFICATION_ERR:
	    msg = "INVALID_MODIFICATION_ERR";
	    break;
	    case FileError.INVALID_STATE_ERR:
	    msg = "INVALID_STATE_ERR";
	    break;
	    default:
	    msg = "Unknown Error";
	    break;
	  };
	  console.log("Error: " + msg);
	}		
		
	
	that.loadClassesFromFile = function(){
		
		deferred = $q.defer();
		
		// loads a new file
		chrome.fileSystem.chooseEntry({ type: 'openWritableFile' }, function(file) {
			if (file == null)
			{
				var havePermission = window.webkitNotifications.checkPermission();
				if (havePermission == 0) {
					// 0 is PERMISSION_ALLOWED
					var imageUri = 'Images/64x64/user_warning.png';
					if (fileEntry != null)
					{
						var textBody = 'No new file selected';
					}
					else 
					{
						var textBody = 'Please Select a file to start working';
					}
					
					var notification = window.webkitNotifications.createNotification(
					imageUri,
					'No File Selected',
					textBody
					);
					
					notification.onclick = function () {
						notification.close();
					}
					notification.show();
				} else 
				{
					window.webkitNotifications.requestPermission();
				}
			}
			else
			{
				fileEntry = file;
				fileEntry.file(function(file) {
					  var fileReader = new FileReader();
					  fileReader.onload = function(e) {
						console.log("This is the result of the file read");
						console.log(e.target.result);	
						$rootScope.$apply(function() {
							data = angular.fromJson(e.target.result);
							deferred.resolve(data);
						});
					  };
					  fileReader.onerror = function(e) {
						console.log("Read failed: " + e.toString());
					  };
					  fileName = file;
					  fileReader.readAsText(file);
					}, errorHandler);
			}
		});
		
		return deferred.promise;
		 
	};
	
	that.save = function(){
		
		fileEntry.createWriter(function(fileWriter) {
		    fileWriter.onerror = function(e) {
		      console.log("Write failed: " + e.toString());
		    };
			
			var blob = new Blob([angular.toJson(data)]);
			    fileWriter.truncate(blob.size);
			    fileWriter.onwriteend = function() {
			      fileWriter.onwriteend = function(e) {
			        handleDocumentChange(fileName);
			        console.log("Write completed.");
			      };
			
			      fileWriter.write(blob);
				  console.log("Write completed.");
				  var havePermission = window.webkitNotifications.checkPermission();
				  if (havePermission == 0) {
					// 0 is PERMISSION_ALLOWED
					var imageUri = 'Images/64x64/done.png';
					var textBody = 'Finished saving to ' + fileName.name;				
					var notification = window.webkitNotifications.createNotification(
					imageUri,
					'Save Completed',
					textBody
					);
					
					notification.onclick = function () {
						notification.close();
					}
					notification.show();
				} else 
				{
					window.webkitNotifications.requestPermission();
				}
			    }			
		    
		  }, errorHandler);		
	};
	
	that.saveAs = function() {
		chrome.fileSystem.chooseEntry({ type: 'saveFile' }, function(file) {
			fileEntry = file;
			if (fileEntry == null)
			{
				var havePermission = window.webkitNotifications.checkPermission();
				if (havePermission == 0) {
					// 0 is PERMISSION_ALLOWED
					var imageUri = 'Images/64x64/user_warning.png';
					var textBody = 'Please Select a file to save to';
					var notification = window.webkitNotifications.createNotification(
					imageUri,
					'No File Selected',
					textBody
					);
					
					notification.onclick = function () {
						notification.close();
					}
					notification.show();
				} else 
				{
					window.webkitNotifications.requestPermission();
				}
			}
			else
			{
				that.save();
			}
			
		});
	};
	
	
});
