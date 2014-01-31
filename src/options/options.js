// DOMAIN = "http://localhost:5000";
DOMAIN = "https://api.zinc.io";

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
  var ciphertext_key = key//CryptoJS.AES.encrypt(key, chrome.extension.getBackgroundPage().pw).toString();
  var ciphertext_value = CryptoJS.AES.encrypt(plaintext, chrome.extension.getBackgroundPage().pw).toString();
  localStorage[ciphertext_key] = ciphertext_value;
}

safe_get = function(key){
  var ciphertext_key = key//CryptoJS.AES.encrypt(key, chrome.extension.getBackgroundPage().pw).toString();
  var ciphertext_value = localStorage[ciphertext_key];
  if (!ciphertext_value)
    return;
  var plaintext = CryptoJS.AES.decrypt(ciphertext_value, chrome.extension.getBackgroundPage().pw).toString(CryptoJS.enc.Utf8);
  console.log(plaintext);
  return JSON.parse(plaintext);
}

set_status = function (status_text_id, text, timeout, is_error){
  $status = $('#'+status_text_id);
  $status.text(text);
  if (is_error)
    $status.css('color', 'red');
  else
    $status.css('color', 'green');
  setTimeout(function() {
    $status.text("");
  }, timeout);
}

generic_form_submitter = function(status_text_id, form_selector) {
  var status = document.getElementById(status_text_id);
  if (!form_is_populated(form_selector)){
    set_status(status_text_id, "Please enter all required fields.", 3000, true);
    return false;
  }
  return true;
}

save_login = function() {
  if (generic_form_submitter("login-status", "#login-form")) {
    $('.spinner').css('display', 'block');
    email = $('#email').val();
    password = $('#password').val();
    safe_put('email', email);
    data = {'email': email, 'password': password};
    $.post(DOMAIN + "/v0/instant_update_user", JSON.stringify(data))
      .done(function (data){
        console.log(data);
        if (data['_type'] == 'error'){
          $('.spinner').css('display', 'none');
          console.log(data['message']);
          set_status("login-status", data['message'], 5000, true);
        }
        else {
          $('#login-form').css('display', 'none');
          $('.spinner').css('display', 'none');
          $('#main-form').css('display', 'block');
          restore_options(data['payload']);
        }
    });
  }
}

save_options = function() {
  output = creditly.validate();
  if (!output){
    console.log('not output');
    set_status("status", "Invalid credit card information.", 3000, true);
  }
  if (output && generic_form_submitter("status", "#main-form")){
    payload = get_object_from_form("#main-form");
    data = {'email': email, 'password': password, 'payload': payload} // TODO: email and password are global from before
    $.post(DOMAIN + "/v0/instant_update_user", JSON.stringify(data))
      .done(function (data){
        if (data['_type'] == 'error'){
          set_status("status", data['message'], 5000, true);
        }
        else {
          set_status("status", "Information successfully saved!", 3000, false);
        }
    });
  }
}


restore_options = function(payload) {
  // key is the form input id, val
  for (var key in payload){
    var selector = 'input[name="' + key + '"]';
    if ($(selector).length == 0){
      selector = 'select[name="' + key + '"]';
    }
    var value = payload[key];
    $(selector).val(value);
  } 
}

// document.addEventListener("DOMContentLoaded", restore_options);

$(function() {

  $('.fake-button').click(function(event){
    event.preventDefault();
  });

  $('#same-as-billing').click(function(event){
    var is_checked = $(this).is(':checked');
    console.log(is_checked);
    $('.billing-address-information input').each(function(index, input){
      if (input.name.indexOf('billing') > -1) {
        new_name = input.name.replace('billing', 'shipping');
        if (is_checked){
          new_value = $(input).val();
        }
        else{
          new_value = "";   
        }
        $('input[name="' + new_name +'"]').val(new_value);
      }
    });
    if (is_checked){
      $('select[name="shipping_country"]').val($('select[name="billing_country"]').val());
    }
    else {
      $('select[name="shipping_country"]').val('');
    }
  });

  // check if user has email saved to local storage (logged in)
  var email = safe_get('email');
  if (email){
    $('.login_or_register').text("log in");
    $('#email').val(email);
  }
  else {
    $('.login_or_register').text("register or log in");
  }



  document.querySelector('#login-submit').addEventListener('click', save_login);
  document.querySelector('#submit').addEventListener('click', save_options);

  creditly = Creditly.initialize(
    '.expiration_month_and_year',
    '.credit_card_number',
    '.security_code',
    '.card_type');

    // $(".creditly-card-form .submit").click(function(e) {
    //   e.preventDefault();
    //   var output = creditly.validate();
    //   if (output) {
    //     // Your validated credit card output
    //     console.log(output);
    //   }
    // });

});








