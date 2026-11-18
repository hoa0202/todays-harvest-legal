(function (root, factory) {
  'use strict';
  var config = factory();
  if (typeof module === 'object' && module.exports) module.exports = config;
  else root.HarvestStoreConfig = config;
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  return Object.freeze({
    // Confirmed against the official Apple listing on 2026-10-26.
    ios: 'https://apps.apple.com/kr/app/id6824569485',
    // Google Play public listing verified in Korea on 2026-11-18.
    android: 'https://play.google.com/store/apps/details?id=com.creativeforoneself2.todaysharvest'
  });
});
