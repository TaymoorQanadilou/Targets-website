/* Measurement: Google Ads + Meta Pixel. Page views + WhatsApp contact clicks. */
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

document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href*="wa.me/"]');
  if (!a) return;
  gtag('event', 'conversion', { send_to: 'AW-18506972459/5IVUCN7vypodEKv65_hE' });
  fbq('track', 'Contact');
});
