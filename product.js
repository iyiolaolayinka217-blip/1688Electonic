// Product Detail Page JavaScript

// Product data - in production, this would come from an API
const productData = {
    id: 1,
    name: 'iPhone 15 Pro Max 256GB',
    brand: 'Apple',
    category: 'phones',
    sku: 'APL-IPH15PM-256',
    price: 6499,
    originalPrice: 7999,
    rating: 4.9,
    reviews: 2847,
    stock: 150,
    icon: 'fa-mobile-alt',
    moq: 10,
    tieredPricing: { '10-50': 0.95, '51-100': 0.90, '101-500': 0.85, '500+': 0.80 },
    description: 'Experience the future of mobile technology with the iPhone 15 Pro Max. Featuring the revolutionary A17 Pro chip, a stunning Super Retina XDR display, and a pro-grade camera system that captures incredible detail. The titanium design is both lightweight and durable, while the all-day battery keeps you connected longer.',
    shortSpecs: [
        '6.7" Super Retina XDR Display',
        'A17 Pro Chip with 6-core GPU',
        '256GB Internal Storage',
        '48MP Main Camera System',
        'USB-C Connector',
        'Face ID Security'
    ],
    fullSpecs: {
        'Display': '6.7-inch Super Retina XDR OLED',
        'Resolution': '2796 x 1290 pixels, 460 ppi',
        'Processor': 'A17 Pro chip, 6-core CPU',
        'Storage': '256GB',
        'Rear Camera': '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
        'Front Camera': '12MP TrueDepth',
        'Battery': 'Up to 29 hours video playback',
        'OS': 'iOS 17',
        'Connectivity': '5G, Wi-Fi 6E, Bluetooth 5.3',
        'Dimensions': '159.9 x 76.7 x 8.25 mm',
        'Weight': '221 grams',
        'Colors': 'Natural Titanium, Blue Titanium, White Titanium, Black Titanium'
    },
    inBox: ['iPhone 15 Pro Max', 'USB-C Charge Cable', 'Documentation', 'SIM Ejector Tool'],
    images: ['fa-mobile-alt', 'fa-camera', 'fa-battery-full', 'fa-microchip']
};

// State
let currentQuantity = 1;
let currentImage = 0;
let currentRating = 0;
let reviews = [
    {
        id: 1,
        author: 'Michael Chen',
        avatar: 'MC',
        rating: 5,
        date: '2026-04-15',
        verified: true,
        content: 'Absolutely incredible phone! The camera system is phenomenal and the battery life easily lasts me a full day with heavy usage. The titanium build feels premium and lightweight. Highly recommend for anyone looking for the best smartphone experience.'
    },
    {
        id: 2,
        author: 'Sarah Johnson',
        avatar: 'SJ',
        rating: 5,
        date: '2026-04-10',
        verified: true,
        content: 'Upgraded from the 13 Pro and the difference is night and day. The A17 Pro chip handles everything I throw at it, and the 5x optical zoom is perfect for travel photography. Fast shipping from 1688 Mart too!'
    },
    {
        id: 3,
        author: 'David Park',
        avatar: 'DP',
        rating: 4,
        date: '2026-04-05',
        verified: true,
        content: 'Great phone overall. Love the USB-C finally! Only wish it came with a charger in the box. The display is gorgeous and performance is top-notch.'
    }
];

// Initialize product page
window.addEventListener('DOMContentLoaded', () => {
    loadProductData();
    loadRelatedProducts();
    loadRecentlyViewed();
    renderReviews();
    updateWishlistCount();
    
    // Update auth UI
    if (typeof updateUserMenu === 'function') {
        updateUserMenu();
    }
    
    // Add to recently viewed
    addToRecentlyViewed(productData.id);
});

// Load product data into the page
function loadProductData() {
    document.title = `${productData.name} - 1688 Electronic Mart`;
    
    // Breadcrumb
    document.getElementById('breadcrumbCategory').textContent = getCategoryName(productData.category);
    document.getElementById('breadcrumbProduct').textContent = productData.name;
    
    // Product info
    document.getElementById('productBrand').textContent = productData.brand;
    document.getElementById('productName').textContent = productData.name;
    document.getElementById('productSku').textContent = `SKU: ${productData.sku}`;
    
    // Price
    document.getElementById('currentPrice').textContent = `¥${productData.price}`;
    document.getElementById('originalPrice').textContent = `¥${productData.originalPrice}`;
    
    const discount = Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100);
    document.getElementById('discountBadge').textContent = `-${discount}%`;
    
    // Description
    document.getElementById('productDescription').textContent = productData.description;
    
    // Rating
    const ratingHTML = renderStars(productData.rating) + `<span>${productData.rating} (${productData.reviews.toLocaleString()} reviews)</span>`;
    document.getElementById('productRating').innerHTML = ratingHTML;
    
    // Short specs
    const specsList = document.querySelector('.product-specs ul');
    specsList.innerHTML = productData.shortSpecs.map(spec => `
        <li><i class="fas fa-check"></i> ${spec}</li>
    `).join('');
    
    // Stock
    const stockStatus = document.getElementById('stockStatus');
    if (productData.stock > 0) {
        stockStatus.innerHTML = `<i class="fas fa-check-circle"></i> In Stock (${productData.stock} available)`;
        stockStatus.className = 'stock-status in-stock';
    } else {
        stockStatus.innerHTML = `<i class="fas fa-times-circle"></i> Out of Stock`;
        stockStatus.className = 'stock-status out-stock';
    }
    
    // Main image
    document.getElementById('mainProductImage').className = `fas ${productData.icon}`;
    
    // Load full specs table
    loadFullSpecs();
    
    // Load description content
    loadFullDescription();
}

function loadFullSpecs() {
    const tbody = document.getElementById('specsTableBody');
    tbody.innerHTML = Object.entries(productData.fullSpecs).map(([key, value]) => `
        <tr>
            <td>${key}</td>
            <td>${value}</td>
        </tr>
    `).join('');
}

function loadFullDescription() {
    const content = document.getElementById('fullDescription');
    content.innerHTML = `
        <p>${productData.description}</p>
        
        <h4>Key Features</h4>
        <ul>
            ${productData.shortSpecs.map(spec => `<li>${spec}</li>`).join('')}
        </ul>
        
        <h4>In the Box</h4>
        <ul>
            ${productData.inBox.map(item => `<li>${item}</li>`).join('')}
        </ul>
        
        <h4>Warranty</h4>
        <p>This product comes with a 2-year manufacturer warranty covering defects in materials and workmanship. Extended warranty options are available at checkout.</p>
    `;
}

function getCategoryName(category) {
    const names = {
        'phones': 'Mobile Phones',
        'laptops': 'Laptops',
        'components': 'Components',
        'accessories': 'Accessories',
        'gaming': 'Gaming',
        'home': 'Home Electronics'
    };
    return names[category] || category;
}

// Image gallery
function changeImage(index) {
    currentImage = index;
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Update main image
    mainImage.className = `fas ${productData.images[index]}`;
    
    // Update thumbnails
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// Quantity control
function updateQuantity(change) {
    const input = document.getElementById('productQuantity');
    let newValue = parseInt(input.value) + change;
    
    if (newValue < 1) newValue = 1;
    if (newValue > productData.stock) newValue = productData.stock;
    if (newValue > 99) newValue = 99;
    
    input.value = newValue;
    currentQuantity = newValue;
}

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tabs-header .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`${tabName}Panel`).classList.add('active');
}

// Add to cart from detail page
function addToCartFromDetail() {
    const product = {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        icon: productData.icon,
        quantity: currentQuantity
    };
    
    // Add to cart
    for (let i = 0; i < currentQuantity; i++) {
        addToCart(productData.id);
    }
    
    showToast(`${currentQuantity} x ${productData.name} added to cart`);
}

// Buy now
function buyNow() {
    addToCartFromDetail();
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 500);
}

// Wishlist functionality - uses shared functions from wishlist.js
function toggleWishlistDetail() {
    if (typeof toggleWishlist === 'function') {
        toggleWishlist(productData.id);
        updateWishlistButtonUI();
    }
}

function updateWishlistButtonUI() {
    const btn = document.getElementById('wishlistBtn');
    if (!btn) return;
    
    if (typeof isInWishlist === 'function' && isInWishlist(productData.id)) {
        btn.innerHTML = '<i class="fas fa-heart"></i> In Wishlist';
        btn.classList.add('active');
    } else {
        btn.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
        btn.classList.remove('active');
    }
}

// Check if product is in wishlist
function checkWishlistStatus() {
    updateWishlistButtonUI();
}

// Reviews
function renderReviews() {
    const container = document.getElementById('reviewsList');
    container.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="review-author">
                    <div class="author-avatar">${review.avatar}</div>
                    <div class="author-info">
                        <h4>${review.author}</h4>
                        <div class="review-rating">
                            ${renderStars(review.rating)}
                            ${review.verified ? '<span class="reverified"><i class="fas fa-check-circle"></i> Verified Purchase</span>' : ''}
                        </div>
                    </div>
                </div>
                <span class="review-date">${formatDate(review.date)}</span>
            </div>
            <div class="review-content">
                <p>${review.content}</p>
            </div>
            <div class="review-actions">
                <button onclick="helpfulReview(${review.id})">
                    <i class="fas fa-thumbs-up"></i> Helpful (${Math.floor(Math.random() * 50) + 5})
                </button>
                <button onclick="reportReview(${review.id})">
                    <i class="fas fa-flag"></i> Report
                </button>
            </div>
        </div>
    `).join('');
    
    document.getElementById('reviewCount').textContent = `(${productData.reviews.toLocaleString()})`;
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let html = '';
    
    for (let i = 0; i < fullStars; i++) {
        html += '<i class="fas fa-star"></i>';
    }
    if (hasHalf) {
        html += '<i class="fas fa-star-half-alt"></i>';
    }
    const empty = 5 - fullStars - (hasHalf ? 1 : 0);
    for (let i = 0; i < empty; i++) {
        html += '<i class="far fa-star"></i>';
    }
    
    return html;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function helpfulReview(id) {
    showToast('Thanks for your feedback!');
}

function reportReview(id) {
    showToast('Review reported. Thank you.');
}

// Review modal
function openReviewModal() {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        showToast('Please sign in to write a review');
        localStorage.setItem('redirectAfterLogin', window.location.href);
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
        return;
    }
    
    document.getElementById('reviewModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeReviewModal() {
    document.getElementById('reviewModal').classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    document.getElementById('reviewForm').reset();
    setRating(0);
}

function setRating(rating) {
    currentRating = rating;
    document.getElementById('reviewRating').value = rating;
    
    const stars = document.querySelectorAll('.star-rating-input i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas', 'active');
        } else {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        }
    });
}

function submitReview(event) {
    event.preventDefault();
    
    const rating = document.getElementById('reviewRating').value;
    const text = document.getElementById('reviewText').value;
    const name = document.getElementById('reviewerName').value;
    
    if (rating === '0') {
        showToast('Please select a rating');
        return;
    }
    
    const newReview = {
        id: Date.now(),
        author: name,
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase(),
        rating: parseInt(rating),
        date: new Date().toISOString().split('T')[0],
        verified: true,
        content: text
    };
    
    reviews.unshift(newReview);
    renderReviews();
    closeReviewModal();
    showToast('Review submitted successfully!');
}

// Load more reviews
function loadMoreReviews() {
    // Simulate loading more
    showToast('Loading more reviews...');
}

// Related products
function loadRelatedProducts() {
    const related = products.filter(p => 
        p.category === productData.category && p.id !== productData.id
    ).slice(0, 5);
    
    const container = document.getElementById('relatedProducts');
    container.innerHTML = related.map(product => createProductCard(product)).join('');
}

// Recently viewed
function loadRecentlyViewed() {
    let viewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    
    // Filter out current product and get last 5
    viewed = viewed.filter(id => id !== productData.id).slice(-5);
    
    if (viewed.length === 0) {
        document.querySelector('.recently-viewed').style.display = 'none';
        return;
    }
    
    const viewedProducts = products.filter(p => viewed.includes(p.id));
    const container = document.getElementById('recentlyViewed');
    container.innerHTML = viewedProducts.map(product => createProductCard(product)).join('');
}

function addToRecentlyViewed(productId) {
    let viewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    
    // Remove if already exists
    viewed = viewed.filter(id => id !== productId);
    
    // Add to end
    viewed.push(productId);
    
    // Keep only last 10
    if (viewed.length > 10) {
        viewed = viewed.slice(-10);
    }
    
    localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
}

function createProductCard(product) {
    return `
        <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
            ${product.badge ? `<span class="product-badge ${product.badge}">${product.badge === 'bestseller' ? 'Best Seller' : product.badge === 'new' ? 'New' : product.badge}</span>` : ''}
            <div class="product-image">
                <i class="fas ${product.icon}"></i>
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
    `;
}

// Search from product page
function performSearch() {
    const query = document.getElementById('searchInput').value;
    if (query) {
        window.location.href = `index.html?search=${encodeURIComponent(query)}`;
    }
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('review-modal')) {
        closeReviewModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeReviewModal();
    }
});

// B2B Bulk Order Functions
function setBulkQuantity(quantity) {
    const input = document.getElementById('bulkQuantity');
    input.value = quantity;
    calculateBulkPrice();
}

function calculateBulkPrice() {
    const quantity = parseInt(document.getElementById('bulkQuantity').value) || 10;
    const retailPrice = productData.price;
    const wholesalePrice = calculateWholesalePrice(productData.id, quantity);
    const discount = getWholesaleDiscount(productData.id, quantity);
    const total = wholesalePrice * quantity;

    document.getElementById('retailPrice').textContent = `¥${retailPrice.toLocaleString()}`;
    document.getElementById('wholesalePrice').textContent = `¥${wholesalePrice.toLocaleString()}`;
    document.getElementById('discountTag').textContent = `${discount}% off`;
    document.getElementById('bulkTotal').textContent = `¥${total.toLocaleString()}`;
}

function calculateWholesalePrice(productId, quantity) {
    const product = productData;
    if (!product || !product.tieredPricing) return product.price;
    
    let discount = 1;
    
    for (const [range, discountRate] of Object.entries(product.tieredPricing)) {
        const [min, max] = range.replace('+', '').split('-').map(Number);
        if (max) {
            if (quantity >= min && quantity <= max) {
                discount = discountRate;
                break;
            }
        } else {
            if (quantity >= min) {
                discount = discountRate;
                break;
            }
        }
    }
    
    return Math.round(product.price * discount);
}

function getWholesaleDiscount(productId, quantity) {
    const product = productData;
    if (!product || !product.tieredPricing) return 0;
    
    let discount = 1;
    
    for (const [range, discountRate] of Object.entries(product.tieredPricing)) {
        const [min, max] = range.replace('+', '').split('-').map(Number);
        if (max) {
            if (quantity >= min && quantity <= max) {
                discount = discountRate;
                break;
            }
        } else {
            if (quantity >= min) {
                discount = discountRate;
                break;
            }
        }
    }
    
    return Math.round((1 - discount) * 100);
}

function isB2BVerifiedUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return false;
    
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    const user = b2bUsers.find(u => u.id === currentUser.id);
    return user && user.verificationStatus === 'verified';
}

function showBulkOrderSection() {
    const bulkSection = document.getElementById('bulkOrderSection');
    const moqBadge = document.getElementById('moqBadge');
    const tieredDisplay = document.getElementById('tieredPricingDisplay');
    
    if (isB2BVerifiedUser()) {
        bulkSection.style.display = 'block';
        moqBadge.textContent = `MOQ: ${productData.moq} units`;
        
        // Set minimum quantity
        document.getElementById('bulkQuantity').min = productData.moq;
        document.getElementById('bulkQuantity').value = productData.moq;
        
        // Display tiered pricing
        let tieredHtml = '<h4>Volume Discounts:</h4><ul>';
        for (const [range, discountRate] of Object.entries(productData.tieredPricing)) {
            const discountPercent = Math.round((1 - discountRate) * 100);
            tieredHtml += `<li>${range} units: ${discountPercent}% off</li>`;
        }
        tieredHtml += '</ul>';
        tieredDisplay.innerHTML = tieredHtml;
        
        // Calculate initial price
        calculateBulkPrice();
    } else {
        bulkSection.style.display = 'none';
    }
}

// Initialize wishlist status on load
window.addEventListener('load', () => {
    checkWishlistStatus();
    if (typeof updateWishlistCount === 'function') {
        updateWishlistCount();
    }
    showBulkOrderSection();
});

// Exports
window.setBulkQuantity = setBulkQuantity;
window.calculateBulkPrice = calculateBulkPrice;
window.calculateWholesalePrice = calculateWholesalePrice;
window.getWholesaleDiscount = getWholesaleDiscount;
window.isB2BVerifiedUser = isB2BVerifiedUser;
window.showBulkOrderSection = showBulkOrderSection;
