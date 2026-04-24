// Product Data
const products = [
    { id: 1, name: 'iPhone 15 Pro Max 256GB', category: 'phones', price: 6499, originalPrice: 7999, rating: 4.9, reviews: 2847, badge: 'bestseller', icon: 'fa-mobile-alt', tab: 'all' },
    { id: 2, name: 'Samsung Galaxy S24 Ultra', category: 'phones', price: 5799, originalPrice: 7299, rating: 4.8, reviews: 1923, badge: 'new', icon: 'fa-mobile-alt', tab: 'trending' },
    { id: 3, name: 'MacBook Pro M3 14-inch', category: 'laptops', price: 9499, originalPrice: 11699, rating: 4.9, reviews: 1456, badge: 'bestseller', icon: 'fa-laptop', tab: 'bestseller' },
    { id: 4, name: 'Dell XPS 15 OLED', category: 'laptops', price: 8699, originalPrice: 10899, rating: 4.7, reviews: 892, badge: '', icon: 'fa-laptop', tab: 'all' },
    { id: 5, name: 'Sony WH-1000XM5 Headphones', category: 'accessories', price: 2199, originalPrice: 2899, rating: 4.8, reviews: 3421, badge: 'bestseller', icon: 'fa-headphones', tab: 'bestseller' },
    { id: 6, name: 'AirPods Pro 2nd Gen', category: 'accessories', price: 1449, originalPrice: 1799, rating: 4.9, reviews: 5678, badge: 'new', icon: 'fa-headphones', tab: 'new' },
    { id: 7, name: 'RTX 4090 Graphics Card', category: 'components', price: 10899, originalPrice: 13699, rating: 4.9, reviews: 567, badge: 'new', icon: 'fa-microchip', tab: 'trending' },
    { id: 8, name: 'AMD Ryzen 9 7950X', category: 'components', price: 3599, originalPrice: 5099, rating: 4.8, reviews: 1234, badge: '', icon: 'fa-microchip', tab: 'all' },
    { id: 9, name: 'PlayStation 5 Console', category: 'gaming', price: 3299, originalPrice: 3699, rating: 4.9, reviews: 8901, badge: 'bestseller', icon: 'fa-gamepad', tab: 'bestseller' },
    { id: 10, name: 'Xbox Series X', category: 'gaming', price: 2899, originalPrice: 3699, rating: 4.8, reviews: 3456, badge: '', icon: 'fa-gamepad', tab: 'all' },
    { id: 11, name: 'LG 65" OLED C3 TV', category: 'home', price: 12299, originalPrice: 16699, rating: 4.9, reviews: 789, badge: 'new', icon: 'fa-tv', tab: 'new' },
    { id: 12, name: 'Samsung 55" QLED 4K', category: 'home', price: 5799, originalPrice: 8699, rating: 4.7, reviews: 1234, badge: '', icon: 'fa-tv', tab: 'all' },
    { id: 13, name: 'iPad Pro 12.9 M2', category: 'phones', price: 7199, originalPrice: 9399, rating: 4.8, reviews: 2341, badge: 'new', icon: 'fa-tablet-alt', tab: 'new' },
    { id: 14, name: 'Samsung Galaxy Tab S9', category: 'phones', price: 4699, originalPrice: 6199, rating: 4.6, reviews: 876, badge: '', icon: 'fa-tablet-alt', tab: 'all' },
    { id: 15, name: 'ASUS ROG Gaming Laptop', category: 'laptops', price: 12999, originalPrice: 15899, rating: 4.8, reviews: 654, badge: 'trending', icon: 'fa-laptop', tab: 'trending' }
];

const flashSaleProducts = [
    { id: 101, name: 'Logitech MX Master 3S', price: 569, originalPrice: 719, rating: 4.9, reviews: 4321, icon: 'fa-mouse' },
    { id: 102, name: 'Keychron K2 Mechanical Keyboard', price: 499, originalPrice: 719, rating: 4.7, reviews: 1234, icon: 'fa-keyboard' },
    { id: 103, name: 'Samsung T7 Portable SSD 1TB', price: 649, originalPrice: 939, rating: 4.8, reviews: 3456, icon: 'fa-hdd' },
    { id: 104, name: 'Anker 737 Power Bank 24000mAh', price: 719, originalPrice: 1079, rating: 4.9, reviews: 5678, icon: 'fa-battery-full' }
];

// State Management
let cart = [];
let currentTab = 'all';
let loadedProducts = 10;

// DOM Elements
const productGrid = document.getElementById('productGrid');
const flashProducts = document.getElementById('flashProducts');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const productModal = document.getElementById('productModal');
const modalBody = document.getElementById('modalBody');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    loadProducts(currentTab);
    loadFlashSaleProducts();
    startCountdown();
    setupEventListeners();
    updateProfileButtonVisibility();
});

// Update profile button visibility based on auth state
function updateProfileButtonVisibility() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const profileBtn = document.getElementById('profileBtn');
    const authLinks = document.getElementById('authLinks');
    
    if (profileBtn) {
        profileBtn.style.display = currentUser ? 'flex' : 'none';
    }
    
    if (authLinks) {
        if (currentUser) {
            authLinks.innerHTML = `
                <span style="color: rgba(255,255,255,0.9); margin-right: 15px;">Hello, ${currentUser.firstName || 'User'}</span>
                <a href="profile.html" class="top-link">Profile</a>
                <a href="#" class="top-link" onclick="logout(); return false;">Logout</a>
            `;
        } else {
            authLinks.innerHTML = `
                <a href="auth.html" class="top-link">Sign In</a>
                <a href="auth.html" class="top-link">Register</a>
            `;
        }
    }
}

// Navigate to profile page
function goToProfile() {
    window.location.href = 'profile.html';
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    updateProfileButtonVisibility();
    showToast('Logged out successfully');
}

// Load Products
function loadProducts(tab) {
    currentTab = tab;
    let filteredProducts = products;
    
    if (tab !== 'all') {
        filteredProducts = products.filter(p => p.tab === tab || p.category === tab);
    }
    
    const displayProducts = filteredProducts.slice(0, loadedProducts);
    renderProducts(displayProducts, productGrid);
}

function loadFlashSaleProducts() {
    renderProducts(flashSaleProducts, flashProducts, true);
}

function renderProducts(productsToRender, container, isFlash = false) {
    // Check which products are in wishlist
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    container.innerHTML = productsToRender.map(product => {
        const inWishlist = wishlist.includes(product.id);
        return `
        <div class="product-card" onclick="openProductDetail(${product.id})">
            ${product.badge ? `<span class="product-badge ${product.badge}">${product.badge === 'bestseller' ? 'Best Seller' : product.badge === 'new' ? 'New' : product.badge}</span>` : ''}
            <div class="product-image">
                <i class="fas ${product.icon}"></i>
                <div class="product-actions">
                    <button class="action-icon" onclick="event.stopPropagation(); addToCart(${product.id})" title="Add to Cart">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="action-icon ${inWishlist ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${product.id}); updateWishlistButton(this, ${product.id})" title="${inWishlist ? 'In Wishlist' : 'Add to Wishlist'}">
                        <i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <button class="action-icon" onclick="event.stopPropagation(); quickView(${product.id})" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${getCategoryName(product.category)}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    ${renderStars(product.rating)}
                    <span>(${product.reviews.toLocaleString()})</span>
                </div>
                <div class="product-price">
                    <span class="price-current">¥${product.price}</span>
                    ${product.originalPrice ? `<span class="price-original">¥${product.originalPrice}</span>` : ''}
                </div>
            </div>
        </div>
    `}).join('');
}

// Update wishlist button visual state after toggle
function updateWishlistButton(button, productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const inWishlist = wishlist.includes(productId);
    
    if (inWishlist) {
        button.classList.add('active');
        button.innerHTML = '<i class="fas fa-heart"></i>';
        button.title = 'In Wishlist';
    } else {
        button.classList.remove('active');
        button.innerHTML = '<i class="far fa-heart"></i>';
        button.title = 'Add to Wishlist';
    }
}

function getCategoryName(category) {
    const categoryNames = {
        'phones': 'Mobile Phones',
        'laptops': 'Laptops',
        'components': 'Components',
        'accessories': 'Accessories',
        'gaming': 'Gaming',
        'home': 'Home Electronics'
    };
    return categoryNames[category] || category;
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Tab Functionality
function setupEventListeners() {
    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            loadProducts(e.target.dataset.tab);
        });
    });

    // Nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const category = item.dataset.category;
            if (category && category !== 'all') {
                filterByCategory(category);
            }
        });
    });

    // Search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function filterByCategory(category) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.tab-btn[data-tab="all"]').classList.add('active');
    
    const filtered = products.filter(p => p.category === category);
    renderProducts(filtered, productGrid);
    
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    
    showToast(`${getCategoryName(category)} products loaded`);
}

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    if (!query) return;
    
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
    );
    
    renderProducts(filtered, productGrid);
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    
    showToast(`Found ${filtered.length} products for "${query}"`);
}

function loadMoreProducts() {
    loadedProducts += 5;
    loadProducts(currentTab);
    showToast('More products loaded');
}

// Cart Functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId) || flashSaleProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    showToast(`${product.name} added to cart`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `¥${total.toFixed(0)}`;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas ${item.icon}"></i>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">¥${item.price}</div>
                    <div class="quantity-control">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <span class="remove-item" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
}

function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Checkout successful! Total: ¥${total.toFixed(0)}`);
    cart = [];
    updateCartUI();
    toggleCart();
}

// Product Modal
function openProductModal(productId) {
    const product = products.find(p => p.id === productId) || flashSaleProducts.find(p => p.id === productId);
    if (!product) return;
    
    modalBody.innerHTML = `
        <div class="modal-image">
            <i class="fas ${product.icon}"></i>
        </div>
        <div class="modal-info">
            <span class="product-category">${getCategoryName(product.category || 'accessories')}</span>
            <h2>${product.name}</h2>
            <div class="product-meta">
                <div class="product-rating">
                    ${renderStars(product.rating)}
                    <span>${product.rating} (${product.reviews.toLocaleString()} reviews)</span>
                </div>
            </div>
            <div class="price">¥${product.price} <span style="font-size: 16px; color: #999; text-decoration: line-through; margin-left: 10px;">¥${product.originalPrice || (product.price * 1.3).toFixed(0)}</span></div>
            <p class="description">
                Experience premium quality with the ${product.name}. This top-rated product offers exceptional 
                performance and reliability. Perfect for both personal and professional use. Order now and enjoy 
                fast shipping with our 30-day money-back guarantee.
            </p>
            <div class="quantity-selector">
                <label>Quantity:</label>
                <div class="quantity-control">
                    <button class="qty-btn" onclick="updateModalQuantity(-1)">-</button>
                    <span id="modalQty">1</span>
                    <button class="qty-btn" onclick="updateModalQuantity(1)">+</button>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary btn-large" onclick="addToCartFromModal(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="btn btn-secondary btn-large" onclick="toggleCart(); closeProductModal();">
                    View Cart
                </button>
            </div>
        </div>
    `;
    
    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

let modalQuantity = 1;

function updateModalQuantity(change) {
    modalQuantity += change;
    if (modalQuantity < 1) modalQuantity = 1;
    const qtyElement = document.getElementById('modalQty');
    if (qtyElement) qtyElement.textContent = modalQuantity;
}

function addToCartFromModal(productId) {
    const product = products.find(p => p.id === productId) || flashSaleProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += modalQuantity;
    } else {
        cart.push({ ...product, quantity: modalQuantity });
    }
    
    updateCartUI();
    closeProductModal();
    showToast(`${modalQuantity} x ${product.name} added to cart`);
    modalQuantity = 1;
}

function closeProductModal() {
    productModal.classList.remove('active');
    document.body.style.overflow = '';
    modalQuantity = 1;
}

function quickView(productId) {
    openProductModal(productId);
}

function toggleWishlist(productId) {
    showToast('Added to wishlist!');
}

// Countdown Timer
function startCountdown() {
    let hours = 4;
    let minutes = 32;
    let seconds = 15;
    
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    setInterval(() => {
        if (seconds > 0) {
            seconds--;
        } else {
            if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else {
                if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else {
                    hours = 24;
                    minutes = 0;
                    seconds = 0;
                }
            }
        }
        
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }, 1000);
}

// Toast Notification
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Mobile Menu
function toggleMobileMenu() {
    const nav = document.getElementById('mainNav');
    nav.classList.toggle('active');
}

// Newsletter
function subscribeNewsletter(e) {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    if (email) {
        showToast('Successfully subscribed!');
        e.target.reset();
    }
}

// Scroll to Products
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Close modals on overlay click
productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
        closeProductModal();
    }
});

// Escape key to close modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProductModal();
        if (cartSidebar.classList.contains('active')) {
            toggleCart();
        }
    }
});

// Wishlist Functions
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index === -1) {
        wishlist.push(productId);
        showToast('Added to wishlist!');
    } else {
        wishlist.splice(index, 1);
        showToast('Removed from wishlist');
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
}

function updateWishlistUI() {
    const count = document.getElementById('wishlistCount');
    if (count) {
        count.textContent = wishlist.length;
    }
}

function goToWishlist() {
    window.location.href = 'wishlist.html';
}

// Update product cards to navigate to detail page
function openProductDetail(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// Initialize wishlist count on load
window.addEventListener('load', updateWishlistUI);

// Check URL parameters for search
window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
        document.getElementById('searchInput').value = searchQuery;
        performSearch();
    }
});

// ============================================
// ANALYTICS & TRACKING
// ============================================

// Google Analytics 4 Tracking (replace GA_MEASUREMENT_ID with your actual ID)
function initAnalytics() {
    // Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID'); // Replace with your GA4 ID
    
    // Track page view
    trackPageView();
    
    // Track user interactions
    trackUserInteractions();
}

// Track page views
function trackPageView() {
    const page = window.location.pathname;
    const title = document.title;
    
    if (window.gtag) {
        gtag('event', 'page_view', {
            page_title: title,
            page_location: window.location.href,
            page_path: page
        });
    }
    
    // Meta Pixel tracking (if available)
    if (window.fbq) {
        fbq('track', 'PageView');
    }
}

// Track user interactions
function trackUserInteractions() {
    // Track add to cart
    const originalAddToCart = window.addToCart;
    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        if (product && window.gtag) {
            gtag('event', 'add_to_cart', {
                currency: 'CNY',
                value: product.price,
                items: [{
                    item_id: product.id.toString(),
                    item_name: product.name,
                    item_category: product.category,
                    price: product.price,
                    quantity: 1
                }]
            });
        }
        if (window.fbq) {
            fbq('track', 'AddToCart', {
                value: product?.price,
                currency: 'CNY'
            });
        }
        return originalAddToCart(productId);
    };
    
    // Track wishlist additions
    const originalToggleWishlist = window.toggleWishlist;
    window.toggleWishlist = function(productId) {
        const product = products.find(p => p.id === productId);
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const isAdding = !wishlist.includes(productId);
        
        if (isAdding && window.gtag) {
            gtag('event', 'add_to_wishlist', {
                currency: 'CNY',
                value: product?.price,
                items: [{
                    item_id: productId.toString(),
                    item_name: product?.name
                }]
            });
        }
        return originalToggleWishlist(productId);
    };
    
    // Track product views
    const originalOpenProductDetail = window.openProductDetail;
    window.openProductDetail = function(productId) {
        const product = products.find(p => p.id === productId);
        if (product && window.gtag) {
            gtag('event', 'view_item', {
                currency: 'CNY',
                value: product.price,
                items: [{
                    item_id: product.id.toString(),
                    item_name: product.name,
                    item_category: product.category,
                    price: product.price
                }]
            });
        }
        return originalOpenProductDetail(productId);
    };
    
    // Track search
    const originalPerformSearch = window.performSearch;
    window.performSearch = function() {
        const query = document.getElementById('searchInput')?.value;
        if (query && window.gtag) {
            gtag('event', 'search', {
                search_term: query
            });
        }
        return originalPerformSearch();
    };
    
    // Track begin checkout
    const originalGoToCheckout = window.goToCheckout;
    if (originalGoToCheckout) {
        window.goToCheckout = function() {
            if (window.gtag) {
                gtag('event', 'begin_checkout', {
                    currency: 'CNY',
                    value: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                    items: cart.map(item => ({
                        item_id: item.id.toString(),
                        item_name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    }))
                });
            }
            return originalGoToCheckout();
        };
    }
}

// Track custom events
function trackEvent(eventName, params = {}) {
    if (window.gtag) {
        gtag('event', eventName, params);
    }
    console.log('Event tracked:', eventName, params);
}

// Performance tracking
function trackPerformance() {
    // Core Web Vitals
    new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (window.gtag) {
                gtag('event', 'web_vitals', {
                    event_category: 'Web Vitals',
                    event_label: entry.name,
                    value: Math.round(entry.value),
                    non_interaction: true
                });
            }
        }
    }).observe({ type: 'web-vitals' });
    
    // Page load time
    window.addEventListener('load', () => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        trackEvent('page_load_time', {
            value: loadTime,
            unit: 'milliseconds'
        });
    });
}

// Initialize analytics on load
window.addEventListener('load', () => {
    initAnalytics();
    trackPerformance();
});

// Export tracking function for global use
window.trackEvent = trackEvent;
