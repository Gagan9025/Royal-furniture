/**
 * Admin Setup Script for Royal Hood Wood Works
 * 
 * This script creates an admin user in Firebase Authentication
 * and sets up admin privileges in Firestore.
 * 
 * Usage:
 * 1. Run this script once to create the admin user
 * 2. Remove the script after setup for security
 */

// Wait for Firebase to be initialized
function setupAdminUser() {
    const email = prompt("Enter admin email:");
    const password = prompt("Enter admin password (at least 6 characters):");
    
    if (!email || !password) {
        console.error("Email and password are required");
        return;
    }
    
    if (password.length < 6) {
        console.error("Password must be at least 6 characters");
        return;
    }
    
    // Create the admin user
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Successfully created user
            const user = userCredential.user;
            
            // Set admin privileges in Firestore
            return firebase.firestore().collection('admins').doc(user.uid).set({
                isAdmin: true,
                email: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                role: 'admin'
            });
        })
        .then(() => {
            console.log("Admin user created successfully!");
            alert("Admin user created successfully! You can now log in with the admin credentials.");
        })
        .catch((error) => {
            console.error("Error creating admin user:", error);
            alert("Error creating admin user: " + error.message);
        });
}

// Alternative function to promote an existing user to admin
function promoteToAdmin() {
    const email = prompt("Enter existing user email to promote to admin:");
    
    if (!email) {
        console.error("Email is required");
        return;
    }
    
    // Find the user by email
    firebase.auth().getUserByEmail(email)
        .then((userRecord) => {
            // Set admin privileges in Firestore
            return firebase.firestore().collection('admins').doc(userRecord.uid).set({
                isAdmin: true,
                email: userRecord.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                role: 'admin'
            });
        })
        .then(() => {
            console.log("User promoted to admin successfully!");
            alert("User promoted to admin successfully!");
        })
        .catch((error) => {
            console.error("Error promoting user to admin:", error);
            alert("Error promoting user to admin: " + error.message);
        });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("Admin setup script loaded. Call setupAdminUser() to create an admin account.");
});