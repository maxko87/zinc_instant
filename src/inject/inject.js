MAX_SELECTORS = 2; // so it's an individual product page

retailers = [
  // ['amazon',          '#title',              '#priceblock_ourprice'],
  // ['amazon',          '#btAsinTitle',        '#actualPriceValue'],
  // ['amazon',          'BLANK',               '#priceblock_saleprice'],
  ["Macy's",          '#productTitle',       '.standardProdPricingGroup > span:last', '.productQuantity',
    ['.productColor', '.sizes .selected']
  ],
  // ['ebay',            '#itemTitle',          '#prcIsum'],
  // ['walmart',         '.productTitle',       '.bigPriceText1'],
  // ['bestbuy',         '#sku-title',          '.item-price'],
  // ['target',          '.product-name',       '.offerPrice'],
  // ['newegg',          '#grpDescrip_0',       '#singleFinalPrice'],
  // ['home_depot',      '.product_title',      '#ajaxPrice'],
  // ['zappos',          '.banner',             '#priceSlot'],
  // ['gap',             '.productName',        '#priceText'],
  // ['victorias_secret','.name h1',            '.price p'],
  // ['forever_21',      '.product-title',      '.product-price'],
  // ['net_a_porter',    '#product-details h1', '#price'],
  // ['shopbop',         '.product-title',      '.priceBlock'],
  // ['modcloth',        '#product-name',       '#product-price'],
  // ['jcrew',           '.description h1',     '.product-detail-price'], // broken
  // ['overstock',       'div[itemprop="name"]','.main-price-red'],
  // ['nordstrom',       '.bHeading',           'li[itemprop="price"]'],
  // ['nordstrom',       '.pdp_title',          '.gallery_page_price'],
  // ['staples',         '.brand-content',      '.price'],
  // ['barnes_and_noble','.productDetails h1',  '.finalPrice'],
  // ['kohls',           '#product-title-1 h1', '.price.hilight'],
  // ['nike',            '.productTitleName',   '.productdet .sale'],
  // ['hm',              '.exp-product-title',  '.exp-pdp-local-price'],
  // ['tigerdirect',     '.longTitle',          '#text-ql-price'],
  // ['jcpenney',        '.prodName h1',        '.salePrice'],
  // ['sephora',         '.h1.OneLinkNoTx',     '.sku-price .price'], // broken
  // ['ae',              '.pName',              '.mainEquity .price'],
  // ['bebe',            '.crumb.last',         '.currentPrice'],
  // ['squishable',      '#itemTitle',          '.itemPrice']
]

var title = null;
var price = null;
var title_selector = null;
var price_selector = null;
var retailer = null;

get_title = function(title_selector){
  var title = document.querySelector(title_selector).innerText;
  return title;
}

get_price = function(price_selector){
  // var price = document.querySelector(price_selector).innerText;
  var price = $(price_selector).text();
  if (price.indexOf('-') > -1){
    price = price.substring(price.indexOf('-'));
  }
  price = price.replace(/[^0-9]/g, '');
  return price;
}

get_quantity = function(quantity_selector){
  var quantity = $(quantity_selector).val();
  return quantity;
}

get_variants = function(variants_selectors){
  var variants = [];
  for (var i=0; i<variants_selectors.length; i++){
    variants_selector = variants_selectors[i];
    variant = $(variants_selector).text();//.replace(/^[^a-zA-Z0-9]*$/g, '');
    variants.push(variant);
  }
  return variants;
}

$(document).ready(function(){

  console.log('ready');

  for (i=0; i<retailers.length; i++){
    retailer = retailers[i][0];
    title_selector = retailers[i][1];
    if (document.querySelector(title_selector) && document.querySelectorAll(title_selector).length <= MAX_SELECTORS) {
      title = get_title(title_selector);
      break;
    }
  }

  //ensures we fuzzy match
  for (var i=0; i<retailers.length; i++){
    price_selector = retailers[i][2];
    if ($(price_selector).length > 0){
      price = get_price(price_selector);
      break;
    }
  }

  console.log('recognized retailer: ' + retailer);
  console.log(title);
  console.log(price);

  quantity_selector = retailers[i][3];
  variants_selectors = retailers[i][4];

  // ensures we use a supported retailer
  // selector = price_selectors[i];
  // if (document.querySelector(selector) && document.querySelectorAll(selector).length <= MAX_SELECTORS) {

  if (title && price){
    setInterval(function(){
      title = get_title(title_selector);
      price = get_price(price_selector);
      quantity = get_quantity(quantity_selector);
      variants = get_variants(variants_selectors);
      message = {'_type': 'set_popup_contents', 'retailer': retailer, 'title': title, 'price': price, 'quantity': quantity, 'variants': variants}
      chrome.runtime.sendMessage(message);
    }, 300);
  }
  else {
    chrome.runtime.sendMessage({disable_tab: true});
  }

});
