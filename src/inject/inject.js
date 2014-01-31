console.log('in inject.js');

retailers = ['amazon', 'amazon', 'ebay', 'walmart', 'bestbuy', 'target', 'newegg', 'home_depot', 'zappos', 'gap', 'victorias_secret', 'forever_21', 'net_a_porter', 'shopbop', 'modcloth', 'jcrew'];
title_selectors = ['#title', '#btAsinTitle', '#itemTitle','.productTitle', '#sku-title', '.product-name', '#grpDescrip_0', '.product_title', '.banner', '.productName', '.name h1', '.product-title', '#product-details h1', '.product-title', '#product-name', '#description h1'];
price_selectors = ['#priceblock_ourprice', '#actualPriceValue', '#prcIsum', '.bigPriceText1', '.item-price', '.offerPrice', '#singleFinalPrice', '#ajaxPrice', '#priceSlot', '#priceText', '.price p', '.product-price', '#price', '.priceBlock', '#product-price', '.full-price span'];
MAX_SELECTORS = 1; // so it's an individual product page

var title = null;
var price = null;

for (var i=0; i<title_selectors.length; i++){
  selector = title_selectors[i];
  if (document.querySelector(selector) && document.querySelectorAll(selector).length <= MAX_SELECTORS) {
    title = document.querySelector(selector).innerText;
    break;
  }
}

for (var i=0; i<price_selectors.length; i++){
  selector = price_selectors[i];
  if (document.querySelector(selector) && document.querySelectorAll(selector).length <= MAX_SELECTORS) {
    price = document.querySelector(selector).innerText;
    break;
  }
}

var message = "";
if (title && price){
  chrome.runtime.sendMessage({confirmation: {'title': title, 'price': price}});
  console.log('product page');
}
// else if (title){
//   message = "Purchase " + title + "?";
//   chrome.runtime.sendMessage({confirmation: message});
// }
else {
  // message = "Purchase this item?";
  chrome.runtime.sendMessage({disable_tab: true});
  console.log('non product page');
}


