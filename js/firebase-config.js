// Firebase Configuration for Royal Hood Wood Works
// IMPORTANT: Replace with your actual Firebase project configuration

const firebaseConfig = {
  apiKey: "AIzaSyChVmewlPRMYngwwvdikcBP7ChFWpy65zk",
  authDomain: "royalfurntrinteriordesigning.firebaseapp.com",
  projectId: "royalfurntrinteriordesigning",
  storageBucket: "royalfurntrinteriordesigning.firebasestorage.app",
  messagingSenderId: "817030435959",
  appId: "1:817030435959:web:cb7ff9380bbeda64182272",
  measurementId: "G-YZDD63P4J6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

// Export for use in other files
window.firebaseDB = db;
window.firebaseStorage = storage;
window.firebaseAuth = auth;

// Console log for debugging
console.log('Firebase initialized successfully');

// Firebase Authentication state observer
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('User is signed in:', user.email);
        // Check if we're on admin page
        if (window.location.pathname.includes('admin.html')) {
            window.handleAdminAuthState(true, user);
        }
    } else {
        console.log('No user is signed in');
        // Check if we're on admin page
        if (window.location.pathname.includes('admin.html')) {
            window.handleAdminAuthState(false);
        }
    }
});

// Firestore Security Rules (to be implemented in Firebase Console)
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Business info - public read, admin write
    match /business_info/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Interior packages - public read, admin write
    match /interior_packages/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Services - public read, admin write
    match /services/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Products - public read, admin write
    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Orders - public create, admin read/write
    match /orders/{document} {
      allow read, write: if request.auth != null;
      allow create: if request.auth == null;
    }
  }
}
*/

// Storage Security Rules (to be implemented in Firebase Console)
/*
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to all files
    match /{allPaths=**} {
      allow read;
      allow write: if request.auth != null;
    }
  }
}
*/

// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Helper function to show notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type} show`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Helper function to upload image to Firebase Storage
async function uploadImage(file, path) {
    try {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`${path}/${Date.now()}_${file.name}`);
        const snapshot = await fileRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

// Helper function to generate unique IDs
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Export helper functions
window.formatCurrency = formatCurrency;
window.showNotification = showNotification;
window.uploadImage = uploadImage;
window.generateId = generateId;