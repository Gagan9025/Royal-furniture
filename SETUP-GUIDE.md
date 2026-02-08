# Quick Setup Guide

## 1. Firebase Project Setup

**Note: Firebase has already been configured with your project credentials.**

If you need to access your Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Google account
3. Your project "royalfurntrinteriordesigning" should be listed

## 2. Enable Required Firebase Services

In your Firebase project, ensure the following services are enabled:

### Authentication
- Go to "Authentication" → "Sign-in method"
- Enable "Email/Password"
- Create admin user:
  - Email: admin@royalhood.com
  - Password: Choose a strong password

### Firestore Database
- Go to "Firestore Database" → "Create database"
- Start in "Test mode" (change to production rules later)
- Choose your region

### Storage
- Go to "Storage" → "Get started"
- Use default security rules for now

## 3. Firebase Configuration Status

✅ **Firebase has already been configured** with your project credentials in `js/firebase-config.js`.

No additional configuration is needed. Your Firebase project is ready to use.

## 4. Set Security Rules

### Firestore Rules (Production)
In Firestore → Rules tab, replace with:

```
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
```

### Storage Rules (Production)
In Storage → Rules tab, replace with:

```
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
```

## 5. Add Sample Data

### Business Information
In Firestore, create collection `business_info` with document ID `main`:

```json
{
  "businessName": "Royal Hood Wood Works",
  "ownerName": "John Smith",
  "experience": "15+ years",
  "phone": "+91 9876543210",
  "address": "123 Wood Street, Furniture City",
  "description": "Premium wood furniture and interior design services with handcrafted quality"
}
```

### Sample Products
Create collection `products` with sample documents:

```json
[
  {
    "name": "Royal Teak Dining Table",
    "price": 25000,
    "description": "Handcrafted teak wood dining table with premium finish",
    "category": "Dining"
  },
  {
    "name": "Classic Wooden Chair Set",
    "price": 8000,
    "description": "Set of 4 elegant wooden chairs with comfortable seating",
    "category": "Seating"
  },
  {
    "name": "Premium Wardrobe",
    "price": 35000,
    "description": "Spacious wooden wardrobe with multiple compartments",
    "category": "Storage"
  }
]
```

### Sample Services
Create collection `services`:

```json
[
  {
    "name": "Furniture Repair",
    "price": "Starts from ₹500",
    "description": "Professional repair services for all types of wooden furniture"
  },
  {
    "name": "Custom Furniture Making",
    "price": "Price on request",
    "description": "Custom-designed furniture made to your specifications"
  },
  {
    "name": "Wood Polishing",
    "price": "₹800 onwards",
    "description": "Professional wood polishing and finishing services"
  }
]
```

### Sample Interior Packages
Create collection `interior_packages`:

```json
[
  {
    "name": "Premium Living Room Package",
    "materials": ["Teak Wood", "Marble", "Premium Fabric"],
    "priceRange": "₹75,000 - ₹1,50,000",
    "description": "Complete living room solution with premium materials and design"
  },
  {
    "name": "Modern Bedroom Suite",
    "materials": ["Sheesham Wood", "MDF", "Fabric"],
    "priceRange": "₹50,000 - ₹1,00,000",
    "description": "Modern bedroom furniture suite with contemporary design"
  }
]
```

## 6. Test the Setup

1. Open `test-firebase.html` in your browser
2. Check that Firebase connects successfully
3. Test read operations (should work)
4. Test write operations (should fail without auth - this is correct)

## 7. Access Admin Dashboard

1. Open `admin.html` in your browser
2. Login with your admin credentials
3. You should see the dashboard with empty counts
4. Add your business information through the dashboard

## 8. Update WhatsApp Number

In the JavaScript files, update the WhatsApp business number:
- `js/main.js` - Update WhatsApp URLs
- `js/cart.js` - Update WhatsApp URLs

## 9. Go Live!

Your website is ready for production deployment. Follow the deployment instructions in README.md.