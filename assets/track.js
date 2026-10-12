/* Google Ads measurement: page views + WhatsApp contact clicks. */
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'AW-18506972459');
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href*="wa.me/"]');
  if (!a) return;
  gtag('event', 'conversion', { send_to: 'AW-18506972459/5IVUCN7vypodEKv65_hE' });
});
