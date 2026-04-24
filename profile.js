// Profile Page JavaScript

// Load user data and initialize profile
let currentUser = null;
let addresses = [];
let cards = [];
let orders = [];
let wishlist = [];

document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadAddresses();
    loadCards();
    loadOrders();
    loadWishlist();
    renderProfile();
    renderAddresses();
    renderCards();
    renderOrders();
    renderWishlist();
    updateAuthLinks();
});

// Load user data from localStorage
function loadUserData() {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
        currentUser = JSON.parse(userJson);
    } else {
        // Redirect to login if not authenticated
        window.location.href = 'auth.html';
    }
}

// Load addresses from localStorage
function loadAddresses() {
    const addressesJson = localStorage.getItem('addresses');
    if (addressesJson) {
        addresses = JSON.parse(addressesJson);
    } else {
        // Add default address if none exists
        addresses = [];
    }
}

// Load cards from localStorage
function loadCards() {
    const cardsJson = localStorage.getItem('cards');
    if (cardsJson) {
        cards = JSON.parse(cardsJson);
    } else {
        cards = [];
    }
}

// Load orders from localStorage
function loadOrders() {
    const ordersJson = localStorage.getItem('orders');
    if (ordersJson) {
        orders = JSON.parse(ordersJson);
    } else {
        orders = [];
    }
}

// Load wishlist from localStorage
function loadWishlist() {
    const wishlistJson = localStorage.getItem('wishlist');
    if (wishlistJson) {
        wishlist = JSON.parse(wishlistJson);
    } else {
        wishlist = [];
    }
}

// Render profile information
function renderProfile() {
    if (!currentUser) return;

    // Update profile header
    document.getElementById('profileName').textContent = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'User Name';
    document.getElementById('profileEmail').textContent = currentUser.email || 'user@example.com';
    document.getElementById('profilePhone').textContent = currentUser.phone || '+86 123 4567 8900';
    
    // Update avatar
    const initials = `${(currentUser.firstName || 'U')[0]}${(currentUser.lastName || '')[0]}`.toUpperCase();
    document.getElementById('avatarInitials').textContent = initials;
    
    if (currentUser.avatar) {
        document.getElementById('profileAvatar').innerHTML = `<img src="${currentUser.avatar}" alt="Profile Avatar">`;
    }

    // Update member since date
    if (currentUser.joined) {
        const joinedDate = new Date(currentUser.joined);
        document.getElementById('memberSince').textContent = joinedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    // Update personal info form
    document.getElementById('firstName').value = currentUser.firstName || '';
    document.getElementById('lastName').value = currentUser.lastName || '';
    document.getElementById('email').value = currentUser.email || '';
    document.getElementById('phone').value = currentUser.phone || '';
    document.getElementById('bio').value = currentUser.bio || '';

    // Update stats
    document.getElementById('statOrders').textContent = orders.length;
    document.getElementById('statWishlist').textContent = wishlist.length;
    
    // Calculate reward points (1 point per ¥100 spent)
    const totalSpent = orders.reduce((sum, order) => {
        const total = parseFloat(order.totals?.total?.replace('¥', '') || 0);
        return sum + total;
    }, 0);
    document.getElementById('statPoints').textContent = Math.floor(totalSpent / 100);
    
    // Calculate savings (mock 15% savings)
    const savings = totalSpent * 0.15;
    document.getElementById('statSavings').textContent = `¥${savings.toFixed(0)}`;
}

// Render addresses
function renderAddresses() {
    const container = document.getElementById('addressList');
    if (!container) return;

    if (addresses.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 40px;">No saved addresses yet. Click "Add New Address" to add one.</p>';
        return;
    }

    container.innerHTML = addresses.map((addr, index) => `
        <div class="address-card ${addr.isDefault ? 'default' : ''}">
            ${addr.isDefault ? '<span class="badge">Default</span>' : ''}
            <h4>${addr.firstName} ${addr.lastName}</h4>
            <p>${addr.address}${addr.apartment ? ', ' + addr.apartment : ''}</p>
            <p>${addr.city}, ${addr.state} ${addr.zip}</p>
            <p>${getCountryName(addr.country)}</p>
            <p><strong>Phone:</strong> ${addr.phone}</p>
            <div class="address-actions">
                <button class="btn btn-secondary btn-small" onclick="editAddress(${index})">Edit</button>
                <button class="btn btn-secondary btn-small" onclick="deleteAddress(${index})">Delete</button>
                ${!addr.isDefault ? `<button class="btn btn-secondary btn-small" onclick="setDefaultAddress(${index})">Set Default</button>` : ''}
            </div>
        </div>
    `).join('');
}

// Render payment methods
function renderCards() {
    const container = document.getElementById('cardList');
    if (!container) return;

    if (cards.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 40px;">No saved payment methods yet. Click "Add New Card" to add one.</p>';
        return;
    }

    container.innerHTML = cards.map((card, index) => `
        <div class="card-item ${card.isDefault ? 'default' : ''}">
            ${card.isDefault ? '<span class="badge">Default</span>' : ''}
            <h4><i class="fab fa-cc-${card.type.toLowerCase()}"></i> ${card.type}</h4>
            <p>•••• •••• •••• ${card.last4}</p>
            <p>Expires: ${card.expiry}</p>
            <p><strong>Cardholder:</strong> ${card.name}</p>
            <div class="card-actions">
                <button class="btn btn-secondary btn-small" onclick="editCard(${index})">Edit</button>
                <button class="btn btn-secondary btn-small" onclick="deleteCard(${index})">Delete</button>
                ${!card.isDefault ? `<button class="btn btn-secondary btn-small" onclick="setDefaultCard(${index})">Set Default</button>` : ''}
            </div>
        </div>
    `).join('');
}

// Render orders
function renderOrders(filter = 'all') {
    const container = document.getElementById('orderList');
    if (!container) return;

    let filteredOrders = orders;
    if (filter !== 'all') {
        filteredOrders = orders.filter(order => order.status === filter);
    }

    if (filteredOrders.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 40px;">No orders found.</p>';
        return;
    }

    container.innerHTML = filteredOrders.map(order => `
        <div class="order-item">
            <div class="order-item-header">
                <div>
                    <span class="order-number">${order.orderNumber}</span>
                    <span class="order-date">${formatDate(order.date)}</span>
                </div>
                <span class="order-status ${order.status}">${capitalizeFirst(order.status)}</span>
            </div>
            <div style="margin-bottom: 15px;">
                ${order.items.slice(0, 3).map(item => `
                    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
                        <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">
                        <div>
                            <div style="font-weight: 500;">${item.name}</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Qty: ${item.quantity}</div>
                        </div>
                    </div>
                `).join('')}
                ${order.items.length > 3 ? `<div style="font-size: 12px; color: var(--text-muted);">+${order.items.length - 3} more items</div>` : ''}
            </div>
            <div class="order-total">
                <span>Total</span>
                <strong>${order.totals?.total || '¥0'}</strong>
            </div>
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <a href="track-order.html?order=${order.orderNumber}" class="btn btn-secondary btn-small">Track Order</a>
                <a href="order-success.html?order=${order.orderNumber}" class="btn btn-secondary btn-small">View Details</a>
            </div>
        </div>
    `).join('');
}

// Render wishlist
function renderWishlist() {
    const container = document.getElementById('wishlistList');
    if (!container) return;

    if (wishlist.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 40px;">Your wishlist is empty.</p>';
        return;
    }

    container.innerHTML = wishlist.map(item => `
        <div class="wishlist-item">
            <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name}">
            <div class="wishlist-item-details">
                <h4>${item.name}</h4>
                <div class="price">¥${item.price}</div>
            </div>
            <div class="wishlist-item-actions">
                <button class="btn btn-primary btn-small" onclick="addToCart(${item.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="btn btn-secondary btn-small" onclick="removeFromWishlist(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Show profile section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.profile-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update sidebar menu
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Save personal information
function savePersonalInfo() {
    if (!currentUser) return;

    currentUser.firstName = document.getElementById('firstName').value;
    currentUser.lastName = document.getElementById('lastName').value;
    currentUser.email = document.getElementById('email').value;
    currentUser.phone = document.getElementById('phone').value;
    currentUser.bio = document.getElementById('bio').value;

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    renderProfile();
    showToast('Profile updated successfully!');
}

// Handle avatar upload
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentUser.avatar = e.target.result;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            document.getElementById('profileAvatar').innerHTML = `<img src="${e.target.result}" alt="Profile Avatar">`;
            showToast('Profile picture updated!');
        };
        reader.readAsDataURL(file);
    }
}

// Address Modal Functions
function showAddressModal() {
    document.getElementById('addressModal').classList.add('show');
}

function closeAddressModal() {
    document.getElementById('addressModal').classList.remove('show');
    document.getElementById('addressForm').reset();
}

// Handle address form submission
document.getElementById('addressForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const newAddress = {
        firstName: document.getElementById('addrFirstName').value,
        lastName: document.getElementById('addrLastName').value,
        address: document.getElementById('addrLine1').value,
        apartment: document.getElementById('addrLine2').value,
        city: document.getElementById('addrCity').value,
        state: document.getElementById('addrState').value,
        zip: document.getElementById('addrZip').value,
        country: document.getElementById('addrCountry').value,
        phone: document.getElementById('addrPhone').value,
        isDefault: document.getElementById('addrDefault').checked
    };

    // If setting as default, remove default from others
    if (newAddress.isDefault) {
        addresses.forEach(addr => addr.isDefault = false);
    }

    addresses.push(newAddress);
    localStorage.setItem('addresses', JSON.stringify(addresses));
    renderAddresses();
    closeAddressModal();
    showToast('Address saved successfully!');
});

function editAddress(index) {
    const addr = addresses[index];
    document.getElementById('addrFirstName').value = addr.firstName;
    document.getElementById('addrLastName').value = addr.lastName;
    document.getElementById('addrLine1').value = addr.address;
    document.getElementById('addrLine2').value = addr.apartment || '';
    document.getElementById('addrCity').value = addr.city;
    document.getElementById('addrState').value = addr.state;
    document.getElementById('addrZip').value = addr.zip;
    document.getElementById('addrCountry').value = addr.country;
    document.getElementById('addrPhone').value = addr.phone;
    document.getElementById('addrDefault').checked = addr.isDefault;

    // Remove old address and show modal
    addresses.splice(index, 1);
    showAddressModal();
}

function deleteAddress(index) {
    if (confirm('Are you sure you want to delete this address?')) {
        addresses.splice(index, 1);
        localStorage.setItem('addresses', JSON.stringify(addresses));
        renderAddresses();
        showToast('Address deleted successfully!');
    }
}

function setDefaultAddress(index) {
    addresses.forEach((addr, i) => {
        addr.isDefault = (i === index);
    });
    localStorage.setItem('addresses', JSON.stringify(addresses));
    renderAddresses();
    showToast('Default address updated!');
}

// Card Modal Functions
function showCardModal() {
    document.getElementById('cardModal').classList.add('show');
}

function closeCardModal() {
    document.getElementById('cardModal').classList.remove('show');
    document.getElementById('cardForm').reset();
}

// Handle card form submission
document.getElementById('cardForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardType = detectCardType(cardNumber);

    const newCard = {
        number: cardNumber,
        last4: cardNumber.slice(-4),
        name: document.getElementById('cardName').value,
        expiry: document.getElementById('cardExpiry').value,
        cvv: document.getElementById('cardCvv').value,
        type: cardType,
        isDefault: document.getElementById('cardDefault').checked
    };

    // If setting as default, remove default from others
    if (newCard.isDefault) {
        cards.forEach(card => card.isDefault = false);
    }

    cards.push(newCard);
    localStorage.setItem('cards', JSON.stringify(cards));
    renderCards();
    closeCardModal();
    showToast('Card saved successfully!');
});

function detectCardType(number) {
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5')) return 'Mastercard';
    if (number.startsWith('3')) return 'American Express';
    return 'Credit Card';
}

function editCard(index) {
    const card = cards[index];
    document.getElementById('cardNumber').value = card.number.replace(/(\d{4})/g, '$1 ').trim();
    document.getElementById('cardName').value = card.name;
    document.getElementById('cardExpiry').value = card.expiry;
    document.getElementById('cardCvv').value = card.cvv;
    document.getElementById('cardDefault').checked = card.isDefault;

    // Remove old card and show modal
    cards.splice(index, 1);
    showCardModal();
}

function deleteCard(index) {
    if (confirm('Are you sure you want to delete this card?')) {
        cards.splice(index, 1);
        localStorage.setItem('cards', JSON.stringify(cards));
        renderCards();
        showToast('Card deleted successfully!');
    }
}

function setDefaultCard(index) {
    cards.forEach((card, i) => {
        card.isDefault = (i === index);
    });
    localStorage.setItem('cards', JSON.stringify(cards));
    renderCards();
    showToast('Default card updated!');
}

// Filter orders
function filterOrders() {
    const filter = document.getElementById('orderFilter').value;
    renderOrders(filter);
}

// Change password
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        showToast('Please fill in all password fields');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match');
        return;
    }

    if (newPassword.length < 6) {
        showToast('Password must be at least 6 characters');
        return;
    }

    // In production, this would verify current password with backend
    currentUser.password = newPassword;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    document.getElementById('passwordForm').reset();
    showToast('Password updated successfully!');
}

// Toggle notification preference
function togglePreference(element) {
    element.classList.toggle('active');
    showToast('Preference updated!');
}

// Confirm delete account
function confirmDeleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        if (confirm('This will permanently delete all your data including orders, addresses, and payment methods. Continue?')) {
            // Delete user data
            localStorage.removeItem('currentUser');
            localStorage.removeItem('addresses');
            localStorage.removeItem('cards');
            localStorage.removeItem('orders');
            localStorage.removeItem('wishlist');
            
            showToast('Account deleted successfully');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }
}

// Helper functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getCountryName(code) {
    const countries = {
        'CN': 'China',
        'US': 'United States',
        'UK': 'United Kingdom',
        'JP': 'Japan',
        'KR': 'South Korea',
        'SG': 'Singapore',
        'AU': 'Australia'
    };
    return countries[code] || code;
}

// Update auth links in header
function updateAuthLinks() {
    const authLinks = document.getElementById('authLinks');
    if (authLinks && currentUser) {
        authLinks.innerHTML = `
            <span style="color: rgba(255,255,255,0.9); margin-right: 15px;">Hello, ${currentUser.firstName || 'User'}</span>
            <a href="profile.html" class="top-link">Profile</a>
            <a href="#" class="top-link" onclick="logout(); return false;">Logout</a>
        `;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 15px 25px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-md);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
