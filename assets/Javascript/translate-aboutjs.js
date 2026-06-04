const fs = require('fs');

let file = 'Preview/About us.html';
let html = fs.readFileSync(file, 'utf8');

html = html.replace(
    'title: \'Mendidik Untuk <br><span class="text-primary">Masa Depan Indonesia</span>\',',
    'title: \'<span class="lang-id">Mendidik Untuk <br><span class="text-primary">Masa Depan Indonesia</span></span><span class="lang-en">Educating For <br><span class="text-primary">Indonesia\\\'s Future</span></span>\','
);

html = html.replace(
    'subtitle: \'Hey Youth adalah sebuah komunitas pemuda di Indonesia yang didedikasikan untuk melakukan perubahan melalui pendidikan. Kami menyediakan akses ke pendidikan berkualitas dan peluang mentoring bagi mereka yang membutuhkan.\',',
    'subtitle: \'<span class="lang-id">Hey Youth adalah sebuah komunitas pemuda di Indonesia yang didedikasikan untuk melakukan perubahan melalui pendidikan. Kami menyediakan akses ke pendidikan berkualitas dan peluang mentoring bagi mereka yang membutuhkan.</span><span class="lang-en">Hey Youth is a youth community in Indonesia dedicated to making changes through education. We provide access to quality education and mentoring opportunities for those in need.</span>\','
);

fs.writeFileSync(file, html);
console.log('About us JS translated');
