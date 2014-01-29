console.log('in inject.js');

retailers = ['amazon', 'ebay', 'walmart', 'bestbuy', 'target'];
title_selectors = ['#title', '#itemTitle','.productTitle', '#sku-title', '.product-name'];
price_selectors = ['#priceblock_ourprice', '#prcIsum', '.bigPriceText1', '.item-price', '.offerPrice'];

var title = null;
var price = null;

for (var i=0; i<title_selectors.length; i++){
  selector = title_selectors[i];
  if (document.querySelector(selector)) {
    title = document.querySelector(selector).innerText;
    break;
  }
}

for (var i=0; i<price_selectors.length; i++){
  selector = price_selectors[i];
  if (document.querySelector(selector)) {
    price = document.querySelector(selector).innerText;
    break;
  }
}

var message = "";
if (title && price){
  message = "Purchase " + title + " for " + price + "?";
  chrome.runtime.sendMessage({confirmation: message});
}
// else if (title){
//   message = "Purchase " + title + "?";
//   chrome.runtime.sendMessage({confirmation: message});
// }
else {
  // message = "Purchase this item?";
  chrome.runtime.sendMessage({disable_tab: true});
}


