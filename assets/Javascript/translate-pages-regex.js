const fs = require('fs');

const fileRegexes = {
    'Preview/About us.html': [
        [
            /(<h1[^>]*>)\s*Tentang Kami\s*(<\/h1>)/,
            '$1<span class="lang-id">Tentang Kami</span><span class="lang-en">About Us</span>$2'
        ],
        [
            /(<h2[^>]*>)\s*Tim Kami\s*(<\/h2>)/,
            '$1<span class="lang-id">Tim Kami</span><span class="lang-en">Our Team</span>$2'
        ]
    ],
    'Preview/Activities.html': [
        [
            /(<h1[^>]*>)\s*Kegiatan Kami\s*(<\/h1>)/,
            '$1<span class="lang-id">Kegiatan Kami</span><span class="lang-en">Our Activities</span>$2'
        ]
    ],
    'Preview/Partner.html': [
        [
            /(<h1[^>]*>)\s*Partner Kami\s*(<\/h1>)/,
            '$1<span class="lang-id">Partner Kami</span><span class="lang-en">Our Partners</span>$2'
        ]
    ]
};

for (const [file, regexes] of Object.entries(fileRegexes)) {
    if (fs.existsSync(file)) {
        let html = fs.readFileSync(file, 'utf8');
        let modified = false;

        for (let [regex, replacement] of regexes) {
            if (regex.test(html) && !html.includes('lang-en">About Us')) {
                html = html.replace(regex, replacement);
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(file, html);
            console.log('Regex translated content in: ' + file);
        }
    }
}
