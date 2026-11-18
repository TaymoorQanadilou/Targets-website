/* Measurement: Google Ads + Meta Pixel + TikTok Pixel.
   Page views, service-page views and WhatsApp contact clicks. */
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'AW-18506972459');

/* Meta Pixel (Targets Agency) — used for retargeting site visitors. */
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1337845467924763');
fbq('track', 'PageView');

/* TikTok Pixel (Targets Agency - targetsagency.com) */
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=d.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=d.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load('DBUPR6JC77U1OIGLL9CG');
  ttq.page();
}(window, document, 'ttq');

/* Service pages: tell Meta and TikTok which service the visitor looked at. */
(function () {
  var path = location.pathname.replace(/^\/en/, '');
  var services = { '/ads/': 'Ads management', '/web/': 'Websites', '/automation/': 'Auto-reply', '/apps/': 'Apps' };
  var name = services[path];
  if (!name) return;
  fbq('track', 'ViewContent', { content_name: name, content_category: 'Service' });
  ttq.track('ViewContent', { contents: [{ content_id: path, content_name: name }], content_type: 'product' });
})();

document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href*="wa.me/"]');
  if (!a) return;
  gtag('event', 'conversion', { send_to: 'AW-18506972459/5IVUCN7vypodEKv65_hE' });
  fbq('track', 'Contact');
  ttq.track('Contact', { contents: [{ content_id: 'whatsapp', content_name: 'WhatsApp' }], content_type: 'product' });
});
