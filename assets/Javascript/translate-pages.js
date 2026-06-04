const fs = require('fs');

const translations = [
    // About us.html
    [
        'Tentang Kami',
        '<span class="lang-id">Tentang Kami</span><span class="lang-en">About Us</span>'
    ],
    [
        'Membangun masa depan yang lebih baik melalui pendidikan, pemberdayaan pemuda, dan kolaborasi global.',
        '<span class="lang-id">Membangun masa depan yang lebih baik melalui pendidikan, pemberdayaan pemuda, dan kolaborasi global.</span><span class="lang-en">Building a better future through education, youth empowerment, and global collaboration.</span>'
    ],
    [
        'Tim Kami',
        '<span class="lang-id">Tim Kami</span><span class="lang-en">Our Team</span>'
    ],
    [
        'Para pemuda hebat di balik Hey Youth yang berdedikasi untuk menciptakan perubahan positif.',
        '<span class="lang-id">Para pemuda hebat di balik Hey Youth yang berdedikasi untuk menciptakan perubahan positif.</span><span class="lang-en">The great youths behind Hey Youth dedicated to creating positive change.</span>'
    ],

    // Activities.html
    [
        'Kegiatan Kami',
        '<span class="lang-id">Kegiatan Kami</span><span class="lang-en">Our Activities</span>'
    ],
    [
        'Lihat apa saja yang telah kami lakukan dan dampak yang kami ciptakan untuk komunitas dan lingkungan sekitar.',
        '<span class="lang-id">Lihat apa saja yang telah kami lakukan dan dampak yang kami ciptakan untuk komunitas dan lingkungan sekitar.</span><span class="lang-en">See what we have done and the impact we have created for the community and environment.</span>'
    ],

    // Partner.html
    [
        'Partner Kami',
        '<span class="lang-id">Partner Kami</span><span class="lang-en">Our Partners</span>'
    ],
    [
        'Berkolaborasi dengan berbagai organisasi untuk menciptakan dampak yang lebih besar dalam ekosistem pendidikan.',
        '<span class="lang-id">Berkolaborasi dengan berbagai organisasi untuk menciptakan dampak yang lebih besar dalam ekosistem pendidikan.</span><span class="lang-en">Collaborating with various organizations to create a greater impact in the education ecosystem.</span>'
    ],

    // Donation.html
    [
        'Bantu kami menyediakan akses pendidikan yang layak bagi anak-anak Indonesia. Setiap donasi Anda menjadi jembatan menuju masa depan yang lebih cerah.',
        '<span class="lang-id">Bantu kami menyediakan akses pendidikan yang layak bagi anak-anak Indonesia. Setiap donasi Anda menjadi jembatan menuju masa depan yang lebih cerah.</span><span class="lang-en">Help us provide decent access to education for Indonesian children. Every donation you make is a bridge to a brighter future.</span>'
    ],
    [
        'Informasi Rekening',
        '<span class="lang-id">Informasi Rekening</span><span class="lang-en">Account Information</span>'
    ],
    [
        'Atas Nama',
        '<span class="lang-id">Atas Nama</span><span class="lang-en">Account Name</span>'
    ],
    [
        'No. Rekening',
        '<span class="lang-id">No. Rekening</span><span class="lang-en">Account Number</span>'
    ],
    [
        'Scan QRIS',
        '<span class="lang-id">Scan QRIS</span><span class="lang-en">Scan QRIS</span>'
    ],
    [
        'Scan kode QRIS di bawah ini menggunakan aplikasi perbankan atau e-wallet pilihan Anda.',
        '<span class="lang-id">Scan kode QRIS di bawah ini menggunakan aplikasi perbankan atau e-wallet pilihan Anda.</span><span class="lang-en">Scan the QRIS code below using your preferred banking or e-wallet application.</span>'
    ],
];

const files = [
    'Preview/About us.html',
    'Preview/Activities.html',
    'Preview/Donation.html',
    'Preview/Partner.html'
];

for (let file of files) {
    if (fs.existsSync(file)) {
        let html = fs.readFileSync(file, 'utf8');
        let modified = false;

        for (let [id, en] of translations) {
            // Only replace if it hasn't been replaced yet
            if (html.includes(id) && !html.includes(en)) {
                // simple string replace for first occurrence
                html = html.replace(id, en);
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(file, html);
            console.log('Translated content in: ' + file);
        }
    }
}
