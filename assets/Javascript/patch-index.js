const fs = require('fs');

let f = fs.readFileSync('Preview/Index.html', 'utf8');

// 1. Add class lang-en to body
f = f.replace('<body class="bg-bg text-body font-sans antialiased selection:bg-primary selection:text-white">', '<body class="bg-bg text-body font-sans antialiased selection:bg-primary selection:text-white lang-en">');

// 2. Desktop navbar
f = f.replace(
    /(\s*)<a href="https:\/\/bit\.ly\/HYOprec"[^>]*>Join\s*Us!<\/a>\s*<\/div>/g,
    `$1<a href="https://bit.ly/HYOprec"
                        class="bg-primary hover:bg-primaryDark text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-primary">Join
                        Us!</a>
                    <div class="relative inline-flex items-center bg-gray-200 rounded-full w-[72px] h-8 cursor-pointer select-none ml-2 lang-toggle-btn">
                        <div class="absolute left-1 bg-white w-[30px] h-[24px] rounded-full shadow-sm transition-transform duration-300 lang-slider-bg"></div>
                        <span class="relative z-10 flex-1 text-center text-xs font-bold text-gray-800 transition-colors">ID</span>
                        <span class="relative z-10 flex-1 text-center text-xs font-bold text-gray-800 transition-colors">EN</span>
                    </div>
                </div>`
);

// 3. Mobile navbar
f = f.replace(
    /(\s*)<a href="https:\/\/bit\.ly\/HYOprec"[^>]*>Join\s*Us Now!<\/a>\s*<\/div>/g,
    `$1<a href="https://bit.ly/HYOprec"
                        class="block w-full text-center bg-accent text-white px-4 py-3 rounded-xl font-bold hover:bg-yellow-600 transition-colors shadow-md">Join
                        Us Now!</a>
                    <div class="flex justify-center mt-4 pt-2">
                        <div class="relative inline-flex items-center bg-gray-200 rounded-full w-[72px] h-8 cursor-pointer select-none lang-toggle-btn">
                            <div class="absolute left-1 bg-white w-[30px] h-[24px] rounded-full shadow-sm transition-transform duration-300 lang-slider-bg"></div>
                            <span class="relative z-10 flex-1 text-center text-xs font-bold text-gray-800 transition-colors">ID</span>
                            <span class="relative z-10 flex-1 text-center text-xs font-bold text-gray-800 transition-colors">EN</span>
                        </div>
                    </div>
                </div>`
);

// 4. Hero text translation
f = f.replace(
    'Membangun Masa Depan Pendidikan',
    '<span class="lang-id">Membangun Masa Depan Pendidikan</span><span class="lang-en">Building the Future of Education</span>'
);

f = f.replace(
    'Bergabunglah bersama kami dalam gerakan sosial untuk menyediakan akses pendidikan yang\n                            setara bagi pemuda di seluruh pelosok negeri.',
    '<span class="lang-id">Bergabunglah bersama kami dalam gerakan sosial untuk menyediakan akses pendidikan yang setara bagi pemuda di seluruh pelosok negeri.</span><span class="lang-en">Join us in a social movement to provide equal access to education for youth across the nation.</span>'
);

f = f.replace(
    '1k+</p>\n                                    <p class="text-xs sm:text-sm text-gray-500 font-medium">Relawan</p>',
    '1k+</p>\n                                    <p class="text-xs sm:text-sm text-gray-500 font-medium"><span class="lang-id">Relawan</span><span class="lang-en">Volunteers</span></p>'
);

f = f.replace(
    '7+ Tahun</p>\n                                    <p class="text-xs sm:text-sm text-gray-500 font-medium">Pengalaman</p>',
    '7+ Tahun</p>\n                                    <p class="text-xs sm:text-sm text-gray-500 font-medium"><span class="lang-id">Pengalaman</span><span class="lang-en">Experience</span></p>'
);

f = f.replace(
    'Mengapa Bergabung Bersama Kami?</p>',
    '<span class="lang-id">Mengapa Bergabung Bersama Kami?</span><span class="lang-en">Why Join Us?</span></p>'
);

f = f.replace(
    'Melalui edukasi, kami berdampak langsung pada\n                            kehidupan anak-anak yang kurang mampu untuk masa depan yang lebih cerah.',
    '<span class="lang-id">Melalui edukasi, kami berdampak langsung pada kehidupan anak-anak yang kurang mampu untuk masa depan yang lebih cerah.</span><span class="lang-en">Through education, we make a direct impact on the lives of underprivileged children for a brighter future.</span>'
);

f = f.replace(
    'Terhubung dengan ribuan relawan dan mentor dari\n                            seluruh dunia yang memiliki visi yang sama.',
    '<span class="lang-id">Terhubung dengan ribuan relawan dan mentor dari seluruh dunia yang memiliki visi yang sama.</span><span class="lang-en">Connect with thousands of volunteers and mentors from around the world who share the same vision.</span>'
);

f = f.replace(
    'Kembangkan kemampuan kepemimpinan dan manajemen\n                            proyek Anda melalui pengalaman langsung.',
    '<span class="lang-id">Kembangkan kemampuan kepemimpinan dan manajemen proyek Anda melalui pengalaman langsung.</span><span class="lang-en">Develop your leadership and project management skills through hands-on experience.</span>'
);

f = f.replace(
    '"Pendidikan adalah senjata paling ampuh yang bisa Anda gunakan untuk mengubah dunia. Di Hey\n                            Youth, kami percaya bahwa setiap anak berhak mendapatkan kesempatan yang sama."',
    '"<span class="lang-id">Pendidikan adalah senjata paling ampuh yang bisa Anda gunakan untuk mengubah dunia. Di Hey Youth, kami percaya bahwa setiap anak berhak mendapatkan kesempatan yang sama.</span><span class="lang-en">Education is the most powerful weapon which you can use to change the world. At Hey Youth, we believe every child deserves equal opportunities.</span>"'
);

f = f.replace(
    'Kami terus bergerak maju, menghubungkan kepedulian dengan aksi, dan\n                            membangun ekosistem pendidikan yang inklusif bagi semua.',
    '<span class="lang-id">Kami terus bergerak maju, menghubungkan kepedulian dengan aksi, dan membangun ekosistem pendidikan yang inklusif bagi semua.</span><span class="lang-en">We keep moving forward, connecting care with action, and building an inclusive education ecosystem for all.</span>'
);

f = f.replace(
    'Jawaban untuk pertanyaan yang sering diajukan.</p>',
    '<span class="lang-id">Jawaban untuk pertanyaan yang sering diajukan.</span><span class="lang-en">Answers to frequently asked questions.</span></p>'
);

f = f.replace(
    'Jangkauan Kami</h2>',
    '<span class="lang-id">Jangkauan Kami</span><span class="lang-en">Our Reach</span></h2>'
);

f = f.replace(
    'Kami menyambut baik kontributor dari 22 provinsi di Indonesia dan 20 negara lainnya. Jejak\n                            kami tersebar dari Sabang sampai Merauke, dibangun oleh relawan lokal yang didukung oleh\n                            jaringan global.',
    '<span class="lang-id">Kami menyambut baik kontributor dari 22 provinsi di Indonesia dan 20 negara lainnya. Jejak kami tersebar dari Sabang sampai Merauke, dibangun oleh relawan lokal yang didukung oleh jaringan global.</span><span class="lang-en">We welcome contributors from 22 provinces in Indonesia and 20 other countries. Our footprint stretches from Sabang to Merauke, built by local volunteers supported by a global network.</span>'
);

f = f.replace(
    'Tersebar di seluruh Indonesia</span>',
    '<span class="lang-id">Tersebar di seluruh Indonesia</span><span class="lang-en">Spread across Indonesia</span></span>'
);

f = f.replace(
    'Jaringan kontributor internasional</span>',
    '<span class="lang-id">Jaringan kontributor internasional</span><span class="lang-en">International contributor network</span></span>'
);

f = f.replace(
    'Lihat Detail Kegiatan\n                                <i\n                                    class="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>',
    '<span class="lang-id">Lihat Detail Kegiatan</span><span class="lang-en">View Activity Details</span>\n                                <i class="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>'
);

fs.writeFileSync('Preview/Index.html', f);
console.log('Index.html patched successfully.');
