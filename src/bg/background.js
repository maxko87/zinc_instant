var pw = "0123890128365209132"; // fuckit.js

// chrome.runtime.onInstalled.addListener(function (){
//   chrome.tabs.create({url: "src/options/options.html"});
// });

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
  if (request._type == 'set_popup_contents'){
    console.log('updated tab map: ');
    console.log(request);
    tab_content_map[sender.tab.id] = request;
  }
  else if (request._type == 'disable_tab'){
    delete tab_content_map[sender.tab.id];
  }
  update_tab_map(sender.tab);
});





