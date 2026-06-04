const fs = require('fs');

// ==== 1. About us.html ====
let aboutPath = 'Preview/About us.html';
let aboutHtml = fs.readFileSync(aboutPath, 'utf8');

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
console.log('About us.html fixed successfully.');

// ==== 2. Activities.html ====
let activitiesPath = 'Preview/Activities.html';
let activitiesHtml = fs.readFileSync(activitiesPath, 'utf8');

activitiesHtml = activitiesHtml.replace(
    `        document.addEventListener('DOMContentLoaded', function () {
            var data = getData();
            renderActivityCards(data.activityCards);
            renderPodcasts(data.podcasts);
        });`,
    `        document.addEventListener('DOMContentLoaded', async function () {
            var data = await window.getFirebaseData(DEFAULT_DATA);
            renderActivityCards(data.activityCards || DEFAULT_DATA.activityCards);
            renderPodcasts(data.podcasts || DEFAULT_DATA.podcasts);
        });`
);

fs.writeFileSync(activitiesPath, activitiesHtml);
console.log('Activities.html fixed successfully.');
