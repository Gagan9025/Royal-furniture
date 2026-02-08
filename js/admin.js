// Admin Dashboard for Royal Hood Wood Works

// Handle Admin Authentication State
window.handleAdminAuthState = function(isLoggedIn, user = null) {
    const loginScreen = document.getElementById('login-screen');
    const dashboard = document.getElementById('dashboard');
    
    if (isLoggedIn) {
        loginScreen.classList.add('hidden');
        dashboard.classList.remove('hidden');
        document.getElementById('admin-email-display').textContent = user.email;
        loadDashboardData();
        initTabs();
    } else {
        loginScreen.classList.remove('hidden');
        dashboard.classList.add('hidden');
    }
};

// Admin Login
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const errorDiv = document.getElementById('login-error');
    
    // Development mode - bypass authentication
    // Remove these lines for production deployment
    console.log('Login attempt:', email, password);
    
    // Always allow login in development mode
    errorDiv.classList.add('hidden');
    window.handleAdminAuthState(true, { email: email || 'admin@example.com' });
    return;
    
    // Production code (commented out for development)
    /*
    try {
        await firebaseAuth.signInWithEmailAndPassword(email, password);
        errorDiv.classList.add('hidden');
    } catch (error) {
        console.error('Login error:', error);
        errorDiv.classList.remove('hidden');
        errorDiv.textContent = 'Invalid credentials. Please try again.';
    }
    */
});

// Admin Logout
document.getElementById('logout-btn').addEventListener('click', async function() {
    try {
        await firebaseAuth.signOut();
        window.location.reload();
    } catch (error) {
        console.error('Logout error:', error);
    }
});

// Initialize Tabs
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.add('hidden'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            document.getElementById(`${tabId}-tab`).classList.remove('hidden');
        });
    });
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        // Load counts
        const productsSnapshot = await firebaseDB.collection('products').get();
        const packagesSnapshot = await firebaseDB.collection('interior_packages').get();
        const servicesSnapshot = await firebaseDB.collection('services').get();
        const ordersSnapshot = await firebaseDB.collection('orders').get();
        
        document.getElementById('products-count').textContent = productsSnapshot.size;
        document.getElementById('packages-count').textContent = packagesSnapshot.size;
        document.getElementById('services-count').textContent = servicesSnapshot.size;
        document.getElementById('orders-count').textContent = ordersSnapshot.size;
        
        // Load business info for editing
        loadBusinessInfoForm();
        
        // Load lists
        loadProductsList();
        loadPackagesList();
        loadServicesList();
        loadOrdersList();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Load Business Info Form
async function loadBusinessInfoForm() {
    try {
        const doc = await firebaseDB.collection('business_info').doc('main').get();
        
        if (doc.exists) {
            const data = doc.data();
            document.getElementById('business-name-input').value = data.businessName || '';
            document.getElementById('owner-name-input').value = data.ownerName || '';
            document.getElementById('experience-input').value = data.experience || '';
            document.getElementById('phone-input').value = data.phone || '';
            document.getElementById('address-input').value = data.address || '';
            document.getElementById('description-input').value = data.description || '';
            
            // Handle logo preview
            if (data.logoUrl) {
                const preview = document.getElementById('logo-preview');
                preview.innerHTML = `<img src="${data.logoUrl}" alt="Logo Preview" class="image-preview">`;
            }
        }
    } catch (error) {
        console.error('Error loading business info:', error);
    }
}

// Handle Business Info Form Submission
document.getElementById('business-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        const formData = {
            businessName: document.getElementById('business-name-input').value,
            ownerName: document.getElementById('owner-name-input').value,
            experience: document.getElementById('experience-input').value,
            phone: document.getElementById('phone-input').value,
            address: document.getElementById('address-input').value,
            description: document.getElementById('description-input').value
        };
        
        // Handle logo upload
        const logoFile = document.getElementById('logo-upload').files[0];
        if (logoFile) {
            const logoUrl = await uploadImage(logoFile, 'logos');
            formData.logoUrl = logoUrl;
        }
        
        await firebaseDB.collection('business_info').doc('main').set(formData);
        showNotification('Business information updated successfully!');
        
    } catch (error) {
        console.error('Error updating business info:', error);
        showNotification('Error updating business information', 'error');
    }
});

// Load Products List
async function loadProductsList() {
    try {
        const snapshot = await firebaseDB.collection('products').get();
        const container = document.getElementById('products-list');
        container.innerHTML = '';
        
        if (snapshot.empty) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No products found</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const product = { id: doc.id, ...doc.data() };
            const productCard = createProductCard(product);
            container.appendChild(productCard);
        });
        
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'admin-card';
    card.innerHTML = `
        <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4">
                <div class="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    ${product.imageUrl ? 
                        `<img src="${product.imageUrl}" alt="${product.name}" class="w-full h-full object-cover">` :
                        `<div class="w-full h-full bg-amber-200 flex items-center justify-center">
                            <i class="fas fa-couch text-amber-600"></i>
                        </div>`
                    }
                </div>
                <div>
                    <h3 class="font-semibold text-gray-800">${product.name}</h3>
                    <p class="text-amber-600 font-medium">${formatCurrency(product.price)}</p>
                    <p class="text-gray-600 text-sm mt-1">${product.description || ''}</p>
                </div>
            </div>
            <div class="flex space-x-2">
                <button onclick="editProduct('${product.id}')" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                    Edit
                </button>
                <button onclick="deleteProduct('${product.id}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                    Delete
                </button>
            </div>
        </div>
    `;
    return card;
}

// Load Packages List
async function loadPackagesList() {
    try {
        const snapshot = await firebaseDB.collection('interior_packages').get();
        const container = document.getElementById('packages-list');
        container.innerHTML = '';
        
        if (snapshot.empty) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No packages found</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const pkg = { id: doc.id, ...doc.data() };
            const packageCard = createPackageCard(pkg);
            container.appendChild(packageCard);
        });
        
    } catch (error) {
        console.error('Error loading packages:', error);
    }
}

// Create Package Card
function createPackageCard(pkg) {
    const card = document.createElement('div');
    card.className = 'admin-card';
    card.innerHTML = `
        <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4">
                <div class="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    ${pkg.imageUrl ? 
                        `<img src="${pkg.imageUrl}" alt="${pkg.name}" class="w-full h-full object-cover">` :
                        `<div class="w-full h-full bg-amber-200 flex items-center justify-center">
                            <i class="fas fa-home text-amber-600"></i>
                        </div>`
                    }
                </div>
                <div>
                    <h3 class="font-semibold text-gray-800">${pkg.name}</h3>
                    <p class="text-amber-600 font-medium">${pkg.priceRange || 'Price on request'}</p>
                    <p class="text-gray-600 text-sm mt-1">Materials: ${pkg.materials ? pkg.materials.join(', ') : 'Various'}</p>
                </div>
            </div>
            <div class="flex space-x-2">
                <button onclick="editPackage('${pkg.id}')" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                    Edit
                </button>
                <button onclick="deletePackage('${pkg.id}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                    Delete
                </button>
            </div>
        </div>
    `;
    return card;
}

// Load Services List
async function loadServicesList() {
    try {
        const snapshot = await firebaseDB.collection('services').get();
        const container = document.getElementById('services-list');
        container.innerHTML = '';
        
        if (snapshot.empty) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No services found</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const service = { id: doc.id, ...doc.data() };
            const serviceCard = createServiceCard(service);
            container.appendChild(serviceCard);
        });
        
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

// Create Service Card
function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'admin-card';
    card.innerHTML = `
        <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4">
                <div class="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    ${service.imageUrl ? 
                        `<img src="${service.imageUrl}" alt="${service.name}" class="w-full h-full object-cover">` :
                        `<div class="w-full h-full bg-amber-200 flex items-center justify-center">
                            <i class="fas fa-tools text-amber-600"></i>
                        </div>`
                    }
                </div>
                <div>
                    <h3 class="font-semibold text-gray-800">${service.name}</h3>
                    <p class="text-amber-600 font-medium">${service.price || 'Price on request'}</p>
                    <p class="text-gray-600 text-sm mt-1">${service.description || ''}</p>
                </div>
            </div>
            <div class="flex space-x-2">
                <button onclick="editService('${service.id}')" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                    Edit
                </button>
                <button onclick="deleteService('${service.id}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                    Delete
                </button>
            </div>
        </div>
    `;
    return card;
}

// Load Orders List
async function loadOrdersList() {
    try {
        const snapshot = await firebaseDB.collection('orders')
            .orderBy('timestamp', 'desc')
            .get();
        const container = document.getElementById('orders-list');
        container.innerHTML = '';
        
        if (snapshot.empty) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No orders found</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const order = { id: doc.id, ...doc.data() };
            const orderCard = createOrderCard(order);
            container.appendChild(orderCard);
        });
        
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Create Order Card
function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'admin-card';
    card.innerHTML = `
        <div class="flex items-start justify-between">
            <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                    <h3 class="font-semibold text-gray-800">Order #${order.id?.substring(0, 8) || 'N/A'}</h3>
                    <span class="status-badge status-${order.status || 'pending'}">
                        ${order.status || 'pending'}
                    </span>
                </div>
                <p class="text-gray-700"><strong>Customer:</strong> ${order.customerName}</p>
                <p class="text-gray-700"><strong>Phone:</strong> ${order.phone}</p>
                <p class="text-gray-700"><strong>Total:</strong> ${formatCurrency(order.total)}</p>
                <p class="text-gray-600 text-sm mt-2">${order.address}</p>
                ${order.notes ? `<p class="text-gray-600 text-sm mt-1"><strong>Notes:</strong> ${order.notes}</p>` : ''}
            </div>
            <div class="flex space-x-2">
                <button onclick="updateOrderStatus('${order.id}', 'processing')" class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                    Process
                </button>
                <button onclick="updateOrderStatus('${order.id}', 'completed')" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                    Complete
                </button>
            </div>
        </div>
    `;
    return card;
}

// Add Product Button Event
document.addEventListener('DOMContentLoaded', function() {
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            console.log('Add product button clicked');
            showAddProductModal();
        });
    } else {
        console.error('Add product button not found');
    }
});

// Show Add Product Modal
function showAddProductModal() {
    console.log('showAddProductModal function called');
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="text-xl font-bold text-white">Add New Product</h2>
                <button class="modal-close text-gray-400 hover:text-white">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="add-product-form" class="space-y-4">
                    <div>
                        <label class="block text-gray-300 font-medium mb-2">Product Name *</label>
                        <input type="text" id="product-name" required 
                               class="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white">
                    </div>
                    
                    <div>
                        <label class="block text-gray-300 font-medium mb-2">Price (₹) *</label>
                        <input type="number" id="product-price" required min="0" step="0.01"
                               class="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white">
                    </div>
                    
                    <div>
                        <label class="block text-gray-300 font-medium mb-2">Description</label>
                        <textarea id="product-description" rows="4"
                                  class="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-gray-300 font-medium mb-2">Product Image</label>
                        <input type="file" id="product-image" accept="image/*"
                               class="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white">
                        <div id="product-image-preview" class="mt-2"></div>
                    </div>
                    
                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" class="modal-close bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                            Cancel
                        </button>
                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle image preview
    const imageInput = document.getElementById('product-image');
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('product-image-preview').innerHTML = 
                    `<img src="${e.target.result}" alt="Preview" class="image-preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Handle form submission
    document.getElementById('add-product-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        await addProduct();
        modal.remove();
    });
    
    // Handle close button
    modal.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => modal.remove());
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Add Product Function
async function addProduct() {
    console.log('addProduct function called');
    try {
        const name = document.getElementById('product-name').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const description = document.getElementById('product-description').value;
        const imageFile = document.getElementById('product-image').files[0];
        
        let imageUrl = '';
        if (imageFile) {
            imageUrl = await uploadImage(imageFile, 'products');
        }
        
        const productData = {
            name: name,
            price: price,
            description: description,
            imageUrl: imageUrl,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        await firebaseDB.collection('products').add(productData);
        showNotification('Product added successfully!');
        loadProductsList();
        loadDashboardData(); // Update counts
        
    } catch (error) {
        console.error('Error adding product:', error);
        showNotification('Error adding product', 'error');
    }
}

// Delete Product
async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await firebaseDB.collection('products').doc(productId).delete();
            showNotification('Product deleted successfully!');
            loadProductsList();
            loadDashboardData(); // Update counts
        } catch (error) {
            console.error('Error deleting product:', error);
            showNotification('Error deleting product', 'error');
        }
    }
}

// Add Package Button Event
document.addEventListener('DOMContentLoaded', function() {
    const addPackageBtn = document.getElementById('add-package-btn');
    if (addPackageBtn) {
        addPackageBtn.addEventListener('click', function() {
            console.log('Add package button clicked');
            showAddPackageModal();
        });
    } else {
        console.error('Add package button not found');
    }
});

// Show Add Package Modal
function showAddPackageModal() {
    console.log('showAddPackageModal function called');
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="text-xl font-bold text-white">Add New Interior Package</h2>
                <button class="modal-close text-gray-400 hover:text-white">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="add-package-form" class="space-y-4">
                    <div>
                        <label class="block text-gray-300 font-medium mb-2">Package Name *</label>
                        <input type="text" id="package-name" required 
                               class="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white">
                    </div>
                    
                    <div>
                        <label class="block text-gray-300 font-medium mb-2">Price Range *</label>
                        <input type="text" id="package-price" required placeholder="e.g., ₹50,000 - ₹1,50,000"
                               class="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white">
                    </div>
                    
                    <div>
                        <label class="block text-gray-300 font-medium mb-2">Description</label>
                        <textarea id="package-description" rows="4"
                                  class="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-gray-300 font-medium mb-2">Materials (comma separated)</label>
                        <input type="text" id="package-materials" placeholder="e.g., Wood, Fabric, Metal"
                               class="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white">
                    </div>
                    
                    <div>
                        <label class="block text-gray-300 font-medium mb-2">Package Image</label>
                        <input type="file" id="package-image" accept="image/*"
                               class="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white">
                        <div id="package-image-preview" class="mt-2"></div>
                    </div>
                    
                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" class="modal-close bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                            Cancel
                        </button>
                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                            Add Package
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Small delay to ensure DOM is fully rendered
    setTimeout(() => {
        // Handle image preview
        const imageInput = document.getElementById('package-image');
        if (imageInput) {
            imageInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        document.getElementById('package-image-preview').innerHTML = 
                            `<img src="${e.target.result}" alt="Preview" class="image-preview">`;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        // Handle form submission
        const form = document.getElementById('add-package-form');
        if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                console.log('Form submitted');
                await addPackage();
                modal.remove();
            });
        } else {
            console.error('Package form not found');
        }
    }, 100);
    
    // Handle close button
    setTimeout(() => {
        const closeButtons = modal.querySelectorAll('.modal-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('Close button clicked');
                modal.remove();
            });
        });
    }, 100);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            console.log('Backdrop clicked');
            modal.remove();
        }
    });
}

// Add Package Function
async function addPackage() {
    console.log('addPackage function called');
    try {
        const name = document.getElementById('package-name').value;
        const priceRange = document.getElementById('package-price').value;
        const description = document.getElementById('package-description').value;
        const materialsInput = document.getElementById('package-materials').value;
        const imageFile = document.getElementById('package-image').files[0];
        
        console.log('Form data:', { name, priceRange, description, materialsInput, imageFile });
        
        // Process materials array
        const materials = materialsInput ? materialsInput.split(',').map(m => m.trim()).filter(m => m) : [];
        
        let imageUrl = '';
        if (imageFile) {
            console.log('Uploading image...');
            imageUrl = await uploadImage(imageFile, 'packages');
            console.log('Image uploaded, URL:', imageUrl);
        }
        
        const packageData = {
            name: name,
            priceRange: priceRange,
            description: description,
            materials: materials,
            imageUrl: imageUrl,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        console.log('Adding package to Firestore:', packageData);
        await firebaseDB.collection('interior_packages').add(packageData);
        console.log('Package added successfully');
        showNotification('Package added successfully!');
        loadPackagesList();
        loadDashboardData(); // Update counts
        
    } catch (error) {
        console.error('Error adding package:', error);
        showNotification('Error adding package: ' + error.message, 'error');
    }
}

// Delete Package
async function deletePackage(packageId) {
    if (confirm('Are you sure you want to delete this package?')) {
        try {
            await firebaseDB.collection('interior_packages').doc(packageId).delete();
            showNotification('Package deleted successfully!');
            loadPackagesList();
            loadDashboardData(); // Update counts
        } catch (error) {
            console.error('Error deleting package:', error);
            showNotification('Error deleting package', 'error');
        }
    }
}

// Add Service Button Event
document.addEventListener('DOMContentLoaded', function() {
    const addServiceBtn = document.getElementById('add-service-btn');
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', function() {
            console.log('Add service button clicked');
            showAddServiceModal();
        });
    } else {
        console.error('Add service button not found');
    }
});

// Show Add Service Modal
function showAddServiceModal() {
    console.log('showAddServiceModal function called');
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="text-xl font-bold text-white">Add New Service</h2>
                <button class="modal-close text-gray-400 hover:text-white">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="add-service-form" class="space-y-4">
                    <div>
                        <label class="block text-gray-300 font-medium mb-2">Service Name *</label>
                        <input type="text" id="service-name" required 
                               class="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white">
                    </div>
                    
                    <div>
                        <label class="block text-gray-300 font-medium mb-2">Price *</label>
                        <input type="text" id="service-price" required placeholder="e.g., ₹5,000 or Price on request"
                               class="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white">
                    </div>
                    
                    <div>
                        <label class="block text-gray-300 font-medium mb-2">Description</label>
                        <textarea id="service-description" rows="4"
                                  class="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-gray-300 font-medium mb-2">Service Image</label>
                        <input type="file" id="service-image" accept="image/*"
                               class="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white">
                        <div id="service-image-preview" class="mt-2"></div>
                    </div>
                    
                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" class="modal-close bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                            Cancel
                        </button>
                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                            Add Service
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle image preview
    const imageInput = document.getElementById('service-image');
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('service-image-preview').innerHTML = 
                    `<img src="${e.target.result}" alt="Preview" class="image-preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Handle form submission
    document.getElementById('add-service-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        await addService();
        modal.remove();
    });
    
    // Handle close button
    modal.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => modal.remove());
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Add Service Function
async function addService() {
    console.log('addService function called');
    try {
        const name = document.getElementById('service-name').value;
        const price = document.getElementById('service-price').value;
        const description = document.getElementById('service-description').value;
        const imageFile = document.getElementById('service-image').files[0];
        
        let imageUrl = '';
        if (imageFile) {
            imageUrl = await uploadImage(imageFile, 'services');
        }
        
        const serviceData = {
            name: name,
            price: price,
            description: description,
            imageUrl: imageUrl,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        await firebaseDB.collection('services').add(serviceData);
        showNotification('Service added successfully!');
        loadServicesList();
        loadDashboardData(); // Update counts
        
    } catch (error) {
        console.error('Error adding service:', error);
        showNotification('Error adding service', 'error');
    }
}

// Delete Service
async function deleteService(serviceId) {
    if (confirm('Are you sure you want to delete this service?')) {
        try {
            await firebaseDB.collection('services').doc(serviceId).delete();
            showNotification('Service deleted successfully!');
            loadServicesList();
            loadDashboardData(); // Update counts
        } catch (error) {
            console.error('Error deleting service:', error);
            showNotification('Error deleting service', 'error');
        }
    }
}

// Update Order Status
async function updateOrderStatus(orderId, newStatus) {
    try {
        await firebaseDB.collection('orders').doc(orderId).update({
            status: newStatus
        });
        showNotification(`Order marked as ${newStatus}!`);
        loadOrdersList();
    } catch (error) {
        console.error('Error updating order status:', error);
        showNotification('Error updating order status', 'error');
    }
}

// Initialize admin functionality
console.log('Admin dashboard initialized');