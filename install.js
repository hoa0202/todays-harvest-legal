(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else api.render(root.document, root.navigator, root.HarvestStoreConfig);
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  function platform(navigatorInfo) {
    var info = navigatorInfo || {};
    var ua = typeof info.userAgent === 'string' ? info.userAgent : '';
    var hints = info.userAgentData || {};
    // Android wins conflicting signals: never send an Android recipient to Apple.
    if (/Android/i.test(ua) || hints.platform === 'Android') return 'android';
    if (/iPhone|iPad|iPod/i.test(ua) || hints.platform === 'iOS' ||
        (info.platform === 'MacIntel' && Number(info.maxTouchPoints) > 1)) return 'ios';
    return 'unknown';
  }

  function storeUrl(value, target) {
    if (typeof value !== 'string' || !value) return '';
    try {
      var url = new URL(value);
      if (url.protocol !== 'https:' || url.username || url.password || url.port || url.hash) return '';
      if (target === 'ios' && url.hostname === 'apps.apple.com' &&
          /\/id6824569485$/.test(url.pathname) && !url.search) return url.href;
      if (target === 'android' && url.hostname === 'play.google.com' &&
          url.pathname === '/store/apps/details' && /^[a-zA-Z][\w]*(?:\.[\w]+)+$/.test(url.searchParams.get('id') || '') &&
          [...url.searchParams.keys()].length === 1) return url.href;
    } catch (_) { /* Missing or invalid configuration keeps the store link absent. */ }
    return '';
  }

  function resolve(navigatorInfo, config) {
    var target = platform(navigatorInfo), stores = config || {};
    if (target === 'android') {
      var android = storeUrl(stores.android, 'android');
      return { platform: target, url: android, label: android ? 'Google Play에서 받기' : '',
        message: android ? 'Google Play에서 오늘의 수확을 만나 보세요.' : 'Android 버전은 아직 준비 중이에요.' };
    }
    var ios = storeUrl(stores.ios, 'ios');
    return { platform: target, url: ios,
      label: ios ? (target === 'ios' ? 'App Store에서 받기' : 'iPhone·iPad용 App Store') : '',
      message: ios ? (target === 'ios' ? 'App Store에서 오늘의 수확을 만나 보세요.' : 'iPhone·iPad에서는 App Store에서 설치할 수 있어요.') : '설치 링크를 준비하고 있어요.' };
  }

  function render(document, navigatorInfo, config) {
    var result = resolve(navigatorInfo, config);
    var link = document.getElementById('store-link');
    // Empty means no href at all, not href="" (which would reload this page).
    link.hidden = true;
    link.removeAttribute('href');
    link.textContent = '';
    if (result.url) {
      link.setAttribute('href', result.url);
      link.textContent = result.label;
      link.hidden = false;
    }
    document.getElementById('store-status').textContent = result.message;
    return result;
  }

  // No redirects, network requests, query-string destinations, tracking or storage.
  return Object.freeze({ platform: platform, storeUrl: storeUrl, resolve: resolve, render: render });
});
