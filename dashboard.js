/**
 * 1688 Electronic Mart - User Dashboard
 * Account management, orders, addresses, wishlist
 */

let currentUser = null;
let orders = [];
let savedAddresses = [];
let savedCards = [];
let wishlist = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserData();
    loadOrders();
    loadSavedAddresses();
    loadSavedCards();
    loadWishlist();
    updateDashboardUI();
    setupEventListeners();
});

// Check authentication
function checkAuth() {
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
        window.location.href = 'auth.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }
    currentUser = JSON.parse(userData);
}

// Load user data
function loadUserData() {
    if (!currentUser) return;
    
    // Update sidebar user info
    const userNameEl = document.getElementById('userName');
    const userEmailEl = document.getElementById('userEmail');
    const userAvatarEl = document.getElementById('userAvatar');
    
    const fullName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
    
    if (userNameEl) userNameEl.textContent = fullName || 'Welcome';
    if (userEmailEl) userEmailEl.textContent = currentUser.email || 'user@example.com';
    
    // Set avatar initials
    if (userAvatarEl && fullName) {
        const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        userAvatarEl.innerHTML = `<span style="font-weight: 700;">${initials}</span>`;
    }
    
    // Update settings form
    const settingFirstName = document.getElementById('settingFirstName');
    const settingLastName = document.getElementById('settingLastName');
    const settingEmail = document.getElementById('settingEmail');
    const settingPhone = document.getElementById('settingPhone');
    
    if (settingFirstName) settingFirstName.value = currentUser.firstName || '';
    if (settingLastName) settingLastName.value = currentUser.lastName || '';
    if (settingEmail) settingEmail.value = currentUser.email || '';
    if (settingPhone) settingPhone.value = currentUser.phone || '';
}

// Load orders
function loadOrders() {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders).filter(order => {
            // Filter orders for current user
            if (currentUser && order.shipping) {
                return order.shipping.email === currentUser.email;
            }
            return true;
        });
    }
}

// Load saved addresses
function loadSavedAddresses() {
    const saved = localStorage.getItem('savedAddresses');
    if (saved) {
        savedAddresses = JSON.parse(saved);
    }
}

// Load saved cards
function loadSavedCards() {
    const saved = localStorage.getItem('savedCards');
    if (saved) {
        savedCards = JSON.parse(saved);
    }
}

// Load wishlist
function loadWishlist() {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
        // Convert product IDs to full product objects
        const wishlistIds = JSON.parse(saved);
        // Mock products - in real app, fetch from API
        wishlist = wishlistIds.map(id => getProductById(id)).filter(Boolean);
    }
}

// Mock product lookup
function getProductById(id) {
    const products = {
        1: { id: 1, name: 'iPhone 15 Pro Max', price: 899.99, image: 'https://via.placeholder.com/150', category: 'phones' },
        2: { id: 2, name: 'Samsung Galaxy S24', price: 799.99, image: 'https://via.placeholder.com/150', category: 'phones' },
        3: { id: 3, name: 'MacBook Pro 16"', price: 2499.99, image: 'https://via.placeholder.com/150', category: 'laptops' },
        4: { id: 4, name: 'Sony WH-1000XM5', price: 348.99, image: 'https://via.placeholder.com/150', category: 'accessories' }
    };
    return products[id];
}

// Update dashboard UI
function updateDashboardUI() {
    // Update stats
    document.getElementById('statOrders').textContent = orders.length;
    document.getElementById('statWishlist').textContent = wishlist.length;
    
    // Calculate savings (mock calculation)
    const totalSpent = orders.reduce((sum, order) => {
        const total = parseFloat(order.totals.total.replace('¥', ''));
        return sum + total;
    }, 0);
    const savings = totalSpent * 0.15; // Mock 15% savings
    document.getElementById('statSavings').textContent = '¥' + savings.toFixed(0);
    
    // Reward points (1 point per ¥1 spent)
    document.getElementById('statPoints').textContent = Math.floor(totalSpent);
    
    // Update badges
    document.getElementById('orderBadge').textContent = orders.length;
    document.getElementById('wishlistBadge').textContent = wishlist.length;
    
    // Render recent orders
    renderRecentOrders();
    
    // Render all orders
    renderOrdersList();
    
    // Render addresses
    renderAddresses();
    
    // Render cards
    renderCards();
    
    // Render wishlist
    renderWishlist();
}

// Render recent orders (limit 3)
function renderRecentOrders() {
    const container = document.getElementById('recentOrders');
    if (!container) return;
    
    const recentOrders = orders.slice(0, 3);
    
    if (recentOrders.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-light, #666);">
                <i class="fas fa-shopping-bag" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                <p>No orders yet. Start shopping!</p>
                <a href="index.html" class="btn btn-primary" style="margin-top: 1rem;">Shop Now</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recentOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-number">${order.orderNumber}</div>
                    <div class="order-date">${formatDate(order.date)}</div>
                </div>
                <span class="order-status ${order.status}">${capitalizeFirst(order.status)}</span>
            </div>
            <div class="order-items-preview">
                ${order.items.slice(0, 3).map(item => `
                    <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name}" class="order-item-thumb">
                `).join('')}
                ${order.items.length > 3 ? `<span style="display: flex; align-items: center; color: var(--text-light, #666);">+${order.items.length - 3}</span>` : ''}
            </div>
            <div class="order-total">
                <span>${order.items.length} item${order.items.length > 1 ? 's' : ''}</span>
                <strong>${order.totals.total}</strong>
            </div>
            <div class="order-actions">
                <a href="track-order.html?order=${order.orderNumber}" class="btn btn-secondary btn-small">
                    <i class="fas fa-truck"></i> Track
                </a>
                <a href="order-success.html?order=${order.orderNumber}" class="btn btn-secondary btn-small">
                    <i class="fas fa-eye"></i> View
                </a>
            </div>
        </div>
    `).join('');
}

// Render full orders list
function renderOrdersList(filter = 'all') {
    const container = document.getElementById('ordersList');
    if (!container) return;
    
    let filteredOrders = orders;
    if (filter !== 'all') {
        filteredOrders = orders.filter(o => o.status === filter);
    }
    
    if (filteredOrders.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-light, #666);">
                <i class="fas fa-shopping-bag" style="font-size: 4rem; margin-bottom: 1rem; display: block;"></i>
                <p>No ${filter !== 'all' ? filter : ''} orders found.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredOrders.map(order => `
        <div class="order-detail-card">
            <div class="order-header">
                <div>
                    <div class="order-number">${order.orderNumber}</div>
                    <div class="order-date">${formatDate(order.date)}</div>
                </div>
                <span class="order-status ${order.status}">${capitalizeFirst(order.status)}</span>
            </div>
            <div class="order-items-list" style="margin: 1rem 0;">
                ${order.items.map(item => `
                    <div style="display: flex; gap: 1rem; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border, #e0e0e0);">
                        <img src="${item.image || 'https://via.placeholder.com/60'}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;">
                        <div style="flex: 1;">
                            <div style="font-weight: 500;">${item.name}</div>
                            <div style="font-size: 0.875rem; color: var(--text-light, #666);">Qty: ${item.quantity}</div>
                        </div>
                        <div style="font-weight: 700; color: var(--primary, #ff6600);">¥${(item.price * item.quantity).toFixed(0)}</div>
                    </div>
                `).join('')}
            </div>
            <div class="order-total" style="padding-top: 1rem;">
                <span>Total</span>
                <strong style="font-size: 1.125rem;">${order.totals.total}</strong>
            </div>
            <div class="order-actions" style="margin-top: 1rem;">
                <a href="track-order.html?order=${order.orderNumber}" class="btn btn-primary btn-small">Track Order</a>
                <a href="order-success.html?order=${order.orderNumber}" class="btn btn-secondary btn-small">View Details</a>
                ${order.status !== 'cancelled' ? `
                    <button class="btn btn-secondary btn-small" onclick="reorder('${order.orderNumber}')">
                        <i class="fas fa-redo"></i> Reorder
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Render addresses
function renderAddresses() {
    const container = document.getElementById('addressesGrid');
    if (!container) return;
    
    if (savedAddresses.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-light, #666); grid-column: 1 / -1;">
                <i class="fas fa-map-marker-alt" style="font-size: 4rem; margin-bottom: 1rem; display: block;"></i>
                <p>No saved addresses.</p>
                <button class="btn btn-primary" onclick="showAddressModal()" style="margin-top: 1rem;">
                    <i class="fas fa-plus"></i> Add Address
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = savedAddresses.map((addr, index) => `
        <div class="address-card ${addr.isDefault ? 'default' : ''}">
            ${addr.isDefault ? '<span class="address-badge">Default</span>' : ''}
            <div class="address-name">${addr.firstName} ${addr.lastName}</div>
            <div class="address-line">
                ${addr.address}${addr.apartment ? ', ' + addr.apartment : ''}<br>
                ${addr.city}, ${addr.state} ${addr.zip}<br>
                ${getCountryName(addr.country)}
            </div>
            <div class="address-actions">
                <button onclick="editAddress(${index})">Edit</button>
                <button onclick="deleteAddress(${index})" class="delete">Delete</button>
                ${!addr.isDefault ? `<button onclick="setDefaultAddress(${index})">Set as Default</button>` : ''}
            </div>
        </div>
    `).join('');
}

// Render cards
function renderCards() {
    const container = document.getElementById('cardsList');
    if (!container) return;
    
    if (savedCards.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-light, #666);">
                <i class="fas fa-credit-card" style="font-size: 4rem; margin-bottom: 1rem; display: block;"></i>
                <p>No saved cards.</p>
                <button class="btn btn-primary" onclick="showCardModal()" style="margin-top: 1rem;">
                    <i class="fas fa-plus"></i> Add Card
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = savedCards.map((card, index) => `
        <div class="card-item ${card.isDefault ? 'default' : ''}">
            <div class="card-icon">
                <i class="fas fa-credit-card"></i>
            </div>
            <div class="card-details">
                <div class="card-number">•••• •••• •••• ${card.last4}</div>
                <div class="card-expiry">Expires: ${card.expiry}</div>
                ${card.isDefault ? '<span class="default-badge" style="font-size: 0.625rem; background: var(--primary, #ff6600); color: white; padding: 0.125rem 0.375rem; border-radius: 4px;">Default</span>' : ''}
            </div>
            <div class="card-actions">
                <button onclick="deleteCard(${index})" class="delete">Delete</button>
                ${!card.isDefault ? `<button onclick="setDefaultCard(${index})">Set Default</button>` : ''}
            </div>
        </div>
    `).join('');
}

// Render wishlist
function renderWishlist() {
    const container = document.getElementById('wishlistGrid');
    if (!container) return;
    
    if (wishlist.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-light, #666); grid-column: 1 / -1;">
                <i class="fas fa-heart" style="font-size: 4rem; margin-bottom: 1rem; display: block;"></i>
                <p>Your wishlist is empty.</p>
                <a href="index.html" class="btn btn-primary" style="margin-top: 1rem;">Shop Now</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = wishlist.map(item => `
        <div class="wishlist-item">
            <img src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.name}">
            <div class="wishlist-item-details">
                <div class="wishlist-item-name">${item.name}</div>
                <div class="wishlist-item-price">¥${item.price.toFixed(0)}</div>
                <div class="wishlist-item-actions">
                    <button class="btn btn-primary btn-small" onclick="addToCartFromWishlist(${item.id})">
                        <i class="fas fa-shopping-cart"></i> Add
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="removeFromWishlist(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Order filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderOrdersList(this.dataset.filter);
        });
    });
    
    // Settings tabs
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const setting = this.dataset.setting;
            
            document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.setting-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(setting + 'Panel').classList.add('active');
        });
    });
}

// Switch dashboard tab
function switchTab(tab) {
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.tab === tab) {
            link.classList.add('active');
        }
    });
    
    // Show corresponding section
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(tab + 'Tab').classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show address modal
function showAddressModal() {
    const modal = document.getElementById('addressModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Close address modal
function closeAddressModal() {
    const modal = document.getElementById('addressModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        document.getElementById('addressForm').reset();
    }
}

// Save address
function saveAddress(e) {
    e.preventDefault();
    
    const address = {
        firstName: document.getElementById('addrFirstName').value,
        lastName: document.getElementById('addrLastName').value,
        address: document.getElementById('addrStreet').value,
        apartment: document.getElementById('addrApt').value,
        city: document.getElementById('addrCity').value,
        state: document.getElementById('addrState').value,
        zip: document.getElementById('addrZip').value,
        country: document.getElementById('addrCountry').value,
        isDefault: document.getElementById('addrDefault').checked
    };
    
    // If setting as default, remove default from others
    if (address.isDefault) {
        savedAddresses.forEach(addr => addr.isDefault = false);
    }
    
    savedAddresses.push(address);
    localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));
    
    closeAddressModal();
    renderAddresses();
    showToast('Address saved successfully!');
}

// Delete address
function deleteAddress(index) {
    if (confirm('Are you sure you want to delete this address?')) {
        savedAddresses.splice(index, 1);
        localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));
        renderAddresses();
        showToast('Address deleted');
    }
}

// Set default address
function setDefaultAddress(index) {
    savedAddresses.forEach((addr, i) => {
        addr.isDefault = (i === index);
    });
    localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));
    renderAddresses();
    showToast('Default address updated');
}

// Show card modal
function showCardModal() {
    const modal = document.getElementById('cardModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Close card modal
function closeCardModal() {
    const modal = document.getElementById('cardModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        document.getElementById('cardForm').reset();
    }
}

// Save card
function saveCard(e) {
    e.preventDefault();
    
    const cardNum = document.getElementById('cardNum').value.replace(/\s/g, '');
    const card = {
        last4: cardNum.slice(-4),
        expiry: document.getElementById('cardExpiry').value,
        name: document.getElementById('cardHolder').value,
        isDefault: document.getElementById('cardDefault').checked
    };
    
    // If setting as default, remove default from others
    if (card.isDefault) {
        savedCards.forEach(c => c.isDefault = false);
    }
    
    savedCards.push(card);
    localStorage.setItem('savedCards', JSON.stringify(savedCards));
    
    closeCardModal();
    renderCards();
    showToast('Card saved successfully!');
}

// Delete card
function deleteCard(index) {
    if (confirm('Are you sure you want to delete this card?')) {
        savedCards.splice(index, 1);
        localStorage.setItem('savedCards', JSON.stringify(savedCards));
        renderCards();
        showToast('Card deleted');
    }
}

// Set default card
function setDefaultCard(index) {
    savedCards.forEach((card, i) => {
        card.isDefault = (i === index);
    });
    localStorage.setItem('savedCards', JSON.stringify(savedCards));
    renderCards();
    showToast('Default card updated');
}

// Add to cart from wishlist
function addToCartFromWishlist(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    showToast('Added to cart!');
}

// Remove from wishlist
function removeFromWishlist(productId) {
    let wishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlistIds = wishlistIds.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlistIds));
    
    // Update wishlist array
    wishlist = wishlist.filter(item => item.id !== productId);
    
    renderWishlist();
    updateDashboardUI();
    showToast('Removed from wishlist');
}

// Reorder
function reorder(orderNumber) {
    const order = orders.find(o => o.orderNumber === orderNumber);
    if (!order) return;
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    order.items.forEach(item => {
        const existing = cart.find(c => c.id === item.id);
        if (existing) {
            existing.quantity += item.quantity;
        } else {
            cart.push({ ...item });
        }
    });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    showToast('Items added to cart!');
    
    // Redirect to cart
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 1000);
}

// Update profile
function updateProfile(e) {
    e.preventDefault();
    
    if (!currentUser) return;
    
    currentUser.firstName = document.getElementById('settingFirstName').value;
    currentUser.lastName = document.getElementById('settingLastName').value;
    currentUser.email = document.getElementById('settingEmail').value;
    currentUser.phone = document.getElementById('settingPhone').value;
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    loadUserData();
    showToast('Profile updated successfully!');
}

// Update password
function updatePassword(e) {
    e.preventDefault();
    
    const currentPass = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    
    if (newPass !== confirmPass) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (newPass.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return;
    }
    
    // Mock password update
    showToast('Password updated successfully!');
    document.getElementById('passwordForm').reset();
}

// Save notification settings
function saveNotificationSettings() {
    showToast('Notification preferences saved!');
}

// Delete account
function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('savedAddresses');
        localStorage.removeItem('savedCards');
        showToast('Account deleted');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    showToast('Logged out successfully');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Helper functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getCountryName(code) {
    const countries = {
        'US': 'United States',
        'CA': 'Canada',
        'UK': 'United Kingdom',
        'AU': 'Australia',
        'DE': 'Germany',
        'FR': 'France'
    };
    return countries[code] || code;
}

// Show toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        
        const icon = toast.querySelector('i');
        if (icon) {
            icon.className = type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
            icon.style.color = type === 'error' ? '#dc3545' : '#28a745';
        }
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Mobile menu toggle (placeholder)
function toggleMobileMenu() {
    // Implementation depends on existing menu structure
    showToast('Menu toggled');
}

// Export functions for global access
window.switchTab = switchTab;
window.showAddressModal = showAddressModal;
window.closeAddressModal = closeAddressModal;
window.saveAddress = saveAddress;
window.deleteAddress = deleteAddress;
window.setDefaultAddress = setDefaultAddress;
window.editAddress = function(index) {
    showToast('Edit functionality coming soon');
};
window.showCardModal = showCardModal;
window.closeCardModal = closeCardModal;
window.saveCard = saveCard;
window.deleteCard = deleteCard;
window.setDefaultCard = setDefaultCard;
window.addToCartFromWishlist = addToCartFromWishlist;
window.removeFromWishlist = removeFromWishlist;
window.reorder = reorder;
window.updateProfile = updateProfile;
window.updatePassword = updatePassword;
window.saveNotificationSettings = saveNotificationSettings;
window.deleteAccount = deleteAccount;
window.logout = logout;
window.toggleMobileMenu = toggleMobileMenu;
