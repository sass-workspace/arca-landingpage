/* ARCA CONSULTANCY — site behaviour (v2 editorial direction) */
(function () {
  'use strict';

  /* ------- logo walls (static grids; images recolored cream via CSS filter,
     items with `text` render as styled wordmarks until a clean logo file exists) ------- */
  var clients = [
    { text: 'SER' },
    { src: 'assets/logos/miale.png', alt: 'Mialé', h: 38 },
    { text: 'MAI · PETIT' },
    { src: 'assets/logos/ola-azul.png', alt: 'Ola Azul', h: 32 },
    { src: 'assets/logos/cristian-tula.png', alt: 'Cristian Tula', h: 22 },
    { src: 'assets/logos/bahama-mama.png', alt: 'Bahama Mama', h: 21 },
    { src: 'assets/logos/francques.png', alt: 'Francques', h: 26 },
    { src: 'assets/logos/andres-pajon.svg', alt: 'Andrés Pajón', h: 30 },
    { text: 'lululemon' },
    { src: 'assets/logos/pitusa.png', alt: 'Pitusa', h: 30 },
    { src: 'assets/logos/reina-olga.png', alt: 'Reina Olga', h: 36 },
    { src: 'assets/logos/agua-by-agua-bendita.png', alt: 'Agua by Agua Bendita', h: 46 },
    { src: 'assets/logos/cala-de-la-cruz.png', alt: 'Cala de la Cruz', h: 34 }
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
    { src: 'assets/buyers/printemps.svg', alt: 'Printemps', h: 30 },
    { src: 'assets/buyers/le-bon-marche.svg', alt: 'Le Bon Marché', h: 58 },
    { src: 'assets/buyers/galeries-lafayette.svg', alt: 'Galeries Lafayette', h: 46 },
    { src: 'assets/buyers/revolve.png', alt: 'Revolve', h: 64 }
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

  function fillWall(id, defs) {
    var wall = document.getElementById(id);
    if (!wall) return;
    defs.forEach(function (d) {
      var el;
      if (d.text) {
        el = document.createElement('span');
        el.className = 'wall-text';
        el.textContent = d.text;
      } else {
        el = document.createElement('img');
        el.src = d.src;
        el.alt = d.alt;
        el.style.height = d.h + 'px';
        el.loading = 'lazy';
      }
      wall.appendChild(el);
    });
  }
  fillWall('client-wall', clients);
  fillWall('buyer-wall', buyers);
  fillWall('press-wall', press);

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

  /* ------- specimen animation: video plays ONCE when vertically centered in
     the viewport; static SVG remains the fallback until the asset exists ------- */
  var cv = document.getElementById('collection-video');
  if (cv) {
    var section = cv.closest('.specimen-section');
    cv.addEventListener('loadeddata', function () {
      if (section) section.classList.add('has-video');
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
    });
    cv.addEventListener('error', function () {
      if (section) section.classList.remove('has-video'); // SVG fallback stays
    });
  }

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
