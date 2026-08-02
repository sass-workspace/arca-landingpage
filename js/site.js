/* ARCA CONSULTANCY — site behaviour (ported from Arca Landing.dc.html DCLogic) */
(function () {
  'use strict';

  /* ------- logo rows (marquees) ------- */
  var clients = [
    { src: 'assets/logos/ser-cream.png', alt: 'SER', h: 46 },
    { src: 'assets/logos/miale.png', alt: 'Mialé', h: 38 },
    { src: 'assets/logos/mai-petit.gif', alt: 'Mai Petit', h: 48 },
    { src: 'assets/logos/ola-azul.png', alt: 'Ola Azul', h: 32 },
    { src: 'assets/logos/cristian-tula.png', alt: 'Cristian Tula', h: 22 },
    { src: 'assets/logos/bahama-mama.png', alt: 'Bahama Mama', h: 21 },
    { src: 'assets/logos/francques.png', alt: 'Francques', h: 26 },
    { src: 'assets/logos/andres-pajon.svg', alt: 'Andrés Pajón', h: 30 },
    { src: 'assets/logos/lululemon.svg', alt: 'lululemon', h: 34 },
    { src: 'assets/logos/pitusa.png', alt: 'Pitusa', h: 30 },
    { src: 'assets/logos/reina-olga.png', alt: 'Reina Olga', h: 36 },
    { src: 'assets/logos/agua-by-agua-bendita.png', alt: 'Agua by Agua Bendita', h: 46 },
    { src: 'assets/logos/cala-de-la-cruz.png', alt: 'Cala de la Cruz', h: 34 }
  ];
  var press = [
    { src: 'assets/logos/vogue-mexico.svg', alt: 'Vogue México', h: 42 },
    { src: 'assets/logos/marie-claire.png', alt: 'Marie Claire Colombia', h: 32 },
    { src: 'assets/logos/cult-mia.png', alt: 'Cult Mia', h: 36 },
    { src: 'assets/logos/colombiamoda.png', alt: 'Colombiamoda', h: 44 },
    { src: 'assets/logos/inexmoda.svg', alt: 'Inexmoda', h: 38 },
    { src: 'assets/logos/fgi-colombia.png', alt: 'FGI Colombia', h: 44 },
    { src: 'assets/logos/premiere-vision-cream.png', alt: 'Première Vision Paris', h: 34 }
  ];
  var buyers = [
    { src: 'assets/buyers/net-a-porter.svg', alt: 'Net-A-Porter', h: 22 },
    { src: 'assets/buyers/harrods.svg', alt: 'Harrods', h: 36 },
    { src: 'assets/buyers/selfridges.svg', alt: 'Selfridges', h: 26 },
    { src: 'assets/buyers/liberty-london.svg', alt: 'Liberty', h: 26 },
    { src: 'assets/buyers/kith.svg', alt: 'KITH', h: 34 },
    { src: 'assets/buyers/mytheresa.png', alt: 'MyTheresa', h: 24 },
    { src: 'assets/buyers/moda-operandi.svg', alt: 'Moda Operandi', h: 20 },
    { src: 'assets/buyers/harvey-nichols.svg', alt: 'Harvey Nichols', h: 22 },
    { src: 'assets/buyers/printemps.svg', alt: 'Printemps', h: 26 },
    { src: 'assets/buyers/le-bon-marche.svg', alt: 'Le Bon Marché', h: 40 },
    { src: 'assets/buyers/galeries-lafayette.svg', alt: 'Galeries Lafayette', h: 36 },
    { src: 'assets/buyers/revolve.png', alt: 'Revolve', h: 26 }
  ];

  // seamless CSS loop (translateX(-50%)) needs the sequence exactly twice
  function fillRow(id, defs, filterClass) {
    var row = document.getElementById(id);
    if (!row) return;
    defs.concat(defs).forEach(function (d) {
      var img = document.createElement('img');
      img.src = d.src;
      img.alt = d.alt;
      img.style.height = d.h + 'px';
      img.loading = 'lazy';
      img.className = filterClass;
      row.appendChild(img);
    });
  }
  fillRow('client-row-blue', clients, 'logo-blue');
  fillRow('client-row-cream', clients, 'logo-cream');
  fillRow('press-row', press, 'logo-cream');
  fillRow('buyer-row', buyers, 'logo-cream');

  /* ------- reveal on scroll ------- */
  var rvEls = document.querySelectorAll('[data-rv]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('rv-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    rvEls.forEach(function (el) { io.observe(el); });
  } else {
    rvEls.forEach(function (el) { el.classList.add('rv-in'); });
  }

  /* ------- hero video: keep playing ------- */
  var hv = document.getElementById('hero-video');
  if (hv) {
    var go = function () { hv.play().catch(function () {}); };
    go();
    hv.addEventListener('pause', go);
    hv.addEventListener('ended', go);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) go(); });
  }

  /* ------- collection video: play once when centered; hide if asset missing ------- */
  var cv = document.getElementById('collection-video');
  if (cv) {
    cv.addEventListener('error', function () {
      var wrap = cv.closest('.problem-media');
      if (wrap) wrap.style.display = 'none';
    });
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

  /* ------- L-shaped connector lines between service blocks ------- */
  var svcShown = false;
  function drawSvcLines() {
    var list = document.getElementById('svc-list');
    if (!list) return;
    list.querySelectorAll('[data-svc-line]').forEach(function (n) { n.remove(); });
    if (window.matchMedia('(max-width: 860px)').matches) return; // stacked layout: no lines
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
    if (svcShown) {
      segs.forEach(function (d) { d.style.transition = 'none'; d.style.transform = 'none'; });
    } else {
      var io2 = new IntersectionObserver(function (es) {
        if (es.some(function (e) { return e.isIntersecting; })) {
          svcShown = true;
          segs.forEach(function (d) { d.style.transform = 'none'; });
          io2.disconnect();
        }
      }, { threshold: 0.2 });
      io2.observe(list);
    }
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { setTimeout(drawSvcLines, 50); });
  } else {
    setTimeout(drawSvcLines, 300);
  }
  window.addEventListener('resize', drawSvcLines);

  /* ------- contact form: mailto handoff until a backend exists ------- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var f = new FormData(form);
      var body =
        'Name: ' + (f.get('name') || '') + '\n' +
        'Brand: ' + (f.get('brand') || '') + '\n' +
        'Website/Instagram: ' + (f.get('website') || '') + '\n' +
        'Target market: ' + (f.get('market') || '') + '\n\n' +
        (f.get('message') || '');
      window.location.href = 'mailto:honor@arca-consultancy.com' +
        '?subject=' + encodeURIComponent('Introduction call — ' + (f.get('brand') || f.get('name') || 'new inquiry')) +
        '&body=' + encodeURIComponent(body);
      var btn = document.getElementById('submit-btn');
      if (btn) btn.textContent = 'Received — we’ll be in touch';
    });
  }
})();
