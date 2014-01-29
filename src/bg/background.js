var pw = "0123890128365209132"; // fuckit.js

console.log('background.js');

// get_html_from_jquery = function(jquery){
//   return "<html>" + $('<div>').append(jquery).html() + "</html>";
// }

var tab_content_map = {}

update_tab_map = function(tab){
  var popup_file = 'src/browser_action/disabled.html';
  var image_file = 'icons/instant_disabled.png';
  if (tab.id in tab_content_map){
    popup_file = 'src/browser_action/enabled.html';
    image_file = 'icons/instant_enabled.png';
  }
  chrome.browserAction.setPopup({
    tabId: tab.id,
    popup: popup_file
  });
  chrome.browserAction.setIcon({
    tabId: tab.id,
    path: image_file
  });
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.confirmation){
    console.log('setting tab ' + sender.tab.id + " to " + request.confirmation);
    tab_content_map[sender.tab.id] = request.confirmation;
  }
  else if (request.disable_tab){
    console.log('disabling popup for tab ' + sender.tab.id);
    delete tab_content_map[sender.tab.id];
  }
  update_tab_map(sender.tab);
});





