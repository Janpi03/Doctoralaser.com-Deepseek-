var WA_NUMBER = '573015666729';

var navLinks = [
    { label: 'Inicio', href: 'index.html' },
    { label: 'Beneficios', href: 'beneficios.html' },
    { label: 'Tratamientos', href: 'tratamientos.html' },
    { label: 'Evidencia', href: 'evidencia.html' },
    { label: 'Casos', href: 'casos.html' },
    { label: 'Agenda', href: 'agenda.html' },
];

function buildNav() {
    var navEl = document.getElementById('main-nav');
    if (!navEl) return;
    var currentPage = location.pathname.split('/').pop() || 'index.html';
    navEl.innerHTML = 
        '<div class="nav-inner">' +
            '<a href="index.html" class="nav-logo">Doctor Láser <em>Dra. Ana Vinasco</em> · Bogotá</a>' +
            '<ul class="nav-links" id="mobile-menu">' +
                navLinks.map(function(l) {
                    var active = (currentPage === l.href || (currentPage === '' && l.href === 'index.html')) ? ' class="active"' : '';
                    return '<li><a href="' + l.href + '"' + active + '>' + l.label + '</a></li>';
                }).join('') +
                '<li class="nav-cta-mobile"><a href="agenda.html" class="btn btn--primary">Agendar cita</a></li>' +
            '</ul>' +
            '<a href="agenda.html" class="nav-cta desktop-only"><span class="btn btn--primary">Agendar cita</span></a>' +
            '<button class="nav-mobile-btn" id="hamburger-btn" aria-label="Menú" aria-expanded="false">' +
                '<i class="ti ti-menu-2"></i>' +
            '</button>' +
        '</div>' +
        '<div class="nav-overlay" id="nav-overlay"></div>';
    
    var menu = document.getElementById('mobile-menu');
    var btn = document.getElementById('hamburger-btn');
    var overlay = document.getElementById('nav-overlay');
    
    function toggleMenu() {
        var isOpen = menu.classList.toggle('active');
        overlay.classList.toggle('active');
        btn.setAttribute('aria-expanded', isOpen);
        btn.innerHTML = isOpen ? '<i class="ti ti-x"></i>' : '<i class="ti ti-menu-2"></i>';
    }
    
    btn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
}

function buildFooter() {
    var footer = document.getElementById('main-footer');
    if (!footer) return;
    footer.innerHTML = 
        '<footer class="footer">' +
            '<div class="footer-inner">' +
                '<div>' +
                    '<p><strong>Doctor Láser</strong><br>Dra. Ana Vinasco<br>Odontología láser en Bogotá</p>' +
                '</div>' +
                '<div>' +
                    '<p>Cra. 7 Bis #124-56<br>Bogotá, Colombia</p>' +
                '</div>' +
                '<div>' +
                    '<p><a href="https://wa.me/' + WA_NUMBER + '">+57 301 5666729</a></p>' +
                    '<p><a href="mailto:info@doctoralaser.com">info@doctoralaser.com</a></p>' +
                '</div>' +
            '</div>' +
        '</footer>';
}

function buildWhatsAppFloat() {
    var el = document.getElementById('wa-float');
    if (!el) return;
    el.innerHTML = '<a href="https://wa.me/' + WA_NUMBER + '" target="_blank" rel="noopener" aria-label="Chatea por WhatsApp"><i class="ti ti-brand-whatsapp"></i></a>';
}

function initPopup() {
    var STORAGE_KEY = 'dl_popup_dismissed';
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    
    var banner = document.createElement('div');
    banner.className = 'email-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'banner-title');
    banner.innerHTML = 
        '<div class="email-banner__content">' +
            '<button class="email-banner__close" id="banner-close" aria-label="Cerrar">&times;</button>' +
            '<h3 id="banner-title">Guía gratuita: Todo sobre el láser dental</h3>' +
            '<p>Descarga el PDF que la Dra. Ana Vinasco preparó para ti.</p>' +
            '<form id="banner-form" class="email-banner__form">' +
                '<input type="email" id="banner-email" placeholder="tu@correo.com" required>' +
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
    var scrollHandler = function () {
        var scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        if (scrolled >= 0.6) {
            clearTimeout(timer);
            window.removeEventListener('scroll', scrollHandler, { passive: true });
            maybeShow();
        }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    document.getElementById('banner-close').addEventListener('click', dismissBanner);
    document.getElementById('banner-form').addEventListener('submit', function(e) {
        e.preventDefault();
        var email = document.getElementById('banner-email').value.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('banner-email').focus();
            return;
        }
        var waMsg = encodeURIComponent('Hola, me interesa recibir la guía gratuita sobre láser dental. Mi correo: ' + email);
        window.open('https://wa.me/' + WA_NUMBER + '?text=' + waMsg, '_blank');
        dismissBanner();
    });
}

function initAnimations() {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });
    
    document.querySelectorAll('.fade-up').forEach(function(el) {
        observer.observe(el);
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    buildNav();
    buildFooter();
    buildWhatsAppFloat();
    initPopup();
    initAnimations();
});