# Admin Setup Guide - Royal Hood Wood Works

## Overview
This guide explains how to set up the admin panel for Royal Hood Wood Works website.

## Prerequisites
- Firebase project set up with Authentication, Firestore, and Storage enabled
- Firebase configuration in `js/firebase-config.js` updated with your project credentials

## Step-by-Step Setup

### 1. Initial Admin Setup
1. Open `admin-setup.html` in your browser
2. Click "Create Admin Account" button
3. Enter your admin email and password when prompted
4. Confirm the admin account creation
5. The system will create an admin user in Firebase Authentication and set admin privileges in Firestore

### 2. Security Setup
1. **IMPORTANT:** Delete `admin-setup.html` and `setup-admin.js` after completing setup
2. These files contain administrative functions and pose security risks if left online
3. To delete: `rm admin-setup.html setup-admin.js`

### 3. Admin Panel Access
1. Open `admin.html` in your browser
2. Log in with the admin credentials you created
3. You now have full access to manage:
   - Business information
   - Products
   - Interior packages
   - Services
   - Orders

## Firebase Security Rules (Update in Firebase Console)

### Firestore Rules
Go to Firebase Console → Firestore → Rules and update with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admins collection - only authenticated admins can read/write
    match /admins/{document} {
      allow read, write: if request.auth != null && request.auth.uid == document;
    }
    
    // Business info - public read, admin write
    match /business_info/{document} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin(request.auth.uid);
    }
    
    // Interior packages - public read, admin write
    match /interior_packages/{document} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin(request.auth.uid);
    }
    
    // Services - public read, admin write
    match /services/{document} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin(request.auth.uid);
    }
    
    // Products - public read, admin write
    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin(request.auth.uid);
    }
    
    // Orders - public create, admin read/write
    match /orders/{document} {
      allow read, write: if request.auth != null && isAdmin(request.auth.uid);
      allow create: if request.auth == null;
    }
  }
  
  function isAdmin(userId) {
    return get(/databases/$(database)/documents/admins/$(userId)).data.isAdmin == true;
  }
}
```

### Storage Rules
Go to Firebase Console → Storage → Rules and update with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to all files
    match /{allPaths=**} {
      allow read;
      allow write: if request.auth != null && isAdmin(request.auth.uid);
    }
  }
  
  function isAdmin(userId) {
    return get(/databases/$(database)/documents/admins/$(userId)).data.isAdmin == true;
  }
}
```

## Verification

1. Test admin login with your credentials
2. Verify you can add/edit/delete content
3. Check that unauthorized users cannot access admin features
4. Confirm that front-end users can view content but cannot modify it

## Troubleshooting

- **Cannot log in**: Verify admin account was created in Firebase Authentication
- **Access denied**: Check that admin privileges were set in Firestore `admins` collection
- **Functions not working**: Ensure Firebase configuration matches your project
- **Security errors**: Verify Firebase security rules are correctly set

## Production Deployment Checklist

- [ ] Delete `admin-setup.html` and `setup-admin.js`
- [ ] Update Firebase configuration with production credentials
- [ ] Verify all security rules are active
- [ ] Test admin functionality thoroughly
- [ ] Confirm public site works as expected
- [ ] Backup admin credentials securely