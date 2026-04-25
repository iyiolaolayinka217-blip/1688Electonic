// Product Data
const products = [
    { id: 1, name: 'iPhone 15 Pro Max 256GB', category: 'phones', price: 6499, originalPrice: 7999, rating: 4.9, reviews: 2847, badge: 'bestseller', icon: 'fa-mobile-alt', tab: 'all', moq: 10, tieredPricing: { '10-50': 0.95, '51-100': 0.90, '101-500': 0.85, '500+': 0.80 } },
    { id: 2, name: 'Samsung Galaxy S24 Ultra', category: 'phones', price: 5799, originalPrice: 7299, rating: 4.8, reviews: 1923, badge: 'new', icon: 'fa-mobile-alt', tab: 'trending', moq: 10, tieredPricing: { '10-50': 0.95, '51-100': 0.90, '101-500': 0.85, '500+': 0.80 } },
    { id: 3, name: 'MacBook Pro M3 14-inch', category: 'laptops', price: 9499, originalPrice: 11699, rating: 4.9, reviews: 1456, badge: 'bestseller', icon: 'fa-laptop', tab: 'bestseller', moq: 5, tieredPricing: { '5-20': 0.95, '21-50': 0.90, '51-100': 0.85, '100+': 0.80 } },
    { id: 4, name: 'Dell XPS 15 OLED', category: 'laptops', price: 8699, originalPrice: 10899, rating: 4.7, reviews: 892, badge: '', icon: 'fa-laptop', tab: 'all', moq: 5, tieredPricing: { '5-20': 0.95, '21-50': 0.90, '51-100': 0.85, '100+': 0.80 } },
    { id: 5, name: 'Sony WH-1000XM5 Headphones', category: 'accessories', price: 2199, originalPrice: 2899, rating: 4.8, reviews: 3421, badge: 'bestseller', icon: 'fa-headphones', tab: 'bestseller', moq: 20, tieredPricing: { '20-100': 0.95, '101-500': 0.90, '501-1000': 0.85, '1000+': 0.80 } },
    { id: 6, name: 'AirPods Pro 2nd Gen', category: 'accessories', price: 1449, originalPrice: 1799, rating: 4.9, reviews: 5678, badge: 'new', icon: 'fa-headphones', tab: 'new', moq: 25, tieredPricing: { '25-100': 0.95, '101-500': 0.90, '501-1000': 0.85, '1000+': 0.80 } },
    { id: 7, name: 'RTX 4090 Graphics Card', category: 'components', price: 10899, originalPrice: 13699, rating: 4.9, reviews: 567, badge: 'new', icon: 'fa-microchip', tab: 'trending', moq: 5, tieredPricing: { '5-10': 0.95, '11-50': 0.90, '51-100': 0.85, '100+': 0.80 } },
    { id: 8, name: 'AMD Ryzen 9 7950X', category: 'components', price: 3599, originalPrice: 5099, rating: 4.8, reviews: 1234, badge: '', icon: 'fa-microchip', tab: 'all', moq: 10, tieredPricing: { '10-50': 0.95, '51-100': 0.90, '101-500': 0.85, '500+': 0.80 } },
    { id: 9, name: 'PlayStation 5 Console', category: 'gaming', price: 3299, originalPrice: 3699, rating: 4.9, reviews: 8901, badge: 'bestseller', icon: 'fa-gamepad', tab: 'bestseller', moq: 10, tieredPricing: { '10-50': 0.95, '51-100': 0.90, '101-500': 0.85, '500+': 0.80 } },
    { id: 10, name: 'Xbox Series X', category: 'gaming', price: 2899, originalPrice: 3699, rating: 4.8, reviews: 3456, badge: '', icon: 'fa-gamepad', tab: 'all', moq: 10, tieredPricing: { '10-50': 0.95, '51-100': 0.90, '101-500': 0.85, '500+': 0.80 } },
    { id: 11, name: 'LG 65" OLED C3 TV', category: 'home', price: 12299, originalPrice: 16699, rating: 4.9, reviews: 789, badge: 'new', icon: 'fa-tv', tab: 'new', moq: 5, tieredPricing: { '5-10': 0.95, '11-50': 0.90, '51-100': 0.85, '100+': 0.80 } },
    { id: 12, name: 'Samsung 55" QLED 4K', category: 'home', price: 5799, originalPrice: 8699, rating: 4.7, reviews: 1234, badge: '', icon: 'fa-tv', tab: 'all', moq: 10, tieredPricing: { '10-50': 0.95, '51-100': 0.90, '101-500': 0.85, '500+': 0.80 } },
    { id: 13, name: 'iPad Pro 12.9 M2', category: 'phones', price: 7199, originalPrice: 9399, rating: 4.8, reviews: 2341, badge: 'new', icon: 'fa-tablet-alt', tab: 'new', moq: 10, tieredPricing: { '10-50': 0.95, '51-100': 0.90, '101-500': 0.85, '500+': 0.80 } },
    { id: 14, name: 'Samsung Galaxy Tab S9', category: 'phones', price: 4699, originalPrice: 6199, rating: 4.6, reviews: 876, badge: '', icon: 'fa-tablet-alt', tab: 'all', moq: 15, tieredPricing: { '15-50': 0.95, '51-100': 0.90, '101-500': 0.85, '500+': 0.80 } },
    { id: 15, name: 'ASUS ROG Gaming Laptop', category: 'laptops', price: 12999, originalPrice: 15899, rating: 4.8, reviews: 654, badge: 'trending', icon: 'fa-laptop', tab: 'trending', moq: 5, tieredPricing: { '5-10': 0.95, '11-50': 0.90, '51-100': 0.85, '100+': 0.80 } }
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

// New Customer Bonus System
const newCustomerBonus = {
    // Check if user is a new customer (registered within last 30 days)
    isNewCustomer(userId) {
        if (!userId) return false;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.id === userId);
        
        if (!user || !user.registrationDate) return false;
        
        const registrationDate = new Date(user.registrationDate);
        const now = new Date();
        const daysSinceRegistration = (now - registrationDate) / (1000 * 60 * 60 * 24);
        
        return daysSinceRegistration <= 30;
    },
    
    // Get discount tier based on days since registration
    getDiscountTier(userId) {
        if (!userId) return 0;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.id === userId);
        
        if (!user || !user.registrationDate) return 0;
        
        const registrationDate = new Date(user.registrationDate);
        const now = new Date();
        const daysSinceRegistration = (now - registrationDate) / (1000 * 60 * 60 * 24);
        
        // Tier 1: First 7 days - 20% discount
        if (daysSinceRegistration <= 7) return 0.20;
        // Tier 2: 8-14 days - 15% discount
        if (daysSinceRegistration <= 14) return 0.15;
        // Tier 3: 15-30 days - 10% discount
        if (daysSinceRegistration <= 30) return 0.10;
        
        return 0;
    },
    
    // Check if user has already used their first purchase bonus
    hasUsedFirstPurchaseBonus(userId) {
        if (!userId) return true;
        
        const bonusUsage = JSON.parse(localStorage.getItem('bonusUsage')) || [];
        const userUsage = bonusUsage.find(b => b.userId === userId);
        
        return userUsage && userUsage.firstPurchaseUsed;
    },
    
    // Mark first purchase bonus as used
    markFirstPurchaseBonusUsed(userId) {
        if (!userId) return;
        
        const bonusUsage = JSON.parse(localStorage.getItem('bonusUsage')) || [];
        const existingIndex = bonusUsage.findIndex(b => b.userId === userId);
        
        if (existingIndex >= 0) {
            bonusUsage[existingIndex].firstPurchaseUsed = true;
            bonusUsage[existingIndex].usedAt = new Date().toISOString();
        } else {
            bonusUsage.push({
                userId,
                firstPurchaseUsed: true,
                usedAt: new Date().toISOString()
            });
        }
        
        localStorage.setItem('bonusUsage', JSON.stringify(bonusUsage));
    },
    
    // Get new customer discount for cart
    getNewCustomerDiscount(userId, cartTotal) {
        if (!userId || !this.isNewCustomer(userId)) return 0;
        
        // Check if first purchase bonus is available
        if (!this.hasUsedFirstPurchaseBonus(userId)) {
            return Math.min(cartTotal * 0.20, 500); // Max ¥500 discount
        }
        
        // Otherwise use tiered discount
        const tierDiscount = this.getDiscountTier(userId);
        return cartTotal * tierDiscount;
    },
    
    // Get discount percentage for display
    getDiscountPercentage(userId) {
        if (!userId || !this.isNewCustomer(userId)) return 0;
        
        if (!this.hasUsedFirstPurchaseBonus(userId)) return 20;
        
        return Math.round(this.getDiscountTier(userId) * 100);
    },
    
    // Get discount tier name
    getDiscountTierName(userId) {
        if (!userId || !this.isNewCustomer(userId)) return null;
        
        if (!this.hasUsedFirstPurchaseBonus(userId)) return 'Welcome Bonus';
        
        const daysSinceRegistration = this.getDaysSinceRegistration(userId);
        
        if (daysSinceRegistration <= 7) return 'Welcome Bonus';
        if (daysSinceRegistration <= 14) return 'First Week Bonus';
        if (daysSinceRegistration <= 30) return 'First Month Bonus';
        
        return null;
    },
    
    // Helper to get days since registration
    getDaysSinceRegistration(userId) {
        if (!userId) return 0;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.id === userId);
        
        if (!user || !user.registrationDate) return 0;
        
        const registrationDate = new Date(user.registrationDate);
        const now = new Date();
        return (now - registrationDate) / (1000 * 60 * 60 * 24);
    }
};

// Free Shipping System
const freeShipping = {
    // Shipping thresholds
    thresholds: {
        standard: 1000,  // Free standard shipping for orders ¥1000+
        express: 2000,   // Free express shipping for orders ¥2000+
        priority: 5000,  // Free priority shipping for orders ¥5000+
        newCustomer: 500 // Lower threshold for new customers (¥500+)
    },
    
    // Shipping costs
    shippingCosts: {
        standard: 50,
        express: 100,
        priority: 200
    },
    
    // Check if order qualifies for free shipping
    qualifiesForFreeShipping(orderTotal, userId = null, shippingType = 'standard') {
        const threshold = this.getFreeShippingThreshold(userId, shippingType);
        return orderTotal >= threshold;
    },
    
    // Get free shipping threshold (lower for new customers)
    getFreeShippingThreshold(userId = null, shippingType = 'standard') {
        // Check if user is a new customer for lower threshold
        if (userId && newCustomerBonus.isNewCustomer(userId)) {
            if (shippingType === 'standard') return this.thresholds.newCustomer;
            if (shippingType === 'express') return this.thresholds.standard;
            if (shippingType === 'priority') return this.thresholds.express;
        }
        
        // Standard thresholds
        if (shippingType === 'standard') return this.thresholds.standard;
        if (shippingType === 'express') return this.thresholds.express;
        if (shippingType === 'priority') return this.thresholds.priority;
        
        return this.thresholds.standard;
    },
    
    // Calculate shipping cost
    calculateShippingCost(orderTotal, userId = null, shippingType = 'standard') {
        if (this.qualifiesForFreeShipping(orderTotal, userId, shippingType)) {
            return 0;
        }
        
        return this.shippingCosts[shippingType] || this.shippingCosts.standard;
    },
    
    // Get amount needed for free shipping
    getAmountNeededForFreeShipping(orderTotal, userId = null, shippingType = 'standard') {
        const threshold = this.getFreeShippingThreshold(userId, shippingType);
        return Math.max(0, threshold - orderTotal);
    },
    
    // Get shipping type name
    getShippingTypeName(shippingType) {
        const names = {
            standard: 'Standard Shipping',
            express: 'Express Shipping',
            priority: 'Priority Shipping'
        };
        return names[shippingType] || 'Standard Shipping';
    }
};

// Bonus Tracking System
const bonusTracking = {
    // Record bonus usage
    recordBonusUsage(userId, orderId, discountAmount, bonusType) {
        const bonusUsage = JSON.parse(localStorage.getItem('bonusUsage')) || [];
        
        const usageRecord = {
            userId,
            orderId,
            bonusType,
            discountAmount,
            usedAt: new Date().toISOString(),
            expiryDate: this.getExpiryDate(userId)
        };
        
        bonusUsage.push(usageRecord);
        localStorage.setItem('bonusUsage', JSON.stringify(bonusUsage));
        
        // Mark first purchase as used if applicable
        if (bonusType === 'first_purchase') {
            newCustomerBonus.markFirstPurchaseBonusUsed(userId);
        }
    },
    
    // Get expiry date for user's bonus
    getExpiryDate(userId) {
        if (!userId) return null;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.id === userId);
        
        if (!user || !user.registrationDate) return null;
        
        const registrationDate = new Date(user.registrationDate);
        const expiryDate = new Date(registrationDate);
        expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from registration
        
        return expiryDate.toISOString();
    },
    
    // Check if bonus has expired
    isBonusExpired(userId) {
        const expiryDate = this.getExpiryDate(userId);
        if (!expiryDate) return true;
        
        return new Date() > new Date(expiryDate);
    },
    
    // Get user's bonus usage history
    getUserBonusHistory(userId) {
        const bonusUsage = JSON.parse(localStorage.getItem('bonusUsage')) || [];
        return bonusUsage.filter(record => record.userId === userId);
    },
    
    // Get total bonus savings for a user
    getTotalBonusSavings(userId) {
        const history = this.getUserBonusHistory(userId);
        return history.reduce((total, record) => total + record.discountAmount, 0);
    },
    
    // Track customer status transition
    trackStatusTransition(userId, fromStatus, toStatus) {
        const statusTransitions = JSON.parse(localStorage.getItem('statusTransitions')) || [];
        
        statusTransitions.push({
            userId,
            fromStatus,
            toStatus,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('statusTransitions', JSON.stringify(statusTransitions));
    },
    
    // Get current customer status
    getCustomerStatus(userId) {
        if (!userId) return 'guest';
        
        if (newCustomerBonus.isNewCustomer(userId)) {
            return 'new_customer';
        }
        
        return 'regular_customer';
    },
    
    // Update customer status and track transition
    updateCustomerStatus(userId) {
        const currentStatus = this.getCustomerStatus(userId);
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex >= 0) {
            const previousStatus = users[userIndex].customerStatus || 'new';
            
            if (previousStatus !== currentStatus) {
                users[userIndex].customerStatus = currentStatus;
                users[userIndex].statusUpdatedAt = new Date().toISOString();
                localStorage.setItem('users', JSON.stringify(users));
                
                this.trackStatusTransition(userId, previousStatus, currentStatus);
            }
        }
        
        return currentStatus;
    },
    
    // Get bonus usage statistics
    getBonusStatistics() {
        const bonusUsage = JSON.parse(localStorage.getItem('bonusUsage')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        const totalBonusUsed = bonusUsage.reduce((sum, record) => sum + record.discountAmount, 0);
        const totalUsersWithBonus = new Set(bonusUsage.map(r => r.userId)).size;
        const expiredBonuses = bonusUsage.filter(r => new Date(r.expiryDate) < new Date()).length;
        
        return {
            totalBonusUsed,
            totalUsersWithBonus,
            expiredBonuses,
            totalBonusesIssued: bonusUsage.length,
            averageBonusValue: totalBonusUsed / (bonusUsage.length || 1)
        };
    },
    
    // Get expiring bonuses (bonuses expiring within X days)
    getExpiringBonuses(days = 7) {
        const bonusUsage = JSON.parse(localStorage.getItem('bonusUsage')) || [];
        const now = new Date();
        const expiryThreshold = new Date();
        expiryThreshold.setDate(expiryThreshold.getDate() + days);
        
        return bonusUsage.filter(record => {
            const expiryDate = new Date(record.expiryDate);
            return expiryDate > now && expiryDate <= expiryThreshold;
        });
    },
    
    // Check and send expiry notifications
    checkExpiryNotifications() {
        const expiringBonuses = this.getExpiringBonuses(7);
        const notifications = JSON.parse(localStorage.getItem('expiryNotifications')) || [];
        
        expiringBonuses.forEach(bonus => {
            const notificationKey = `${bonus.userId}_${bonus.orderId}`;
            const alreadyNotified = notifications.some(n => n.key === notificationKey);
            
            if (!alreadyNotified) {
                // Send notification (in a real app, this would be an email or push notification)
                console.log(`Bonus expiring soon for user ${bonus.userId}: ¥${bonus.discountAmount}`);
                
                notifications.push({
                    key: notificationKey,
                    userId: bonus.userId,
                    orderId: bonus.orderId,
                    expiryDate: bonus.expiryDate,
                    sentAt: new Date().toISOString()
                });
            }
        });
        
        localStorage.setItem('expiryNotifications', JSON.stringify(notifications));
        return expiringBonuses.length;
    },
    
    // Get redemption rate for a time period
    getRedemptionRate(startDate, endDate) {
        const bonusUsage = JSON.parse(localStorage.getItem('bonusUsage')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        const newCustomersInPeriod = users.filter(u => {
            if (!u.registrationDate) return false;
            const registrationDate = new Date(u.registrationDate);
            return registrationDate >= new Date(startDate) && registrationDate <= new Date(endDate);
        });
        
        const usersWhoRedeemed = new Set(
            bonusUsage
                .filter(r => new Date(r.usedAt) >= new Date(startDate) && new Date(r.usedAt) <= new Date(endDate))
                .map(r => r.userId)
        );
        
        return {
            totalNewCustomers: newCustomersInPeriod.length,
            customersWhoRedeemed: usersWhoRedeemed.size,
            redemptionRate: newCustomersInPeriod.length > 0 
                ? (usersWhoRedeemed.size / newCustomersInPeriod.length) * 100 
                : 0
        };
    }
};

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

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts('all');
    loadFlashSaleProducts();
    startCountdown();
    updateCartCount();
    updateWishlistCount();
    updateAuthLinks();
    
    // Check if welcome modal should be shown
    checkWelcomeModal();
});

// Update profile button visibility based on auth state
function updateProfileButtonVisibility() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authLinks = document.getElementById('authLinks');
    
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
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        window.location.href = 'profile.html';
    } else {
        window.location.href = 'auth.html';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    updateProfileButtonVisibility();
    showToast('Logged out successfully');
}

// Wholesale Pricing Functions
function calculateWholesalePrice(productId, quantity) {
    const product = products.find(p => p.id === productId);
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
    const product = products.find(p => p.id === productId);
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

function getTieredPricingDisplay(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.tieredPricing) return '';
    
    let html = '<div class="tiered-pricing">';
    html += '<h4>Volume Discounts:</h4>';
    html += '<ul>';
    
    for (const [range, discountRate] of Object.entries(product.tieredPricing)) {
        const discountPercent = Math.round((1 - discountRate) * 100);
        html += `<li>${range} units: ${discountPercent}% off</li>`;
    }
    
    html += '</ul></div>';
    return html;
}

function isB2BVerifiedUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return false;
    
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    const user = b2bUsers.find(u => u.id === currentUser.id);
    return user && user.verificationStatus === 'verified';
}

// Dynamic Pricing Engine
const pricingEngine = {
    // Calculate final price with all applicable discounts
    calculateFinalPrice(productId, quantity, userId = null) {
        let basePrice = calculateWholesalePrice(productId, quantity);
        
        // Apply promotional discounts
        basePrice = this.applyPromotionalDiscount(productId, basePrice);
        
        // Apply customer-specific discounts
        if (userId) {
            basePrice = this.applyCustomerDiscount(productId, basePrice, userId);
        }
        
        return basePrice;
    },
    
    // Apply promotional campaign discounts
    applyPromotionalDiscount(productId, price) {
        const campaigns = JSON.parse(localStorage.getItem('promotionalCampaigns')) || [];
        const activeCampaigns = campaigns.filter(c => 
            c.status === 'active' && 
            new Date(c.startDate) <= new Date() && 
            new Date(c.endDate) >= new Date()
        );
        
        let finalPrice = price;
        activeCampaigns.forEach(campaign => {
            if (campaign.productIds.includes(productId) || campaign.productIds.includes('all')) {
                finalPrice = finalPrice * (1 - campaign.discountRate);
            }
        });
        
        return Math.round(finalPrice);
    },
    
    // Apply customer-specific discounts based on order history
    applyCustomerDiscount(productId, price, userId) {
        const customerDiscounts = JSON.parse(localStorage.getItem('customerDiscounts')) || [];
        const discount = customerDiscounts.find(d => d.userId === userId);
        
        if (discount) {
            return Math.round(price * (1 - discount.rate));
        }
        
        return price;
    },
    
    // Get all applicable discounts for a product
    getApplicableDiscounts(productId, quantity, userId = null) {
        const discounts = [];
        
        // Tiered pricing discount
        const tieredDiscount = getWholesaleDiscount(productId, quantity);
        if (tieredDiscount > 0) {
            discounts.push({
                type: 'volume',
                name: 'Volume Discount',
                rate: tieredDiscount / 100,
                amount: tieredDiscount
            });
        }
        
        // Promotional discounts
        const campaigns = JSON.parse(localStorage.getItem('promotionalCampaigns')) || [];
        const activeCampaigns = campaigns.filter(c => 
            c.status === 'active' && 
            new Date(c.startDate) <= new Date() && 
            new Date(c.endDate) >= new Date() &&
            (c.productIds.includes(productId) || c.productIds.includes('all'))
        );
        
        activeCampaigns.forEach(campaign => {
            discounts.push({
                type: 'promotion',
                name: campaign.name,
                rate: campaign.discountRate,
                amount: Math.round(campaign.discountRate * 100)
            });
        });
        
        // Customer-specific discounts
        if (userId) {
            const customerDiscounts = JSON.parse(localStorage.getItem('customerDiscounts')) || [];
            const discount = customerDiscounts.find(d => d.userId === userId);
            
            if (discount) {
                discounts.push({
                    type: 'customer',
                    name: 'Loyalty Discount',
                    rate: discount.rate,
                    amount: Math.round(discount.rate * 100)
                });
            }
        }
        
        return discounts;
    },
    
    // Calculate total savings
    calculateTotalSavings(productId, quantity, userId = null) {
        const product = products.find(p => p.id === productId);
        if (!product) return 0;
        
        const retailTotal = product.price * quantity;
        const wholesaleTotal = this.calculateFinalPrice(productId, quantity, userId);
        
        return retailTotal - wholesaleTotal;
    }
};

// Promotional Campaign Management
function createPromotionalCampaign(campaignData) {
    const campaigns = JSON.parse(localStorage.getItem('promotionalCampaigns')) || [];
    
    const newCampaign = {
        id: Date.now(),
        ...campaignData,
        status: 'active',
        createdAt: new Date().toISOString()
    };
    
    campaigns.push(newCampaign);
    localStorage.setItem('promotionalCampaigns', JSON.stringify(campaigns));
    
    return newCampaign;
}

function getActivePromotionalCampaigns() {
    const campaigns = JSON.parse(localStorage.getItem('promotionalCampaigns')) || [];
    const now = new Date();
    
    return campaigns.filter(c => 
        c.status === 'active' && 
        new Date(c.startDate) <= now && 
        new Date(c.endDate) >= now
    );
}

function updatePromotionalCampaign(campaignId, updates) {
    const campaigns = JSON.parse(localStorage.getItem('promotionalCampaigns')) || [];
    const index = campaigns.findIndex(c => c.id === campaignId);
    
    if (index !== -1) {
        campaigns[index] = { ...campaigns[index], ...updates };
        localStorage.setItem('promotionalCampaigns', JSON.stringify(campaigns));
        return true;
    }
    
    return false;
}

function deletePromotionalCampaign(campaignId) {
    const campaigns = JSON.parse(localStorage.getItem('promotionalCampaigns')) || [];
    const filteredCampaigns = campaigns.filter(c => c.id !== campaignId);
    
    localStorage.setItem('promotionalCampaigns', JSON.stringify(filteredCampaigns));
    return true;
}

// Price Comparison Features
function compareProductPrices(productIds, quantity) {
    return productIds.map(productId => {
        const product = products.find(p => p.id === productId);
        if (!product) return null;
        
        const retailPrice = product.price * quantity;
        const wholesalePrice = calculateWholesalePrice(productId, quantity);
        const savings = retailPrice - wholesalePrice;
        const discountPercent = Math.round((savings / retailPrice) * 100);
        
        return {
            productId: productId,
            name: product.name,
            retailPrice: retailPrice,
            wholesalePrice: wholesalePrice,
            savings: savings,
            discountPercent: discountPercent
        };
    }).filter(item => item !== null);
}

function getBestPriceForCategory(category, quantity) {
    const categoryProducts = products.filter(p => p.category === category);
    
    return categoryProducts.map(product => {
        const retailPrice = product.price * quantity;
        const wholesalePrice = calculateWholesalePrice(product.id, quantity);
        const savings = retailPrice - wholesalePrice;
        
        return {
            productId: product.id,
            name: product.name,
            retailPrice: retailPrice,
            wholesalePrice: wholesalePrice,
            savings: savings,
            discountPercent: Math.round((savings / retailPrice) * 100)
        };
    }).sort((a, b) => b.discountPercent - a.discountPercent);
}

// Invoice Generation System
const invoiceGenerator = {
    // Generate invoice for an order
    generateInvoice(orderData, userId = null) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
        const b2bUser = b2bUsers.find(u => u.id === (userId || currentUser.id));
        
        const invoice = {
            id: 'INV-' + Date.now(),
            orderId: orderData.id || null,
            userId: userId || currentUser.id,
            companyInfo: b2bUser ? {
                companyName: b2bUser.businessInfo.companyName,
                taxId: b2bUser.businessInfo.taxId,
                address: b2bUser.businessInfo.businessAddress,
                contactEmail: b2bUser.businessInfo.businessEmail,
                contactPhone: b2bUser.businessInfo.businessPhone
            } : null,
            items: orderData.items || [],
            subtotal: 0,
            discount: 0,
            tax: 0,
            total: 0,
            paymentTerms: orderData.paymentTerms || 'net30',
            status: 'pending',
            createdAt: new Date().toISOString(),
            dueDate: this.calculateDueDate(orderData.paymentTerms || 'net30')
        };
        
        // Calculate line items
        invoice.items = invoice.items.map(item => {
            const product = products.find(p => p.id === item.productId);
            const unitPrice = item.price || (product ? product.price : 0);
            const lineTotal = unitPrice * item.quantity;
            
            return {
                ...item,
                productName: product ? product.name : 'Unknown Product',
                unitPrice: unitPrice,
                lineTotal: lineTotal
            };
        });
        
        // Calculate subtotal
        invoice.subtotal = invoice.items.reduce((sum, item) => sum + item.lineTotal, 0);
        
        // Apply discounts
        const discounts = pricingEngine.getApplicableDiscounts(
            orderData.productId || (invoice.items[0] ? invoice.items[0].productId : 1),
            invoice.items.reduce((sum, item) => sum + item.quantity, 0),
            userId || currentUser.id
        );
        
        discounts.forEach(discount => {
            invoice.discount += invoice.subtotal * discount.rate;
        });
        
        // Calculate tax
        invoice.tax = this.calculateTax(invoice.subtotal - invoice.discount);
        
        // Calculate total
        invoice.total = invoice.subtotal - invoice.discount + invoice.tax;
        
        return invoice;
    },
    
    // Calculate due date based on payment terms
    calculateDueDate(paymentTerms) {
        const dueDate = new Date();
        
        switch (paymentTerms) {
            case 'net15':
                dueDate.setDate(dueDate.getDate() + 15);
                break;
            case 'net30':
                dueDate.setDate(dueDate.getDate() + 30);
                break;
            case 'net45':
                dueDate.setDate(dueDate.getDate() + 45);
                break;
            case 'net60':
                dueDate.setDate(dueDate.getDate() + 60);
                break;
            default:
                dueDate.setDate(dueDate.getDate() + 30);
        }
        
        return dueDate.toISOString();
    },
    
    // Calculate tax based on tax rate
    calculateTax(amount, taxRate = 0.13) {
        return Math.round(amount * taxRate);
    },
    
    // Save invoice to storage
    saveInvoice(invoice) {
        const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        invoices.push(invoice);
        localStorage.setItem('invoices', JSON.stringify(invoices));
        return invoice;
    },
    
    // Get invoices for user
    getUserInvoices(userId) {
        const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        return invoices.filter(i => i.userId === userId);
    },
    
    // Get all invoices (for admin)
    getAllInvoices() {
        return JSON.parse(localStorage.getItem('invoices')) || [];
    },
    
    // Update invoice status
    updateInvoiceStatus(invoiceId, status) {
        const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        const index = invoices.findIndex(i => i.id === invoiceId);
        
        if (index !== -1) {
            invoices[index].status = status;
            invoices[index].updatedAt = new Date().toISOString();
            localStorage.setItem('invoices', JSON.stringify(invoices));
            return true;
        }
        
        return false;
    },
    
    // Generate invoice number
    generateInvoiceNumber() {
        const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        const year = new Date().getFullYear();
        const count = invoices.length + 1;
        return `INV-${year}-${String(count).padStart(5, '0')}`;
    },
    
    // Check if invoice is overdue
    isOverdue(invoice) {
        const dueDate = new Date(invoice.dueDate);
        const now = new Date();
        return dueDate < now && invoice.status !== 'paid';
    },
    
    // Get days until due
    getDaysUntilDue(invoice) {
        const dueDate = new Date(invoice.dueDate);
        const now = new Date();
        const diffTime = dueDate - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
};

// Tax and Compliance Support
const taxCompliance = {
    // Tax rates by region
    taxRates: {
        'CN': 0.13, // China VAT
        'US': 0.08, // US average
        'EU': 0.20, // EU average
        'UK': 0.20, // UK VAT
        'JP': 0.10, // Japan
        'SG': 0.07, // Singapore
        'MY': 0.06, // Malaysia
        'TH': 0.07, // Thailand
        'VN': 0.10, // Vietnam
        'PH': 0.12  // Philippines
    },
    
    // Get tax rate for country
    getTaxRate(countryCode) {
        return this.taxRates[countryCode] || 0.13; // Default to 13%
    },
    
    // Calculate tax amount
    calculateTax(amount, countryCode = 'CN') {
        const taxRate = this.getTaxRate(countryCode);
        return Math.round(amount * taxRate);
    },
    
    // Validate tax ID format
    validateTaxId(taxId, countryCode = 'CN') {
        if (!taxId) return false;
        
        const patterns = {
            'CN': /^[A-Z0-9]{15,20}$/,
            'US': /^\d{2}-\d{7}$/,
            'EU': /^[A-Z]{2}\d{9,12}$/,
            'UK': /^GB\d{9,12}$/,
            'JP': /^\d{13}$/,
            'SG': /^\d{9}[A-Z]$/,
            'MY': /^\d{12}$/,
            'TH': /^\d{13}$/,
            'VN': /^\d{10}$/,
            'PH': /^\d{12}$/
        };
        
        const pattern = patterns[countryCode] || patterns['CN'];
        return pattern.test(taxId);
    },
    
    // Generate tax invoice number
    generateTaxInvoiceNumber() {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        const count = invoices.length + 1;
        return `TAX-${year}${month}-${String(count).padStart(5, '0')}`;
    },
    
    // Check compliance requirements
    checkCompliance(invoice) {
        const requirements = {
            hasTaxId: !!(invoice.companyInfo && invoice.companyInfo.taxId),
            hasValidAddress: !!(invoice.companyInfo && invoice.companyInfo.address),
            hasContactInfo: !!(invoice.companyInfo && invoice.companyInfo.contactEmail),
            hasValidTaxId: invoice.companyInfo ? this.validateTaxId(invoice.companyInfo.taxId) : false
        };
        
        return {
            compliant: Object.values(requirements).every(Boolean),
            requirements: requirements
        };
    }
};

// Payment Terms Management
const paymentTermsManager = {
    // Available payment terms
    terms: [
        { code: 'net15', name: 'NET 15', days: 15, description: 'Payment due in 15 days' },
        { code: 'net30', name: 'NET 30', days: 30, description: 'Payment due in 30 days' },
        { code: 'net45', name: 'NET 45', days: 45, description: 'Payment due in 45 days' },
        { code: 'net60', name: 'NET 60', days: 60, description: 'Payment due in 60 days' },
        { code: 'lc', name: 'Letter of Credit', days: 0, description: 'Payment via Letter of Credit' },
        { code: 'tt', name: 'Telegraphic Transfer', days: 0, description: 'Immediate TT payment' }
    ],
    
    // Get payment term details
    getTermDetails(termCode) {
        return this.terms.find(t => t.code === termCode) || this.terms[1]; // Default to NET 30
    },
    
    // Calculate due date
    calculateDueDate(termCode, fromDate = new Date()) {
        const term = this.getTermDetails(termCode);
        const dueDate = new Date(fromDate);
        
        if (term.days > 0) {
            dueDate.setDate(dueDate.getDate() + term.days);
        }
        
        return dueDate;
    },
    
    // Get late fee amount
    calculateLateFee(invoiceAmount, daysOverdue) {
        const dailyRate = 0.001; // 0.1% per day
        return Math.round(invoiceAmount * dailyRate * daysOverdue);
    }
};

// Supplier Management System
const supplierManager = {
    // Mock supplier data
    suppliers: [
        {
            id: 1,
            name: 'TechMaster Electronics',
            code: 'TM001',
            contact: 'John Smith',
            email: 'john@techmaster.com',
            phone: '+86 138 0013 8000',
            address: { street: '123 Tech Park', city: 'Shenzhen', state: 'Guangdong', zip: '518000', country: 'CN' },
            rating: 4.8,
            totalOrders: 156,
            onTimeDelivery: 95,
            qualityScore: 4.7,
            responseTime: 2.5,
            status: 'active',
            productCategories: ['phones', 'laptops', 'accessories']
        },
        {
            id: 2,
            name: 'Global Components Ltd',
            code: 'GC002',
            contact: 'Sarah Johnson',
            email: 'sarah@globalcomponents.com',
            phone: '+1 555 0123 4567',
            address: { street: '456 Industry Ave', city: 'San Francisco', state: 'CA', zip: '94102', country: 'US' },
            rating: 4.5,
            totalOrders: 89,
            onTimeDelivery: 92,
            qualityScore: 4.4,
            responseTime: 3.2,
            status: 'active',
            productCategories: ['components', 'gaming']
        },
        {
            id: 3,
            name: 'Asia Tech Solutions',
            code: 'AT003',
            contact: 'Wei Chen',
            email: 'wei@asiatech.com',
            phone: '+86 139 0013 9000',
            address: { street: '789 Innovation Blvd', city: 'Shanghai', state: 'Shanghai', zip: '200000', country: 'CN' },
            rating: 4.9,
            totalOrders: 234,
            onTimeDelivery: 98,
            qualityScore: 4.8,
            responseTime: 1.8,
            status: 'active',
            productCategories: ['phones', 'accessories', 'home']
        },
        {
            id: 4,
            name: 'Euro Electronics GmbH',
            code: 'EE004',
            contact: 'Hans Mueller',
            email: 'hans@euroelectronics.de',
            phone: '+49 30 1234 5678',
            address: { street: '321 Tech Street', city: 'Berlin', state: 'Berlin', zip: '10115', country: 'DE' },
            rating: 4.6,
            totalOrders: 67,
            onTimeDelivery: 90,
            qualityScore: 4.5,
            responseTime: 3.5,
            status: 'active',
            productCategories: ['laptops', 'components']
        },
        {
            id: 5,
            name: 'Pacific Rim Traders',
            code: 'PR005',
            contact: 'Kenji Tanaka',
            email: 'kenji@pacificrim.jp',
            phone: '+81 3 1234 5678',
            address: { street: '654 Business District', city: 'Tokyo', state: 'Tokyo', zip: '100-0001', country: 'JP' },
            rating: 4.7,
            totalOrders: 112,
            onTimeDelivery: 94,
            qualityScore: 4.6,
            responseTime: 2.8,
            status: 'active',
            productCategories: ['gaming', 'home', 'accessories']
        }
    ],
    
    // Get all suppliers
    getAllSuppliers() {
        const storedSuppliers = JSON.parse(localStorage.getItem('suppliers'));
        return storedSuppliers || this.suppliers;
    },
    
    // Get supplier by ID
    getSupplierById(supplierId) {
        const suppliers = this.getAllSuppliers();
        return suppliers.find(s => s.id === supplierId);
    },
    
    // Get suppliers by category
    getSuppliersByCategory(category) {
        const suppliers = this.getAllSuppliers();
        return suppliers.filter(s => s.productCategories.includes(category));
    },
    
    // Get supplier performance metrics
    getSupplierPerformance(supplierId) {
        const supplier = this.getSupplierById(supplierId);
        if (!supplier) return null;
        
        return {
            rating: supplier.rating,
            onTimeDelivery: supplier.onTimeDelivery,
            qualityScore: supplier.qualityScore,
            responseTime: supplier.responseTime,
            totalOrders: supplier.totalOrders,
            status: supplier.status
        };
    },
    
    // Calculate supplier score
    calculateSupplierScore(supplierId) {
        const supplier = this.getSupplierById(supplierId);
        if (!supplier) return 0;
        
        // Weighted score calculation
        const weights = {
            rating: 0.3,
            onTimeDelivery: 0.3,
            qualityScore: 0.25,
            responseTime: 0.15
        };
        
        // Normalize response time (lower is better, max 5 hours)
        const normalizedResponseTime = Math.max(0, 1 - (supplier.responseTime / 5));
        
        const score = (
            (supplier.rating / 5) * weights.rating +
            (supplier.onTimeDelivery / 100) * weights.onTimeDelivery +
            (supplier.qualityScore / 5) * weights.qualityScore +
            normalizedResponseTime * weights.responseTime
        ) * 100;
        
        return Math.round(score);
    },
    
    // Get top suppliers by category
    getTopSuppliersByCategory(category, limit = 3) {
        const suppliers = this.getSuppliersByCategory(category);
        return suppliers
            .map(s => ({
                ...s,
                score: this.calculateSupplierScore(s.id)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    },
    
    // Add supplier
    addSupplier(supplierData) {
        const suppliers = this.getAllSuppliers();
        const newSupplier = {
            id: Date.now(),
            ...supplierData,
            rating: 0,
            totalOrders: 0,
            onTimeDelivery: 100,
            qualityScore: 5,
            responseTime: 0,
            status: 'active'
        };
        
        suppliers.push(newSupplier);
        localStorage.setItem('suppliers', JSON.stringify(suppliers));
        return newSupplier;
    },
    
    // Update supplier
    updateSupplier(supplierId, updates) {
        const suppliers = this.getAllSuppliers();
        const index = suppliers.findIndex(s => s.id === supplierId);
        
        if (index !== -1) {
            suppliers[index] = { ...suppliers[index], ...updates };
            localStorage.setItem('suppliers', JSON.stringify(suppliers));
            return true;
        }
        
        return false;
    },
    
    // Update supplier performance
    updateSupplierPerformance(supplierId, metrics) {
        const supplier = this.getSupplierById(supplierId);
        if (!supplier) return false;
        
        const updates = {
            totalOrders: supplier.totalOrders + (metrics.orders || 0),
            onTimeDelivery: metrics.onTimeDelivery !== undefined ? metrics.onTimeDelivery : supplier.onTimeDelivery,
            qualityScore: metrics.qualityScore !== undefined ? metrics.qualityScore : supplier.qualityScore,
            responseTime: metrics.responseTime !== undefined ? metrics.responseTime : supplier.responseTime
        };
        
        return this.updateSupplier(supplierId, updates);
    },
    
    // Deactivate supplier
    deactivateSupplier(supplierId) {
        return this.updateSupplier(supplierId, { status: 'inactive' });
    },
    
    // Activate supplier
    activateSupplier(supplierId) {
        return this.updateSupplier(supplierId, { status: 'active' });
    },
    
    // Get suppliers for products (multi-supplier listings)
    getSuppliersForProduct(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return [];
        
        return this.getSuppliersByCategory(product.category);
    },
    
    // Compare suppliers for product
    compareSuppliersForProduct(productId) {
        const suppliers = this.getSuppliersForProduct(productId);
        const product = products.find(p => p.id === productId);
        
        return suppliers.map(supplier => {
            const score = this.calculateSupplierScore(supplier.id);
            const wholesalePrice = calculateWholesalePrice(productId, product.moq || 10);
            
            return {
                supplier: supplier,
                score: score,
                wholesalePrice: wholesalePrice,
                estimatedDelivery: Math.ceil(supplier.responseTime * 2) // Estimate based on response time
            };
        }).sort((a, b) => b.score - a.score);
    }
};

// Credit System
const creditSystem = {
    // Credit tiers
    creditTiers: [
        { name: 'Bronze', minScore: 0, maxScore: 499, creditLimit: 10000, interestRate: 0.025 },
        { name: 'Silver', minScore: 500, maxScore: 749, creditLimit: 50000, interestRate: 0.02 },
        { name: 'Gold', minScore: 750, maxScore: 899, creditLimit: 150000, interestRate: 0.015 },
        { name: 'Platinum', minScore: 900, maxScore: 1000, creditLimit: 500000, interestRate: 0.01 }
    ],
    
    // Get user credit score
    getCreditScore(userId) {
        const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
        const user = b2bUsers.find(u => u.id === userId);
        
        if (!user) return 0;
        
        // Calculate credit score based on order history, payment history, and account age
        const orders = JSON.parse(localStorage.getItem('b2bOrders')) || [];
        const userOrders = orders.filter(o => o.userId === userId);
        
        let score = 500; // Base score
        
        // Order history bonus
        score += Math.min(userOrders.length * 10, 200);
        
        // Payment history bonus
        const onTimePayments = userOrders.filter(o => o.paymentStatus === 'on-time').length;
        score += Math.min(onTimePayments * 5, 150);
        
        // Account age bonus
        const accountAge = Math.floor((Date.now() - new Date(user.registrationDate)) / (1000 * 60 * 60 * 24));
        score += Math.min(accountAge * 0.5, 100);
        
        return Math.min(Math.round(score), 1000);
    },
    
    // Get credit tier for user
    getCreditTier(userId) {
        const score = this.getCreditScore(userId);
        return this.creditTiers.find(tier => score >= tier.minScore && score <= tier.maxScore) || this.creditTiers[0];
    },
    
    // Get credit limit for user
    getCreditLimit(userId) {
        const tier = this.getCreditTier(userId);
        return tier.creditLimit;
    },
    
    // Get available credit
    getAvailableCredit(userId) {
        const limit = this.getCreditLimit(userId);
        const used = this.getUsedCredit(userId);
        return limit - used;
    },
    
    // Get used credit
    getUsedCredit(userId) {
        const invoices = invoiceGenerator.getUserInvoices(userId);
        const pendingInvoices = invoices.filter(i => i.status === 'pending');
        return pendingInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
    },
    
    // Check if user can make purchase
    canMakePurchase(userId, amount) {
        const available = this.getAvailableCredit(userId);
        return amount <= available;
    },
    
    // Record credit transaction
    recordCreditTransaction(userId, amount, type) {
        const transactions = JSON.parse(localStorage.getItem('creditTransactions')) || [];
        transactions.push({
            id: Date.now(),
            userId: userId,
            amount: amount,
            type: type, // 'purchase' or 'payment'
            date: new Date().toISOString()
        });
        localStorage.setItem('creditTransactions', JSON.stringify(transactions));
    },
    
    // Get credit history
    getCreditHistory(userId) {
        const transactions = JSON.parse(localStorage.getItem('creditTransactions')) || [];
        return transactions.filter(t => t.userId === userId).sort((a, b) => new Date(b.date) - new Date(a.date));
    }
};

// Warehouse Integration
const warehouseManager = {
    // Mock warehouse data
    warehouses: [
        {
            id: 1,
            name: 'Shenzhen Main Warehouse',
            code: 'SZ-WH-001',
            location: { city: 'Shenzhen', country: 'CN', lat: 22.5431, lng: 114.0579 },
            capacity: 100000,
            utilized: 75000,
            status: 'active',
            productCategories: ['phones', 'laptops', 'accessories']
        },
        {
            id: 2,
            name: 'Shanghai Distribution Center',
            code: 'SH-WH-002',
            location: { city: 'Shanghai', country: 'CN', lat: 31.2304, lng: 121.4737 },
            capacity: 80000,
            utilized: 60000,
            status: 'active',
            productCategories: ['phones', 'accessories', 'gaming']
        },
        {
            id: 3,
            name: 'Los Angeles Hub',
            code: 'LA-WH-003',
            location: { city: 'Los Angeles', country: 'US', lat: 34.0522, lng: -118.2437 },
            capacity: 50000,
            utilized: 35000,
            status: 'active',
            productCategories: ['laptops', 'components', 'gaming']
        },
        {
            id: 4,
            name: 'Berlin Storage Facility',
            code: 'BL-WH-004',
            location: { city: 'Berlin', country: 'DE', lat: 52.5200, lng: 13.4050 },
            capacity: 40000,
            utilized: 25000,
            status: 'active',
            productCategories: ['laptops', 'accessories']
        },
        {
            id: 5,
            name: 'Tokyo Distribution Center',
            code: 'TK-WH-005',
            location: { city: 'Tokyo', country: 'JP', lat: 35.6762, lng: 139.6503 },
            capacity: 60000,
            utilized: 45000,
            status: 'active',
            productCategories: ['phones', 'gaming', 'home']
        }
    ],
    
    // Get all warehouses
    getAllWarehouses() {
        const storedWarehouses = JSON.parse(localStorage.getItem('warehouses'));
        return storedWarehouses || this.warehouses;
    },
    
    // Get warehouse by ID
    getWarehouseById(warehouseId) {
        const warehouses = this.getAllWarehouses();
        return warehouses.find(w => w.id === warehouseId);
    },
    
    // Get warehouses by category
    getWarehousesByCategory(category) {
        const warehouses = this.getAllWarehouses();
        return warehouses.filter(w => w.productCategories.includes(category));
    },
    
    // Get nearest warehouse to location
    getNearestWarehouse(lat, lng, category = null) {
        let warehouses = this.getAllWarehouses();
        
        if (category) {
            warehouses = warehouses.filter(w => w.productCategories.includes(category));
        }
        
        return warehouses.map(wh => {
            const distance = this.calculateDistance(lat, lng, wh.location.lat, wh.location.lng);
            return { ...wh, distance };
        }).sort((a, b) => a.distance - b.distance)[0];
    },
    
    // Calculate distance between two points (Haversine formula)
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },
    
    // Check stock availability
    checkStockAvailability(productId, quantity, warehouseId = null) {
        const stockData = JSON.parse(localStorage.getItem('warehouseStock')) || {};
        
        if (warehouseId) {
            const warehouseStock = stockData[warehouseId] || {};
            return (warehouseStock[productId] || 0) >= quantity;
        }
        
        // Check all warehouses
        const warehouses = this.getAllWarehouses();
        let totalAvailable = 0;
        
        warehouses.forEach(wh => {
            const warehouseStock = stockData[wh.id] || {};
            totalAvailable += warehouseStock[productId] || 0;
        });
        
        return totalAvailable >= quantity;
    },
    
    // Get available stock for product
    getAvailableStock(productId) {
        const stockData = JSON.parse(localStorage.getItem('warehouseStock')) || {};
        const warehouses = this.getAllWarehouses();
        let totalStock = 0;
        
        warehouses.forEach(wh => {
            const warehouseStock = stockData[wh.id] || {};
            totalStock += warehouseStock[productId] || 0;
        });
        
        return totalStock;
    }
};

// Business Shipping Options
const shippingManager = {
    // Shipping options
    shippingOptions: [
        {
            id: 1,
            name: 'Standard Ground',
            code: 'STD-GND',
            minDays: 5,
            maxDays: 10,
            baseRate: 15,
            ratePerKg: 0.5,
            availableFor: ['retail']
        },
        {
            id: 2,
            name: 'Express Air',
            code: 'EXP-AIR',
            minDays: 2,
            maxDays: 3,
            baseRate: 35,
            ratePerKg: 2,
            availableFor: ['retail', 'b2b']
        },
        {
            id: 3,
            name: 'Priority Overnight',
            code: 'PRI-OVR',
            minDays: 1,
            maxDays: 1,
            baseRate: 60,
            ratePerKg: 4,
            availableFor: ['retail', 'b2b']
        },
        {
            id: 4,
            name: 'Freight LTL',
            code: 'FRT-LTL',
            minDays: 7,
            maxDays: 14,
            baseRate: 100,
            ratePerKg: 0.3,
            availableFor: ['b2b']
        },
        {
            id: 5,
            name: 'Freight FTL',
            code: 'FRT-FTL',
            minDays: 5,
            maxDays: 10,
            baseRate: 500,
            ratePerKg: 0.15,
            availableFor: ['b2b']
        },
        {
            id: 6,
            name: 'Sea Freight',
            code: 'SEA-FRT',
            minDays: 20,
            maxDays: 45,
            baseRate: 200,
            ratePerKg: 0.1,
            availableFor: ['b2b']
        }
    ],
    
    // Get shipping options for customer type
    getShippingOptions(customerType = 'retail') {
        return this.shippingOptions.filter(opt => opt.availableFor.includes(customerType));
    },
    
    // Calculate shipping cost
    calculateShippingCost(optionId, weight, distance = 0) {
        const option = this.shippingOptions.find(opt => opt.id === optionId);
        if (!option) return 0;
        
        let cost = option.baseRate;
        cost += weight * option.ratePerKg;
        
        // Add distance surcharge for freight
        if (option.code.includes('FRT') && distance > 0) {
            cost += distance * 0.01;
        }
        
        return Math.round(cost);
    },
    
    // Get estimated delivery date
    getEstimatedDeliveryDate(optionId, startDate = new Date()) {
        const option = this.shippingOptions.find(opt => opt.id === optionId);
        if (!option) return null;
        
        const minDate = new Date(startDate);
        minDate.setDate(minDate.getDate() + option.minDays);
        
        const maxDate = new Date(startDate);
        maxDate.setDate(maxDate.getDate() + option.maxDays);
        
        return { min: minDate, max: maxDate };
    },
    
    // Get best shipping option for budget
    getBestOptionForBudget(weight, budget) {
        const options = this.getShippingOptions('b2b');
        return options
            .map(opt => ({
                ...opt,
                cost: this.calculateShippingCost(opt.id, weight)
            }))
            .filter(opt => opt.cost <= budget)
            .sort((a, b) => a.minDays - b.minDays)[0];
    },
    
    // Get fastest shipping option
    getFastestOption(customerType = 'retail') {
        const options = this.getShippingOptions(customerType);
        return options.sort((a, b) => a.minDays - b.minDays)[0];
    }
};

// Dedicated Support System
const supportManager = {
    // Support tiers
    supportTiers: [
        { name: 'Basic', responseTime: 24, channels: ['email', 'chat'], features: ['standard'] },
        { name: 'Business', responseTime: 12, channels: ['email', 'chat', 'phone'], features: ['standard', 'priority'] },
        { name: 'Premium', responseTime: 4, channels: ['email', 'chat', 'phone', 'video'], features: ['standard', 'priority', 'dedicated'] },
        { name: 'Enterprise', responseTime: 1, channels: ['email', 'chat', 'phone', 'video', 'onsite'], features: ['standard', 'priority', 'dedicated', 'onsite'] }
    ],
    
    // Get user support tier
    getSupportTier(userId) {
        const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
        const user = b2bUsers.find(u => u.id === userId);
        
        if (!user) return this.supportTiers[0];
        
        // Determine tier based on monthly order volume
        const orders = JSON.parse(localStorage.getItem('b2bOrders')) || [];
        const userOrders = orders.filter(o => o.userId === userId);
        const monthlyVolume = userOrders.reduce((sum, o) => sum + o.total, 0);
        
        if (monthlyVolume >= 100000) return this.supportTiers[3]; // Enterprise
        if (monthlyVolume >= 50000) return this.supportTiers[2]; // Premium
        if (monthlyVolume >= 10000) return this.supportTiers[1]; // Business
        
        return this.supportTiers[0]; // Basic
    },
    
    // Create support ticket
    createSupportTicket(userId, issue, priority = 'normal') {
        const tickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
        const ticket = {
            id: 'TKT-' + Date.now(),
            userId: userId,
            issue: issue,
            priority: priority,
            status: 'open',
            createdAt: new Date().toISOString(),
            tier: this.getSupportTier(userId).name
        };
        
        tickets.push(ticket);
        localStorage.setItem('supportTickets', JSON.stringify(tickets));
        return ticket;
    },
    
    // Get user tickets
    getUserTickets(userId) {
        const tickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
        return tickets.filter(t => t.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    
    // Get dedicated support agent
    getDedicatedAgent(userId) {
        const tier = this.getSupportTier(userId);
        
        if (tier.name === 'Enterprise' || tier.name === 'Premium') {
            return {
                name: 'Dedicated Account Manager',
                email: 'account-manager@platform.com',
                phone: '+86 400-888-8888',
                available: true
            };
        }
        
        return null;
    },
    
    // Get support channels
    getSupportChannels(userId) {
        const tier = this.getSupportTier(userId);
        return tier.channels;
    },
    
    // Schedule support call
    scheduleSupportCall(userId, dateTime, topic) {
        const calls = JSON.parse(localStorage.getItem('supportCalls')) || [];
        calls.push({
            id: Date.now(),
            userId: userId,
            dateTime: dateTime,
            topic: topic,
            status: 'scheduled'
        });
        localStorage.setItem('supportCalls', JSON.stringify(calls));
        return true;
    }
};

// Mobile Swipe Back Navigation
let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 100;
const edgeThreshold = 50;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchmove', function(e) {
    touchEndX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    
    // Check if swipe is from left edge and exceeds threshold
    if (touchStartX < edgeThreshold && swipeDistance > swipeThreshold) {
        // Check if there's a previous page to go back to
        if (window.history.length > 1) {
            window.history.back();
        }
    }
}

// Welcome Modal for First-Time Visitors
function checkWelcomeModal() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const hasSeenWelcomeModal = localStorage.getItem('hasSeenWelcomeModal');
    
    // Only show if user is not logged in and hasn't seen the modal before
    if (!currentUser && !hasSeenWelcomeModal) {
        // Show modal after a short delay
        setTimeout(() => {
            document.getElementById('welcomeModal').classList.add('active');
        }, 1000);
    }
}

function closeWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    modal.classList.remove('active');
    
    // Store that user has seen the modal
    localStorage.setItem('hasSeenWelcomeModal', 'true');
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
                window.filterByCategory(category);
            } else if (category === 'all') {
                loadProducts('all');
                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
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

// Export functions to window for HTML onclick handlers
window.filterByCategory = filterByCategory;
window.loadAllProducts = function(event) {
    event.preventDefault();
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.querySelector('.nav-item[data-category="all"]').classList.add('active');
    loadProducts('all');
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
};

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

// Swipe gesture to open mobile menu
document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const nav = document.getElementById('mainNav');
    const swipeThreshold = 100;
    
    // Swipe from center to left (right to left swipe) to open menu
    if (touchStartX - touchEndX > swipeThreshold) {
        if (!nav.classList.contains('active')) {
            nav.classList.add('active');
        }
    }
    // Swipe from left to right to close menu
    else if (touchEndX - touchStartX > swipeThreshold) {
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    }
}

// Tap anywhere on screen to close hamburger menu
document.addEventListener('click', (e) => {
    const nav = document.getElementById('mainNav');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    // If menu is open and click is outside the menu and not on the toggle button
    if (nav.classList.contains('active') && 
        !nav.contains(e.target) && 
        !menuToggle.contains(e.target)) {
        nav.classList.remove('active');
    }
});

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
