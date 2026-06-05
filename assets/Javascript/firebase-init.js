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
                await window.saveFirebaseData(defaultData);
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

// Global utility to save data
window.saveFirebaseData = async function(data) {
    try {
        const docRef = db.collection('heyyouth').doc('cms_data');
        await docRef.set(data);
        return true;
    } catch (e) {
        console.error("Error writing to Firebase:", e);
        throw e;
    }
};
