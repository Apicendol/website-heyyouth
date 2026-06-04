const fs = require('fs');
const path = require('path');

const files = [
    'Preview/About us.html',
    'Preview/Activities.html',
    'Preview/Activity-detail.html',
    'Preview/Donation.html',
    'Preview/Partner.html'
];

const desktopToggle = `
                    <div class="btn-group lang-toggle-group ml-2 bg-gray-200 rounded-full p-1 relative flex items-center w-[84px] h-9" role="group" aria-label="Language Switch">
                        <div class="absolute left-1 bg-white h-7 w-9 rounded-full shadow-sm transition-transform duration-300 lang-slider-bg" style="transform: translateX(0);"></div>
                        <button type="button" class="btn btn-secondary flex-1 text-xs font-bold text-gray-800 relative z-10 lang-btn" data-lang="id">ID</button>
                        <button type="button" class="btn btn-secondary flex-1 text-xs font-bold text-gray-800 relative z-10 lang-btn" data-lang="en">EN</button>
                    </div>
                </div>`;

const mobileToggle = `
                    <div class="flex justify-center mt-4 pt-2">
                        <div class="btn-group lang-toggle-group bg-gray-200 rounded-full p-1 relative flex items-center w-[84px] h-9 mx-auto" role="group" aria-label="Language Switch">
                            <div class="absolute left-1 bg-white h-7 w-9 rounded-full shadow-sm transition-transform duration-300 lang-slider-bg" style="transform: translateX(0);"></div>
                            <button type="button" class="btn btn-secondary flex-1 text-xs font-bold text-gray-800 relative z-10 lang-btn" data-lang="id">ID</button>
                            <button type="button" class="btn btn-secondary flex-1 text-xs font-bold text-gray-800 relative z-10 lang-btn" data-lang="en">EN</button>
                        </div>
                    </div>
                </div>`;

for (let file of files) {
    if (fs.existsSync(file)) {
        let html = fs.readFileSync(file, 'utf8');

        // Check if already patched to avoid double patch
        if (html.includes('lang-toggle-group')) {
            console.log(file + ' is already patched.');
            continue;
        }

        // 1. Add class lang-en to body
        html = html.replace(/<body([^>]*)>/i, (match, p1) => {
            if (p1.includes('lang-en')) return match;
            if (p1.includes('class="')) {
                return match.replace('class="', 'class="lang-en ');
            } else {
                return `<body${p1} class="lang-en">`;
            }
        });

        // 2. Desktop navbar
        const desktopRegex = /(<a href="https:\/\/bit\.ly\/HYOprec"[^>]*>Join\s*Us!<\/a>\s*)<\/div>/i;
        html = html.replace(desktopRegex, `$1${desktopToggle}`);

        // 3. Mobile navbar
        const mobileRegex = /(<a href="https:\/\/bit\.ly\/HYOprec"[^>]*>Join\s*Us Now!<\/a>\s*)<\/div>/i;
        html = html.replace(mobileRegex, `$1${mobileToggle}`);

        fs.writeFileSync(file, html);
        console.log('Patched: ' + file);
    } else {
        console.log('File not found: ' + file);
    }
}
