$(document).ready(function(){

  console.log('browser_action.js');

  show_success = function(text) {
    $('#success').text(text);
    setTimeout(function() {
      $('#success').text("");
    }, 3000);
  };

  show_error = function(text) {
    $('#error').text(text);
    setTimeout(function() {
      $('#error').text("");
    }, 5000);
  };

  process_current_tab = function(callback) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      tab = tabs[0];
      console.log(tab);
      callback(tab);
    });
  }

  $('#buy').click(function(){
    console.log('buying item');
    // MAKE API CALL
    chrome.tabs.captureVisibleTab(null, {}, function (image) {
      process_current_tab(function(tab) {
        user_info = localStorage.getItem("user_info");
        if (!user_info){
          show_error("You must enter your payment and shipping information in the extension options before you can place an order!");
          return;
        }
        var tab_content_map = chrome.extension.getBackgroundPage().tab_content_map;
        var text = tab_content_map[tab.id];
        data = {"image": image, "payload": user_info};
        console.log(JSON.stringify(data));
        $.post("http://api.zinc.io/v0/instant_buy", JSON.stringify(data))
          .done(function (data){
            console.log("saved");
            console.log(data);
            show_success('Order placed successfully! You will receive a confirmation email shortly.');
        });
      })
    });
  });

  process_current_tab(function(tab){
    var tab_content_map = chrome.extension.getBackgroundPage().tab_content_map;
    var text = tab_content_map[tab.id];
    $('#confirmation').text(text);
  });

});

