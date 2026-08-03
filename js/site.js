/* ARCA CONSULTANCY — site behaviour (from the design handoff's logic class) */
(function () {
  'use strict';

  /* ------- logo rows (marquees; sources are black-on-transparent, recolored via CSS filter) ------- */
  var clients = [
    { src: 'assets/logos/ser-cream.png', alt: 'SER', h: 46 },
    { src: 'assets/logos/miale.png', alt: 'Mialé', h: 38 },
    { src: 'assets/logos/mai-petit-cream2.png', alt: 'Mai Petit', h: 48 },
    { src: 'assets/logos/ola-azul.png', alt: 'Ola Azul', h: 32 },
    { src: 'assets/logos/cristian-tula.png', alt: 'Cristian Tula', h: 22 },
    { src: 'assets/logos/bahama-mama.png', alt: 'Bahama Mama', h: 21 },
    { src: 'assets/logos/francques-cream.png', alt: 'Francques', h: 26 },
    { src: 'assets/logos/andres-pajon.svg', alt: 'Andrés Pajón', h: 30 },
    { src: 'assets/logos/lululemon.png', alt: 'lululemon', h: 34 },
    { src: 'assets/logos/pitusa.png', alt: 'Pitusa', h: 30 },
    { src: 'assets/logos/reina-olga.png', alt: 'Reina Olga', h: 36 },
    { src: 'assets/logos/agua-by-agua-bendita.png', alt: 'Agua by Agua Bendita', h: 46 },
    { src: 'assets/logos/cala-de-la-cruz.png', alt: 'Cala de la Cruz', h: 34 }
  ];
  var press = [
    { src: 'assets/logos/vogue-mexico.svg', alt: 'Vogue México', h: 42 },
    { src: 'assets/logos/marie-claire.png', alt: 'Marie Claire Colombia', h: 32 },
    { src: 'assets/logos/cult-mia.png', alt: 'Cult Mia', h: 36 },
    { src: 'assets/logos/colombiamoda-cream.png', alt: 'Colombiamoda', h: 44 },
    { src: 'assets/logos/inexmoda.svg', alt: 'Inexmoda', h: 38 },
    { src: 'assets/logos/fgi-colombia.png', alt: 'FGI Colombia', h: 44 },
    { src: 'assets/logos/premiere-vision-cream.png', alt: 'Première Vision Paris', h: 34 }
  ];
  var buyers = [
    { src: 'assets/buyers/net-a-porter.png', alt: 'Net-A-Porter', h: 22 },
    { src: 'assets/buyers/harrods.png', alt: 'Harrods', h: 36 },
    { src: 'assets/buyers/selfridges.png', alt: 'Selfridges', h: 26 },
    { src: 'assets/buyers/liberty-london.png', alt: 'Liberty', h: 26 },
    { src: 'assets/buyers/kith.png', alt: 'KITH', h: 34 },
    { src: 'assets/buyers/mytheresa.png', alt: 'MyTheresa', h: 24 },
    { src: 'assets/buyers/moda-operandi.png', alt: 'Moda Operandi', h: 20 },
    { src: 'assets/buyers/harvey-nichols.png', alt: 'Harvey Nichols', h: 22 },
    { src: 'assets/buyers/printemps.png', alt: 'Printemps', h: 26 },
    { src: 'assets/buyers/le-bon-marche-mono.png', alt: 'Le Bon Marché', h: 40 },
    { src: 'assets/buyers/galeries-lafayette.png', alt: 'Galeries Lafayette', h: 36 },
    { src: 'assets/buyers/revolve.png', alt: 'Revolve', h: 26 }
  ];

  // rows are duplicated 2× so the translateX(-50%) loop is seamless
  function fillRow(id, defs, filterClass) {
    var row = document.getElementById(id);
    if (!row) return;
    defs.concat(defs).forEach(function (d, i) {
      var img = document.createElement('img');
      img.src = d.src;
      img.style.height = d.h + 'px';
      img.className = filterClass;
      if (i < defs.length) {
        img.alt = d.alt;
      } else {
        img.alt = '';                       // seamless-loop duplicate:
        img.setAttribute('aria-hidden', 'true'); // hidden from screen readers
      }
      row.appendChild(img);
    });
  }
  fillRow('client-row-blue', clients, 'logo-blue');
  fillRow('client-row-cream', clients, 'logo-cream');
  fillRow('buyer-row', buyers, 'logo-cream');
  fillRow('press-row', press, 'logo-cream');

  /* ------- collection video: play once when vertically centered in viewport, no replay ------- */
  var cv = document.getElementById('collection-video');
  if (cv) {
    cv.muted = true;
    var played = false;
    var check = function () {
      if (played) return;
      var r = cv.getBoundingClientRect();
      var mid = r.top + r.height / 2, vc = window.innerHeight / 2;
      if (Math.abs(mid - vc) < window.innerHeight * 0.25) {
        played = true;
        cv.play().catch(function () {});
        window.removeEventListener('scroll', check);
      }
    };
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  /* ------- L-shaped connector lines between "What we do" blocks ------- */
  var svcLinesShown = false;
  function drawSvcLines() {
    var list = document.getElementById('svc-list');
    if (!list) return;
    list.querySelectorAll('[data-svc-line]').forEach(function (n) { n.remove(); });
    if (window.matchMedia('(max-width: 900px)').matches) return; // mobile: horizontal rail, no lines
    var blocks = Array.prototype.filter.call(list.children, function (el) {
      return !el.hasAttribute('data-svc-line');
    });
    var segs = [];
    function mk(st, origin, delay) {
      var d = document.createElement('div');
      d.setAttribute('data-svc-line', '');
      d.style.position = 'absolute';
      d.style.background = 'rgba(8,23,126,.3)';
      d.style.pointerEvents = 'none';
      d.style.transform = origin === 'top' ? 'scaleY(0)' : 'scaleX(0)';
      d.style.transformOrigin = origin === 'top' ? 'top' : 'left';
      d.style.transition = 'transform .6s ease ' + delay + 'ms';
      for (var k in st) d.style[k] = st[k];
      list.appendChild(d);
      segs.push(d);
    }
    for (var i = 1; i < blocks.length; i++) {
      var prev = blocks[i - 1], cur = blocks[i];
      var x1 = prev.offsetLeft + 52, x2 = cur.offsetLeft;
      var yStart = prev.offsetTop + prev.offsetHeight, yTurn = cur.offsetTop + 52;
      if (x2 <= x1) continue;
      var k = i - 1;
      mk({ left: x1 + 'px', top: yStart + 'px', width: '1px', height: (yTurn - yStart) + 'px' }, 'top', k * 900);
      mk({ left: x1 + 'px', top: yTurn + 'px', width: (x2 - x1) + 'px', height: '1px' }, 'left', k * 900 + 500);
    }
    if (svcLinesShown) {
      segs.forEach(function (d) { d.style.transition = 'none'; d.style.transform = 'none'; });
    } else {
      var io = new IntersectionObserver(function (es) {
        if (es.some(function (e) { return e.isIntersecting; })) {
          svcLinesShown = true;
          segs.forEach(function (d) { d.style.transform = 'none'; });
          io.disconnect();
        }
      }, { threshold: 0.2 });
      io.observe(list);
    }
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { setTimeout(drawSvcLines, 50); });
  } else {
    setTimeout(drawSvcLines, 300);
  }
  window.addEventListener('resize', drawSvcLines);

  /* ------- hero video: keep playing ------- */
  var hv = document.getElementById('hero-video');
  if (hv) {
    hv.muted = true; hv.loop = true; hv.autoplay = true;
    var heroHidden = window.matchMedia('(max-width: 900px)');
    var go = function () { if (!heroHidden.matches) hv.play().catch(function () {}); };
    var syncHero = function () { if (heroHidden.matches) { hv.pause(); } else { go(); } };
    hv.addEventListener('pause', go);
    hv.addEventListener('ended', go);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) go(); });
    if (heroHidden.addEventListener) heroHidden.addEventListener('change', syncHero);
    syncHero();
  }

  /* ------- reveal on scroll ------- */
  var rvEls = document.querySelectorAll('[data-rv]');
  if ('IntersectionObserver' in window) {
    var rvIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('rv-in'); rvIo.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    rvEls.forEach(function (el) { rvIo.observe(el); });
  } else {
    rvEls.forEach(function (el) { el.classList.add('rv-in'); });
  }

  /* ------- smooth scroll engine: eased anchors + gentle section snap-assist -------
     Replaces CSS scroll-snap (mandatory felt abrupt, and Safari's native snap
     fights momentum). Pure rAF easing — identical feel in Chrome and Safari. */
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var animId = null;

  function cancelScrollAnim() {
    if (animId) { cancelAnimationFrame(animId); animId = null; }
  }
  function animateScrollTo(targetY, duration) {
    cancelScrollAnim();
    var startY = window.pageYOffset;
    var maxY = document.documentElement.scrollHeight - window.innerHeight;
    targetY = Math.max(0, Math.min(targetY, maxY));
    var delta = targetY - startY;
    if (Math.abs(delta) < 2) return;
    var start = null;
    var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
    var stepFn = function (ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      window.scrollTo(0, startY + delta * ease(p));
      if (p < 1) { animId = requestAnimationFrame(stepFn); } else { animId = null; }
    };
    animId = requestAnimationFrame(stepFn);
  }

  // eased anchor navigation (duration scales with distance)
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href').slice(1);
      var target = id ? document.getElementById(id) : null;
      if (!target && id !== 'top') return;
      ev.preventDefault();
      var y = id === 'top' ? 0 : target.offsetTop; // offsetTop: unaffected by reveal transforms
      if (reducedMotion) { window.scrollTo(0, y); } else {
        var dist = Math.abs(y - window.pageYOffset);
        animateScrollTo(y, Math.max(450, Math.min(1100, dist * 0.55)));
      }
      if (history.pushState) history.pushState(null, '', '#' + id);
    });
  });

  // snap-assist: when scrolling settles near a section edge, glide to it.
  // Desktop AND mobile; with reduced-motion the snap still happens, just without easing.
  var snapTimer = null;
  var snapTargets = function () {
    return Array.prototype.map.call(
      document.querySelectorAll('main > section:not(.client-strip), footer'),
      function (el) { return el.offsetTop; } // layout position — reveal transforms don't skew it
    );
  };
  var trySnap = function () {
    if (animId) return;
    var y = window.pageYOffset;
    var isMobile = window.innerWidth <= 900;
    var win = window.innerHeight * (isMobile ? 0.35 : 0.42); // catch window around section edges
    var best = null, bestDist = win;
    snapTargets().forEach(function (t) {
      var d = Math.abs(t - y);
      if (d < bestDist) { best = t; bestDist = d; }
    });
    if (best !== null && bestDist > 2) {
      if (reducedMotion) { window.scrollTo(0, best); }
      else { animateScrollTo(best, Math.max(380, Math.min(750, bestDist * 1.2))); }
    }
  };
  window.addEventListener('scroll', function () {
    if (animId) return;                     // our own animation — leave it alone
    clearTimeout(snapTimer);
    snapTimer = setTimeout(trySnap, 120);
  }, { passive: true });
  // any fresh user intent cancels an in-flight glide immediately
  ['wheel', 'touchstart', 'keydown'].forEach(function (evt) {
    window.addEventListener(evt, cancelScrollAnim, { passive: true });
  });

  /* ------- contact form → POST /api/contact (Cloudflare Worker → honor@arca-consultancy.com) ------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var sent = false;
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (sent) return;
      var f = new FormData(form);
      var btn = document.getElementById('submit-btn');
      btn.disabled = true;
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name') || '',
          brand: f.get('brand') || '',
          website: f.get('website') || '',
          market: f.get('market') || '',
          message: f.get('message') || ''
        })
      }).then(function (res) {
        if (!res.ok) throw new Error('send failed');
        sent = true;
        btn.textContent = 'Received — we’ll be in touch';
      }).catch(function () {
        btn.disabled = false;
        btn.textContent = 'Send — try again';
      });
    });
  }
})();
