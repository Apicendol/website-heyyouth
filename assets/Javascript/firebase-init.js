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
            return docSnap.data();
        } else {
            // Seed default data if it doesn't exist
            if (defaultData) {
                await window.saveFirebaseData(defaultData);
            }
            return JSON.parse(JSON.stringify(defaultData));
        }
    } catch (e) {
        console.error("Error reading from Firebase:", e);
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
