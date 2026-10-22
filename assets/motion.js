/* Calm motion for targetsagency.com. No dependencies, no text or colour changes.
   Skipped entirely when the visitor prefers reduced motion. */
(function () {
  'use strict';
  var mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!mq || mq.matches) return;

  /* 1. Calm reveal of each section's content as it scrolls into view. */
  function reveal() {
    if (!('IntersectionObserver' in window)) return;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var groups = document.querySelectorAll('main > section:not(.hero):not(.phero)');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        var i = +el.getAttribute('data-mv-i') || 0;
        el.style.transitionDelay = Math.min(i, 5) * 0.1 + 's';
        el.classList.add('mv-in');
        el.classList.remove('mv-pre');
        setTimeout(function () {
          el.classList.remove('mv-in');
          el.style.transitionDelay = '';
        }, 1800);
      });
    }, { rootMargin: '0px 0px -15% 0px', threshold: 0 });
    groups.forEach(function (sec) {
      var kids = sec.querySelectorAll(':scope > .wrap > *');
      kids.forEach(function (el, i) {
        if (el.getBoundingClientRect().top < vh * 0.85) return; /* already on screen */
        el.setAttribute('data-mv-i', i);
        el.classList.add('mv-pre');
        io.observe(el);
      });
    });
  }

  /* 2. Soft light rays behind the hero, in the brand red. */
  function rays(host) {
    var cv = document.createElement('canvas');
    cv.className = 'mv-rays';
    cv.setAttribute('aria-hidden', 'true');
    host.insertBefore(cv, host.firstChild);
    var ctx = cv.getContext('2d');
    if (!ctx) { cv.remove(); return; }
    var c = getComputedStyle(document.documentElement).getPropertyValue('--red').trim() || '#FF4343';
    var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(c);
    var rgb = m ? parseInt(m[1], 16) + ',' + parseInt(m[2], 16) + ',' + parseInt(m[3], 16) : '255,67,67';
    var SCALE = 0.35, w = 0, h = 0, visible = true, last = 0;
    var beams = [
      { x: 0.20, a: -0.25, s: 0.10, w: 0.16, p: 0.0, o: 0.16 },
      { x: 0.42, a: -0.05, s: 0.08, w: 0.12, p: 1.7, o: 0.12 },
      { x: 0.60, a: 0.12, s: 0.12, w: 0.18, p: 3.1, o: 0.14 },
      { x: 0.82, a: 0.30, s: 0.09, w: 0.14, p: 4.6, o: 0.10 }
    ];
    function size() {
      var r = host.getBoundingClientRect();
      w = cv.width = Math.max(1, Math.round(r.width * SCALE));
      h = cv.height = Math.max(1, Math.round(r.height * SCALE));
    }
    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      beams.forEach(function (b) {
        var sway = Math.sin(t / 5000 + b.p) * b.s;
        var ang = b.a + sway;
        var ox = b.x * w, oy = -h * 0.08, len = h * 1.5;
        var ex = ox + Math.sin(ang) * len, ey = oy + Math.cos(ang) * len;
        var half = b.w * w * 0.5;
        var g = ctx.createLinearGradient(ox, oy, ex, ey);
        var pulse = 0.75 + 0.25 * Math.sin(t / 3500 + b.p * 2);
        g.addColorStop(0, 'rgba(' + rgb + ',' + (b.o * pulse) + ')');
        g.addColorStop(1, 'rgba(' + rgb + ',0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(ox - half * 0.15, oy);
        ctx.lineTo(ox + half * 0.15, oy);
        ctx.lineTo(ex + half, ey);
        ctx.lineTo(ex - half, ey);
        ctx.closePath();
        ctx.fill();
      });
    }
    function loop(t) {
      if (mq.matches) { cv.remove(); return; }
      if (visible && !document.hidden && t - last > 33) { last = t; draw(t); }
      requestAnimationFrame(loop);
    }
    size();
    draw(0);
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(host);
    else window.addEventListener('resize', size);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(host);
    }
    requestAnimationFrame(loop);
  }

  function start() {
    reveal();
    var host = document.querySelector('.hero, .phero');
    if (host) rays(host);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

/* Mobile section links: bring the current page's link into view */
document.addEventListener('DOMContentLoaded',function(){var a=document.querySelector('.mnav a[aria-current="page"]');if(a&&a.parentNode.scrollWidth>a.parentNode.clientWidth){a.parentNode.scrollLeft+=a.getBoundingClientRect().left-a.parentNode.getBoundingClientRect().left-16;}});
