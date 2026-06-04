const fs = require('fs');
const path = require('path');

const previewDir = path.join(__dirname, 'Preview');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            console.log(`Processing ${fullPath}`);
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;

            // 1. Inject Firebase Scripts before Script.js
            const isCMS = fullPath.includes('CMS');
            const jsPrefix = isCMS ? '../Javascript' : 'Javascript';
            const scriptTag = `<script src="${jsPrefix}/Script.js"></script>`;
            
            if (content.includes(scriptTag) && !content.includes('firebase-app-compat.js')) {
                const injection = `<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"></script>
    <script src="${jsPrefix}/firebase-init.js"></script>
    <script src="${jsPrefix}/Script.js"></script>`;
                content = content.replace(scriptTag, injection);
                updated = true;
            }

            // 2. Make inline DOMContentLoaded use async getData
            if (content.includes('document.addEventListener(\'DOMContentLoaded\', function() {') && content.includes('var data = getData();')) {
                content = content.replace('document.addEventListener(\'DOMContentLoaded\', function() {', 'document.addEventListener(\'DOMContentLoaded\', async function() {');
                content = content.replace(/var data = getData\(\);/g, 'var data = await window.getFirebaseData(_DEFAULT_ACTIVITIES || _DEFAULT_ABOUT || _DEFAULT_ACTIVITY_DETAIL || null);'); // We'll just replace the body of getData soon, but wait, it's easier to just call getFirebaseData directly and remove local getData!
                updated = true;
            }

            if (updated) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDir(previewDir);
