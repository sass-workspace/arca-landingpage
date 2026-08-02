/* ARCA CONSULTANCY — site behaviour (v2 editorial direction) */
(function () {
  'use strict';

  /* ------- logo walls (static grids, all recolored cream via CSS filter) ------- */
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
      var img = document.createElement('img');
      img.src = d.src;
      img.alt = d.alt;
      img.style.height = d.h + 'px';
      img.loading = 'lazy';
      wall.appendChild(img);
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

  /* ------- hero video: keep playing ------- */
  var hv = document.getElementById('hero-video');
  if (hv) {
    var go = function () { hv.play().catch(function () {}); };
    go();
    hv.addEventListener('pause', go);
    hv.addEventListener('ended', go);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) go(); });
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
