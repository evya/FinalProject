var singletonWindow;

chrome.app.runtime.onLaunched.addListener(function() {
  // width 640 for font size 12
  //       720 for font size 14
  chrome.app.window.create('main.html', {
    id: "singleton window", singleton: true, frame: 'chrome', bounds: { width: 1230, height: 800}, minWidth:1230, minHeight: 800 ,maxHeight : 800, maxWidth: 1230
  });
});

/*chrome.commands.onCommand.addListener(function(command) {
   console.log("Command triggered: " + command);

   if (command == "cmdNew") {
     chrome.app.window.create('main.html', {
       frame: 'chrome', bounds: { width: 1230, height: 800}, minWidth:1230, minHeight: 800 ,maxHeight : 800, maxWidth: 1230
     });
   }
});*/
