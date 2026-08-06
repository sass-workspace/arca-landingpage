/* ARCA CONSULTANCY — site behaviour (from the design handoff's logic class) */
(function () {
  'use strict';

  /* ------- logo rows (marquees; sources are black-on-transparent, recolored via CSS filter)

     Marks are sized on their CAP BAND, not their bounding box. Every file wraps its
     letterforms differently — a tagline under SER, an accent over MIALÉ, a Q tail on
     Valentina Quintero — so equal box heights produce wildly unequal letter sizes and
     equal box centres put the letterforms on different lines. Measuring the dominant
     ink band instead gives one consistent cap height (~19px) across every row.

       h  rendered box height = 19 / (cap band as a fraction of the file),
          clamped so w <= ~300px and so h/2 + |dy| stays inside the 56px row
       w  h × the file's natural aspect
       dy nudge that puts the cap band — not the box — on the row centre

     h/w are written as attributes so the row reserves its width before the images
     decode; otherwise width:max-content and the translateX(-50%) loop both shift as
     logos land, which reads as a misaligned strip on first paint.

     Signatures, monograms and symbol+wordmark lockups have no meaningful cap band, so
     they are sized by optical mass by hand: Andrés Pajón, kibys, lululemon,
     Le Bon Marché, FGI Colombia.

     A def with `label` instead of `src` renders a TODO chip for a logo we don't have yet.
     Re-measure with the cap-band sweep before changing any of these numbers. ------- */
  var clients = [
    { src: '/assets/logos/ser-cream.png', alt: 'SER', h: 30, w: 48, dy: 4 },       // tagline below
    { src: '/assets/logos/mai-petit.svg', alt: 'Mai Petit', h: 19, w: 155 },
    { src: '/assets/logos/miale.png', alt: 'Mialé', h: 27, w: 104, dy: -4 },       // é accent above
    { src: '/assets/logos/valentina-quintero.png', alt: 'Valentina Quintero', h: 32, w: 282, dy: 3 },
    { src: '/assets/logos/ola-azul.png', alt: 'Ola Azul', h: 20, w: 138 },
    { src: '/assets/logos/maygel-coronel.png', alt: 'Maygel Coronel', h: 19, w: 295 },
    { src: '/assets/logos/cristian-tula.png', alt: 'Cristian Tula', h: 35, w: 300 }, // width-clamped
    { src: '/assets/logos/francques-cream.png', alt: 'Francques', h: 20, w: 148 },
    { src: '/assets/logos/soloio.png', alt: 'Soloio', h: 26, w: 107, dy: -3 },
    { src: '/assets/logos/andres-pajon.svg', alt: 'Andrés Pajón', h: 28, w: 158, dy: 3 }, // signature
    { src: '/assets/logos/kibys.png', alt: 'kibys', h: 31, w: 31 },                // monogram
    { src: '/assets/logos/lululemon.png', alt: 'lululemon', h: 40, w: 155, dy: -2 }, // symbol lockup
    { src: '/assets/logos/pitusa.png', alt: 'Pitusa', h: 32, w: 111 },
    { src: '/assets/logos/casabela.png', alt: 'Casabela', h: 20, w: 127 },
    { src: '/assets/logos/cala-de-la-cruz.png', alt: 'Cala de la Cruz', h: 49, w: 302 } // width-clamped
  ];
  var press = [
    { src: '/assets/logos/vogue-mexico.svg', alt: 'Vogue México', h: 36, w: 154, dy: 9 },
    { src: '/assets/logos/marie-claire.png', alt: 'Marie Claire Colombia', h: 32, w: 186, dy: -3 },
    { src: '/assets/logos/cult-mia.png', alt: 'Cult Mia', h: 20, w: 96 },
    { src: '/assets/logos/colombiamoda-cream.png', alt: 'Colombiamoda', h: 40, w: 271, dy: 7 },
    { src: '/assets/logos/inexmoda.svg', alt: 'Inexmoda', h: 37, w: 170, dy: 2 },
    { src: '/assets/logos/fgi-colombia.png', alt: 'FGI Colombia', h: 34, w: 34, dy: -6 }, // round badge
    { src: '/assets/logos/premiere-vision-cream.png', alt: 'Première Vision Paris', h: 21, w: 54 }
  ];
  var buyers = [
    { src: '/assets/buyers/net-a-porter.png', alt: 'Net-A-Porter', h: 20, w: 245 },
    { src: '/assets/buyers/harrods.png', alt: 'Harrods', h: 41, w: 94, dy: -6 },
    { src: '/assets/buyers/selfridges.png', alt: 'Selfridges', h: 20, w: 127 },
    { src: '/assets/buyers/liberty-london.png', alt: 'Liberty', h: 20, w: 123 },
    { src: '/assets/buyers/kith.png', alt: 'KITH', h: 19, w: 45 },
    { src: '/assets/buyers/mytheresa.png', alt: 'MyTheresa', h: 20, w: 161 },
    { src: '/assets/buyers/moda-operandi.png', alt: 'Moda Operandi', h: 18, w: 304 },
    { src: '/assets/buyers/harvey-nichols.png', alt: 'Harvey Nichols', h: 22, w: 273 },
    { src: '/assets/buyers/printemps.png', alt: 'Printemps', h: 20, w: 167 },
    { src: '/assets/buyers/le-bon-marche-mono.png', alt: 'Le Bon Marché', h: 34, w: 33, dy: -5 }, // stacked
    { src: '/assets/buyers/galeries-lafayette.png', alt: 'Galeries Lafayette', h: 30, w: 58, dy: -2 },
    { src: '/assets/buyers/revolve.png', alt: 'Revolve', h: 20, w: 133 }
  ];

  // rows are duplicated 2× so the translateX(-50%) loop is seamless
  function fillRow(id, defs, filterClass) {
    var row = document.getElementById(id);
    if (!row) return;
    defs.concat(defs).forEach(function (d, i) {
      var isDup = i >= defs.length;         // seamless-loop copy: hidden from screen readers
      var node;
      if (d.label) {
        node = document.createElement('span');
        node.className = 'chip-todo';       // never filterClass — the filters start with
        node.textContent = d.label;         // brightness(0) and would flatten the yellow
        if (isDup) node.setAttribute('aria-hidden', 'true');
      } else {
        node = document.createElement('img');
        node.src = d.src;
        node.width = d.w;
        node.height = d.h;
        node.className = filterClass;
        node.alt = isDup ? '' : d.alt;
        if (d.dy) node.style.transform = 'translateY(' + d.dy + 'px)';
        if (isDup) node.setAttribute('aria-hidden', 'true');
      }
      row.appendChild(node);
    });
  }
  fillRow('client-row-blue', clients, 'logo-blue');
  fillRow('client-row-cream', clients, 'logo-cream');
  fillRow('buyer-row', buyers, 'logo-cream');
  fillRow('press-row', press, 'logo-cream');

  /* The loop is translateX(-50%) of the row's own width, and a composited animation
     resolves that percentage ONCE, when it starts. The rows are empty in the markup
     and filled here, so the animation can start against a near-zero width and latch a
     travel distance of a few px — the strip then looks frozen until something forces a
     re-composite (scrolling the page end to end was the reported workaround).
     Restart the animations now that the rows have their real width, and again whenever
     that width changes: the gap drops 80 → 52 → 40px across the breakpoints, so a
     resize past one otherwise leaves the loop travelling the wrong distance. */
  var lastRowWidth = 0;
  function syncMarquees() {
    var rows = document.querySelectorAll('.marquee');
    if (!rows.length) return;
    var w = rows[0].scrollWidth;
    if (w === lastRowWidth) return;
    lastRowWidth = w;
    Array.prototype.forEach.call(rows, function (row) {
      row.style.animation = 'none';
      void row.offsetWidth;              // force layout so the new width is committed
      row.style.animation = '';          // hand it back to the class, restarted
    });
  }
  syncMarquees();
  var marqueeResizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(marqueeResizeTimer);
    marqueeResizeTimer = setTimeout(syncMarquees, 200);
  });

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

  /* ------- smooth scroll engine: eased anchor navigation only -------
     Section snapping (CSS scroll-snap, then a JS snap-assist) was removed after
     review: settling near a section edge pulled the page back, which read as the
     scroll bouncing. Free scrolling now; only nav clicks are animated.
     Pure rAF easing — identical feel in Chrome and Safari. */
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

  // any fresh user intent cancels an in-flight glide immediately
  ['wheel', 'touchstart', 'keydown'].forEach(function (evt) {
    window.addEventListener(evt, cancelScrollAnim, { passive: true });
  });

  /* ------- contact form → POST /api/contact (Cloudflare Worker → honor@arca-consultancy.com) -------
     The only user-facing strings in JS. Everything else is in the markup, so a new
     language means a new page plus two entries here. */
  var COPY = {
    en: { sent: 'Received — we’ll be in touch', retry: 'Send — try again' },
    es: { sent: 'Recibido — nos pondremos en contacto', retry: 'Enviar — intenta de nuevo' }
  };
  var t = COPY[(document.documentElement.lang || 'en').slice(0, 2)] || COPY.en;

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
        btn.textContent = t.sent;
      }).catch(function () {
        btn.disabled = false;
        btn.textContent = t.retry;
      });
    });
  }
})();
