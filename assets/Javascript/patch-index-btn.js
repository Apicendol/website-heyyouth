const fs = require('fs');

let htmlPath = 'Preview/Index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace desktop toggle
html = html.replace(
    /<div class="relative inline-flex items-center bg-gray-200 rounded-full w-\[72px\] h-8 cursor-pointer select-none ml-2 lang-toggle-btn">[\s\S]*?<\/div>\n                    <\/div>/,
    `<div class="btn-group lang-toggle-group ml-2 bg-gray-200 rounded-full p-1 relative flex items-center w-[84px] h-9" role="group" aria-label="Language Switch">
                        <div class="absolute left-1 bg-white h-7 w-9 rounded-full shadow-sm transition-transform duration-300 lang-slider-bg" style="transform: translateX(0);"></div>
                        <button type="button" class="btn btn-secondary flex-1 text-xs font-bold text-gray-800 relative z-10 lang-btn" data-lang="id">ID</button>
                        <button type="button" class="btn btn-secondary flex-1 text-xs font-bold text-gray-800 relative z-10 lang-btn" data-lang="en">EN</button>
                    </div>
                </div>`
);

// Replace mobile toggle
html = html.replace(
    /<div class="relative inline-flex items-center bg-gray-200 rounded-full w-\[72px\] h-8 cursor-pointer select-none lang-toggle-btn">[\s\S]*?<\/div>\n                    <\/div>/,
    `<div class="btn-group lang-toggle-group bg-gray-200 rounded-full p-1 relative flex items-center w-[84px] h-9 mx-auto" role="group" aria-label="Language Switch">
                            <div class="absolute left-1 bg-white h-7 w-9 rounded-full shadow-sm transition-transform duration-300 lang-slider-bg" style="transform: translateX(0);"></div>
                            <button type="button" class="btn btn-secondary flex-1 text-xs font-bold text-gray-800 relative z-10 lang-btn" data-lang="id">ID</button>
                            <button type="button" class="btn btn-secondary flex-1 text-xs font-bold text-gray-800 relative z-10 lang-btn" data-lang="en">EN</button>
                        </div>
                    </div>`
);

fs.writeFileSync(htmlPath, html);

let scriptPath = 'Preview/javascript/Script.js';
let script = fs.readFileSync(scriptPath, 'utf8');

let newJs = `function initLanguageToggle() {
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
                    slider.style.transform = 'translateX(36px)'; // Move to EN
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
}`;

script = script.replace(/function initLanguageToggle\(\) \{[\s\S]*?\}\n\ndocument\.addEventListener\('DOMContentLoaded'/m, newJs + '\n\ndocument.addEventListener(\'DOMContentLoaded\'');

fs.writeFileSync(scriptPath, script);

console.log('Update complete.');
