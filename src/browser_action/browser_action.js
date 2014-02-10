DOMAIN = "http://localhost:5000";
// DOMAIN = "https://api.zinc.io";

get_our_total = function(their_total_cents){
  return their_total_cents - (their_total_cents%489);
}

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

display_price = function(price){
  return "$" + parseFloat(price/100).toFixed(2);
}

popup_info_received_callback = function(data){ // TODO: less global vars..
  tax_basis_points = data['tax_basis_points'];
  their_shipping_methods = data['shipping_methods'];
  shipping_address_line1 = data['shipping_address_line1'];
  brand = data['brand'];
  last_four = data['last_four'];

  their_tax_raw = parseInt((their_price_raw * tax_basis_points * 1.0) / 10000);

  // set constant stuff
  $('#title').text(title);
  $('#retailer').text(retailer);
  $('#quantity').text(quantity);
  $('#variants').text(variants.join(', '));

  $('#card_brand_image').attr("alt", brand);
  $('#card_brand_image').attr("src", "/icons/cards/" + brand + ".png");
  $('#shipping_address_line1').text(shipping_address_line1);
  $('#last_four').text(last_four);

  // hide if all variants aren't selected
  variants.forEach(function(variant){
    if (variant.length == 0){
      console.log(variant);
      console.log(variant.length);
      $('.hide1').css('display', 'none');
      $('#missing-variants').css('display', 'block');
    }
  });

  //dropdown to select shipping method
  var select_html = '<select id="retailer_shipping_methods"><option value="-1">Select a shipping method</option>';
  for (var shipping_method in their_shipping_methods){
    var shipping_price = their_shipping_methods[shipping_method];
    select_html += '<option value="' + shipping_method + '">' + shipping_method + ' (' + display_price(shipping_price) + ')</option>';
  }
  select_html += '</select>';
  $('#shipping_methods').html(select_html);

  //listener for shipping method
  $('#retailer_shipping_methods').change(function(){

    //calculate their total price and our price
    var value = $('#retailer_shipping_methods').val();
    if (value == -1){
      $('.hide2').css('display', 'none');
      return;
    }
    their_shipping_raw = their_shipping_methods[value];
    console.log('shipping choice price: ' + their_shipping_raw);

    console.log(their_price_raw);
    console.log(their_tax_raw);
    console.log(their_shipping_raw);
    their_total_raw = parseInt(their_price_raw) + parseInt(their_tax_raw) + parseInt(their_shipping_raw);
    our_total_raw = get_our_total(their_total_raw);
    savings_raw = their_total_raw - our_total_raw;

    //format as prices
    their_price = display_price(their_price_raw);
    our_total = display_price(our_total_raw);
    savings = display_price(savings_raw);
    their_tax = display_price(their_tax_raw);
    their_shipping = display_price(their_shipping_raw);
    their_total = display_price(their_total_raw);

    //set all the values in html
    $('#their_total').text(their_total);
    $('#their_price').text(their_price);
    $('#their_tax').text(their_tax);
    $('#their_shipping').text(their_shipping);
    $('#savings').text(savings);
    $('#our_total').text(our_total);

    //show it all
    $('.hide2').css('display', 'block');
  });
}

$(document).ready(function(){

  $('.to_options').click(function(event) {
    chrome.tabs.create({url: '/src/options/options.html'});
  });

  if (!safe_get('email')) {
    $('#buy-form').hide();
    $('#registration').show();
    return;
  }

  process_current_tab(function(tab){

    //pull and set fixed data values
    var tab_content_map = chrome.extension.getBackgroundPage().tab_content_map;
    retailer = tab_content_map[tab.id].retailer;
    title = tab_content_map[tab.id].title;
    their_price_raw = tab_content_map[tab.id].price;
    quantity = tab_content_map[tab.id].quantity;
    variants = tab_content_map[tab.id].variants;

    // API call to get tax, shipping method, etc information
    $('.spinner').css('display', 'block');
    var data = {'email': safe_get('email'), 'retailer': retailer, 'their_price_raw': their_price_raw};
    $.post(DOMAIN + "/v0/instant_get_popup_info", JSON.stringify(data))
    .done(function (data){
      $('.spinner').css('display', 'none');
      if (data['_type'] == 'error'){
        show_error(data['message'])
      }
      else{
        popup_info_received_callback(data);
      }
    });
  });
});

  // TODO: refactor this to work with new system
  // $('#buy').click(function(event){
  //   event.preventDefault();
  //   // API call to make the purchase
  //   chrome.tabs.captureVisibleTab(null, {}, function (image) {
  //     process_current_tab(function(tab) {
  //       var tab_content_map = chrome.extension.getBackgroundPage().tab_content_map;
  //       var product_data = tab_content_map[tab.id];
  //       var email = safe_get('email');
  //       var password = $("#password").val();
  //       if (password.length == 0){
  //         show_error("Please enter your password to authorize the purchase.");
  //         return;
  //       }
  //       data = {'email': email, 'password': password, "image": image, "product_data": product_data, "url": tab.url};
  //       $('.spinner').css('display', 'block');
  //       $('#buy').css('display', 'none');
  //       $('#password').css('display', 'none');
  //       $.post(DOMAIN + "/v0/instant_buy", JSON.stringify(data))
//         .done(function (data){
//           $('.spinner').css('display', 'none');
//           if (data['_type'] == 'error'){
//             show_error(data['message']);
//           }
//           else{
//             show_success('Order placed successfully! You will receive a confirmation email shortly.');
//           }
//         });
  //     });
  //   });
  // });

