# Royal Hood Wood Works - E-commerce Website

A complete e-commerce website for a wood furniture and interior design business with Firebase backend and admin dashboard.

## 🚀 Features

### Frontend Pages
- **Home Page** - Business information and navigation
- **Interior Designing** - Dynamic interior packages display
- **Services** - Professional services listing
- **Products** - E-commerce style product catalog
- **Cart & Order** - Shopping cart and order processing
- **Admin Dashboard** - Secure content management system

### Core Functionality
- **Firebase Integration** - Real-time data synchronization
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **LocalStorage Cart** - Client-side shopping cart
- **WhatsApp Integration** - User-initiated customer support
- **Order Management** - Complete order processing workflow
- **Image Management** - Firebase Storage for media files

## 🛠️ Technology Stack

### Frontend
- HTML5
- Tailwind CSS
- Vanilla JavaScript
- Font Awesome Icons

### Backend
- Firebase Authentication
- Cloud Firestore
- Firebase Storage

### Other
- LocalStorage (cart management)
- WhatsApp API (customer communication)

## 📁 Project Structure

```
royal-hood/
├── index.html          # Home page
├── interior.html       # Interior Designing page
├── services.html       # Services page
├── products.html       # Products page
├── cart.html           # Cart & Order page
├── admin.html          # Admin Dashboard
├── css/
│   └── style.css       # Custom styles
├── js/
│   ├── main.js         # Main functionality
│   ├── admin.js        # Admin dashboard logic
│   ├── cart.js         # Cart and order system
│   └── firebase-config.js  # Firebase configuration
├── images/             # Image assets
└── README.md           # This file
```

## 🔧 Setup Instructions

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable the following services:
   - **Authentication** - Email/Password sign-in method
   - **Cloud Firestore** - Database
   - **Storage** - File storage

### 2. Firebase Configuration

The Firebase configuration has already been set up with your project credentials in `js/firebase-config.js`. No additional configuration is needed.

### 3. Set up Firebase Security Rules

#### Firestore Rules
In Firebase Console → Firestore → Rules, add:

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

#### Storage Rules
In Firebase Console → Storage → Rules, add:

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

### 4. Create Admin Account

1. Go to Firebase Authentication in Console
2. Click "Add User"
3. Create an admin account with email/password
4. Use these credentials to log into the admin dashboard

### 5. Add Initial Data

#### Business Information
Add a document to `business_info` collection with ID `main`:

```json
{
  "businessName": "Royal Hood Wood Works",
  "ownerName": "John Doe",
  "experience": "15+ years",
  "phone": "+91 9876543210",
  "address": "123 Main Street, City",
  "description": "Premium wood furniture and interior design services"
}
```

#### Sample Products
Add documents to `products` collection:

```json
{
  "name": "Royal Wooden Dining Table",
  "price": 15000,
  "description": "Handcrafted teak wood dining table",
  "category": "Dining"
}
```

#### Sample Services
Add documents to `services` collection:

```json
{
  "name": "Furniture Repair",
  "price": "Starts from ₹500",
  "description": "Professional furniture repair services"
}
```

#### Sample Interior Packages
Add documents to `interior_packages` collection:

```json
{
  "name": "Premium Living Room Package",
  "materials": ["Teak Wood", "Marble", "Fabric"],
  "priceRange": "₹50,000 - ₹1,50,000",
  "description": "Complete living room solution"
}
```

## 🚀 Deployment

### Local Development
1. Open `index.html` in a web browser
2. Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   
   # Using Live Server (VS Code extension)
   # Right-click index.html → Open with Live Server
   ```

### Production Deployment
Options for hosting:

#### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Deploy
firebase deploy
```

#### Netlify
1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop the project folder
3. Set build command (if needed)
4. Deploy

#### GitHub Pages
1. Push code to GitHub repository
2. Go to repository Settings
3. Enable GitHub Pages
4. Select source branch

## 📱 WhatsApp Integration

The WhatsApp integration is user-initiated only. Users can click WhatsApp buttons to:
- Enquire about interior packages
- Enquire about services
- Contact regarding orders

Update the WhatsApp number in:
- `js/main.js` - `enquirePackage()` and `enquireService()` functions
- `js/cart.js` - `contactOnWhatsApp()` function

## 🔒 Security Notes

- Admin dashboard requires Firebase Authentication
- Only authenticated users can write to Firestore
- Public users can only read content and create orders
- All images are publicly readable but only admins can upload

## 🎨 Customization

### Colors
The website uses amber/brown color scheme suitable for wood business. To change:
- Modify Tailwind classes in HTML files
- Update CSS variables in `css/style.css`
- Change color classes throughout the codebase

### Business Information
Update business details in Firebase Firestore `business_info` collection or through admin dashboard.

### WhatsApp Number
Change the WhatsApp business number in the JavaScript files where WhatsApp URLs are constructed.

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify Firebase configuration
3. Ensure all required collections exist in Firestore
4. Check Firebase security rules are properly set

## 📄 License

This project is for educational and commercial use. Feel free to modify and customize according to your needs.

---

**Built with ❤️ for Royal Hood Wood Works**