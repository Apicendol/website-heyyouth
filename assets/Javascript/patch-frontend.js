const fs = require('fs');

// ==== 1. About us.html ====
let aboutPath = 'Preview/About us.html';
let aboutHtml = fs.readFileSync(aboutPath, 'utf8');

// Fix path and inject Firebase
aboutHtml = aboutHtml.replace(
    '<script src="Javascript/Script.js"></script>',
    `<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"></script>
    <script src="javascript/firebase-init.js"></script>
    <script src="javascript/Script.js"></script>`
);

// Update render functions
aboutHtml = aboutHtml.replace(
    /function renderHero\(\) \{[\s\S]*?var heroData = data\.aboutHero \|\| _DEFAULT_ABOUT\.hero;/g,
    `function renderHero(heroData) {`
);

aboutHtml = aboutHtml.replace(
    /function renderTeam\(\) \{[\s\S]*?var teamData = data\.team \|\| _DEFAULT_ABOUT\.team;/g,
    `function renderTeam(teamData) {`
);

// Update DOMContentLoaded
aboutHtml = aboutHtml.replace(
    `            document.addEventListener('DOMContentLoaded', function() {
                renderHero();
                renderTeam();
            });`,
    `            document.addEventListener('DOMContentLoaded', async function() {
                var data = await window.getFirebaseData({ aboutHero: _DEFAULT_ABOUT.hero, team: _DEFAULT_ABOUT.team });
                renderHero(data.aboutHero || _DEFAULT_ABOUT.hero);
                renderTeam(data.team || _DEFAULT_ABOUT.team);
            });`
);

fs.writeFileSync(aboutPath, aboutHtml);
console.log('About us.html updated successfully.');


// ==== 2. Activities.html ====
let activitiesPath = 'Preview/Activities.html';
let activitiesHtml = fs.readFileSync(activitiesPath, 'utf8');

// Fix path and inject Firebase
activitiesHtml = activitiesHtml.replace(
    '<script src="Javascript/Script.js"></script>',
    `<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"></script>
    <script src="javascript/firebase-init.js"></script>
    <script src="javascript/Script.js"></script>`
);

// Update DOMContentLoaded
activitiesHtml = activitiesHtml.replace(
    `        document.addEventListener('DOMContentLoaded', function () {
            var data = getData();
            renderActivityCards(data.activityCards);
            renderPodcasts(data.podcasts);
        });`,
    `        document.addEventListener('DOMContentLoaded', async function () {
            var data = await window.getFirebaseData(DEFAULT_DATA);
            renderActivityCards(data.activityCards);
            renderPodcasts(data.podcasts);
        });`
);

fs.writeFileSync(activitiesPath, activitiesHtml);
console.log('Activities.html updated successfully.');

