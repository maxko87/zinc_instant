get_object_from_form = function(form_selector) {
  var inputs = $(form_selector + " :input");
  var values = {};
  inputs.each(function() {
    if (this.type === "checkbox") {
      values[this.name] = this.checked;
    } else {
      values[this.name] = $(this).val();
    }
  });
  return values;
};

form_is_populated = function(form_selector) {
  var is_populated = true;
  $(form_selector + " .form-required").each(function() {
    if ($(this).val() === "") {
      is_populated = false;
    }
  });
  return is_populated;
};

safe_put = function(key, val){
  var plaintext = JSON.stringify(val);
  var ciphertext = CryptoJS.AES.encrypt(plaintext, chrome.extension.getBackgroundPage().pw);
  localStorage[key] = ciphertext;
}

safe_get = function(key){
  var ciphertext = localStorage[key];
  if (!ciphertext)
    return;
  var plaintext = CryptoJS.AES.decrypt(ciphertext, chrome.extension.getBackgroundPage().pw);
  return JSON.parse(plaintext.toString(CryptoJS.enc.Utf8));
}

function save_options() {
  var status = document.getElementById("status");
  if (!form_is_populated("#billing-info-form")){
    status.innerHTML = "Please enter all required fields.";
    setTimeout(function() {
      status.innerHTML = "";
    }, 3000);
    return 
  }
  safe_put("user_info", get_object_from_form("#billing-info-form"));
  status.innerHTML = "Information saved!";
  setTimeout(function() {
    status.innerHTML = "";
  }, 2000);
}


function restore_options() {
  var user_info = safe_get("user_info");
  if (!user_info) {
    return;
  }
  // key is the form input id, val
  for (var key in user_info){
    // if value = number
    var value = user_info[key];
    $('input[name="' + key + '"]').val(value);
  } 
}

document.addEventListener("DOMContentLoaded", restore_options);

$(function() {
  document.querySelector('#submit').addEventListener('click', save_options);
  // var a = "hello";
  // var ciphertext = CryptoJS.AES.encrypt(a, "hi");
  // console.log(ciphertext.toString());
  // var plaintext = CryptoJS.AES.decrypt(ciphertext, "hi");
  // console.log(plaintext.toString(CryptoJS.enc.Utf8));
});