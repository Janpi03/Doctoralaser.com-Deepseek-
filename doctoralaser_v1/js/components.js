/* ─────────────────────────────────────────────────────
   DoctorLáser · components.js
   Centralises: config, nav, footer, WhatsApp float,
   lead-capture banner, animations, font injection,
   Schema.org JSON-LD, service-worker registration.
   ───────────────────────────────────────────────────── */

// ── SITE CONFIG ──────────────────────────────────────
var CFG = {
  name:         'Doctor Láser',
  doctor:       'Dra. Ana Vinasco',
  tagline:      'Odontología láser en Bogotá',
  url:          'https://www.doctoralaser.com',   // ← update with final domain
  phone:        '573015666729',
  phoneDisplay: '+57 301 5666729',
  email:        'info@doctoralaser.com',
  address: {
    street:       'Cra. 7 Bis #124-56',
    neighborhood: 'Chapinero',
    city:         'Bogotá',
    country:      'Colombia',
    postalCode:   '110221',
    lat:           4.6639,
    lng:          -74.0554
  },
  hours: {
    display: 'Lun–Vie 8:00 a.m. – 7:00 p.m. · Sáb 8:00 a.m. – 7:00 p.m.',
    schema: [
      { dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '19:00' },
      { dayOfWeek: ['Saturday'], opens: '08:00', closes: '19:00' }
    ]
  },
  social: {
    instagram: 'https://www.instagram.com/doctoralaser.co',
    facebook:  'https://www.facebook.com/doctoralaser.co'
  },
  nav: [
    { label: 'Inicio',       href: 'index.html' },
    { label: 'Beneficios',   href: 'beneficios.html' },
    { label: 'Tratamientos', href: 'tratamientos.html' },
    { label: 'Evidencia',    href: 'evidencia.html' },
    { label: 'Casos',        href: 'casos.html' },
    { label: 'Agenda',       href: 'agenda.html' }
  ]
};

// Convenience alias kept for any inline scripts that reference WA_NUMBER
var WA_NUMBER = CFG.phone;

// ── FONT INJECTION ───────────────────────────────────
// Injects Google Fonts if not already present (handles
// pages that omit the <link> tag).
function injectFonts() {
  if (document.querySelector('link[href*="fonts.googleapis.com"]')) return;
  var preconnect1 = document.createElement('link');
  preconnect1.rel = 'preconnect';
  preconnect1.href = 'https://fonts.googleapis.com';

  var preconnect2 = document.createElement('link');
  preconnect2.rel = 'preconnect';
  preconnect2.href = 'https://fonts.gstatic.com';
  preconnect2.crossOrigin = 'anonymous';

  var fonts = document.createElement('link');
  fonts.rel  = 'stylesheet';
  fonts.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700&display=swap';

  var head = document.head;
  head.insertBefore(preconnect1, head.firstChild);
  head.insertBefore(preconnect2, head.children[1] || null);
  head.appendChild(fonts);
}

// ── SCHEMA.ORG JSON-LD ───────────────────────────────
// Injected once per page. Google supports JS-rendered JSON-LD.
function injectSchema() {
  if (document.querySelector('script[data-schema="doctoralaser"]')) return;

  var schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'MedicalBusiness'],
    'name': CFG.name,
    'description': 'Odontología con láser diodo en Bogotá. Blanqueamiento, gingivoplastia, frenilectomía y más. Sin suturas, recuperación en 24-48h.',
    'url': CFG.url,
    'telephone': CFG.phoneDisplay,
    'email': CFG.email,
    'image': CFG.url + '/og-image.webp',
    'priceRange': '$$',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': CFG.address.street,
      'addressLocality': CFG.address.city,
      'addressRegion': 'Bogotá D.C.',
      'postalCode': CFG.address.postalCode,
      'addressCountry': 'CO'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude':  CFG.address.lat,
      'longitude': CFG.address.lng
    },
    'openingHoursSpecification': CFG.hours.schema.map(function(h) {
      return {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': h.dayOfWeek,
        'opens': h.opens,
        'closes': h.closes
      };
    }),
    'sameAs': [
      CFG.social.instagram,
      CFG.social.facebook
    ],
    'hasMap': 'https://maps.google.com/?q=' + CFG.address.lat + ',' + CFG.address.lng
  };

  var tag = document.createElement('script');
  tag.type = 'application/ld+json';
  tag.setAttribute('data-schema', 'doctoralaser');
  tag.textContent = JSON.stringify(schema);
  document.head.appendChild(tag);
}

// ── NAV ──────────────────────────────────────────────
function buildNav() {
  var navEl = document.getElementById('main-nav');
  if (!navEl) return;

  var currentPage = location.pathname.split('/').pop() || 'index.html';

  var linksHTML = CFG.nav.map(function(l) {
    var isActive = (currentPage === l.href || (currentPage === '' && l.href === 'index.html'));
    return '<li><a href="' + l.href + '"' + (isActive ? ' class="active" aria-current="page"' : '') + '>' + l.label + '</a></li>';
  }).join('');

  navEl.setAttribute('role', 'navigation');
  navEl.setAttribute('aria-label', 'Navegación principal');

  navEl.innerHTML =
    '<div class="nav-inner">' +
      '<a href="index.html" class="nav-logo" aria-label="' + CFG.name + ' – inicio">' +
        CFG.name + ' <em>' + CFG.doctor + ' · ' + CFG.address.city + '</em>' +
      '</a>' +
      '<ul class="nav-links" id="mobile-menu" role="list">' +
        linksHTML +
        '<li class="nav-cta-mobile"><a href="agenda.html" class="btn btn--primary">Agendar cita</a></li>' +
      '</ul>' +
      '<a href="agenda.html" class="nav-cta desktop-only"><span class="btn btn--primary">Agendar cita</span></a>' +
      '<button class="nav-mobile-btn" id="hamburger-btn" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobile-menu">' +
        '<i class="ti ti-menu-2" aria-hidden="true"></i>' +
      '</button>' +
    '</div>' +
    '<div class="nav-overlay" id="nav-overlay" aria-hidden="true"></div>';

  var menu   = document.getElementById('mobile-menu');
  var btn    = document.getElementById('hamburger-btn');
  var overlay = document.getElementById('nav-overlay');

  function openMenu() {
    menu.classList.add('active');
    overlay.classList.add('active');
    overlay.removeAttribute('aria-hidden');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Cerrar menú');
    btn.innerHTML = '<i class="ti ti-x" aria-hidden="true"></i>';
    // Trap focus: focus first nav link
    var firstLink = menu.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    menu.classList.remove('active');
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menú');
    btn.innerHTML = '<i class="ti ti-menu-2" aria-hidden="true"></i>';
    btn.focus();
  }

  btn.addEventListener('click', function() {
    menu.classList.contains('active') ? closeMenu() : openMenu();
  });
  overlay.addEventListener('click', closeMenu);

  // Close menu on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menu.classList.contains('active')) closeMenu();
  });
}

// ── FOOTER ───────────────────────────────────────────
function buildFooter() {
  var footer = document.getElementById('main-footer');
  if (!footer) return;

  var year = new Date().getFullYear();

  footer.innerHTML =
    '<footer class="footer">' +
      '<div class="footer-inner">' +
        '<div>' +
          '<p><strong>' + CFG.name + '</strong><br>' + CFG.doctor + '<br>' + CFG.tagline + '</p>' +
        '</div>' +
        '<div>' +
          '<p>' + CFG.address.street + '<br>' + CFG.address.city + ', ' + CFG.address.country + '</p>' +
          '<p>' + CFG.hours.display + '</p>' +
        '</div>' +
        '<div>' +
          '<p><a href="https://wa.me/' + CFG.phone + '" rel="noopener">' + CFG.phoneDisplay + '</a></p>' +
          '<p><a href="mailto:' + CFG.email + '">' + CFG.email + '</a></p>' +
          '<p>' +
            '<a href="' + CFG.social.instagram + '" rel="noopener noreferrer" target="_blank" aria-label="Instagram de ' + CFG.name + '"><i class="ti ti-brand-instagram" aria-hidden="true"></i></a> ' +
            '<a href="' + CFG.social.facebook  + '" rel="noopener noreferrer" target="_blank" aria-label="Facebook de ' + CFG.name + '"><i class="ti ti-brand-facebook" aria-hidden="true"></i></a>' +
          '</p>' +
        '</div>' +
      '</div>' +
      '<div class="footer-copy">' +
        '<p>© ' + year + ' ' + CFG.name + '. Todos los derechos reservados. ' +
          '<a href="privacidad.html">Política de privacidad</a>' +
        '</p>' +
      '</div>' +
    '</footer>';
}

// ── WHATSAPP FLOAT ───────────────────────────────────
function buildWhatsAppFloat() {
  var el = document.getElementById('wa-float');
  if (!el) return;
  el.innerHTML =
    '<a href="https://wa.me/' + CFG.phone + '" target="_blank" rel="noopener noreferrer" ' +
       'aria-label="Chatea con nosotros por WhatsApp">' +
      '<i class="ti ti-brand-whatsapp" aria-hidden="true"></i>' +
    '</a>';
}

// ── LEAD-CAPTURE BANNER ──────────────────────────────
function initPopup() {
  var STORAGE_KEY = 'dl_popup_dismissed';
  if (sessionStorage.getItem(STORAGE_KEY)) return;

  var banner = document.createElement('div');
  banner.className = 'email-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-modal', 'true');
  banner.setAttribute('aria-labelledby', 'banner-title');
  banner.innerHTML =
    '<div class="email-banner__content">' +
      '<button class="email-banner__close" id="banner-close" aria-label="Cerrar guía gratuita">&times;</button>' +
      '<h3 id="banner-title">Guía gratuita: Todo sobre el láser dental</h3>' +
      '<p>Descarga el PDF que la ' + CFG.doctor + ' preparó para ti.</p>' +
      '<form id="banner-form" class="email-banner__form" novalidate>' +
        '<label for="banner-email" class="visually-hidden">Tu correo electrónico</label>' +
        '<input type="email" id="banner-email" placeholder="tu@correo.com" required autocomplete="email">' +
        '<button type="submit" class="btn btn--primary">Recibir guía</button>' +
      '</form>' +
      '<p class="email-banner__note">Sin spam. Solo para enviarte la guía.</p>' +
    '</div>';

  document.body.appendChild(banner);

  function showBanner() {
    banner.classList.add('visible');
    document.getElementById('banner-email').focus();
  }

  function dismissBanner() {
    banner.classList.remove('visible');
    sessionStorage.setItem(STORAGE_KEY, '1');
  }

  var shown = false;
  function maybeShow() {
    if (shown) return;
    shown = true;
    showBanner();
  }

  var timer = setTimeout(maybeShow, 35000);

  // Intersection Observer replaces scroll listener for 60% threshold
  var sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;bottom:40%;left:0;height:1px;width:1px;pointer-events:none';
  document.body.appendChild(sentinel);

  var io = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      clearTimeout(timer);
      io.disconnect();
      maybeShow();
    }
  }, { threshold: 0 });
  io.observe(sentinel);

  document.getElementById('banner-close').addEventListener('click', dismissBanner);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && banner.classList.contains('visible')) dismissBanner();
  });

  document.getElementById('banner-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var emailInput = document.getElementById('banner-email');
    var email = emailInput.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailInput.setAttribute('aria-invalid', 'true');
      emailInput.focus();
      return;
    }
    emailInput.removeAttribute('aria-invalid');
    var waMsg = encodeURIComponent('Hola, me interesa recibir la guía gratuita sobre láser dental. Mi correo: ' + email);
    window.open('https://wa.me/' + CFG.phone + '?text=' + waMsg, '_blank', 'noopener,noreferrer');
    dismissBanner();
  });
}

// ── FADE-UP ANIMATIONS (IntersectionObserver) ────────
// Already used IntersectionObserver in original — kept,
// with threshold tuned for mobile viewports.
function initAnimations() {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    // Make all elements visible immediately
    document.querySelectorAll('.fade-up').forEach(function(el) {
      el.classList.add('visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // stop observing once revealed
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(function(el) {
    observer.observe(el);
  });
}

// ── SERVICE WORKER REGISTRATION ──────────────────────
function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').catch(function(err) {
        // SW registration failed — non-critical, fail silently
        console.warn('SW registration failed:', err);
      });
    });
  }
}

// ── INIT ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  injectFonts();
  injectSchema();
  buildNav();
  buildFooter();
  buildWhatsAppFloat();
  initPopup();
  initAnimations();
  registerSW();
});