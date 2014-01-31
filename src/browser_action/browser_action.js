// DOMAIN = "http://localhost:5000";
DOMAIN = "https://api.zinc.io";

$(document).ready(function(){

  console.log('browser_action.js');

  // TODO: refactor
  safe_get = function(key){
    var ciphertext_key = key//CryptoJS.AES.encrypt(key, chrome.extension.getBackgroundPage().pw).toString();
    var ciphertext_value = localStorage[ciphertext_key];
    if (!ciphertext_value)
      return;
    var plaintext = CryptoJS.AES.decrypt(ciphertext_value, chrome.extension.getBackgroundPage().pw).toString(CryptoJS.enc.Utf8);
    return JSON.parse(plaintext);
  }

  show_success = function(text) {
    $('#success').text(text);
    setTimeout(function() {
      $('#success').text("");
    }, 5000);
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
      callback(tab);
    });
  }

  if (!safe_get('email')) {
    $('#buy-form').hide();
    $('#registration').show();
  };


  $('#buy').click(function(event){
    event.preventDefault();
    // MAKE API CALL
    chrome.tabs.captureVisibleTab(null, {}, function (image) {
      process_current_tab(function(tab) {
        var tab_content_map = chrome.extension.getBackgroundPage().tab_content_map;
        var product_data = tab_content_map[tab.id];
        var email = safe_get('email');
        var password = $("#password").val();
        if (password.length == 0){
          show_error("Please enter your password to authorize the purchase.");
          return;
        }
        data = {'email': email, 'password': password, "image": image, "product_data": product_data, "url": tab.url};
        console.log(JSON.stringify(data));
        $.post(DOMAIN + "/v0/instant_buy", JSON.stringify(data))
          .done(function (data){
            if (data['_type'] == 'error'){
              show_error(data['message']);
            }
            else{
              console.log("placed");
              console.log(data);
              show_success('Order placed successfully! You will receive a confirmation email shortly.');
            }
          });
      });
    });
  });

  $('#register').click(function(event) {
    console.log('hi');
    chrome.tabs.create({url: '/src/options/options.html'});
  });

  process_current_tab(function(tab){
    var tab_content_map = chrome.extension.getBackgroundPage().tab_content_map;
    var text = tab_content_map[tab.id];
    $('#confirmation').text(text);
  });

});

