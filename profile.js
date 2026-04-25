// Profile Page JavaScript

// State Management
let currentUser = null;
let addresses = [];
let cards = [];
let orders = [];
let wishlist = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadUserData();
    loadMockDataIfEmpty(); // Ensure the "Advanced" look has content

    // Initial Render
    renderProfile();
    renderAddresses();
    renderCards();
    renderOrders();
    renderWishlist();

    // Global event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });

    // Handle ESC key to close modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) closeModal(openModal.id);
        }
    });
}

// Load user data from Auth system
function loadUserData() {
    currentUser = window.Auth ? window.Auth.getCurrentUser() : JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));

    if (!currentUser) {
        // Redirect if not logged in
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'auth.html';
    }
}

function loadMockDataIfEmpty() {
    // Load existing or set defaults
    addresses = JSON.parse(localStorage.getItem('addresses')) || [
        {
            firstName: 'Alex',
            lastName: 'Chen',
            address: '123 High-Tech Park, Nanshan District',
            city: 'Shenzhen',
            state: 'Guangdong',
            zip: '518057',
            country: 'CN',
            phone: '+86 138 0013 8000',
            isDefault: true
        }
    ];

    cards = JSON.parse(localStorage.getItem('cards')) || [
        {
            type: 'Visa',
            last4: '8842',
            expiry: '12/26',
            name: 'Alex Chen',
            isDefault: true
        }
    ];

    orders = JSON.parse(localStorage.getItem('orders')) || [
        {
            orderNumber: 'ORD-2024-9912',
            date: '2024-03-10T14:20:00Z',
            status: 'delivered',
            items: [
                { name: 'iPhone 15 Pro Max', quantity: 20, price: 6499, image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=200' },
                { name: 'MacBook Pro M3', quantity: 5, price: 9499, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200' }
            ],
            totals: { total: '¥177,475' }
        },
        {
            orderNumber: 'ORD-2024-8850',
            date: '2024-02-15T09:10:00Z',
            status: 'shipped',
            items: [
                { name: 'Sony WH-1000XM5', quantity: 50, price: 2199, image: 'https://images.unsplash.com/photo-1644982647708-0b2cc3d910b7?w=200' }
            ],
            totals: { total: '¥109,950' }
        }
    ];

    wishlist = JSON.parse(localStorage.getItem('wishlist')) || [
        { id: 7, name: 'RTX 4090 Graphics Card', price: 10899, image: 'https://images.unsplash.com/photo-1624701928517-44c8ac49d93c?w=200' }
    ];

    localStorage.setItem('addresses', JSON.stringify(addresses));
    localStorage.setItem('cards', JSON.stringify(cards));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Render profile information
function renderProfile() {
    if (!currentUser) return;

    // Hero Section
    const fullName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'Valued Member';
    document.getElementById('profileName').textContent = fullName;
    document.getElementById('profileEmail').textContent = currentUser.email || 'No email set';
    
    // Avatar
    const initials = `${(currentUser.firstName || 'U')[0]}${(currentUser.lastName || '')[0]}`.toUpperCase();
    document.getElementById('avatarInitials').textContent = initials;
    
    const avatarContainer = document.getElementById('profileAvatar');
    if (currentUser.avatar) {
        avatarContainer.innerHTML = `<img src="${currentUser.avatar}" alt="Profile">`;
    } else {
        avatarContainer.innerHTML = `<span id="avatarInitials">${initials}</span>`;
    }

    // Stats Bar
    document.getElementById('statOrders').textContent = orders.length;
    document.getElementById('statWishlist').textContent = wishlist.length;
    
    const totalSpent = orders.reduce((sum, order) => {
        const val = parseInt(order.totals?.total?.replace(/[^\d]/g, '') || 0);
        return sum + val;
    }, 0);
    document.getElementById('statPoints').textContent = Math.floor(totalSpent / 500);

    // Form pre-fill
    if (document.getElementById('firstName')) document.getElementById('firstName').value = currentUser.firstName || '';
    if (document.getElementById('lastName')) document.getElementById('lastName').value = currentUser.lastName || '';
    if (document.getElementById('email')) document.getElementById('email').value = currentUser.email || '';
    if (document.getElementById('phone')) document.getElementById('phone').value = currentUser.phone || '';
    if (document.getElementById('bio')) document.getElementById('bio').value = currentUser.bio || '';
}

function renderAddresses() {
    const container = document.getElementById('addressList');
    if (!container) return;

    if (addresses.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No addresses saved yet.</p></div>';
        return;
    }

    container.innerHTML = addresses.map((addr, index) => `
        <div class="address-card ${addr.isDefault ? 'default' : ''}" style="background: #f8f9fa; padding: 15px; border-radius: 15px; margin-bottom: 10px; border: 1px solid ${addr.isDefault ? 'var(--primary)' : '#eee'}">
            <div style="display: flex; justify-content: space-between;">
                <h4 style="margin: 0;">${addr.firstName} ${addr.lastName}</h4>
                ${addr.isDefault ? '<span style="color: var(--primary); font-size: 10px; font-weight: bold; text-transform: uppercase;">Default</span>' : ''}
            </div>
            <p style="font-size: 13px; color: #666; margin: 5px 0;">${addr.address}, ${addr.city}, ${addr.state}</p>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button onclick="deleteAddress(${index})" style="background: none; border: none; color: #f56565; font-size: 12px; cursor: pointer; padding: 0;">Remove</button>
                ${!addr.isDefault ? `<button onclick="setDefaultAddress(${index})" style="background: none; border: none; color: var(--primary); font-size: 12px; cursor: pointer; padding: 0;">Set Default</button>` : ''}
            </div>
        </div>
    `).join('');
}

function renderCards() {
    const container = document.getElementById('cardList');
    if (!container) return;

    if (cards.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No payment methods saved.</p></div>';
        return;
    }

    container.innerHTML = cards.map((card, index) => `
        <div class="card-item ${card.isDefault ? 'default' : ''}" style="background: #f8f9fa; padding: 15px; border-radius: 15px; margin-bottom: 10px; border: 1px solid ${card.isDefault ? 'var(--primary)' : '#eee'}">
            <div style="display: flex; gap: 15px; align-items: center;">
                <i class="fab fa-cc-${card.type.toLowerCase()}" style="font-size: 24px; color: #2d3436;"></i>
                <div style="flex: 1;">
                    <h4 style="margin: 0;">•••• •••• •••• ${card.last4}</h4>
                    <p style="font-size: 12px; color: #666; margin: 2px 0;">Expires ${card.expiry} | ${card.name}</p>
                </div>
                <button onclick="deleteCard(${index})" style="background: none; border: none; color: #f56565; cursor: pointer;"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>
    `).join('');
}

function renderOrders(filter = 'all') {
    const container = document.getElementById('orderList');
    if (!container) return;

    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state" style="text-align: center; padding: 30px;"><i class="fas fa-box-open" style="font-size: 40px; color: #eee; margin-bottom: 15px;"></i><p>No orders found.</p></div>';
        return;
    }

    container.innerHTML = filtered.map(order => `
        <div class="order-item" style="border: 1px solid #eee; border-radius: 15px; padding: 15px; margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f5f5f5; padding-bottom: 10px; margin-bottom: 10px;">
                <div>
                    <span style="font-weight: 700; font-size: 14px;">${order.orderNumber}</span>
                    <p style="margin: 0; font-size: 11px; color: #999;">${new Date(order.date).toLocaleDateString()}</p>
                </div>
                <span class="status-badge" style="background: ${getStatusColor(order.status)}; color: white; padding: 4px 10px; border-radius: 10px; font-size: 10px; font-weight: 700; text-transform: uppercase;">${order.status}</span>
            </div>
            <div class="order-products">
                ${order.items.slice(0, 2).map(item => `
                    <div style="display: flex; gap: 10px; margin-bottom: 8px;">
                        <img src="${item.image}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
                        <div style="flex: 1;">
                            <p style="margin: 0; font-size: 13px; font-weight: 500;">${item.name}</p>
                            <p style="margin: 0; font-size: 11px; color: #666;">Qty: ${item.quantity} × ¥${item.price}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 10px; border-top: 1px solid #f5f5f5;">
                <span style="font-size: 14px; font-weight: 700; color: var(--primary);">${order.totals.total}</span>
                <button onclick="showToast('Loading tracking info...')" style="background: #f0f2f5; border: none; padding: 6px 15px; border-radius: 10px; font-size: 12px; font-weight: 600; cursor: pointer;">Track</button>
            </div>
        </div>
    `).join('');
}

function renderWishlist() {
    const container = document.getElementById('wishlistList');
    if (!container) return;

    if (wishlist.length === 0) {
        container.innerHTML = '<div class="empty-state" style="text-align: center; padding: 30px;"><i class="fas fa-heart" style="font-size: 40px; color: #eee; margin-bottom: 15px;"></i><p>Your wishlist is empty.</p></div>';
        return;
    }

    container.innerHTML = wishlist.map((item, index) => `
        <div style="display: flex; gap: 15px; align-items: center; padding: 12px; border: 1px solid #eee; border-radius: 15px; margin-bottom: 10px;">
            <img src="${item.image}" style="width: 60px; height: 60px; border-radius: 12px; object-fit: cover;">
            <div style="flex: 1;">
                <h4 style="margin: 0; font-size: 14px;">${item.name}</h4>
                <p style="margin: 5px 0 0; font-weight: 700; color: var(--primary);">¥${item.price}</p>
            </div>
            <button onclick="removeFromWishlist(${index})" style="background: none; border: none; color: #999; cursor: pointer;"><i class="fas fa-trash-alt"></i></button>
        </div>
    `).join('');
}

// Actions
function savePersonalInfo() {
    currentUser.firstName = document.getElementById('firstName').value;
    currentUser.lastName = document.getElementById('lastName').value;
    currentUser.email = document.getElementById('email').value;
    currentUser.phone = document.getElementById('phone').value;
    currentUser.bio = document.getElementById('bio').value;

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    renderProfile();
    closeModal('personal-info-modal');
    showToast('Profile updated successfully!');
}

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentUser.avatar = e.target.result;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            renderProfile();
            showToast('Avatar updated!');
        };
        reader.readAsDataURL(file);
    }
}

function deleteAddress(index) {
    if (confirm('Delete this address?')) {
        addresses.splice(index, 1);
        localStorage.setItem('addresses', JSON.stringify(addresses));
        renderAddresses();
    }
}

function setDefaultAddress(index) {
    addresses.forEach((a, i) => a.isDefault = i === index);
    localStorage.setItem('addresses', JSON.stringify(addresses));
    renderAddresses();
}

function deleteCard(index) {
    if (confirm('Remove this card?')) {
        cards.splice(index, 1);
        localStorage.setItem('cards', JSON.stringify(cards));
        renderCards();
    }
}

function removeFromWishlist(index) {
    wishlist.splice(index, 1);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    renderWishlist();
    document.getElementById('statWishlist').textContent = wishlist.length;
}

function changePassword() {
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (!current || !newPass || !confirm) return showToast('Fill all fields');
    if (newPass !== confirm) return showToast('Passwords mismatch');

    showToast('Password updated successfully!');
    document.getElementById('passwordForm').reset();
    closeModal('settings-modal');
}

function togglePreference(el) {
    el.classList.toggle('active');
    showToast('Settings saved');
}

function filterOrders() {
    const val = document.getElementById('orderFilter').value;
    renderOrders(val);
}

function confirmDeleteAccount() {
    if (confirm('ARE YOU ABSOLUTELY SURE? All data will be wiped.')) {
        localStorage.clear();
        showToast('Account deleted. Redirecting...');
        setTimeout(() => window.location.href = 'index.html', 2000);
    }
}

function logout() {
    showToast('Logging out...');
    setTimeout(() => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }, 1000);
}

// UI Helpers
function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('show');
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('show');
}

function getStatusColor(status) {
    switch(status) {
        case 'delivered': return '#4caf50';
        case 'shipped': return '#2196f3';
        case 'processing': return '#ff9800';
        default: return '#9e9e9e';
    }
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
        background: #333; color: white; padding: 12px 25px; border-radius: 20px;
        z-index: 10000; font-size: 14px; font-weight: 600; box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// Window exports
window.openModal = openModal;
window.closeModal = closeModal;
window.savePersonalInfo = savePersonalInfo;
window.handleAvatarUpload = handleAvatarUpload;
window.deleteAddress = deleteAddress;
window.setDefaultAddress = setDefaultAddress;
window.deleteCard = deleteCard;
window.removeFromWishlist = removeFromWishlist;
window.changePassword = changePassword;
window.togglePreference = togglePreference;
window.filterOrders = filterOrders;
window.confirmDeleteAccount = confirmDeleteAccount;
window.logout = logout;
window.addNewAddress = () => showToast('Redirecting to Address Form...');
window.addNewCard = () => showToast('Opening Payment Gateway...');
