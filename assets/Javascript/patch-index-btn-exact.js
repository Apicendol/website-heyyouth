const fs = require('fs');

let htmlPath = 'Preview/Index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const desktopTarget = `<div class="relative inline-flex items-center bg-gray-200 rounded-full w-[72px] h-8 cursor-pointer select-none ml-2 lang-toggle-btn">
                        <div class="absolute left-1 bg-white w-[30px] h-[24px] rounded-full shadow-sm transition-transform duration-300 lang-slider-bg"></div>
                        <span class="relative z-10 flex-1 text-center text-xs font-bold text-gray-800 transition-colors">ID</span>
                        <span class="relative z-10 flex-1 text-center text-xs font-bold text-gray-800 transition-colors">EN</span>
                    </div>`;

const desktopReplacement = `<div class="btn-group lang-toggle-group ml-2 bg-gray-200 rounded-full p-1 relative flex items-center w-[84px] h-9" role="group" aria-label="Language Switch">
                        <div class="absolute left-1 bg-white h-7 w-9 rounded-full shadow-sm transition-transform duration-300 lang-slider-bg" style="transform: translateX(0);"></div>
                        <button type="button" class="btn btn-secondary flex-1 text-xs font-bold text-gray-800 relative z-10 lang-btn" data-lang="id">ID</button>
                        <button type="button" class="btn btn-secondary flex-1 text-xs font-bold text-gray-800 relative z-10 lang-btn" data-lang="en">EN</button>
                    </div>`;

const mobileTarget = `<div class="relative inline-flex items-center bg-gray-200 rounded-full w-[72px] h-8 cursor-pointer select-none lang-toggle-btn">
                            <div class="absolute left-1 bg-white w-[30px] h-[24px] rounded-full shadow-sm transition-transform duration-300 lang-slider-bg"></div>
                            <span class="relative z-10 flex-1 text-center text-xs font-bold text-gray-800 transition-colors">ID</span>
                            <span class="relative z-10 flex-1 text-center text-xs font-bold text-gray-800 transition-colors">EN</span>
                        </div>`;

const mobileReplacement = `<div class="btn-group lang-toggle-group bg-gray-200 rounded-full p-1 relative flex items-center w-[84px] h-9 mx-auto" role="group" aria-label="Language Switch">
                            <div class="absolute left-1 bg-white h-7 w-9 rounded-full shadow-sm transition-transform duration-300 lang-slider-bg" style="transform: translateX(0);"></div>
                            <button type="button" class="btn btn-secondary flex-1 text-xs font-bold text-gray-800 relative z-10 lang-btn" data-lang="id">ID</button>
                            <button type="button" class="btn btn-secondary flex-1 text-xs font-bold text-gray-800 relative z-10 lang-btn" data-lang="en">EN</button>
                        </div>`;

html = html.replace(desktopTarget, desktopReplacement);
html = html.replace(mobileTarget, mobileReplacement);

fs.writeFileSync(htmlPath, html);
console.log('Update HTML complete.');
