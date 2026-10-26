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
    // Leave empty until an actual Google Play listing is approved and verified.
    android: ''
  });
});
