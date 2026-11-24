/* Marsa Tales legal pages: AR/EN switch. No network, no tracking.
   Order of preference: ?lang=ar|en in the URL, then the stored choice,
   then the browser language. Without JavaScript both languages stay visible. */
(function () {
  var KEY = 'marsa-lang';
  var html = document.documentElement;

  function store(l) { try { localStorage.setItem(KEY, l); } catch (e) {} }
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function valid(l) { return l === 'ar' || l === 'en'; }

  function pick() {
    var q = null;
    try { q = new URLSearchParams(location.search).get('lang'); } catch (e) {}
    if (valid(q)) { store(q); return q; }
    var s = stored();
    if (valid(s)) return s;
    var n = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase();
    return n.indexOf('ar') === 0 ? 'ar' : 'en';
  }

  function apply(l) {
    html.setAttribute('data-lang', l);
    html.setAttribute('lang', l);
    html.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
    try { var links = document.querySelectorAll('[data-set-lang]'); for (var i = 0; i < links.length; i++) { if (links[i].getAttribute('data-set-lang') === l) links[i].setAttribute('aria-current', 'true'); else links[i].removeAttribute('aria-current'); } } catch (e) {}
    var t = html.getAttribute('data-title-' + l);
    if (t) document.title = t;
  }

  apply(pick());

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('[data-set-lang]') : null;
    if (!a) return;
    var l = a.getAttribute('data-set-lang');
    if (!valid(l)) return;
    e.preventDefault();
    store(l);
    apply(l);
    try { history.replaceState(null, '', location.pathname); } catch (err) {}
  });
})();
