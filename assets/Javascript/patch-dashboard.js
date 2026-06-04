const fs = require('fs');

const path = 'Preview/CMS/Dashboard.html';
let content = fs.readFileSync(path, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

// 1. Inject scripts
content = content.replace(
    '<!-- ===== JAVASCRIPT ===== -->\n    <script>\n    (function () {\n        \'use strict\';',
    `<!-- ===== JAVASCRIPT ===== -->
    <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"></script>
    <script src="../Javascript/firebase-init.js"></script>
    <script>
    (function () {
        'use strict';`
);

// 2. Data Layer
content = content.replace(
    `        /* =========================================
           DATA LAYER
           ========================================= */
        function getData() {
            try {
                var raw = localStorage.getItem(CMS_KEY);
                if (raw) return JSON.parse(raw);
            } catch (e) { }
            return JSON.parse(JSON.stringify(DEFAULT_DATA));
        }

        function saveData(data) {
            try {
                localStorage.setItem(CMS_KEY, JSON.stringify(data));
                return true;
            } catch (e) {
                showToast('Storage penuh! Kurangi ukuran gambar atau hapus beberapa data.', 'error');
                return false;
            }
        }`,
    `        /* =========================================
           DATA LAYER
           ========================================= */
        var memoryData = null;

        function getData() {
            if (memoryData) return JSON.parse(JSON.stringify(memoryData));
            return JSON.parse(JSON.stringify(DEFAULT_DATA));
        }

        async function saveData(data) {
            memoryData = JSON.parse(JSON.stringify(data));
            try {
                await window.saveFirebaseData(data);
                return true;
            } catch (e) {
                showToast('Gagal menyimpan ke database.', 'error');
                return false;
            }
        }`
);

// 3. Reset Data
content = content.replace(
    `        window.resetData = function () {
            if (!confirm('Reset semua data ke default?')) return;
            localStorage.removeItem(CMS_KEY);
            renderAllLists();
            renderAboutPreview();
            renderDonationPreview();
            showToast('Data berhasil direset.', 'success');
        };`,
    `        window.resetData = async function () {
            if (!confirm('Reset semua data ke default?')) return;
            memoryData = JSON.parse(JSON.stringify(DEFAULT_DATA));
            await window.saveFirebaseData(memoryData);
            renderAllLists();
            renderAboutPreview();
            renderDonationPreview();
            showToast('Data berhasil direset.', 'success');
        };`
);

// 4. Init
content = content.replace(
    `        renderAllLists();\n\n    })();`,
    `        async function initDashboard() {
            var data = await window.getFirebaseData(DEFAULT_DATA);
            memoryData = data;
            renderAllLists();
        }
        initDashboard();\n\n    })();`
);

fs.writeFileSync(path, content);
console.log('Dashboard.html successfully patched.');
