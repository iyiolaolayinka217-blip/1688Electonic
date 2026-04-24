/**
 * 1688 Electronic Mart - Shopping Cart Page
 * Full-page cart functionality
 */

let cart = [];
let savedForLater = [];
let appliedPromo = null;

// Initialize cart page
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    loadSavedForLater();
    loadRecommendations();
    updateCartDisplay();
});

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Load saved for later
function loadSavedForLater() {
    const saved = localStorage.getItem('savedForLater');
    if (saved) {
        savedForLater = JSON.parse(saved);
    }
}

// Update cart display
function updateCartDisplay() {
    const container = document.getElementById('cartItemsContainer');
    const itemCount = document.getElementById('cartItemCount');
    
    if (!container) return;
    
    // Update item count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (itemCount) itemCount.textContent = totalItems;
    
    // Show empty state or items
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-state">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <a href="index.html" class="btn btn-primary">
                    <i class="fas fa-shopping-bag"></i> Start Shopping
                </a>
            </div>
        `;
        
        // Disable checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.style.opacity = '0.5';
            checkoutBtn.style.pointerEvents = 'none';
        }
    } else {
        container.innerHTML = cart.map((item, index) => `
            <div class="cart-item" data-index="${index}">
                <img src="${item.image || 'https://via.placeholder.com/100'}" alt="${item.name}" class="cart-item-image">
                
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-meta">SKU: ${item.sku || 'N/A'} | ${item.category || 'Electronics'}</div>
                    <div class="cart-item-price">
                        ¥${(item.price * item.quantity).toFixed(0)}
                        ${item.originalPrice ? `<span class="cart-item-original-price">¥${(item.originalPrice * item.quantity).toFixed(0)}</span>` : ''}
                    </div>
                </div>
                
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" 
                               onchange="setQuantity(${index}, this.value)">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    
                    <div style="display: flex; gap: 1rem;">
                        <button class="save-for-later" onclick="saveForLater(${index})">
                            <i class="fas fa-bookmark"></i> Save for Later
                        </button>
                        <button class="remove-btn" onclick="removeFromCart(${index})">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    calculateCartTotals();
    renderSavedForLater();
}

// Calculate cart totals
function calculateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate discount
    let discount = 0;
    if (appliedPromo) {
        if (appliedPromo.type === 'percentage') {
            discount = subtotal * (appliedPromo.value / 100);
        } else if (appliedPromo.type === 'fixed') {
            discount = appliedPromo.value;
        }
    }
    
    // Calculate shipping (free over ¥3500)
    const shipping = subtotal >= 3500 ? 0 : 69;
    
    // Calculate tax (8%)
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * 0.08;
    
    // Total
    const total = taxableAmount + shipping + tax;
    
    // Update DOM
    const subtotalEl = document.getElementById('cartSubtotal');
    const shippingEl = document.getElementById('cartShipping');
    const taxEl = document.getElementById('cartTax');
    const totalEl = document.getElementById('cartTotal');
    
    if (subtotalEl) subtotalEl.textContent = `¥${subtotal.toFixed(0)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `¥${shipping.toFixed(0)}`;
    if (taxEl) taxEl.textContent = `¥${tax.toFixed(0)}`;
    if (totalEl) totalEl.textContent = `¥${total.toFixed(0)}`;
}

// Update quantity
function updateQuantity(index, change) {
    if (index >= 0 && index < cart.length) {
        const newQuantity = cart[index].quantity + change;
        if (newQuantity >= 1 && newQuantity <= 99) {
            cart[index].quantity = newQuantity;
            saveCart();
            updateCartDisplay();
        }
    }
}

// Set quantity directly
function setQuantity(index, value) {
    const quantity = parseInt(value);
    if (index >= 0 && index < cart.length && quantity >= 1 && quantity <= 99) {
        cart[index].quantity = quantity;
        saveCart();
        updateCartDisplay();
    }
}

// Remove from cart
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        const item = cart[index];
        cart.splice(index, 1);
        saveCart();
        updateCartDisplay();
        showToast(`${item.name} removed from cart`);
    }
}

// Save for later
function saveForLater(index) {
    if (index >= 0 && index < cart.length) {
        const item = cart[index];
        savedForLater.push(item);
        cart.splice(index, 1);
        
        saveCart();
        saveSavedForLater();
        updateCartDisplay();
        showToast(`${item.name} saved for later`);
    }
}

// Move to cart from saved
function moveToCart(index) {
    if (index >= 0 && index < savedForLater.length) {
        const item = savedForLater[index];
        
        // Check if already in cart
        const existingIndex = cart.findIndex(c => c.id === item.id);
        if (existingIndex >= 0) {
            cart[existingIndex].quantity += item.quantity;
        } else {
            cart.push(item);
        }
        
        savedForLater.splice(index, 1);
        
        saveCart();
        saveSavedForLater();
        updateCartDisplay();
        showToast(`${item.name} moved to cart`);
    }
}

// Remove from saved
function removeFromSaved(index) {
    if (index >= 0 && index < savedForLater.length) {
        const item = savedForLater[index];
        savedForLater.splice(index, 1);
        saveSavedForLater();
        updateCartDisplay();
        showToast(`${item.name} removed`);
    }
}

// Render saved for later
function renderSavedForLater() {
    const section = document.getElementById('savedForLaterSection');
    const container = document.getElementById('savedItemsContainer');
    
    if (!section || !container) return;
    
    if (savedForLater.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    container.innerHTML = savedForLater.map((item, index) => `
        <div class="cart-item" data-index="${index}">
            <img src="${item.image || 'https://via.placeholder.com/100'}" alt="${item.name}" class="cart-item-image">
            
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-meta">Saved for later</div>
                <div class="cart-item-price">¥${item.price.toFixed(0)}</div>
            </div>
            
            <div class="cart-item-actions">
                <button class="btn btn-primary btn-small" onclick="moveToCart(${index})">
                    <i class="fas fa-shopping-cart"></i> Move to Cart
                </button>
                <button class="remove-btn" onclick="removeFromSaved(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Clear cart
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        updateCartDisplay();
        showToast('Cart cleared');
    }
}

// Apply promo code in cart
function applyCartPromo() {
    const input = document.getElementById('cartPromoCode');
    const code = input.value.trim().toUpperCase();
    const message = document.getElementById('cartPromoMessage');
    
    const promoCodes = {
        'SAVE10': { type: 'percentage', value: 10 },
        'SAVE20': { type: 'percentage', value: 20 },
        'WELCOME': { type: 'fixed', value: 15 },
        'FREESHIP': { type: 'shipping', value: 0 }
    };
    
    if (!code) {
        message.textContent = 'Please enter a promo code';
        message.style.color = '#dc3545';
        return;
    }
    
    if (promoCodes[code]) {
        appliedPromo = promoCodes[code];
        message.textContent = `Promo applied! ${appliedPromo.type === 'percentage' ? appliedPromo.value + '% off' : '¥' + appliedPromo.value + ' off'}`;
        message.style.color = '#28a745';
        calculateCartTotals();
        showToast('Promo code applied!');
    } else {
        appliedPromo = null;
        message.textContent = 'Invalid promo code';
        message.style.color = '#dc3545';
        calculateCartTotals();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update header cart count
    const headerCartCount = document.getElementById('cartCount');
    if (headerCartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        headerCartCount.textContent = totalItems;
        headerCartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Save saved for later
function saveSavedForLater() {
    localStorage.setItem('savedForLater', JSON.stringify(savedForLater));
}

// Load recommendations
function loadRecommendations() {
    const grid = document.getElementById('recommendationGrid');
    if (!grid) return;
    
    // Mock recommendations
    const recommendations = [
        { id: 101, name: 'USB-C Cable 3-pack', price: 89, image: 'https://via.placeholder.com/150' },
        { id: 102, name: 'Wireless Mouse', price: 179, image: 'https://via.placeholder.com/150' },
        { id: 103, name: 'Phone Case', price: 69, image: 'https://via.placeholder.com/150' },
        { id: 104, name: 'Screen Protector', price: 59, image: 'https://via.placeholder.com/150' }
    ];
    
    grid.innerHTML = recommendations.map(product => `
        <div class="recommendation-card">
            <img src="${product.image}" alt="${product.name}">
            <h4>${product.name}</h4>
            <div class="price">¥${product.price.toFixed(0)}</div>
            <button class="add-to-cart-btn" onclick="addRecommendationToCart(${product.id})">
                <i class="fas fa-plus"></i> Add
            </button>
        </div>
    `).join('');
}

// Add recommendation to cart
function addRecommendationToCart(productId) {
    // Mock product data - in real app, fetch from API
    const products = {
        101: { id: 101, name: 'USB-C Cable 3-pack', price: 12.99, sku: 'USB-001', category: 'Accessories', image: 'https://via.placeholder.com/150' },
        102: { id: 102, name: 'Wireless Mouse', price: 24.99, sku: 'MOU-001', category: 'Accessories', image: 'https://via.placeholder.com/150' },
        103: { id: 103, name: 'Phone Case', price: 9.99, sku: 'CAS-001', category: 'Accessories', image: 'https://via.placeholder.com/150' },
        104: { id: 104, name: 'Screen Protector', price: 7.99, sku: 'SCR-001', category: 'Accessories', image: 'https://via.placeholder.com/150' }
    };
    
    const product = products[productId];
    if (!product) return;
    
    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex >= 0) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartDisplay();
    showToast(`${product.name} added to cart`);
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Export functions for global access
window.updateQuantity = updateQuantity;
window.setQuantity = setQuantity;
window.removeFromCart = removeFromCart;
window.saveForLater = saveForLater;
window.moveToCart = moveToCart;
window.removeFromSaved = removeFromSaved;
window.clearCart = clearCart;
window.applyCartPromo = applyCartPromo;
window.addRecommendationToCart = addRecommendationToCart;
