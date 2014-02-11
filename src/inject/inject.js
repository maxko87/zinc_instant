inUrl = function(s){
  if (window.location.href.indexOf(s) > -1)
    return true;
  return false
}

inject_conditions = {
  'macys': inUrl('macys.com') && inUrl('ID='), 
  'victorias_secret': inUrl('victoriassecret.com') && inUrl('ProductID')
}

retailers = {
  'macys': {
    'retailer_name': "Macy's", 
    'title_selector': '#productTitle', 
    'price_selector': '.standardProdPricingGroup > span:last',
    'quantity_selector': '.productQuantity',
    'variants_selectors': ['.productColor', '.sizes .selected']
  },
  'victorias_secret': {
    'retailer_name': "Victoria's Secret", 
    'title_selector': '.name h1', 
    'price_selector': '.price p',
    'quantity_selector': '.qty a.selected',
    'variants_selectors': ['.color .selected:first', '.size .selected:first']
  }
}

// retailers = 
  // ['amazon',          '#title',              '#priceblock_ourprice'],
  // ['amazon',          '#btAsinTitle',        '#actualPriceValue'],
  // ['amazon',          'BLANK',               '#priceblock_saleprice'],
  // ['ebay',            '#itemTitle',          '#prcIsum'],
  // ['walmart',         '.productTitle',       '.bigPriceText1'],
  // ['bestbuy',         '#sku-title',          '.item-price'],
  // ['target',          '.product-name',       '.offerPrice'],
  // ['newegg',          '#grpDescrip_0',       '#singleFinalPrice'],
  // ['home_depot',      '.product_title',      '#ajaxPrice'],
  // ['zappos',          '.banner',             '#priceSlot'],
  // ['gap',             '.productName',        '#priceText'],
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
// ]

get_title = function(title_selector){
  var title = $(title_selector).text();
  return title;
}

get_price = function(price_selector){
  // var price = document.querySelector(price_selector).innerText;
  var price = $(price_selector).text();
  if (price.lastIndexOf('$') > -1){
    price = price.substring(price.lastIndexOf('$'));
  }
  price = price.replace(/[^0-9]/g, '');
  return price;
}

get_quantity = function(quantity_selector){
  var quantity = $(quantity_selector).val();
  if (quantity == ""){
    quantity = $(quantity_selector).text();
  }
  return quantity;
}

get_variants = function(variants_selectors){
  var variants = [];
  for (var i=0; i<variants_selectors.length; i++){
    variants_selector = variants_selectors[i];
    variant = $(variants_selector).text().replace(/^[^a-zA-Z0-9\.\ ]*$/g, '').trim().replace(/\ /, " ");
    variants.push(variant);
  }
  return variants;
}

attempt_popup_for_retailer = function(retailer_code){
  var retailer_name = retailers[retailer_code].retailer_name;
  var title_selector = retailers[retailer_code].title_selector;
  var price_selector = retailers[retailer_code].price_selector;
  var quantity_selector = retailers[retailer_code].quantity_selector;
  var variants_selectors = retailers[retailer_code].variants_selectors;
  // console.log(title_selector);
  // console.log(price_selector);
  // console.log(quantity_selector);
  // console.log(variants_selectors);

  setInterval(function(){
    var title = get_title(title_selector);
    var price = get_price(price_selector);
    var quantity = get_quantity(quantity_selector);
    var variants = get_variants(variants_selectors);

    // console.log(title);
    // console.log(price);
    // console.log(quantity);
    // console.log(variants);

    if (title && price){
      message = {'_type': 'set_popup_contents', 'retailer_code': retailer_code, 'retailer_name': retailer_name, 'title': title, 'price': price, 'quantity': quantity, 'variants': variants}
      chrome.runtime.sendMessage(message);
    }
    else{
      chrome.runtime.sendMessage({'_type': 'disable_tab'});
    }
  }, 300);
}


waitForJquery = setInterval(function(){
  console.log('waiting for jquery');
  if (window.$) {
    console.log('loaded jquery');
    for (retailer_code in inject_conditions){
      condition = inject_conditions[retailer_code];
      if (condition) {
        console.log('starting popup for ' + retailer_code);
        attempt_popup_for_retailer(retailer_code);
      }
    }
    clearInterval(waitForJquery);
  }
}, 200);