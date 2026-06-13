/* =============================================
   HEY YOUTH! — Global Script (UPDATED)
   ============================================= */

var _cmsLocations = null;

/* ------ UTILITIES ------ */
function _esc(s) {
    if (!s) return '';
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}

function _escA(s) {
    if (!s) return '';
    return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function _resolveImgPath(path) {
    if (!path) return '';
    if (path.indexOf('data:') === 0 || path.indexOf('http') === 0 || path.indexOf('//') === 0 || path.indexOf('blob:') === 0) {
        return path;
    }
    var cleanPath = path;
    if (cleanPath.indexOf('../assets/') === 0) {
        cleanPath = cleanPath.substring(10);
    } else if (cleanPath.indexOf('assets/') === 0) {
        cleanPath = cleanPath.substring(7);
    } else if (cleanPath.indexOf('../') === 0) {
        cleanPath = cleanPath.substring(3);
    }
    if (cleanPath.indexOf('img/') !== 0) {
        cleanPath = 'img/' + cleanPath;
    }
    var depth = 0;
    var loc = window.location.pathname.toLowerCase();
    if (loc.indexOf('/landing-page/') !== -1 || loc.indexOf('/cms/') !== -1 || loc.slice(-13) === '/landing-page' || loc.slice(-4) === '/cms') {
        depth = 1;
    }
    return (depth === 1 ? '../assets/' : 'assets/') + cleanPath;
}
window._resolveImgPath = _resolveImgPath;

function _avatar(name) {
    return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&size=100&background=random&color=fff';
}

function _bilingualEsc(idVal, enVal, fallback) {
    var id = _esc(idVal || fallback || '');
    var en = _esc(enVal || fallback || '');
    return '<span class="lang-id">' + id + '</span><span class="lang-en">' + en + '</span>';
}

function _bilingualHtml(idVal, enVal, fallback) {
    var id = idVal || fallback || '';
    var en = enVal || fallback || '';
    return '<span class="lang-id">' + id + '</span><span class="lang-en">' + en + '</span>';
}

async function _getCMS() {
    return await window.getFirebaseData(window.HEY_YOUTH_DEFAULT_DATA);
}

/* ------ CMS: RENDER EXTERNAL TESTIMONIALS ------ */
function _renderExternal(data) {
    var el = document.getElementById('external-testimonials');
    if (!el || !data || !data.length) return;
    var html = '';
    for (var i = 0; i < data.length; i++) {
        var t = data[i];
        html += '<div class="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow flex flex-col h-full">'
            + '<p class="text-body italic mb-6 flex-grow">"' + _bilingualEsc(t.quote_id, t.quote_en, t.quote) + '"</p>'
            + '<div class="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-50 mt-auto">'
            + '<div class="w-12 h-12 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">'
            + '<img src="' + _escA(window._resolveImgPath(t.image)) + '" alt="' + _escA(t.name) + '" class="w-full h-full object-cover" onerror="this.src=\'' + _avatar(t.name) + '\'">'
            + '</div>'
            + '<div class="flex-grow min-w-[120px]">'
            + '<h4 class="font-bold text-heading text-sm leading-tight">' + _esc(t.name) + '</h4>'
            + '<p class="text-xs text-primary font-semibold leading-tight mt-0.5">' + _bilingualEsc(t.title_id, t.title_en, t.title) + '</p>'
            + '</div></div></div>';
    }
    el.innerHTML = html;
}

/* ------ CMS: RENDER INTERNAL TESTIMONIALS ------ */
function _renderInternal(data) {
    var el = document.getElementById('internal-testimonials');
    if (!el || !data || !data.length) return;
    var html = '';
    for (var i = 0; i < data.length; i++) {
        var t = data[i];
        html += '<div class="bg-surface p-8 rounded-2xl border border-blue-100 flex flex-col h-full">'
            + '<p class="text-body italic mb-6 flex-grow">"' + _bilingualEsc(t.quote_id, t.quote_en, t.quote) + '"</p>'
            + '<div class="flex flex-wrap items-center gap-3 pt-4 border-t border-blue-50 mt-auto">'
            + '<div class="w-12 h-12 bg-white rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">'
            + '<img src="' + _escA(window._resolveImgPath(t.image)) + '" alt="' + _escA(t.name) + '" class="w-full h-full object-cover" onerror="this.src=\'' + _avatar(t.name) + '\'">'
            + '</div>'
            + '<div class="flex-grow min-w-[120px]">'
            + '<h4 class="font-bold text-heading text-sm leading-tight">' + _esc(t.name) + '</h4>'
            + '<p class="text-xs text-gray-500 leading-tight mt-0.5">' + _bilingualEsc(t.role_id, t.role_en, t.role) + '</p>'
            + '</div></div></div>';
    }
    el.innerHTML = html;
}

/* ------ CMS: RENDER FAQ ------ */
function _renderFAQ(data) {
    var el = document.getElementById('faq-container');
    if (!el || !data || !data.length) return;
    var html = '';
    for (var i = 0; i < data.length; i++) {
        var f = data[i];
        html += '<div class="faq-item bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">'
            + '<button class="faq-header w-full text-left p-6 flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors">'
            + '<span class="faq-header-text text-heading font-medium text-lg pr-4 transition-colors">' + _bilingualEsc(f.question_id, f.question_en, f.question) + '</span>'
            + '<div class="faq-icon bg-gray-100 text-gray-500 p-1.5 rounded-full flex-shrink-0 transition-transform duration-300"><svg fill="none" height="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg></div>'
            + '</button>'
            + '<div class="faq-content"><div class="faq-inner overflow-hidden"><div class="px-6 pb-6 pt-2 text-body text-gray-600 leading-relaxed border-t border-transparent">' + _bilingualEsc(f.answer_id, f.answer_en, f.answer) + '</div></div></div>'
            + '</div>';
    }
    el.innerHTML = html;
}

/* ------ CMS: RENDER PARTNERS (PUBLIC VIEW) ------ */
function _renderPartners(data) {
    var el = document.getElementById('partners-grid-container');
    if (!el || !data || !data.length) {
        if(el) el.innerHTML = '<div class="col-span-full text-center py-10 text-gray-400">Belum ada data partner.</div>';
        return;
    }

    var colorMap = {
        'blue': 'bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white',
        'pink': 'bg-pink-50 text-pink-500 hover:bg-pink-500 hover:text-white',
        'purple': 'bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white',
        'green': 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white',
        'yellow': 'bg-yellow-50 text-yellow-600 hover:bg-yellow-600 hover:text-white',
        'gray': 'bg-gray-100 text-gray-500 hover:bg-gray-500 hover:text-white',
    };

    var html = '';
    for (var i = 0; i < data.length; i++) {
        var p = data[i];
        var colorClass = colorMap[p.color] || colorMap['blue'];
        
        var targetLink = p.link && p.link !== '#' ? p.link : '#';
        var targetAttr = (targetLink !== '#') ? 'target="_blank" rel="noopener noreferrer"' : '';
        var btnText = (targetLink !== '#') ? 
            _bilingualHtml('Kunjungi Website <i class="fas fa-external-link-alt ml-1 text-xs"></i>', 'Visit Website <i class="fas fa-external-link-alt ml-1 text-xs"></i>') : 
            _bilingualHtml('Pelajari Selengkapnya', 'Learn More');

        var logoHtml = '';
        if (p.image) {
            var imgSrc = window._resolveImgPath(p.image);
            logoHtml = '<div class="w-24 h-24 rounded-2xl overflow-hidden mb-6 bg-white border border-gray-100 shadow-sm flex items-center justify-center p-3 group-hover:scale-105 transition-transform duration-300">' +
                         '<img src="' + _escA(imgSrc) + '" class="max-w-full max-h-full object-contain">' +
                       '</div>';
        } else {
            logoHtml = '<div class="w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-6 transition-all duration-300 ' + colorClass + '">' +
                         '<i class="fas ' + (p.icon || 'fa-building') + '"></i>' +
                       '</div>';
        }

        html += '<div class="bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center h-full">' +
            logoHtml +
            '<h3 class="text-xl font-bold text-heading mb-6 leading-tight">' + _esc(p.name) + '</h3>' +
            '<p class="text-sm text-gray-500 mb-6 flex-grow line-clamp-3">' + _bilingualEsc(p.description_id, p.description_en, p.description) + '</p>' + 
            
            '<div class="mt-auto w-full">' +
                '<a href="' + _escA(targetLink) + '" ' + targetAttr + ' class="block w-full py-2.5 px-4 rounded-lg bg-accent/10 text-accent font-bold text-sm hover:bg-accent hover:text-white transition-colors border border-accent/20 text-center">' +
                    btnText +
                '</a>' +
            '</div>' +
        '</div>';
    }
    el.innerHTML = html;
}

/* ------ CMS: RENDER DONATION PAGE (BARU) ------ */
function _renderDonation(data) {
    if (!data || !data.donationSettings) return;
    var s = data.donationSettings;

    // 1. Update Hero Text
    var heroTitleEl = document.getElementById('hero-title-donation');
    if (heroTitleEl) {
        heroTitleEl.innerHTML = _bilingualHtml(s.heroTitle_id, s.heroTitle_en, s.heroTitle || 'Support Our <span class="text-primary">Mission</span>');
    }
    var heroSubEl = document.querySelector('#hero-donation p.text-lg');
    if (heroSubEl) {
        heroSubEl.innerHTML = _bilingualHtml(s.heroSubtitle_id, s.heroSubtitle_en, s.heroSubtitle);
    }

    // 2. Update Image Strip
    var stripImgEl = document.getElementById('strip-img-display');
    var stripTextEl = document.getElementById('strip-text-display');
    if (stripImgEl && s.stripImage) {
        stripImgEl.src = window._resolveImgPath(s.stripImage);
    }
    if (stripTextEl) {
        stripTextEl.innerHTML = _bilingualHtml(s.stripText_id, s.stripText_en, s.stripText);
    }

    // 3. Update Payment Details
    var bankNameEl = document.getElementById('bank-name-display');
    var accNameEl = document.getElementById('acc-name-display');
    var accNumEl = document.getElementById('acc-num-display');
    
    if (bankNameEl) bankNameEl.textContent = s.bankName;
    if (accNameEl) accNameEl.textContent = s.accountName;
    if (accNumEl) accNumEl.textContent = s.accountNumber;
    
    // 4. Update QRIS
    var qrisImgEl = document.getElementById('qris-img-display');
    if (qrisImgEl && s.qrisImage) {
        qrisImgEl.src = window._resolveImgPath(s.qrisImage);
        qrisImgEl.classList.remove('hidden'); // Tampilkan gambar asli
        // Sembunyikan placeholder icon jika ada
        var placeholder = qrisImgEl.nextElementSibling;
        if (placeholder && placeholder.tagName === 'I') placeholder.classList.add('hidden');
    }
}

/* ------ FAQ ACCORDION ------ */
function _initFAQ() {
    var items = document.querySelectorAll('.faq-item');
    for (var i = 0; i < items.length; i++) {
        (function(item) {
            var btn = item.querySelector('.faq-header');
            if (!btn) return;
            var newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', function() {
                var isActive = item.classList.contains('active');
                for (var j = 0; j < items.length; j++) {
                    items[j].classList.remove('active');
                    var c = items[j].querySelector('.faq-content');
                    if (c) c.classList.remove('open');
                }
                if (!isActive) {
                    item.classList.add('active');
                    var c = item.querySelector('.faq-content');
                    if (c) c.classList.add('open');
                }
            });
        })(items[i]);
    }
}

/* ------ COPY TO CLIPBOARD ------ */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        var btn = document.querySelector('#acc-num-display').nextElementSibling;
        var originalHtml = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-check text-green-500 text-xl"></i>';
        
        setTimeout(function() {
            btn.innerHTML = originalHtml;
        }, 2000);
    }).catch(function(err) {
        console.error('Gagal menyalin: ', err);
    });
}

/* ------ NAVBAR SCROLL ------ */
function _initNavbar() {
    var nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', function() {
        if (window.scrollY > 20) {
            nav.classList.add('shadow-md', 'bg-white/95');
            nav.classList.remove('py-2');
        } else {
            nav.classList.remove('shadow-md', 'bg-white/95');
            nav.classList.add('py-2');
        }
    });
}

/* =============================================
   VISITOR TRACKING
   ============================================= */
function getPageName() {
    var path = window.location.pathname;
    var page = path.split("/").pop().toLowerCase();
    
    if (page === "index.html" || page === "") {
        return "Home";
    } else if (page.includes("about")) {
        return "About Us";
    } else if (page.includes("activities")) {
        return "Activities";
    } else if (page.includes("activity-detail")) {
        return "Activities";
    } else if (page.includes("partner")) {
        return "Partners";
    } else if (page.includes("donation")) {
        return "Donation";
    } else if (page.includes("gallery")) {
        return "Gallery";
    }
    return null;
}

async function trackVisitor() {
    try {
        if (window.location.pathname.toLowerCase().includes('/cms/')) {
            return;
        }

        var pageName = getPageName();
        if (!pageName) return;

        var sessionKey = 'tracked_' + pageName;
        if (sessionStorage.getItem(sessionKey)) {
            return;
        }

        sessionStorage.setItem(sessionKey, 'true');

        if (typeof db === 'undefined' || typeof firebase === 'undefined') {
            console.error("Firebase/Firestore is not initialized.");
            return;
        }

        var docRef = db.collection('heyyouth').doc('visitor_stats');
        var docSnap = await docRef.get();
        var now = new Date();
        var todayStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

        if (!docSnap.exists) {
            var initialStats = {
                total: 1,
                pages: {},
                daily: {}
            };
            initialStats.pages[pageName] = 1;
            initialStats.daily[todayStr] = 1;
            await docRef.set(initialStats);
        } else {
            var updates = {
                total: firebase.firestore.FieldValue.increment(1)
            };
            updates['pages.' + pageName] = firebase.firestore.FieldValue.increment(1);
            updates['daily.' + todayStr] = firebase.firestore.FieldValue.increment(1);
            await docRef.update(updates);
        }
        console.log("Visitor tracked successfully for: " + pageName);
    } catch (error) {
        console.error("Error tracking visitor:", error);
    }
}

/* ------ INIT (MAIN SITES) ------ */
async function _initMain() {
    // 1. Mobile Menu
    var btn = document.getElementById('mobile-menu-btn');
    var menu = document.getElementById('mobile-menu');
    var iconO = document.getElementById('icon-menu');
    var iconC = document.getElementById('icon-close');
    
    if(btn && menu && iconO && iconC) {
        btn.addEventListener('click', function() {
            menu.classList.toggle('hidden');
            iconO.classList.toggle('hidden');
            iconC.classList.toggle('hidden');
            document.body.classList.toggle('overflow-hidden');
        });
        var links = menu.querySelectorAll('a');
        for(var i=0; i<links.length; i++){
            links[i].addEventListener('click', function(){
                menu.classList.add('hidden');
                iconO.classList.remove('hidden');
                iconC.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            });
        }
    }

    // 2. Fetch CMS Data
    var cms = await _getCMS();

    /* --- 1. Load CMS data --- */
    try {
        _renderExternal(cms.externalTestimonials);
        _renderInternal(cms.internalTestimonials);
        _renderFAQ(cms.faqs);
        _renderPartners(cms.partners);
        _renderDonation(cms); // RENDER DONATION

        if (cms.locations && cms.locations.length) {
            _cmsLocations = cms.locations;
        }
    } catch (e) {
        console.error('CMS error:', e);
    }
    
    /* --- 2. FAQ accordion --- */
    _initFAQ();

    /* --- 3. Navbar --- */
    _initNavbar();

    /* --- 5. Map (Updated) --- */
    _initMap();

    /* --- 6. Visitor Tracking --- */
    trackVisitor();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _initMain);
} else {
    _initMain();
}

/* =============================================
   LEAFLET MAP (FINAL PRODUCTION VERSION)
   ============================================= */
function _initMap() {
    var el = document.getElementById('map');
    if (!el || typeof L === 'undefined') return;

    // 1. Setup Peta (Fokus Indonesia)
    var map = L.map('map').setView([-2.5489, 118.0149], 5); 

    // 2. Kontrol Zoom
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // 3. Layer Peta Dasar (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // 4. FUNGSI PEMBUAT PIN KUSTOM
    function createPinIcon(volunteerCount) {
        return L.divIcon({
            className: 'custom-div-icon',
            html: `
                <div class="marker-pin-container">
                    <div class="marker-pin-body">
                        <div class="marker-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                    </div>
                    <div class="marker-badge">${volunteerCount}</div>
                </div>
            `,
            iconSize: [40, 50],
            iconAnchor: [20, 50],
            popupAnchor: [0, -55]
        });
    }

    // 5. Ambil data lokasi
    var locs = _cmsLocations || window.HEY_YOUTH_DEFAULT_DATA.locations;
    
    // 6. Loop lokasi untuk render marker
    for (var i = 0; i < locs.length; i++) {
        var l = locs[i];
        L.marker([l.lat, l.lng], { icon: createPinIcon(l.volunteers) })
         .addTo(map)
         .bindPopup('<strong>' + l.name + '</strong><br>Volunteers: ' + l.volunteers);
    }
    
    // 7. Fix render issue saat layout berubah
    setTimeout(function() { map.invalidateSize(); }, 100);
}

/* =============================================
   LANGUAGE TOGGLE LOGIC
   ============================================= */
function initLanguageToggle() {
    var groups = document.querySelectorAll('.lang-toggle-group');
    if (!groups.length) return;

    var currentLang = localStorage.getItem('heyyouth_lang') || 'en';
    
    function setLang(lang) {
        document.body.classList.remove('lang-en', 'lang-id');
        document.body.classList.add('lang-' + lang);
        localStorage.setItem('heyyouth_lang', lang);
        
        groups.forEach(function(group) {
            var slider = group.querySelector('.lang-slider-bg');
            if (slider) {
                if (lang === 'en') {
                    slider.style.transform = 'translateX(40px)'; // Move to EN
                } else {
                    slider.style.transform = 'translateX(0px)';  // Move to ID
                }
            }
        });
    }

    setLang(currentLang);

    groups.forEach(function(group) {
        var btns = group.querySelectorAll('.lang-btn');
        btns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                var lang = e.currentTarget.getAttribute('data-lang');
                if (lang) {
                    setLang(lang);
                }
            });
        });
    });
}

/* =============================================
   DARK MODE TOGGLE LOGIC
   ============================================= */
function initThemeToggle() {
    var toggles = document.querySelectorAll('.theme-toggle-btn');
    if (!toggles.length) return;

    var currentTheme = localStorage.getItem('heyyouth_theme') || 'light';
    
    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('heyyouth_theme', theme);
        
        toggles.forEach(function(btn) {
            var iconSun = btn.querySelector('.theme-icon-sun');
            var iconMoon = btn.querySelector('.theme-icon-moon');
            if (iconSun && iconMoon) {
                if (theme === 'dark') {
                    iconSun.classList.remove('hidden');
                    iconMoon.classList.add('hidden');
                } else {
                    iconSun.classList.add('hidden');
                    iconMoon.classList.remove('hidden');
                }
            }
        });
    }

    setTheme(currentTheme);

    toggles.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
            setTheme(theme);
        });
    });
}

function _initToggles() {
    initLanguageToggle();
    initThemeToggle();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _initToggles);
} else {
    _initToggles();
}