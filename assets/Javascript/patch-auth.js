const fs = require('fs');

// ==== 1. Login.html ====
let loginPath = 'Preview/CMS/Login.html';
let loginHtml = fs.readFileSync(loginPath, 'utf8');

// Replace the dummy login logic with Firebase Auth
const dummyLogic = `                setTimeout(function () {
                    setLoading(false);

                                if (email === 'admin@gmail.com' && password === 'admin123') {
                localStorage.setItem('hey_youth_auth', 'true');
                window.location.href = 'dashboard.html';
                    } else {
                        showError('Email atau password salah. Silakan coba lagi.');
                    }
                }, 1500);`;

const firebaseAuthLogic = `                firebase.auth().signInWithEmailAndPassword(email, password)
                    .then(function(userCredential) {
                        setLoading(false);
                        window.location.href = 'Dashboard.html';
                    })
                    .catch(function(error) {
                        setLoading(false);
                        showError('Email atau password salah. Periksa kembali kredensial Anda.');
                        console.error("Login error:", error);
                    });`;

loginHtml = loginHtml.replace(dummyLogic, firebaseAuthLogic);
fs.writeFileSync(loginPath, loginHtml);
console.log('Login.html updated with Firebase Auth.');

// ==== 2. Dashboard.html ====
let dashboardPath = 'Preview/CMS/Dashboard.html';
let dashboardHtml = fs.readFileSync(dashboardPath, 'utf8');

// Inject firebase-auth-compat
if (!dashboardHtml.includes('firebase-auth-compat.js')) {
    dashboardHtml = dashboardHtml.replace(
        '<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>',
        '<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>\n    <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js"></script>'
    );
}

// Replace dummy auth check
const dummyCheck = `        if (!localStorage.getItem('hey_youth_auth')) {
            window.location.href = 'login.html';
            return;
        }`;

// We will let the initDashboard() handle the rendering after auth state is confirmed
const firebaseAuthCheck = `        // Listen to Auth State
        firebase.auth().onAuthStateChanged(function(user) {
            if (!user) {
                window.location.href = 'Login.html';
            } else {
                initDashboard();
            }
        });`;

dashboardHtml = dashboardHtml.replace(dummyCheck, firebaseAuthCheck);

// Replace logout
const dummyLogout = `        window.logout = function () {
            localStorage.removeItem('hey_youth_auth');
            window.location.href = 'login.html';
        };`;

const firebaseLogout = `        window.logout = function () {
            firebase.auth().signOut().then(function() {
                window.location.href = 'Login.html';
            }).catch(function(error) {
                console.error("Logout error", error);
            });
        };`;

dashboardHtml = dashboardHtml.replace(dummyLogout, firebaseLogout);

// Remove the direct call to initDashboard() at the bottom since onAuthStateChanged will call it
dashboardHtml = dashboardHtml.replace(`        initDashboard();\n\n    })();`, `    })();`);

fs.writeFileSync(dashboardPath, dashboardHtml);
console.log('Dashboard.html updated with Firebase Auth.');
