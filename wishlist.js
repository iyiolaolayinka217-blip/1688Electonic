// Wishlist Page JavaScript

// Initialize wishlist page
window.addEventListener('DOMContentLoaded', () => {
    loadWishlistItems();
    updateWishlistUI();
    updateAuthUI();
});

// Load wishlist items on the page
function loadWishlistItems() {
    const wishlistGrid = document.getElementById('wishlistGrid');
    const emptyWishlist = document.getElementById('emptyWishlist');
    const wishlistActions = document.getElementById('wishlistActions');
    
    // Get wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Filter to get only valid product IDs that exist in our products array
    const wishlistProducts = products.filter(p => wishlist.includes(p.id));
    
    if (wishlistProducts.length === 0) {
        // Show empty state
        wishlistGrid.style.display = 'none';
        wishlistActions.style.display = 'none';
        emptyWishlist.style.display = 'block';
    } else {
        // Show wishlist grid
        emptyWishlist.style.display = 'none';
        wishlistGrid.style.display = 'grid';
        wishlistActions.style.display = 'flex';
        
        // Render wishlist items
        wishlistGrid.innerHTML = wishlistProducts.map(product => `
            <div class="wishlist-card" data-product-id="${product.id}">
                <button class="remove-btn" onclick="removeFromWishlist(${product.id})" title="Remove from wishlist">
                    <i class="fas fa-times"></i>
                </button>
                <div class="product-image" onclick="goToProduct(${product.id})">
                    <i class="fas ${product.icon}"></i>
                </div>
                <div class="product-info">
                    <span class="product-category">${getCategoryName(product.category)}</span>
                    <h3 class="product-title" onclick="goToProduct(${product.id})">${product.name}</h3>
                    <div class="product-rating">
                        ${renderStars(product.rating)}
                        <span>(${product.reviews.toLocaleString()})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">¥${product.price}</span>
                        ${product.originalPrice ? `<span class="original-price">¥${product.originalPrice}</span>` : ''}
                    </div>
                    <div class="stock-status in-stock">
                        <i class="fas fa-check-circle"></i> In Stock
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="addToCart(${product.id}); event.stopPropagation();">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="btn btn-secondary" onclick="goToProduct(${product.id})">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Update counter
    updateWishlistCount();
}

// Remove item from wishlist
function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Find the card and animate removal
        const card = document.querySelector(`[data-product-id="${productId}"]`);
        if (card) {
            card.style.transform = 'scale(0.9)';
            card.style.opacity = '0';
            
            setTimeout(() => {
                loadWishlistItems();
                showToast('Item removed from wishlist');
            }, 300);
        } else {
            loadWishlistItems();
            showToast('Item removed from wishlist');
        }
    }
}

// Clear entire wishlist
function clearWishlist() {
    if (confirm('Are you sure you want to clear your wishlist?')) {
        localStorage.removeItem('wishlist');
        loadWishlistItems();
        showToast('Wishlist cleared');
    }
}

// Add all items to cart
function addAllToCart() {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (wishlist.length === 0) {
        showToast('Your wishlist is empty');
        return;
    }
    
    // Add all wishlist items to cart
    wishlist.forEach(productId => {
        // Add without showing individual toasts
        const product = products.find(p => p.id === productId);
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
        }
    });
    
    updateCartUI();
    showToast(`${wishlist.length} items added to cart!`);
    
    // Optional: Open cart sidebar
    setTimeout(() => {
        toggleCart();
    }, 500);
}

// Go to product detail page
function goToProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// Update wishlist count in header
function updateWishlistCount() {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const count = document.getElementById('wishlistCount');
    if (count) {
        count.textContent = wishlist.length;
    }
}

// Enhanced toggle wishlist function (works from any page)
function toggleWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const index = wishlist.indexOf(productId);
    
    if (index === -1) {
        wishlist.push(productId);
        showToast('Added to wishlist!');
        
        // Update button state if on product page
        updateWishlistButtonState(productId, true);
    } else {
        wishlist.splice(index, 1);
        showToast('Removed from wishlist');
        
        // Update button state if on product page
        updateWishlistButtonState(productId, false);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

// Update wishlist button visual state
function updateWishlistButtonState(productId, inWishlist) {
    // Update on product detail page
    const wishlistBtn = document.getElementById('wishlistBtn');
    if (wishlistBtn) {
        if (inWishlist) {
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> In Wishlist';
            wishlistBtn.classList.add('active');
        } else {
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
            wishlistBtn.classList.remove('active');
        }
    }
}

// Check if product is in wishlist
function isInWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    return wishlist.includes(productId);
}

// Go to wishlist page
function goToWishlist() {
    window.location.href = 'wishlist.html';
}

// Update auth UI
function updateAuthUI() {
    const currentUser = localStorage.getItem('currentUser');
    const authLinks = document.getElementById('authLinks');
    
    if (authLinks && currentUser) {
        const user = JSON.parse(currentUser);
        authLinks.innerHTML = `
            <span style="color: rgba(255,255,255,0.9); margin-right: 15px;">Hello, ${user.name.split(' ')[0]}</span>
            <a href="#" class="top-link" onclick="logout(); return false;">Logout</a>
        `;
    }
}

// Helper: Render stars
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

// Helper: Get category name
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

// Sync wishlist across tabs/pages
window.addEventListener('storage', (e) => {
    if (e.key === 'wishlist') {
        loadWishlistItems();
        updateWishlistCount();
    }
});

// Export functions for use in other files
window.Wishlist = {
    toggleWishlist,
    isInWishlist,
    updateWishlistCount,
    goToWishlist,
    removeFromWishlist
};
