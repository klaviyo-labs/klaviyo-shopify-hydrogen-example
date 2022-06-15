import {useEffect} from 'react';
import {ClientAnalytics, loadScript} from '@shopify/hydrogen';

const PUBLIC_KEY = 'API_KEY';
const URL = `//static.klaviyo.com/onsite/js/klaviyo.js?company_id=${PUBLIC_KEY}`;
let init = false;

function trackViewedProduct(payload) {
  var _learnq = window._learnq || [];
  var product = {
    Name: payload.title,
    ProductID: payload.id.substring(payload.id.lastIndexOf('/') + 1),
    Categories:
      payload.collections == undefined
        ? null
        : payload.collections.map((a) => a.title),
    ImageURL: payload.featuredImage.url,
    URL: payload.url,
    Brand: payload.vendor,
    Price: payload.selectedVariant.priceV2.amount,
    CompareAtPrice: payload.selectedVariant.compareAtPriceV2.amount,
  };
  _learnq.push(['track', 'Viewed Product', product]);
}

function trackViewedItem(payload) {
  var _learnq = window._learnq || [];
  var item = {
    Title: payload.title,
    ItemId: payload.id.substring(payload.id.lastIndexOf('/') + 1),
    Categories:
      payload.collections == undefined
        ? null
        : payload.collections.map((a) => a.title),
    ImageUrl: payload.featuredImage.url,
    Url: payload.url,
    Metadata: {
      Brand: payload.vendor,
      Price: payload.selectedVariant.priceV2.amount,
      CompareAtPrice: payload.selectedVariant.compareAtPriceV2.amount,
    },
  };
  _learnq.push(['trackViewedItem', item]);
}

function trackAddToCart(payload) {
  var _learnq = window._learnq || [];
  var cart = {
    total_price: payload.cart.estimatedCost.totalAmount.amount,
    $value: payload.cart.estimatedCost.totalAmount.amount,
    original_total_price: payload.cart.estimatedCost.subtotalAmount,
    items: payload.cart.lines,
  };

  _learnq.push(['track', 'Added to Cart', cart]);
}

export default function KlaviyoOnsite() {
  useEffect(() => {
    if (!init) {
      init = true;
      loadScript(URL).catch(() => {});
      ClientAnalytics.subscribe(
        ClientAnalytics.eventNames.ADD_TO_CART,
        (payload) => {
          trackAddToCart(payload);
        },
      );

      ClientAnalytics.subscribe(
        ClientAnalytics.eventNames.VIEWED_PRODUCT,
        (payload) => {
          trackViewedProduct(payload);
          trackViewedItem(payload);
        },
      );
    }
  });
  return null;
}
