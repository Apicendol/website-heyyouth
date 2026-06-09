// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAdHfy2lR-gSKNDY-PE6utV-jL57hPNDzM",
    authDomain: "hey-youth-cms.firebaseapp.com",
    projectId: "hey-youth-cms",
    storageBucket: "hey-youth-cms.firebasestorage.app",
    messagingSenderId: "872098145627",
    appId: "1:872098145627:web:a6ad4eac63561a19ea267e",
    measurementId: "G-HVB8Y69Q3Y"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Consolidated Default Data (Master Data)
window.HEY_YOUTH_DEFAULT_DATA = {
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
        qrisImage: 'img/qris-mockup.png' 
    },
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

// Global utility to get data
window.getFirebaseData = async function(defaultData) {
    try {
        const docRef = db.collection('heyyouth').doc('cms_data');
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            const data = docSnap.data();
            if (data && data.donationSettings) {
                if (!data.donationSettings.qrisImage || data.donationSettings.qrisImage.includes('via.placeholder.com')) {
                    data.donationSettings.qrisImage = 'img/qris-mockup.png';
                }
                if (!data.donationSettings.stripImage || data.donationSettings.stripImage.includes('Front Card.webp')) {
                    data.donationSettings.stripImage = 'img/Front Card.webp';
                }
            }
            return data;
        } else {
            // Seed default data if it doesn't exist
            if (defaultData) {
                try {
                    await db.collection('heyyouth').doc('cms_data').set(defaultData);
                } catch (e) {
                    console.error("Error seeding to Firebase:", e);
                }
            }
            return JSON.parse(JSON.stringify(defaultData));
        }
    } catch (e) {
        console.error("Error reading from Firebase:", e);
        if (defaultData && defaultData.donationSettings) {
            if (!defaultData.donationSettings.qrisImage || defaultData.donationSettings.qrisImage.includes('via.placeholder.com')) {
                defaultData.donationSettings.qrisImage = 'img/qris-mockup.png';
            }
            if (!defaultData.donationSettings.stripImage || defaultData.donationSettings.stripImage.includes('Front Card.webp')) {
                defaultData.donationSettings.stripImage = 'img/Front Card.webp';
            }
        }
        return JSON.parse(JSON.stringify(defaultData)); // Fallback
    }
};
