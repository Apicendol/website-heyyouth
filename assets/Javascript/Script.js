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

/* ------ DEFAULT DATA (sama persis dengan CMS) ------ */var _CMS_DEFAULT = {
    externalTestimonials: [
        { 
            id: 1, 
            name: 'Mr. Rifki Zamzam', 
            title: 'Co-Founder, Qatar HR Forum', 
            title_id: 'Co-Founder, Qatar HR Forum',
            title_en: 'Co-Founder, Qatar HR Forum',
            quote: 'Kerjasama dengan Hey Youth! memberikan dampak positif yang nyata bagi komunitas kami.', 
            quote_id: 'Kerjasama dengan Hey Youth! memberikan dampak positif yang nyata bagi komunitas kami.',
            quote_en: 'Collaborating with Hey Youth! brings a real positive impact to our community.',
            image: 'img/Testi/p1.jpg' 
        },
        { 
            id: 2, 
            name: 'Ms. Rina Nurutami, S.Psi', 
            title: 'Vice Principal, Daarut Tauhid', 
            title_id: 'Wakil Kepala Sekolah, Daarut Tauhid',
            title_en: 'Vice Principal, Daarut Tauhid',
            quote: 'Sangat menginspirasi melihat semangat pemuda yang rela berkontribusi untuk pendidikan.', 
            quote_id: 'Sangat menginspirasi melihat semangat pemuda yang rela berkontribusi untuk pendidikan.',
            quote_en: 'It is highly inspiring to see the youth passion to contribute to education.',
            image: 'img/Testi/p2.jpg' 
        },
        { 
            id: 3, 
            name: 'Yiwen Xu', 
            title: 'Student, Univ. of Edinburgh', 
            title_id: 'Mahasiswa, Univ. of Edinburgh',
            title_en: 'Student, Univ. of Edinburgh',
            quote: 'Hey Youth! adalah jembatan yang menghubungkan antusiasme dengan aksi nyata.', 
            quote_id: 'Hey Youth! adalah jembatan yang menghubungkan antusiasme dengan aksi nyata.',
            quote_en: 'Hey Youth! is a bridge that connects enthusiasm with real actions.',
            image: 'img/Testi/p3.jpg' 
        }
    ],
    internalTestimonials: [
        { 
            id: 4, 
            name: 'Alya', 
            role: 'Community Coordinator', 
            role_id: 'Koordinator Komunitas',
            role_en: 'Community Coordinator',
            quote: 'Sangat bahagia bisa bergabung di Hey Youth! Banyak belajar hal baru setiap hari.', 
            quote_id: 'Sangat bahagia bisa bergabung di Hey Youth! Banyak belajar hal baru setiap hari.',
            quote_en: 'Extremely happy to join Hey Youth! Learning new things every day.',
            image: 'img/Testi/Alya.jpg' 
        },
        { 
            id: 5, 
            name: 'Herza', 
            role: 'Web Developer', 
            role_id: 'Web Developer',
            role_en: 'Web Developer',
            quote: 'Hey Youth adalah agent of change. Di sini kita bisa membuat dampak nyata.', 
            quote_id: 'Hey Youth adalah agent of change. Di sini kita bisa membuat dampak nyata.',
            quote_en: 'Hey Youth is an agent of change. Here we can make a real difference.',
            image: 'img/Testi/Herza.jpg' 
        },
        { 
            id: 6, 
            name: 'Karyn', 
            role: 'Teacher', 
            role_id: 'Guru',
            role_en: 'Teacher',
            quote: 'Hey Youth merayakan rasa ingin tahu dan membentuk sistem kepercayaan.', 
            quote_id: 'Hey Youth merayakan rasa ingin tahu dan membentuk sistem kepercayaan.',
            quote_en: 'Hey Youth celebrates curiosity and builds trust systems.',
            image: 'img/Testi/Karyn.jpg' 
        }
    ],
    faqs: [
        { 
            id: 7, 
            question: "Why don't we recruit people per batch?", 
            question_id: 'Mengapa kami tidak merekrut anggota per batch?',
            question_en: "Why don't we recruit people per batch?",
            answer: 'Kami membuka pendaftaran secara terbuka (rolling recruitment) agar talenta terbaik dapat bergabung kapan saja tanpa harus menunggu jadwal batch tertentu. Ini memungkinkan fleksibilitas lebih tinggi.', 
            answer_id: 'Kami membuka pendaftaran secara terbuka (rolling recruitment) agar talenta terbaik dapat bergabung kapan saja tanpa harus menunggu jadwal batch tertentu. Ini memungkinkan fleksibilitas lebih tinggi.',
            answer_en: 'We open registration through rolling recruitment so that the best talent can join at any time without waiting for a specific batch schedule, allowing higher flexibility.'
        },
        { 
            id: 8, 
            question: 'Do I need to have high English levels to join Hey Youth?', 
            question_id: 'Apakah saya perlu memiliki kemampuan Bahasa Inggris tingkat tinggi untuk bergabung dengan Hey Youth?',
            question_en: 'Do I need to have high English levels to join Hey Youth?',
            answer: 'Tidak wajib. Meskipun beberapa program internasional membutuhkan kemampuan Bahasa Inggris, kami menyediakan banyak peran di mana Bahasa Indonesia adalah bahasa utama komunikasi. Yang terpenting adalah semangat berkontribusi.', 
            answer_id: 'Tidak wajib. Meskipun beberapa program internasional membutuhkan kemampuan Bahasa Inggris, kami menyediakan banyak peran di mana Bahasa Indonesia adalah bahasa utama komunikasi. Yang terpenting adalah semangat berkontribusi.',
            answer_en: 'Not required. Although some international programs require English skills, we provide many roles where Indonesian is the primary language. The most important thing is the spirit to contribute.'
        },
        { 
            id: 9, 
            question: 'How can I donate to foundation?', 
            question_id: 'Bagaimana cara berdonasi ke yayasan?',
            question_en: 'How can I donate to foundation?',
            answer: 'Anda dapat mendukung kami melalui transfer bank atau donasi barang. Silakan kunjungi halaman Donation untuk informasi rekening dan kebutuhan barang terkini.', 
            answer_id: 'Anda dapat mendukung kami melalui transfer bank atau donasi barang. Silakan kunjungi halaman Donation untuk informasi rekening dan kebutuhan barang terkini.',
            answer_en: 'You can support us via bank transfer or item donations. Please visit our Donation page for current bank accounts and item needs.'
        }
    ],
    locations: [
        { id: 101, name: 'Jakarta', lat: -6.2088, lng: 106.8456, volunteers: 8 },
        { id: 102, name: 'Karawang', lat: -6.3146, lng: 107.3094, volunteers: 1 },
        { id: 103, name: 'Medan', lat: 3.5952, lng: 98.6722, volunteers: 1 },
        { id: 104, name: 'Jakarta Timur', lat: -6.2307, lng: 106.8967, volunteers: 2 },
        { id: 105, name: 'Malang', lat: -7.9826, lng: 112.6308, volunteers: 3 },
        { id: 106, name: 'Jakarta Selatan', lat: -6.2615, lng: 106.8106, volunteers: 2 },
        { id: 107, name: 'Arcamanik, Bandung', lat: -6.9175, lng: 107.6191, volunteers: 1 },
        { id: 108, name: 'Depok', lat: -6.4025, lng: 106.8048, volunteers: 3 },
        { id: 109, name: 'Bogor', lat: -6.5950, lng: 106.7997, volunteers: 4 },
        { id: 110, name: 'Bangka', lat: -2.3216, lng: 106.1086, volunteers: 1 },
        { id: 111, name: 'West Java', lat: -6.9034, lng: 107.6046, volunteers: 1 },
        { id: 112, name: 'Palembang', lat: -2.9761, lng: 104.7754, volunteers: 1 },
        { id: 113, name: 'Sunter, Jakarta Utara', lat: -6.1360, lng: 106.8778, volunteers: 1 },
        { id: 114, name: 'Purwokerto', lat: -7.4239, lng: 109.2215, volunteers: 1 },
        { id: 115, name: 'Cikarang', lat: -6.2737, lng: 107.1352, volunteers: 1 },
        { id: 116, name: 'Bekasi', lat: -6.2369, lng: 106.9715, volunteers: 3 },
        { id: 117, name: 'Tuban, East Java', lat: -6.9079, lng: 112.0560, volunteers: 1 },
        { id: 118, name: 'Sumedang, Jatinangor', lat: -6.9329, lng: 107.7667, volunteers: 1 },
        { id: 119, name: 'Gresik', lat: -7.1666, lng: 112.6568, volunteers: 1 },
        { id: 120, name: 'Purbalingga', lat: -7.3707, lng: 109.3582, volunteers: 1 },
        { id: 121, name: 'Jakarta Barat', lat: -6.1754, lng: 106.8272, volunteers: 1 },
        { id: 122, name: 'Aceh', lat: 5.5524, lng: 95.3188, volunteers: 1 },
        { id: 123, name: 'Batang, Jawa Tengah', lat: -7.0094, lng: 109.7368, volunteers: 1 },
        { id: 124, name: 'Bandung', lat: -6.9175, lng: 107.6191, volunteers: 2 },
        { id: 125, name: 'Surabaya', lat: -7.2504, lng: 112.7688, volunteers: 1 },
        { id: 126, name: 'Bali', lat: -8.4095, lng: 115.1889, volunteers: 1 },
        { id: 127, name: 'Surakarta', lat: -7.5559, lng: 110.8200, volunteers: 1 },
        { id: 128, name: 'Pekanbaru', lat: 0.5071, lng: 101.4478, volunteers: 1 },
        { id: 129, name: 'South Tangerang', lat: -6.2878, lng: 106.7323, volunteers: 1 },
        { id: 130, name: 'Kendari', lat: -3.9806, lng: 122.5160, volunteers: 1 }
    ],
    partners: [
        { 
            id: 1, 
            name: 'Qatar HR Forum', 
            description: 'Membangun jaringan profesional HR global.', 
            description_id: 'Membangun jaringan profesional HR global.',
            description_en: 'Building a global professional HR network.',
            icon: 'fa-users-cog', 
            image: 'img/Partners/Qatar HR Forum.jpg', 
            color: 'blue', 
            link: 'https://qatarhrforum.com' 
        },
        { 
            id: 2, 
            name: 'The Facial Skin Lab', 
            description: 'Klinik kecantikan terpercaya.', 
            description_id: 'Klinik kecantikan terpercaya.',
            description_en: 'A trusted beauty clinic.',
            icon: 'fa-spa', 
            image: 'img/Partners/The Facial Skin Lab.jpg', 
            color: 'pink', 
            link: 'https://instagram.com' 
        },
        { 
            id: 3, 
            name: 'Shadow A Scientist', 
            description: 'Program mentoring ilmiah.', 
            description_id: 'Program mentoring ilmiah.',
            description_en: 'Scientific mentoring program.',
            icon: 'fa-flask', 
            image: 'img/Partners/Shadow A Scientist.jpg', 
            color: 'purple', 
            link: '#' 
        },
        { 
            id: 4, 
            name: 'SMP Adzkia', 
            description: 'Sekolah Islam terpadu.', 
            description_id: 'Sekolah Islam terpadu.',
            description_en: 'Integrated Islamic School.',
            icon: 'fa-school', 
            image: 'img/Partners/SMP Adzkia Islamic.jpg', 
            color: 'green', 
            link: '#' 
        }
    ],
    
    // DATA DONATION BARU
    donationSettings: {
        heroTitle: 'Support Our Mission',
        heroTitle_id: 'Dukung Misi Kami',
        heroTitle_en: 'Support Our Mission',
        heroSubtitle: 'Bantu kami menyediakan akses pendidikan yang layak bagi anak-anak Indonesia. Setiap donasi Anda menjadi jembatan menuju masa depan yang lebih cerah.',
        heroSubtitle_id: 'Bantu kami menyediakan akses pendidikan yang layak bagi anak-anak Indonesia. Setiap donasi Anda menjadi jembatan menuju masa depan yang lebih cerah.',
        heroSubtitle_en: 'Help us provide decent access to education for Indonesian children. Every donation you make is a bridge to a brighter future.',
        stripText: 'Together We Can',
        stripText_id: 'Bersama Kita Bisa',
        stripText_en: 'Together We Can',
        stripImage: 'img/Front Card.webp',
        bankName: 'Bank Central Asia (BCA)',
        accountName: 'Yuni Triandini',
        accountNumber: '466 0070 724',
        qrisImage: 'https://via.placeholder.com/200?text=QRIS' 
    },

    // DYNAMIC HOME/ABOUT/ACTIVITIES DATA FOR SYNC
    aboutHero: {
        title: 'Mendidik Untuk <br><span class="text-primary">Masa Depan Indonesia</span>',
        title_id: 'Mendidik Untuk <br><span class="text-primary">Masa Depan Indonesia</span>',
        title_en: 'Educating For <br><span class="text-primary">Indonesia\'s Future</span>',
        subtitle: 'Hey Youth adalah sebuah komunitas pemuda di Indonesia yang didedikasikan untuk melakukan perubahan melalui pendidikan. Kami menyediakan akses ke pendidikan berkualitas dan peluang mentoring bagi mereka yang membutuhkan.',
        subtitle_id: 'Hey Youth adalah sebuah komunitas pemuda di Indonesia yang didedikasikan untuk melakukan perubahan melalui pendidikan. Kami menyediakan akses ke pendidikan berkualitas dan peluang mentoring bagi mereka yang membutuhkan.',
        subtitle_en: 'Hey Youth is a youth community in Indonesia dedicated to making changes through education. We provide access to quality education and mentoring opportunities for those in need.',
        volunteerCount: '1k+',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2070&auto=format&fit=crop'
    },
    team: [
        { 
            id: 201, 
            name: 'Yuni Triandini', 
            role: 'Founder', 
            role_id: 'Founder',
            role_en: 'Founder',
            image: 'img/ceo.jpeg', 
            linkedin: '#', 
            instagram: '#' 
        },
        { 
            id: 202, 
            name: 'Rama', 
            role: 'Head of Marketing', 
            role_id: 'Kepala Pemasaran',
            role_en: 'Head of Marketing',
            image: 'https://ui-avatars.com/api/?name=Rama&size=100&background=random&color=fff', 
            linkedin: '#', 
            instagram: '#' 
        },
        { 
            id: 203, 
            name: 'Dzikri', 
            role: 'Head of Graphic Designer', 
            role_id: 'Kepala Desainer Grafis',
            role_en: 'Head of Graphic Designer',
            image: 'https://ui-avatars.com/api/?name=Dzikri&size=100&background=random&color=fff', 
            linkedin: '#', 
            instagram: '#' 
        }
    ],
    activityCards: [
        { 
            id: 301, 
            category: 'Education', 
            category_id: 'Pendidikan',
            category_en: 'Education',
            date: '10 November 2025', 
            title: 'Dream Big, Learn Bigger: Inspiring the Next Generation at Yos Sudarso', 
            title_id: 'Dream Big, Learn Bigger: Menginspirasi Generasi Penerus di Yos Sudarso',
            title_en: 'Dream Big, Learn Bigger: Inspiring the Next Generation at Yos Sudarso',
            description: 'Kami mengunjungi sekolah di Yos Sudarso untuk berbagi inspirasi dan materi pendidikan interaktif kepada ratusan siswa, membantu mereka bermimpi lebih besar.',
            description_id: 'Kami mengunjungi sekolah di Yos Sudarso untuk berbagi inspirasi dan materi pendidikan interaktif kepada ratusan siswa, membantu mereka bermimpi lebih besar.',
            description_en: 'We visited a school in Yos Sudarso to share inspiration and interactive educational materials with hundreds of students, helping them dream bigger.',
            image: 'img/Donation.jpeg',
            link: '#',
            fullStory: '<p>Pada hari yang cerah, tim Hey Youth berkunjung ke SD Yos Sudarso. Antusiasme siswa-siswi sangat luar biasa ketika kami memperkenalkan program mentoring kami.</p><p>Kegiatan ini diawali dengan sesi ice breaking yang diikuti oleh seluruh siswa kelas 5 dan 6. Dilanjutkan dengan materi tentang "Membangun Mimpi Sejak Dini".</p><br><p>Kami berharap kunjungan ini dapat menjadi inspirasi bagi mereka untuk terus belajar dan giat meraih cita-cita.</p>',
            fullStory_id: '<p>Pada hari yang cerah, tim Hey Youth berkunjung ke SD Yos Sudarso. Antusiasme siswa-siswi sangat luar biasa ketika kami memperkenalkan program mentoring kami.</p><p>Kegiatan ini diawali dengan sesi ice breaking yang diikuti oleh seluruh siswa kelas 5 dan 6. Dilanjutkan dengan materi tentang "Membangun Mimpi Sejak Dini".</p><br><p>Kami berharap kunjungan ini dapat menjadi inspirasi bagi mereka untuk terus belajar dan giat meraih cita-cita.</p>',
            fullStory_en: '<p>On a bright day, the Hey Youth team visited SD Yos Sudarso. The enthusiasm of the students was extraordinary when we introduced our mentoring program.</p><p>This activity started with an ice-breaking session followed by all 5th and 6th grade students, followed by material on "Building Dreams from an Early Age".</p><br><p>We hope this visit can serve as an inspiration for them to keep learning and striving to achieve their dreams.</p>'
        },
        { 
            id: 302, 
            category: 'Community', 
            category_id: 'Komunitas',
            category_en: 'Community',
            date: '14 April 2025', 
            title: 'Instilling Education, Igniting Dreams: Hey Youth\'s Visit to TBM Kolong', 
            title_id: 'Menanamkan Pendidikan, Menyalakan Impian: Kunjungan Hey Youth ke TBM Kolong',
            title_en: 'Instilling Education, Igniting Dreams: Hey Youth\'s Visit to TBM Kolong',
            description: 'Kunjungan spesial ke TBM Kolong untuk mendukung literasi di lingkungan sekitar, mendonasikan buku, dan mengadakan sesi membaca bersama anak-anak.',
            description_id: 'Kunjungan spesial ke TBM Kolong untuk mendukung literasi di lingkungan sekitar, mendonasikan buku, dan mengadakan sesi membaca bersama anak-anak.',
            description_en: 'A special visit to TBM Kolong to support local literacy, donating books, and hosting a reading session with children.',
            image: 'img/Front Card.webp',
            link: '#',
            fullStory: '<p>TBM Kolong adalah salah satu tempat baca yang sangat bersemangat di daerah kami. Kami mendonasikan 100 eksemplar buku cerita dan ensiklopedia anak.</p><p>Selain donasi buku, relawan kami juga membacakan cerita rakyat Nusantara kepada anak-anak dengan penuh ekspresi.</p>',
            fullStory_id: '<p>TBM Kolong adalah salah satu tempat baca yang sangat bersemangat di daerah kami. Kami mendonasikan 100 eksemplar buku cerita dan ensiklopedia anak.</p><p>Selain donasi buku, relawan kami juga membacakan cerita rakyat Nusantara kepada anak-anak dengan penuh ekspresi.</p>',
            fullStory_en: '<p>TBM Kolong is a very vibrant reading shelter in our area. We donated 100 copies of children storybooks and encyclopedias.</p><p>Along with book donation, our volunteers read Indonesian folklores to children with rich expressions.</p>'
        }
    ],
    podcasts: [
        {
            id: 401,
            episode: 'Episode 2',
            episode_id: 'Episode 2',
            episode_en: 'Episode 2',
            title: 'Suicide Is Not The Answer: Here\'s Why',
            title_id: 'Suicide Is Not The Answer: Ini Alasannya',
            title_en: 'Suicide Is Not The Answer: Here\'s Why',
            thumbnail: 'img/Podcast/Eps 2.png', 
            spotifyLink: 'https://open.spotify.com/episode/5xcQh5HewK3MvIcxkSiWef' 
        },
        {
            id: 402,
            episode: 'Episode 1',
            episode_id: 'Episode 1',
            episode_en: 'Episode 1',
            title: 'The Power of Self-Affirmation: Transforming Our Lives',
            title_id: 'Kekuatan Afirmasi Diri: Mengubah Hidup Kita',
            title_en: 'The Power of Self-Affirmation: Transforming Our Lives',
            thumbnail: 'img/Podcast/Eps 1.png',
            spotifyLink: 'https://open.spotify.com/episode/1a0xUotfQZAdD6jtHT4l5g?si=l3nk1yvSSzK7XPMMFLMvHA&nd=1&dlsi=746e34d28eaa4e68'
        }
    ]
};

async function _getCMS() {
    return await window.getFirebaseData(_CMS_DEFAULT);
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
    var locs = _cmsLocations || _CMS_DEFAULT.locations;
    
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