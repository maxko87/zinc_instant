MAX_SELECTORS = 2; // so it's an individual product page

// REQUESTS: squishable, bebe

retailers = [
  ['amazon',           '#title',                              '#priceblock_ourprice'],
  ['amazon',           '#btAsinTitle',                        '#actualPriceValue'],
  ['amazon',           'BLANK',                               '#priceblock_saleprice'],
  ['ebay',             '#itemTitle',                          '#prcIsum'],
  ['walmart',          '.productTitle',                       '.bigPriceText1'],
  ['bestbuy',          '#sku-title',                          '.item-price'],
  ['target',           '.product-name',                       '.offerPrice'],
  ['newegg',           '#grpDescrip_0',                       '#singleFinalPrice'],
  ['home_depot',       '.product_title',                      '#ajaxPrice'],
  ['zappos',           '.banner',                             '#priceSlot'],
  ['gap',              '.productName',                        '#priceText'],
  ['victorias_secret', '.name h1',                            '.price p'],
  ['forever_21',       '.product-title',                      '.product-price'],
  ['net_a_porter',     '#product-details h1',                 '#price'],
  ['shopbop',          '.product-title',                      '.priceBlock'],
  ['modcloth',         '#product-name',                       '#product-price'],
  ['jcrew',            '.description h1',                     '.product-detail-price'], // broken
  ['macys',            '#productTitle',                       '.standardProdPricingGroup'],
  ['overstock',        'div[itemprop="name"]',                '.main-price-red'],
  ['nordstrom',        '.bHeading',                           'li[itemprop="price"]'],
  ['staples',          '.brand-content',                      '.price'],
  ['barnes_and_noble', '.productDetails h1',                  '.finalPrice'],
  ['kohls',            '#product-title-1 h1',                 '.price.hilight'],
  ['nike',             '.productTitleName',                   '.productdet .sale'],
  ['hm',               '.exp-product-title',                  '.exp-pdp-local-price'],
  ['tigerdirect',      '.longTitle',                          '#text-ql-price'],
  ['jcpenney',         '.prodName h1',                        '.salePrice'],
  ['nordstrom2',       '.pdp_title',                          '.gallery_page_price'],
  ['sephora',          '.product-description h1.OneLinkNoTx', '.sku-price .price'], // broken
  ['ae',               '.pName',                              '.mainEquity .price'],

]

var title = null;
var price = null;

for (i=0; i<retailers.length; i++){
  var title_selector = retailers[i][1];
  if (document.querySelector(title_selector) && document.querySelectorAll(title_selector).length <= MAX_SELECTORS) {
    title = document.querySelector(title_selector).innerText;
    break;
  }
}

//ensures we fuzzy match
for (var i=0; i<retailers.length; i++){
  var price_selector = retailers[i][2];
  if (document.querySelector(price_selector)){// && document.querySelectorAll(price_selector).length <= MAX_SELECTORS) {
    price = document.querySelector(price_selector).innerText;
    break;
  }
}

// ensures we use a supported retailer
// selector = price_selectors[i];
// if (document.querySelector(selector) && document.querySelectorAll(selector).length <= MAX_SELECTORS) {
//   price = document.querySelector(selector).innerText;

var message = "";
if (title && price){
  chrome.runtime.sendMessage({confirmation: {'title': title, 'price': price}});
}
else {
  chrome.runtime.sendMessage({disable_tab: true});
}


