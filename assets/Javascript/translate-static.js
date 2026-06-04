const fs = require('fs');

let file = 'Preview/About us.html';
let html = fs.readFileSync(file, 'utf8');

// Replace Visi & Misi
html = html.replace(
    '<h3 class="text-3xl lg:text-4xl font-extrabold text-heading">Visi & Misi Kami</h3>',
    '<h3 class="text-3xl lg:text-4xl font-extrabold text-heading"><span class="lang-id">Visi & Misi Kami</span><span class="lang-en">Our Vision & Mission</span></h3>'
);

html = html.replace(
    '<p class="mt-4 text-body text-lg">Kami berdiri atas dasar impian untuk menciptakan ekosistem belajar yang inklusif di seluruh nusantara.</p>',
    '<p class="mt-4 text-body text-lg"><span class="lang-id">Kami berdiri atas dasar impian untuk menciptakan ekosistem belajar yang inklusif di seluruh nusantara.</span><span class="lang-en">We stand on the dream of creating an inclusive learning ecosystem throughout the archipelago.</span></p>'
);

html = html.replace(
    '<p class="text-body text-lg leading-relaxed">Mewujudkan akses pendidikan yang setara dan berkualitas bagi setiap pemuda di Indonesia, tanpa memandang latar belakang sosial maupun ekonomi.</p>',
    '<p class="text-body text-lg leading-relaxed"><span class="lang-id">Mewujudkan akses pendidikan yang setara dan berkualitas bagi setiap pemuda di Indonesia, tanpa memandang latar belakang sosial maupun ekonomi.</span><span class="lang-en">Realizing equal and quality access to education for every youth in Indonesia, regardless of social or economic background.</span></p>'
);

html = html.replace(
    '<p class="text-body text-lg leading-relaxed">Menghubungkan pemimpin muda yang berpotensi dengan komunitas yang membutuhkan dukungan pendidikan, serta memberdayakan mereka melalui program mentoring intensif.</p>',
    '<p class="text-body text-lg leading-relaxed"><span class="lang-id">Menghubungkan pemimpin muda yang berpotensi dengan komunitas yang membutuhkan dukungan pendidikan, serta memberdayakan mereka melalui program mentoring intensif.</span><span class="lang-en">Connecting potential young leaders with communities that need educational support, and empowering them through intensive mentoring programs.</span></p>'
);

html = html.replace(
    '<h3 class="text-3xl lg:text-4xl font-extrabold text-heading">Nilai-Nilai Kami</h3>',
    '<h3 class="text-3xl lg:text-4xl font-extrabold text-heading"><span class="lang-id">Nilai-Nilai Kami</span><span class="lang-en">Our Values</span></h3>'
);

fs.writeFileSync(file, html);

// Activities.html
file = 'Preview/Activities.html';
if (fs.existsSync(file)) {
    html = fs.readFileSync(file, 'utf8');
    html = html.replace(
        '<h1 class="text-4xl lg:text-5xl font-bold text-heading mb-6 leading-tight font-serif">Aktivitas Kami</h1>',
        '<h1 class="text-4xl lg:text-5xl font-bold text-heading mb-6 leading-tight font-serif"><span class="lang-id">Aktivitas Kami</span><span class="lang-en">Our Activities</span></h1>'
    );
    html = html.replace(
        '<p class="text-lg text-body max-w-2xl mx-auto leading-relaxed">Jelajahi berbagai inisiatif dan program yang kami jalankan untuk memberdayakan pemuda dan memajukan pendidikan.</p>',
        '<p class="text-lg text-body max-w-2xl mx-auto leading-relaxed"><span class="lang-id">Jelajahi berbagai inisiatif dan program yang kami jalankan untuk memberdayakan pemuda dan memajukan pendidikan.</span><span class="lang-en">Explore the various initiatives and programs we run to empower youth and advance education.</span></p>'
    );
    fs.writeFileSync(file, html);
}

// Partner.html
file = 'Preview/Partner.html';
if (fs.existsSync(file)) {
    html = fs.readFileSync(file, 'utf8');
    html = html.replace(
        '<h1 class="text-4xl lg:text-5xl font-bold text-heading mb-6 leading-tight font-serif">Partner Kami</h1>',
        '<h1 class="text-4xl lg:text-5xl font-bold text-heading mb-6 leading-tight font-serif"><span class="lang-id">Partner Kami</span><span class="lang-en">Our Partners</span></h1>'
    );
    html = html.replace(
        '<p class="text-lg text-body max-w-2xl mx-auto leading-relaxed">Kami berkolaborasi dengan berbagai organisasi dan institusi untuk menciptakan dampak yang lebih luas dalam dunia pendidikan.</p>',
        '<p class="text-lg text-body max-w-2xl mx-auto leading-relaxed"><span class="lang-id">Kami berkolaborasi dengan berbagai organisasi dan institusi untuk menciptakan dampak yang lebih luas dalam dunia pendidikan.</span><span class="lang-en">We collaborate with various organizations and institutions to create a broader impact in the world of education.</span></p>'
    );
    fs.writeFileSync(file, html);
}

console.log('Static text translated.');
