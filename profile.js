// Profile Page JavaScript - Mobile & Desktop Functionality

// ========== STATE MANAGEMENT ==========
let currentUser = null;
let userData = {};
let activeSection = 'dashboard';

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
});

function initializeProfile() {
    // Check if user is logged in
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }
    
    // Load user data
    loadUserData();
    
    // Update UI
    updateProfileUI();
    
    // Load section data
    loadDashboardData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Update cart/wishlist counts
    updateCartCount();
    updateWishlistCount();
    
    // Initialize interface mode (from global script.js)
    if (typeof initializeInterfaceMode === 'function') {
        initializeInterfaceMode();
    }
}

// Note: Interface mode functions are in global script.js
// setInterfaceMode(), toggleInterfaceMode(), etc.

function setInterfaceMode(mode, save = true) {
    currentInterfaceMode = mode;
    
    // Update settings page buttons
    const desktopBtn = document.getElementById('desktopModeBtn');
    const mobileBtn = document.getElementById('mobileModeBtn');
    const modeIndicator = document.getElementById('modeIndicator');
    
    if (desktopBtn && mobileBtn) {
        if (mode === 'desktop') {
            desktopBtn.classList.add('active');
            mobileBtn.classList.remove('active');
        } else {
            desktopBtn.classList.remove('active');
            mobileBtn.classList.add('active');
        }
    }
    
    // Update indicator text in settings
    if (modeIndicator) {
        const currentModeSpan = modeIndicator.querySelector('.current-mode');
        const modeHintSpan = modeIndicator.querySelector('.mode-hint');
        
        if (currentModeSpan) {
            currentModeSpan.textContent = `Current: ${mode === 'desktop' ? 'Desktop' : 'Mobile'} Mode`;
        }
        if (modeHintSpan) {
            modeHintSpan.textContent = mode === 'desktop' 
                ? 'Optimized for large screens with sidebar navigation'
                : 'Optimized for touch with mobile-style interface';
        }
    }
    
    // Update header compact button
    const headerModeIcon = document.getElementById('headerModeIcon');
    const headerModeLabel = document.getElementById('headerModeLabel');
    const headerModeToggle = document.getElementById('headerModeToggle');
    
    if (headerModeIcon && headerModeLabel && headerModeToggle) {
        if (mode === 'mobile') {
            headerModeIcon.className = 'fas fa-mobile-alt';
            headerModeLabel.textContent = 'Mob';
            headerModeToggle.classList.add('active-mobile-mode');
            headerModeToggle.title = 'Switch to Desktop Mode';
        } else {
            headerModeIcon.className = 'fas fa-desktop';
            headerModeLabel.textContent = 'Dek';
            headerModeToggle.classList.remove('active-mobile-mode');
            headerModeToggle.title = 'Switch to Mobile Mode';
        }
        
        // Add pulse animation
        headerModeToggle.classList.add('pulse');
        setTimeout(() => {
            headerModeToggle.classList.remove('pulse');
        }, 400);
    }
    
    // Apply/remove mobile simulation class
    if (mode === 'mobile') {
        document.body.classList.add('mobile-simulated');
        // Reset any active section to show menu grid
        const contentArea = document.querySelector('.profile-content-area');
        const mobileMenu = document.getElementById('mobileMenuGrid');
        
        if (contentArea) {
            contentArea.classList.remove('active-mobile');
            // Ensure content area is visible in desktop mode inside mobile-simulated
            if (window.innerWidth > 768) {
                contentArea.style.display = 'block';
            }
        }
        if (mobileMenu) mobileMenu.style.display = 'grid';
        
        // Add back button if not exists
        addMobileBackButton();
        
        showToast('Mobile interface mode activated');
    } else {
        document.body.classList.remove('mobile-simulated');
        
        // Reset all mobile-specific states
        const contentArea = document.querySelector('.profile-content-area');
        const mobileMenu = document.getElementById('mobileMenuGrid');
        
        if (contentArea) {
            contentArea.classList.remove('active-mobile');
            contentArea.style.display = 'block';
        }
        if (mobileMenu) mobileMenu.style.display = 'none';
        
        // Restore sidebar visibility on desktop
        const sidebar = document.querySelector('.profile-sidebar');
        if (sidebar && window.innerWidth > 768) {
            sidebar.style.display = 'block';
        }
        
        showToast('Desktop interface mode activated');
    }
    
    // Save preference
    if (save) {
        localStorage.setItem('interfaceMode', mode);
    }
    
    // Trigger resize to adjust layout
    window.dispatchEvent(new Event('resize'));
}

function toggleInterfaceMode() {
    const newMode = currentInterfaceMode === 'desktop' ? 'mobile' : 'desktop';
    setInterfaceMode(newMode);
}

// ========== USER DATA MANAGEMENT ==========
function loadUserData() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === currentUser.id);
    
    if (user) {
        userData = {
            ...user,
            orders: JSON.parse(localStorage.getItem(`orders_${currentUser.id}`)) || [],
            addresses: JSON.parse(localStorage.getItem(`addresses_${currentUser.id}`)) || [],
            paymentMethods: JSON.parse(localStorage.getItem(`payment_${currentUser.id}`)) || [],
            wishlist: JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`)) || [],
            stats: {
                totalOrders: 0,
                totalSpent: 0,
                totalSavings: 0,
                rewardPoints: user.rewardPoints || 0
            }
        };
        
        // Calculate stats
        calculateUserStats();
    }
}

function calculateUserStats() {
    if (userData.orders) {
        userData.stats.totalOrders = userData.orders.length;
        userData.stats.totalSpent = userData.orders.reduce((sum, order) => sum + (order.total || 0), 0);
        userData.stats.totalSavings = userData.orders.reduce((sum, order) => sum + (order.discount || 0), 0);
    }
}

function saveUserData() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData };
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Save specific data
    localStorage.setItem(`orders_${currentUser.id}`, JSON.stringify(userData.orders || []));
    localStorage.setItem(`addresses_${currentUser.id}`, JSON.stringify(userData.addresses || []));
    localStorage.setItem(`payment_${currentUser.id}`, JSON.stringify(userData.paymentMethods || []));
    localStorage.setItem(`wishlist_${currentUser.id}`, JSON.stringify(userData.wishlist || []));
}

// ========== UI UPDATES ==========
function updateProfileUI() {
    if (!userData) return;
    
    const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'User';
    const initials = getInitials(fullName);
    const email = userData.email || 'user@email.com';
    
    // Mobile header
    document.getElementById('mobileUserName').textContent = fullName;
    document.getElementById('mobileUserEmail').textContent = email;
    document.getElementById('mobileAvatarInitials').textContent = initials;
    
    // Desktop header
    document.getElementById('desktopUserName').textContent = fullName;
    document.getElementById('desktopUserEmail').textContent = email;
    document.getElementById('desktopAvatarInitials').textContent = initials;
    
    // Account badge
    const badgeText = userData.userType === 'business' ? 'B2B Business' : 'Regular Customer';
    const badgeElement = document.getElementById('mobileAccountBadge');
    if (badgeElement) badgeElement.textContent = badgeText;
    
    const desktopBadge = document.getElementById('desktopAccountBadge');
    if (desktopBadge) desktopBadge.textContent = badgeText;
    
    // Settings form
    document.getElementById('firstName').value = userData.firstName || '';
    document.getElementById('lastName').value = userData.lastName || '';
    document.getElementById('email').value = userData.email || '';
    document.getElementById('phone').value = userData.phone || '';
    
    // Update nav badges
    updateNavBadges();
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function updateNavBadges() {
    const orderBadge = document.getElementById('orderBadge');
    const wishlistBadge = document.getElementById('wishlistBadge');
    
    if (orderBadge) {
        const pendingOrders = userData.orders?.filter(o => o.status === 'pending').length || 0;
        orderBadge.textContent = pendingOrders;
        orderBadge.style.display = pendingOrders > 0 ? 'block' : 'none';
    }
    
    if (wishlistBadge) {
        const wishlistCount = userData.wishlist?.length || 0;
        wishlistBadge.textContent = wishlistCount;
        wishlistBadge.style.display = wishlistCount > 0 ? 'block' : 'none';
    }
}

// ========== SECTION NAVIGATION ==========
function showSection(sectionName) {
    activeSection = sectionName;
    const isMobileSimulated = document.body.classList.contains('mobile-simulated');
    
    // Desktop: Update sidebar active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        }
    });
    
    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const activeSectionElement = document.getElementById(`${sectionName}-section`);
    if (activeSectionElement) {
        activeSectionElement.classList.add('active');
    }
    
    // Mobile or Simulated Mobile: Show content area as overlay
    if (window.innerWidth <= 768 || isMobileSimulated) {
        const contentArea = document.querySelector('.profile-content-area');
        if (contentArea) {
            contentArea.classList.add('active-mobile');
            // For simulated mode on desktop, ensure content area is visible
            if (isMobileSimulated && window.innerWidth > 768) {
                contentArea.style.display = 'block';
            }
        }
        
        // Hide mobile menu grid
        const mobileMenu = document.getElementById('mobileMenuGrid');
        if (mobileMenu) mobileMenu.style.display = 'none';
        
        // Add back button for simulated mode
        if (isMobileSimulated && window.innerWidth > 768) {
            addMobileBackButton();
        }
    }
    
    // Load section data
    loadSectionData(sectionName);
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function loadSectionData(sectionName) {
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'orders':
            loadOrdersData();
            break;
        case 'addresses':
            loadAddressesData();
            break;
        case 'payment':
            loadPaymentData();
            break;
        case 'wishlist':
            loadWishlistData();
            break;
        case 'settings':
            // Settings form is pre-filled
            break;
        case 'support':
            // Support section is static
            break;
    }
}

function goBackMobile() {
    const contentArea = document.querySelector('.profile-content-area');
    const isMobileSimulated = document.body.classList.contains('mobile-simulated');
    
    if (contentArea) {
        contentArea.classList.remove('active-mobile');
        
        // In simulated mobile mode on desktop, show the menu grid
        if (isMobileSimulated && window.innerWidth > 768) {
            contentArea.style.display = 'none';
        }
    }
    
    const mobileMenu = document.getElementById('mobileMenuGrid');
    if (mobileMenu) {
        mobileMenu.style.display = 'grid';
    }
    
    window.scrollTo(0, 0);
}

// ========== DASHBOARD ==========
function loadDashboardData() {
    // Update stats
    document.getElementById('statOrders').textContent = userData.stats.totalOrders;
    document.getElementById('statWishlist').textContent = userData.wishlist?.length || 0;
    document.getElementById('statPoints').textContent = userData.stats.rewardPoints;
    document.getElementById('statSavings').textContent = `¥${userData.stats.totalSavings.toFixed(0)}`;
    
    // Load recent orders (last 3)
    const recentOrdersList = document.getElementById('recentOrdersList');
    if (recentOrdersList) {
        const recentOrders = userData.orders?.slice(0, 3) || [];
        
        if (recentOrders.length === 0) {
            recentOrdersList.innerHTML = '<p class="empty-state">No recent orders</p>';
        } else {
            recentOrdersList.innerHTML = recentOrders.map(order => `
                <div class="order-card">
                    <div class="order-info">
                        <h4>Order #${order.id || '0000'}</h4>
                        <p class="order-meta">${formatDate(order.date)} • ${order.items?.length || 0} items</p>
                    </div>
                    <span class="order-status status-${order.status}">${capitalize(order.status)}</span>
                </div>
            `).join('');
        }
    }
}

// ========== ORDERS ==========
let currentOrderFilter = 'all';

function loadOrdersData() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    let orders = userData.orders || [];
    
    // Apply filter
    if (currentOrderFilter !== 'all') {
        orders = orders.filter(o => o.status === currentOrderFilter);
    }
    
    // Apply search
    const searchTerm = document.getElementById('orderSearch')?.value?.toLowerCase() || '';
    if (searchTerm) {
        orders = orders.filter(o => 
            (o.id || '').toLowerCase().includes(searchTerm) ||
            (o.items || []).some(item => (item.name || '').toLowerCase().includes(searchTerm))
        );
    }
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="empty-state">No orders found</p>';
    } else {
        ordersList.innerHTML = orders.map(order => createOrderCard(order)).join('');
    }
}

function createOrderCard(order) {
    return `
        <div class="order-card">
            <div class="order-info">
                <h4>Order #${order.id || '0000'}</h4>
                <p class="order-meta">${formatDate(order.date)} • ${order.items?.length || 0} items • ¥${order.total?.toFixed(2) || '0.00'}</p>
            </div>
            <div class="order-actions">
                <span class="order-status status-${order.status}">${capitalize(order.status)}</span>
                <button class="btn btn-sm btn-outline" onclick="viewOrder('${order.id}')">View</button>
            </div>
        </div>
    `;
}

function filterOrders() {
    currentOrderFilter = document.getElementById('orderFilter')?.value || 'all';
    loadOrdersData();
}

function searchOrders() {
    loadOrdersData();
}

function viewOrder(orderId) {
    showToast(`Viewing order #${orderId}`);
    // Navigate to order details or show modal
}

// ========== ADDRESSES ==========
function loadAddressesData() {
    const addressesGrid = document.getElementById('addressesGrid');
    if (!addressesGrid) return;
    
    const addresses = userData.addresses || [];
    
    if (addresses.length === 0) {
        addressesGrid.innerHTML = '<p class="empty-state">No saved addresses. Add your first address!</p>';
    } else {
        addressesGrid.innerHTML = addresses.map((addr, index) => createAddressCard(addr, index)).join('');
    }
}

function createAddressCard(address, index) {
    const isDefault = address.isDefault;
    
    return `
        <div class="address-card ${isDefault ? 'default' : ''}">
            ${isDefault ? '<span class="address-label">Default</span>' : `<span class="address-label">${address.label || 'Address'}</span>`}
            <p class="address-name">${address.name}</p>
            <p class="address-text">${address.street}, ${address.city}, ${address.state} ${address.zip}</p>
            <p class="address-phone">${address.phone}</p>
            <div class="address-actions">
                <button class="btn-edit" onclick="editAddress(${index})">Edit</button>
                <button class="btn-delete" onclick="deleteAddress(${index})">Delete</button>
                ${!isDefault ? `<button class="btn-edit" onclick="setDefaultAddress(${index})">Set Default</button>` : ''}
            </div>
        </div>
    `;
}

function openAddressModal() {
    showToast('Add address modal - implement with your modal system');
}

function editAddress(index) {
    showToast(`Editing address ${index + 1}`);
}

function deleteAddress(index) {
    if (confirm('Are you sure you want to delete this address?')) {
        userData.addresses.splice(index, 1);
        saveUserData();
        loadAddressesData();
        showToast('Address deleted');
    }
}

function setDefaultAddress(index) {
    userData.addresses.forEach((addr, i) => {
        addr.isDefault = i === index;
    });
    saveUserData();
    loadAddressesData();
    showToast('Default address updated');
}

// ========== PAYMENT METHODS ==========
function loadPaymentData() {
    const paymentList = document.getElementById('paymentMethodsList');
    if (!paymentList) return;
    
    const methods = userData.paymentMethods || [];
    
    if (methods.length === 0) {
        paymentList.innerHTML = '<p class="empty-state">No saved payment methods. Add a card for faster checkout!</p>';
    } else {
        paymentList.innerHTML = methods.map((method, index) => createPaymentCard(method, index)).join('');
    }
}

function createPaymentCard(method, index) {
    const isDefault = method.isDefault;
    const cardIcon = getCardIcon(method.type);
    
    return `
        <div class="payment-card ${isDefault ? 'default' : ''}">
            <div class="card-icon">${cardIcon}</div>
            <div class="card-info">
                <p class="card-number">**** **** **** ${method.last4}</p>
                <p class="card-expiry">Expires ${method.expiry}</p>
            </div>
            ${isDefault ? '<span class="card-default-badge">Default</span>' : ''}
            <div class="address-actions">
                ${!isDefault ? `<button class="btn-edit" onclick="setDefaultPayment(${index})">Set Default</button>` : ''}
                <button class="btn-delete" onclick="deletePayment(${index})">Remove</button>
            </div>
        </div>
    `;
}

function getCardIcon(type) {
    const icons = {
        visa: '<i class="fab fa-cc-visa"></i>',
        mastercard: '<i class="fab fa-cc-mastercard"></i>',
        amex: '<i class="fab fa-cc-amex"></i>',
        default: '<i class="fas fa-credit-card"></i>'
    };
    return icons[type?.toLowerCase()] || icons.default;
}

function openPaymentModal() {
    showToast('Add payment modal - implement with your modal system');
}

function setDefaultPayment(index) {
    userData.paymentMethods.forEach((method, i) => {
        method.isDefault = i === index;
    });
    saveUserData();
    loadPaymentData();
    showToast('Default payment method updated');
}

function deletePayment(index) {
    if (confirm('Are you sure you want to remove this payment method?')) {
        userData.paymentMethods.splice(index, 1);
        saveUserData();
        loadPaymentData();
        showToast('Payment method removed');
    }
}

// ========== WISHLIST ==========
function loadWishlistData() {
    const wishlistGrid = document.getElementById('wishlistGrid');
    if (!wishlistGrid) return;
    
    const wishlist = userData.wishlist || [];
    
    if (wishlist.length === 0) {
        wishlistGrid.innerHTML = '<p class="empty-state">Your wishlist is empty. Start adding products you love!</p>';
    } else {
        wishlistGrid.innerHTML = wishlist.map((item, index) => createWishlistCard(item, index)).join('');
    }
}

function createWishlistCard(item, index) {
    return `
        <div class="wishlist-item">
            <div class="wishlist-image">
                <img src="${item.image || 'placeholder.jpg'}" alt="${item.name}">
            </div>
            <div class="wishlist-details">
                <h4 class="wishlist-name">${item.name}</h4>
                <p class="wishlist-price">¥${item.price?.toFixed(2) || '0.00'}</p>
                <div class="wishlist-actions">
                    <button class="btn-add-cart" onclick="addToCartFromWishlist(${index})">Add to Cart</button>
                    <button class="btn-remove" onclick="removeFromWishlist(${index})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
    `;
}

function addToCartFromWishlist(index) {
    const item = userData.wishlist[index];
    if (item) {
        addToCart(item);
        showToast('Added to cart');
    }
}

function removeFromWishlist(index) {
    userData.wishlist.splice(index, 1);
    saveUserData();
    loadWishlistData();
    updateWishlistCount();
    updateNavBadges();
    showToast('Removed from wishlist');
}

// ========== SETTINGS ==========
function setupEventListeners() {
    // Personal info form
    const personalForm = document.getElementById('personalInfoForm');
    if (personalForm) {
        personalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            savePersonalInfo();
        });
    }
    
    // Password form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            changePassword();
        });
    }
    
    // Password strength meter
    const newPassword = document.getElementById('newPassword');
    if (newPassword) {
        newPassword.addEventListener('input', checkPasswordStrength);
    }
    
    // Support form
    const supportForm = document.getElementById('supportForm');
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitSupportTicket();
        });
    }
    
    // Mobile back button (add dynamically for mobile)
    if (window.innerWidth <= 768) {
        addMobileBackButton();
    }
}

function savePersonalInfo() {
    userData.firstName = document.getElementById('firstName').value;
    userData.lastName = document.getElementById('lastName').value;
    userData.email = document.getElementById('email').value;
    userData.phone = document.getElementById('phone').value;
    
    saveUserData();
    updateProfileUI();
    showToast('Personal information saved');
}

function changePassword() {
    const currentPass = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    
    // Validate
    if (newPass !== confirmPass) {
        showToast('Passwords do not match');
        return;
    }
    
    if (newPass.length < 8) {
        showToast('Password must be at least 8 characters');
        return;
    }
    
    // In real app, verify current password with server
    showToast('Password updated successfully');
    document.getElementById('passwordForm').reset();
}

function checkPasswordStrength() {
    const password = document.getElementById('newPassword').value;
    const strengthBar = document.getElementById('passwordStrength');
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    const colors = ['#e0e0e0', '#ff4d4d', '#ffa64d', '#ffff4d', '#4dff4d'];
    const widths = ['0%', '25%', '50%', '75%', '100%'];
    
    if (strengthBar) {
        strengthBar.style.background = colors[strength];
        strengthBar.style.width = widths[strength];
    }
}

function confirmDeleteAccount() {
    if (confirm('WARNING: This will permanently delete your account and all data. This action cannot be undone. Are you absolutely sure?')) {
        if (prompt('Type "DELETE" to confirm:') === 'DELETE') {
            // Delete account
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const filteredUsers = users.filter(u => u.id !== currentUser.id);
            localStorage.setItem('users', JSON.stringify(filteredUsers));
            
            // Clear user data
            localStorage.removeItem('currentUser');
            localStorage.removeItem(`orders_${currentUser.id}`);
            localStorage.removeItem(`addresses_${currentUser.id}`);
            localStorage.removeItem(`payment_${currentUser.id}`);
            localStorage.removeItem(`wishlist_${currentUser.id}`);
            
            showToast('Account deleted');
            window.location.href = 'index.html';
        }
    }
}

function submitSupportTicket() {
    const issueType = document.getElementById('issueType').value;
    const message = document.getElementById('supportMessage').value;
    
    // In real app, send to server
    showToast('Support ticket submitted. We will contact you soon!');
    document.getElementById('supportForm').reset();
}

// ========== UTILITY FUNCTIONS ==========
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

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

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'block' : 'none';
    });
}

function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUser?.id}`)) || [];
    const count = wishlist.length;
    
    const wishlistCountElements = document.querySelectorAll('.wishlist-count');
    wishlistCountElements.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'block' : 'none';
    });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addMobileBackButton() {
    const contentArea = document.querySelector('.profile-content-area');
    if (contentArea && !contentArea.querySelector('.mobile-back-btn')) {
        const backBtn = document.createElement('button');
        backBtn.className = 'mobile-back-btn';
        backBtn.innerHTML = '<i class="fas fa-arrow-left"></i>';
        backBtn.onclick = goBackMobile;
        contentArea.appendChild(backBtn);
    }
}

function uploadAvatar() {
    showToast('Avatar upload - implement with file input');
}

function enableEditMode() {
    showSection('settings');
    showToast('Edit mode enabled');
}

// ========== RESPONSIVE HANDLING ==========
window.addEventListener('resize', function() {
    // Check if mobile mode is forced via interface mode setting
    const isMobileSimulated = document.body.classList.contains('mobile-simulated');
    
    if (window.innerWidth > 768 && !isMobileSimulated) {
        // Desktop: Show both sidebar and content
        const contentArea = document.querySelector('.profile-content-area');
        const mobileMenu = document.getElementById('mobileMenuGrid');
        
        if (contentArea) {
            contentArea.classList.remove('active-mobile');
            contentArea.style.display = 'block';
        }
        if (mobileMenu) mobileMenu.style.display = 'none';
    } else if (window.innerWidth <= 768 && !isMobileSimulated) {
        // Mobile: Show menu grid by default (natural mobile)
        const mobileMenu = document.getElementById('mobileMenuGrid');
        const contentArea = document.querySelector('.profile-content-area');
        
        if (mobileMenu) mobileMenu.style.display = 'grid';
        if (contentArea && !contentArea.classList.contains('active-mobile')) {
            contentArea.style.display = 'none';
        }
        
        // Add back button
        addMobileBackButton();
    }
    // Note: When isMobileSimulated is true, the CSS handles everything
});

// Initialize on load
if (window.innerWidth <= 768) {
    addMobileBackButton();
}
