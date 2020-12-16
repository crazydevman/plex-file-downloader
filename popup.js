
chrome.extension.onRequest.addListener(function(info) {
  document.getElementById('link').innerHTML = '<a href="'+info.url+'">'+info.name+'</a>';
});

// Set up event handlers and inject send_link.js into all frames in the active
// tab.
window.onload = function() {
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id},
                      function(activeTabs) {
      chrome.tabs.executeScript(
        activeTabs[0].id, {file: 'send_link.js', allFrames: true});
    });
  });
};
