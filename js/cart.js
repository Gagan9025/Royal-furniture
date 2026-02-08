// Cart and Order Management for Royal Hood Wood Works

// Add to Cart Function
function addToCart(productId, productName, price, imageUrl) {
    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Increase quantity
        existingItem.quantity += 1;
    } else {
        // Add new item
        cart.push({
            id: productId,
            name: productName,
            price: price,
            imageUrl: imageUrl,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count display
    updateCartCount();
    
    // Show notification
    showNotification(`${productName} added to cart!`);
}

// Remove from Cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
    showNotification('Item removed from cart');
}

// Update Item Quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}

// Display Cart Items
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const emptyCart = document.getElementById('empty-cart');
    const cartContent = document.getElementById('cart-content');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (cart.length === 0) {
        emptyCart.classList.remove('hidden');
        cartContent.classList.add('hidden');
        return;
    }
    
    // Show cart content
    emptyCart.classList.add('hidden');
    cartContent.classList.remove('hidden');
    
    // Render cart items
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item bg-gray-50 rounded-lg p-4 flex items-center';
        
        cartItem.innerHTML = `
            <div class="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-4">
                ${item.imageUrl ? 
                    `<img src="${item.imageUrl}" alt="${item.name}" class="w-full h-full object-cover">` :
                    `<div class="w-full h-full bg-amber-200 flex items-center justify-center">
                        <i class="fas fa-couch text-amber-600"></i>
                    </div>`
                }
            </div>
            
            <div class="flex-1">
                <h3 class="font-semibold text-gray-800">${item.name}</h3>
                <p class="text-amber-600 font-medium">${formatCurrency(item.price)}</p>
            </div>
            
            <div class="flex items-center space-x-2 mr-4">
                <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
                    <i class="fas fa-minus text-sm"></i>
                </button>
                <span class="w-12 text-center font-medium">${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
                    <i class="fas fa-plus text-sm"></i>
                </button>
            </div>
            
            <div class="text-right mr-4">
                <p class="font-semibold text-gray-800">${formatCurrency(itemTotal)}</p>
            </div>
            
            <button onclick="removeFromCart('${item.id}')" class="text-red-500 hover:text-red-700">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Update totals
    subtotalElement.textContent = formatCurrency(subtotal);
    totalElement.textContent = formatCurrency(subtotal); // Free delivery
}

// Show Checkout Form
function showCheckoutForm() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    document.getElementById('checkout-modal').classList.remove('hidden');
    document.getElementById('checkout-modal').classList.add('flex');
}

// Hide Checkout Form
function hideCheckoutForm() {
    document.getElementById('checkout-modal').classList.add('hidden');
    document.getElementById('checkout-modal').classList.remove('flex');
    document.getElementById('order-form').reset();
}

// Handle Order Submission
async function handleOrderSubmission(e) {
    e.preventDefault();
    
    // Get form data
    const customerName = document.getElementById('customer-name').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const customerAddress = document.getElementById('customer-address').value;
    const orderNotes = document.getElementById('order-notes').value;
    
    // Get cart items
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order object
    const order = {
        customerName,
        phone: customerPhone,
        address: customerAddress,
        notes: orderNotes,
        items: cart,
        total,
        status: 'pending',
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        // Save order to Firestore
        const docRef = await firebaseDB.collection('orders').add(order);
        
        // Clear cart
        localStorage.removeItem('cart');
        
        // Hide checkout form
        hideCheckoutForm();
        
        // Show confirmation
        showOrderConfirmation(order, docRef.id);
        
        // Update cart display
        displayCart();
        updateCartCount();
        
        showNotification('Order placed successfully!');
        
    } catch (error) {
        console.error('Error placing order:', error);
        showNotification('Error placing order. Please try again.', 'error');
    }
}

// Show Order Confirmation
function showOrderConfirmation(order, orderId) {
    const modal = document.getElementById('confirmation-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Set up WhatsApp button
    window.currentOrder = {
        id: orderId,
        ...order
    };
    
    // Close modal event
    document.getElementById('continue-shopping').onclick = function() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        window.location.href = 'products.html';
    };
}

// Contact on WhatsApp
function contactOnWhatsApp() {
    if (window.currentOrder) {
        const order = window.currentOrder;
        const message = `Hello! I placed order #${order.id} for ${order.customerName}. Items: ${order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}. Total: ${formatCurrency(order.total)}. Please confirm delivery details.`;
        const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
}

// Load Products (for products page)
async function loadProducts() {
    try {
        const loading = document.getElementById('loading');
        const productsSection = document.getElementById('products-section');
        const noProducts = document.getElementById('no-products');
        const productsContainer = document.getElementById('products-container');
        
        // Show loading
        loading.classList.remove('hidden');
        productsSection.classList.add('hidden');
        noProducts.classList.add('hidden');
        
        const snapshot = await firebaseDB.collection('products').get();
        const products = [];
        
        snapshot.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });
        
        // Hide loading
        loading.classList.add('hidden');
        
        if (products.length > 0) {
            productsSection.classList.remove('hidden');
            renderProducts(products, productsContainer);
        } else {
            noProducts.classList.remove('hidden');
        }
        
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('no-products').classList.remove('hidden');
    }
}

// Render Products
function renderProducts(products, container) {
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card bg-white rounded-xl shadow-lg overflow-hidden';
        
        productCard.innerHTML = `
            <div class="h-64 bg-gray-200">
                ${product.imageUrl ? 
                    `<img src="${product.imageUrl}" alt="${product.name}" class="w-full h-full object-cover">` :
                    `<div class="w-full h-full bg-gradient-to-r from-amber-600 to-amber-800 flex items-center justify-center">
                        <i class="fas fa-couch text-5xl text-white"></i>
                    </div>`
                }
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-2">${product.name}</h3>
                <p class="text-gray-600 mb-3">${product.description || ''}</p>
                <p class="text-2xl font-bold text-amber-700 mb-4">${formatCurrency(product.price)}</p>
                <button onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.imageUrl || ''}')" 
                        class="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition duration-300 flex items-center justify-center">
                    <i class="fas fa-shopping-cart mr-2"></i>Add to Cart
                </button>
            </div>
        `;
        
        container.appendChild(productCard);
    });
}

// Initialize cart functionality
console.log('Cart system initialized');