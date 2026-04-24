/**
 * 1688 Electronic Mart - Checkout System
 * Multi-step checkout with shipping, payment, and review
 * Mobile and Desktop compatible
 */

// Global state
let currentStep = 1;
let cart = [];
let shippingData = {};
let paymentData = {};
let selectedShippingMethod = 'standard';
let appliedPromo = null;

// DOM Elements
const steps = {
    shipping: document.getElementById('shippingStep'),
    payment: document.getElementById('paymentStep'),
    review: document.getElementById('reviewStep')
};

const stepIndicators = document.querySelectorAll('.step');

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    initializeCheckout();
    loadCart();
    loadSavedAddresses();
    loadSavedCards();
    setupEventListeners();
    setupInputMasks();
    checkAuth();
});

// Initialize checkout
function initializeCheckout() {
    // Load any existing checkout data from localStorage
    const savedCheckout = localStorage.getItem('checkoutData');
    if (savedCheckout) {
        const data = JSON.parse(savedCheckout);
        if (data.shipping) {
            populateShippingForm(data.shipping);
        }
    }
}

// Check authentication
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        // Pre-fill email if logged in
        const emailField = document.getElementById('email');
        if (emailField && user.email) {
            emailField.value = user.email;
        }
        // Pre-fill name if available
        const firstNameField = document.getElementById('firstName');
        const lastNameField = document.getElementById('lastName');
        if (firstNameField && user.firstName) {
            firstNameField.value = user.firstName;
        }
        if (lastNameField && user.lastName) {
            lastNameField.value = user.lastName;
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Shipping form
    const shippingForm = document.getElementById('shippingForm');
    if (shippingForm) {
        shippingForm.addEventListener('submit', handleShippingSubmit);
    }
    
    // Payment form
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmit);
    }
    
    // Payment method selection
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', handlePaymentMethodChange);
    });
    
    // Shipping method selection
    const shippingOptions = document.querySelectorAll('input[name="shippingMethod"]');
    shippingOptions.forEach(option => {
        option.addEventListener('change', handleShippingMethodChange);
    });
    
    // Same as shipping checkbox
    const sameAsShipping = document.getElementById('sameAsShipping');
    if (sameAsShipping) {
        sameAsShipping.addEventListener('change', toggleBillingAddress);
    }
    
    // Promo code input (Enter key)
    const promoInput = document.getElementById('promoCode');
    if (promoInput) {
        promoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyPromoCode();
            }
        });
    }
    
    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', formatCardNumber);
        cardNumber.addEventListener('input', detectCardType);
    }
    
    // Expiry date formatting
    const expiry = document.getElementById('expiry');
    if (expiry) {
        expiry.addEventListener('input', formatExpiryDate);
    }
    
    // Save checkout data on input change
    document.querySelectorAll('.checkout-form input, .checkout-form select').forEach(input => {
        input.addEventListener('change', saveCheckoutProgress);
    });
}

// Setup input masks
function setupInputMasks() {
    // Phone mask
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            e.target.value = value;
        });
    }
    
    // ZIP code validation
    const zipInput = document.getElementById('zip');
    if (zipInput) {
        zipInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
        });
    }
    
    // CVV validation
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });
    }
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    // Check if cart is empty
    if (cart.length === 0) {
        showToast('Your cart is empty. Redirecting to shop...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }
    
    renderCartSummary();
    renderReviewItems();
}

// Render cart summary
function renderCartSummary() {
    const summaryItems = document.getElementById('summaryItems');
    if (!summaryItems) return;
    
    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <img src="${item.image || 'https://via.placeholder.com/60'}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-meta">Qty: ${item.quantity}</div>
            </div>
            <div class="item-price">¥${(item.price * item.quantity).toFixed(0)}</div>
        </div>
    `).join('');
    
    calculateTotals();
}

// Render review items
function renderReviewItems() {
    const reviewItems = document.getElementById('reviewItems');
    if (!reviewItems) return;
    
    reviewItems.innerHTML = cart.map(item => `
        <div class="review-item">
            <img src="${item.image || 'https://via.placeholder.com/60'}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-meta">Qty: ${item.quantity} × ¥${item.price.toFixed(0)}</div>
            </div>
            <div class="item-price">¥${(item.price * item.quantity).toFixed(0)}</div>
        </div>
    `).join('');
}

// Calculate totals
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Get shipping cost
    const shippingOption = document.querySelector('input[name="shippingMethod"]:checked');
    const shippingCost = shippingOption ? 
        parseFloat(shippingOption.closest('.shipping-option').querySelector('.option-price').dataset.price) : 9.99;
    
    // Calculate discount
    let discount = 0;
    if (appliedPromo) {
        if (appliedPromo.type === 'percentage') {
            discount = subtotal * (appliedPromo.value / 100);
        } else {
            discount = appliedPromo.value;
        }
    }
    
    // Calculate tax (8%)
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * 0.08;
    
    // Total
    const total = taxableAmount + tax + shippingCost;
    
    // Update DOM
    document.getElementById('subtotal').textContent = `¥${subtotal.toFixed(0)}`;
    document.getElementById('taxAmount').textContent = `¥${tax.toFixed(0)}`;
    document.getElementById('totalAmount').textContent = `¥${total.toFixed(0)}`;
    
    // Update shipping display
    const shippingDisplay = document.getElementById('shippingCost');
    if (currentStep === 1) {
        shippingDisplay.textContent = 'Calculated at next step';
    } else {
        shippingDisplay.textContent = `¥${shippingCost.toFixed(0)}`;
    }
    
    // Update discount display
    const discountRow = document.getElementById('discountRow');
    if (discount > 0) {
        discountRow.style.display = 'flex';
        document.getElementById('discountAmount').textContent = `-¥${discount.toFixed(0)}`;
    } else {
        discountRow.style.display = 'none';
    }
}

// Handle shipping method change
function handleShippingMethodChange(e) {
    selectedShippingMethod = e.target.value;
    calculateTotals();
    saveCheckoutProgress();
}

// Handle shipping form submission
function handleShippingSubmit(e) {
    e.preventDefault();
    
    // Validate form
    const form = e.target;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Collect shipping data
    shippingData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        apartment: document.getElementById('apartment').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip: document.getElementById('zip').value,
        country: document.getElementById('country').value,
        shippingMethod: selectedShippingMethod
    };
    
    saveCheckoutProgress();
    goToStep(2);
}

// Handle payment form submission
function handlePaymentSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Validate card
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    if (!validateCardNumber(cardNumber)) {
        showToast('Please enter a valid card number', 'error');
        return;
    }
    
    // Collect payment data
    paymentData = {
        method: document.querySelector('input[name="paymentMethod"]:checked').value,
        cardName: document.getElementById('cardName').value,
        cardNumber: maskCardNumber(document.getElementById('cardNumber').value),
        expiry: document.getElementById('expiry').value,
        sameAsShipping: document.getElementById('sameAsShipping').checked
    };
    
    // Populate review section
    populateReviewSection();
    
    saveCheckoutProgress();
    goToStep(3);
}

// Populate review section
function populateReviewSection() {
    // Shipping review
    const reviewShipping = document.getElementById('reviewShipping');
    if (reviewShipping) {
        reviewShipping.innerHTML = `
            <p><strong>${shippingData.firstName} ${shippingData.lastName}</strong></p>
            <p>${shippingData.address}${shippingData.apartment ? ', ' + shippingData.apartment : ''}</p>
            <p>${shippingData.city}, ${shippingData.state} ${shippingData.zip}</p>
            <p>${getCountryName(shippingData.country)}</p>
            <p>${shippingData.email}</p>
            <p>${shippingData.phone}</p>
        `;
    }
    
    // Payment review
    const reviewPayment = document.getElementById('reviewPayment');
    if (reviewPayment) {
        const methodDisplay = {
            'card': 'Credit/Debit Card',
            'paypal': 'PayPal',
            'stripe': 'Stripe'
        };
        
        reviewPayment.innerHTML = `
            <p><strong>${methodDisplay[paymentData.method]}</strong></p>
            ${paymentData.method === 'card' ? `
                <p>${paymentData.cardName}</p>
                <p>•••• •••• •••• ${paymentData.cardNumber.slice(-4)}</p>
                <p>Expires: ${paymentData.expiry}</p>
            ` : ''}
        `;
    }
}

// Navigate to step
function goToStep(step) {
    currentStep = step;
    
    // Hide all steps
    Object.values(steps).forEach(s => {
        if (s) s.classList.add('hidden');
    });
    
    // Show current step
    const stepKey = ['shipping', 'payment', 'review'][step - 1];
    if (steps[stepKey]) {
        steps[stepKey].classList.remove('hidden');
    }
    
    // Update step indicators
    stepIndicators.forEach((indicator, index) => {
        indicator.classList.remove('active', 'completed');
        if (index + 1 < step) {
            indicator.classList.add('completed');
        } else if (index + 1 === step) {
            indicator.classList.add('active');
        }
    });
    
    // Recalculate totals if moving to review
    if (step === 3) {
        calculateTotals();
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle payment method change
function handlePaymentMethodChange(e) {
    // Update visual state
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('active');
    });
    e.target.closest('.payment-method').classList.add('active');
}

// Toggle billing address
function toggleBillingAddress(e) {
    const billingForm = document.getElementById('billingAddressForm');
    if (billingForm) {
        billingForm.classList.toggle('hidden', e.target.checked);
    }
}

// Format card number
function formatCardNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0, 16);
    
    // Add spaces every 4 digits
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = formattedValue;
}

// Detect card type
function detectCardType(e) {
    const value = e.target.value.replace(/\D/g, '');
    const indicator = document.getElementById('cardType');
    
    let type = '';
    if (value.startsWith('4')) {
        type = 'Visa';
    } else if (value.startsWith('5')) {
        type = 'Mastercard';
    } else if (value.startsWith('34') || value.startsWith('37')) {
        type = 'American Express';
    } else if (value.startsWith('6')) {
        type = 'Discover';
    }
    
    if (indicator) {
        indicator.textContent = type || 'Card Type';
    }
}

// Format expiry date
function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0, 4);
    
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    e.target.value = value;
}

// Validate card number (Luhn algorithm)
function validateCardNumber(number) {
    const clean = number.replace(/\D/g, '');
    if (clean.length < 13 || clean.length > 19) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = clean.length - 1; i >= 0; i--) {
        let digit = parseInt(clean.charAt(i), 10);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

// Mask card number
function maskCardNumber(number) {
    const clean = number.replace(/\D/g, '');
    return '•••• •••• •••• ' + clean.slice(-4);
}

// Apply promo code
function applyPromoCode() {
    const input = document.getElementById('promoCode');
    const code = input.value.trim().toUpperCase();
    const message = document.getElementById('promoMessage');
    
    // Mock promo codes
    const promoCodes = {
        'SAVE10': { type: 'percentage', value: 10 },
        'SAVE20': { type: 'percentage', value: 20 },
        'WELCOME': { type: 'fixed', value: 15 },
        'FREESHIP': { type: 'shipping', value: 0 }
    };
    
    if (!code) {
        message.textContent = 'Please enter a promo code';
        message.className = 'promo-message error';
        return;
    }
    
    if (promoCodes[code]) {
        appliedPromo = promoCodes[code];
        message.textContent = `Promo code applied! ${appliedPromo.type === 'percentage' ? appliedPromo.value + '% off' : '¥' + appliedPromo.value + ' off'}`;
        message.className = 'promo-message success';
        calculateTotals();
        showToast('Promo code applied successfully!');
    } else {
        appliedPromo = null;
        message.textContent = 'Invalid promo code';
        message.className = 'promo-message error';
        calculateTotals();
    }
}

// Place order
function placeOrder() {
    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms || !agreeTerms.checked) {
        showToast('Please agree to the Terms of Service', 'error');
        return;
    }
    
    // Show loading state
    const btn = document.getElementById('placeOrderBtn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');
    
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    btn.disabled = true;
    
    // Simulate order processing
    setTimeout(() => {
        // Generate order number
        const orderNumber = 'ORD-' + Date.now();
        
        // Create order object
        const order = {
            orderNumber: orderNumber,
            date: new Date().toISOString(),
            items: cart,
            shipping: shippingData,
            payment: paymentData,
            totals: {
                subtotal: document.getElementById('subtotal').textContent,
                shipping: document.getElementById('shippingCost').textContent,
                discount: appliedPromo ? document.getElementById('discountAmount').textContent : null,
                tax: document.getElementById('taxAmount').textContent,
                total: document.getElementById('totalAmount').textContent
            },
            status: 'confirmed'
        };
        
        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Clear cart
        localStorage.removeItem('cart');
        
        // Clear checkout data
        localStorage.removeItem('checkoutData');
        
        // Track conversion for analytics
        trackConversion(order);
        
        // Redirect to success page
        window.location.href = `order-success.html?order=${orderNumber}`;
    }, 2000);
}

// Save checkout progress
function saveCheckoutProgress() {
    const data = {
        step: currentStep,
        shipping: shippingData,
        payment: paymentData,
        promo: appliedPromo
    };
    localStorage.setItem('checkoutData', JSON.stringify(data));
}

// Populate shipping form
function populateShippingForm(data) {
    Object.keys(data).forEach(key => {
        const field = document.getElementById(key);
        if (field && data[key]) {
            field.value = data[key];
        }
    });
}

// Load saved addresses
function loadSavedAddresses() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const addresses = JSON.parse(localStorage.getItem('savedAddresses') || '[]');
    const container = document.getElementById('addressList');
    
    if (!container || addresses.length === 0) return;
    
    container.innerHTML = addresses.map((addr, index) => `
        <div class="address-item" onclick="selectAddress(${index})">
            <label class="address-radio">
                <input type="radio" name="savedAddress" value="${index}">
                <div class="address-details">
                    <div class="address-name">
                        ${addr.firstName} ${addr.lastName}
                        ${addr.isDefault ? '<span class="default-badge">Default</span>' : ''}
                    </div>
                    <div class="address-line">${addr.address}${addr.apartment ? ', ' + addr.apartment : ''}</div>
                    <div class="address-line">${addr.city}, ${addr.state} ${addr.zip}</div>
                </div>
            </label>
        </div>
    `).join('');
}

// Load saved cards
function loadSavedCards() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const cards = JSON.parse(localStorage.getItem('savedCards') || '[]');
    const container = document.getElementById('cardList');
    
    if (!container || cards.length === 0) return;
    
    container.innerHTML = cards.map((card, index) => `
        <div class="card-item" onclick="selectCard(${index})">
            <label class="card-radio">
                <input type="radio" name="savedCard" value="${index}">
                <div class="card-details">
                    <div class="card-number">
                        •••• •••• •••• ${card.last4}
                        ${card.isDefault ? '<span class="default-badge">Default</span>' : ''}
                    </div>
                    <div class="card-expiry">Expires: ${card.expiry}</div>
                </div>
            </label>
        </div>
    `).join('');
}

// Select saved address
function selectAddress(index) {
    const addresses = JSON.parse(localStorage.getItem('savedAddresses') || '[]');
    const addr = addresses[index];
    
    if (addr) {
        document.getElementById('firstName').value = addr.firstName;
        document.getElementById('lastName').value = addr.lastName;
        document.getElementById('address').value = addr.address;
        document.getElementById('apartment').value = addr.apartment || '';
        document.getElementById('city').value = addr.city;
        document.getElementById('state').value = addr.state;
        document.getElementById('zip').value = addr.zip;
        document.getElementById('country').value = addr.country || 'US';
        
        showToast('Address selected');
    }
}

// Select saved card
function selectCard(index) {
    const cards = JSON.parse(localStorage.getItem('savedCards') || '[]');
    const card = cards[index];
    
    if (card) {
        document.getElementById('cardName').value = card.name;
        document.getElementById('cardNumber').value = '•••• •••• •••• ' + card.last4;
        document.getElementById('expiry').value = card.expiry;
        
        showToast('Card selected');
    }
}

// Save current address
function saveCurrentAddress() {
    const address = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address: document.getElementById('address').value,
        apartment: document.getElementById('apartment').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip: document.getElementById('zip').value,
        country: document.getElementById('country').value,
        isDefault: false
    };
    
    if (!address.firstName || !address.address || !address.city) {
        showToast('Please fill in address details first', 'error');
        return;
    }
    
    const addresses = JSON.parse(localStorage.getItem('savedAddresses') || '[]');
    addresses.push(address);
    localStorage.setItem('savedAddresses', JSON.stringify(addresses));
    
    loadSavedAddresses();
    showToast('Address saved successfully!');
}

// Get country name
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

// Track conversion for analytics
function trackConversion(order) {
    // Google Analytics event (if available)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase', {
            transaction_id: order.orderNumber,
            value: parseFloat(order.totals.total.replace('¥', '')),
            currency: 'CNY',
            items: order.items.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }))
        });
    }
    
    // Meta Pixel (if available)
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Purchase', {
            value: parseFloat(order.totals.total.replace('¥', '')),
            currency: 'CNY'
        });
    }
}

// Show toast notification
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

// Export functions for global access
window.goToStep = goToStep;
window.applyPromoCode = applyPromoCode;
window.placeOrder = placeOrder;
window.saveCurrentAddress = saveCurrentAddress;
window.selectAddress = selectAddress;
window.selectCard = selectCard;
