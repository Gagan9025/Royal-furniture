// Main JavaScript for Royal Hood Wood Works Website

// DOM Ready Function
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main JavaScript loaded');
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Load business info on home page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        loadBusinessInfo();
    }
    
    // Update cart count on all pages
    updateCartCount();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Load Business Information
async function loadBusinessInfo() {
    try {
        const doc = await firebaseDB.collection('business_info').doc('main').get();
        
        if (doc.exists) {
            const data = doc.data();
            
            // Update business information
            document.getElementById('business-name').textContent = data.businessName || 'Royal Hood Wood Works';
            document.getElementById('owner-name').textContent = data.ownerName || 'Premium Wood Craft';
            document.getElementById('business-title').textContent = data.businessName || 'Royal Hood Wood Works';
            document.getElementById('business-description').textContent = data.description || 'Premium wood furniture and interior design services';
            document.getElementById('business-owner').textContent = data.ownerName || 'John Doe';
            document.getElementById('business-experience').textContent = data.experience || '15+ years';
            document.getElementById('business-phone').textContent = data.phone || '+91 9876543210';
            document.getElementById('business-address').textContent = data.address || '123 Main Street, City';
            
            // Update logo if available
            if (data.logoUrl) {
                const logoDisplay = document.getElementById('business-logo-display');
                logoDisplay.innerHTML = `<img src="${data.logoUrl}" alt="Business Logo" class="w-full h-full object-cover rounded-full">`;
            }
        } else {
            console.log('No business info found');
        }
    } catch (error) {
        console.error('Error loading business info:', error);
    }
}

// Load Interior Packages
async function loadInteriorPackages() {
    try {
        const loading = document.getElementById('loading');
        const packagesSection = document.getElementById('packages-section');
        const noPackages = document.getElementById('no-packages');
        const packagesContainer = document.getElementById('packages-container');
        
        // Show loading
        loading.classList.remove('hidden');
        packagesSection.classList.add('hidden');
        noPackages.classList.add('hidden');
        
        const snapshot = await firebaseDB.collection('interior_packages').get();
        const packages = [];
        
        snapshot.forEach(doc => {
            packages.push({ id: doc.id, ...doc.data() });
        });
        
        // Hide loading
        loading.classList.add('hidden');
        
        if (packages.length > 0) {
            packagesSection.classList.remove('hidden');
            renderPackages(packages, packagesContainer);
        } else {
            noPackages.classList.remove('hidden');
        }
        
    } catch (error) {
        console.error('Error loading interior packages:', error);
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('no-packages').classList.remove('hidden');
    }
}

// Render Interior Packages
function renderPackages(packages, container) {
    container.innerHTML = '';
    
    packages.forEach(pkg => {
        const packageCard = document.createElement('div');
        packageCard.className = 'bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300';
        
        packageCard.innerHTML = `
            <div class="h-48 bg-gray-200">
                ${pkg.imageUrl ? 
                    `<img src="${pkg.imageUrl}" alt="${pkg.name}" class="w-full h-full object-cover">` :
                    `<div class="w-full h-full bg-gradient-to-r from-amber-600 to-amber-800 flex items-center justify-center">
                        <i class="fas fa-home text-4xl text-white"></i>
                    </div>`
                }
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-2">${pkg.name}</h3>
                <p class="text-gray-600 mb-3">Materials: ${pkg.materials ? pkg.materials.join(', ') : 'Various'}</p>
                <p class="text-lg font-semibold text-amber-700 mb-4">${pkg.priceRange || 'Price on request'}</p>
                <div class="flex flex-col sm:flex-row gap-2">
                    <button onclick="showPackageDetails('${pkg.id}')" class="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-medium transition duration-300">
                        View Details
                    </button>
                    <button onclick="enquirePackage('${pkg.name}')" class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition duration-300">
                        <i class="fab fa-whatsapp mr-2"></i>Enquire
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(packageCard);
    });
}

// Show Package Details Modal
async function showPackageDetails(packageId) {
    try {
        const doc = await firebaseDB.collection('interior_packages').doc(packageId).get();
        if (doc.exists) {
            const pkg = doc.data();
            const modal = document.getElementById('pricing-modal');
            const modalName = document.getElementById('modal-package-name');
            const modalContent = document.getElementById('modal-content');
            
            modalName.textContent = pkg.name;
            modalContent.innerHTML = `
                <div class="mb-4">
                    <img src="${pkg.imageUrl || ''}" alt="${pkg.name}" class="w-full h-48 object-cover rounded-lg mb-4">
                    <p class="text-gray-700 mb-3"><strong>Materials:</strong> ${pkg.materials ? pkg.materials.join(', ') : 'Various'}</p>
                    <p class="text-xl font-bold text-amber-700 mb-4">${pkg.priceRange || 'Price on request'}</p>
                    <p class="text-gray-700">${pkg.description || 'No description available.'}</p>
                </div>
                <button onclick="enquirePackage('${pkg.name}')" class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition duration-300 flex items-center justify-center">
                    <i class="fab fa-whatsapp mr-2"></i>Enquire Now
                </button>
            `;
            
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            // Close modal event
            document.getElementById('close-modal').onclick = function() {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            };
            
            // Close on outside click
            modal.onclick = function(e) {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                }
            };
        }
    } catch (error) {
        console.error('Error loading package details:', error);
    }
}

// Enquire about Package (WhatsApp)
function enquirePackage(packageName) {
    const message = `Hello! I'm interested in your "${packageName}" interior design package. Please provide more details.`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Load Services
async function loadServices() {
    try {
        const loading = document.getElementById('loading');
        const servicesSection = document.getElementById('services-section');
        const noServices = document.getElementById('no-services');
        const servicesContainer = document.getElementById('services-container');
        
        // Show loading
        loading.classList.remove('hidden');
        servicesSection.classList.add('hidden');
        noServices.classList.add('hidden');
        
        const snapshot = await firebaseDB.collection('services').get();
        const services = [];
        
        snapshot.forEach(doc => {
            services.push({ id: doc.id, ...doc.data() });
        });
        
        // Hide loading
        loading.classList.add('hidden');
        
        if (services.length > 0) {
            servicesSection.classList.remove('hidden');
            renderServices(services, servicesContainer);
        } else {
            noServices.classList.remove('hidden');
        }
        
    } catch (error) {
        console.error('Error loading services:', error);
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('no-services').classList.remove('hidden');
    }
}

// Render Services
function renderServices(services, container) {
    container.innerHTML = '';
    
    services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300';
        
        serviceCard.innerHTML = `
            <div class="h-48 bg-gray-200">
                ${service.imageUrl ? 
                    `<img src="${service.imageUrl}" alt="${service.name}" class="w-full h-full object-cover">` :
                    `<div class="w-full h-full bg-gradient-to-r from-amber-700 to-amber-900 flex items-center justify-center">
                        <i class="fas fa-tools text-4xl text-white"></i>
                    </div>`
                }
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-2">${service.name}</h3>
                <p class="text-lg font-semibold text-amber-700 mb-4">${service.price || 'Price on request'}</p>
                <p class="text-gray-600 mb-4">${service.description || ''}</p>
                <button onclick="enquireService('${service.name}')" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition duration-300 flex items-center justify-center">
                    <i class="fab fa-whatsapp mr-2"></i>Enquire Now
                </button>
            </div>
        `;
        
        container.appendChild(serviceCard);
    });
}

// Enquire about Service (WhatsApp)
function enquireService(serviceName) {
    const message = `Hello! I'm interested in your "${serviceName}" service. Please provide more details and pricing.`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Update Cart Count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('#cart-count, #mobile-cart-count');
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

// Initialize cart count on page load
updateCartCount();