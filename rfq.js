// RFQ (Request for Quotation) JavaScript

// Initialize RFQ Page
document.addEventListener('DOMContentLoaded', function() {
    checkB2BAuth();
    setDefaultDeadline();
});

// Check if user is authenticated and verified B2B user
function checkB2BAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'auth.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }

    if (currentUser.userType !== 'business') {
        window.location.href = 'index.html';
        return;
    }

    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    const b2bUser = b2bUsers.find(u => u.id === currentUser.id);

    if (!b2bUser || b2bUser.verificationStatus !== 'verified') {
        alert('Your B2B account is pending verification. Please wait for approval.');
        window.location.href = 'b2b-dashboard.html';
        return;
    }

    // Pre-fill shipping address from business profile
    if (b2bUser) {
        const address = b2bUser.businessInfo.businessAddress;
        document.getElementById('shippingAddress').value = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
        document.getElementById('shippingCity').value = address.city;
        document.getElementById('shippingCountry').value = address.country;
    }
}

// Set default deadline to 30 days from now
function setDefaultDeadline() {
    const deadline = document.getElementById('rfqDeadline');
    const today = new Date();
    const defaultDate = new Date(today.setDate(today.getDate() + 30));
    deadline.value = defaultDate.toISOString().split('T')[0];
}

// Add Product to RFQ
function addProduct() {
    const productsContainer = document.getElementById('rfqProducts');
    const productItem = document.createElement('div');
    productItem.className = 'rfq-product-item';
    productItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Product *</label>
                <select class="product-select" required>
                    <option value="">Select product</option>
                    <option value="1">iPhone 15 Pro Max 256GB</option>
                    <option value="2">Samsung Galaxy S24 Ultra</option>
                    <option value="3">MacBook Pro M3 14-inch</option>
                    <option value="4">Dell XPS 15 OLED</option>
                    <option value="5">Sony WH-1000XM5 Headphones</option>
                    <option value="6">AirPods Pro 2nd Gen</option>
                    <option value="7">RTX 4090 Graphics Card</option>
                    <option value="8">AMD Ryzen 9 7950X</option>
                    <option value="9">PlayStation 5 Console</option>
                    <option value="10">Xbox Series X</option>
                </select>
            </div>
            <div class="form-group">
                <label>Quantity *</label>
                <input type="number" class="product-quantity" placeholder="Quantity" min="10" required>
            </div>
        </div>
        <button type="button" class="btn btn-sm btn-danger remove-product-btn" onclick="removeProduct(this)">
            <i class="fas fa-times"></i> Remove
        </button>
    `;
    productsContainer.appendChild(productItem);
}

// Remove Product from RFQ
function removeProduct(button) {
    const productsContainer = document.getElementById('rfqProducts');
    if (productsContainer.children.length > 1) {
        button.parentElement.remove();
    } else {
        showToast('At least one product is required');
    }
}

// Submit RFQ
function submitRFQ(event) {
    event.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Gather RFQ data
    const rfqData = {
        id: Date.now(),
        userId: currentUser.id,
        title: document.getElementById('rfqTitle').value,
        description: document.getElementById('rfqDescription').value,
        budget: document.getElementById('rfqBudget').value || null,
        deadline: document.getElementById('rfqDeadline').value,
        category: document.getElementById('rfqCategory').value,
        products: [],
        shipping: {
            address: document.getElementById('shippingAddress').value,
            city: document.getElementById('shippingCity').value,
            country: document.getElementById('shippingCountry').value,
            method: document.getElementById('shippingMethod').value
        },
        paymentTerms: document.getElementById('paymentTerms').value,
        certifications: Array.from(document.getElementById('certifications').selectedOptions).map(opt => opt.value),
        sampleRequired: document.getElementById('sampleRequired').checked,
        customPackaging: document.getElementById('customPackaging').checked,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    // Gather products
    const productItems = document.querySelectorAll('.rfq-product-item');
    let totalQuantity = 0;
    productItems.forEach(item => {
        const productId = item.querySelector('.product-select').value;
        const quantity = parseInt(item.querySelector('.product-quantity').value);
        if (productId && quantity) {
            const product = products.find(p => p.id === parseInt(productId));
            rfqData.products.push({
                productId: parseInt(productId),
                productName: product ? product.name : 'Unknown',
                quantity: quantity
            });
            totalQuantity += quantity;
        }
    });

    rfqData.totalQuantity = totalQuantity;

    // Validate
    if (rfqData.products.length === 0) {
        showToast('Please add at least one product');
        return;
    }

    // Save RFQ
    let rfqs = JSON.parse(localStorage.getItem('b2bRFQs')) || [];
    rfqs.push(rfqData);
    localStorage.setItem('b2bRFQs', JSON.stringify(rfqs));

    // Show success message
    showToast('RFQ submitted successfully!');

    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'b2b-dashboard.html';
    }, 2000);
}

// Save RFQ as Draft
function saveDraft() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Gather RFQ data
    const rfqData = {
        id: Date.now(),
        userId: currentUser.id,
        title: document.getElementById('rfqTitle').value || 'Untitled RFQ',
        description: document.getElementById('rfqDescription').value || '',
        budget: document.getElementById('rfqBudget').value || null,
        deadline: document.getElementById('rfqDeadline').value,
        category: document.getElementById('rfqCategory').value || '',
        products: [],
        shipping: {
            address: document.getElementById('shippingAddress').value || '',
            city: document.getElementById('shippingCity').value || '',
            country: document.getElementById('shippingCountry').value || '',
            method: document.getElementById('shippingMethod').value || 'standard'
        },
        paymentTerms: document.getElementById('paymentTerms').value || 'net30',
        certifications: Array.from(document.getElementById('certifications').selectedOptions).map(opt => opt.value),
        sampleRequired: document.getElementById('sampleRequired').checked,
        customPackaging: document.getElementById('customPackaging').checked,
        status: 'draft',
        createdAt: new Date().toISOString()
    };

    // Gather products
    const productItems = document.querySelectorAll('.rfq-product-item');
    let totalQuantity = 0;
    productItems.forEach(item => {
        const productId = item.querySelector('.product-select').value;
        const quantity = parseInt(item.querySelector('.product-quantity').value);
        if (productId && quantity) {
            const product = products.find(p => p.id === parseInt(productId));
            rfqData.products.push({
                productId: parseInt(productId),
                productName: product ? product.name : 'Unknown',
                quantity: quantity
            });
            totalQuantity += quantity;
        }
    });

    rfqData.totalQuantity = totalQuantity;

    // Save draft
    let drafts = JSON.parse(localStorage.getItem('b2bRFQDrafts')) || [];
    drafts.push(rfqData);
    localStorage.setItem('b2bRFQDrafts', JSON.stringify(drafts));

    showToast('RFQ saved as draft');
}

// Get RFQ by ID
function getRFQById(rfqId) {
    const rfqs = JSON.parse(localStorage.getItem('b2bRFQs')) || [];
    return rfqs.find(r => r.id === rfqId);
}

// Get RFQs for User
function getUserRFQs(userId) {
    const rfqs = JSON.parse(localStorage.getItem('b2bRFQs')) || [];
    return rfqs.filter(r => r.userId === userId);
}

// Get All RFQs (for admin)
function getAllRFQs() {
    return JSON.parse(localStorage.getItem('b2bRFQs')) || [];
}

// Update RFQ Status
function updateRFQStatus(rfqId, status) {
    const rfqs = JSON.parse(localStorage.getItem('b2bRFQs')) || [];
    const rfqIndex = rfqs.findIndex(r => r.id === rfqId);
    
    if (rfqIndex !== -1) {
        rfqs[rfqIndex].status = status;
        rfqs[rfqIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('b2bRFQs', JSON.stringify(rfqs));
        return true;
    }
    
    return false;
}

// Add Quote to RFQ
function addQuoteToRFQ(rfqId, quoteData) {
    const rfqs = JSON.parse(localStorage.getItem('b2bRFQs')) || [];
    const rfqIndex = rfqs.findIndex(r => r.id === rfqId);
    
    if (rfqIndex !== -1) {
        if (!rfqs[rfqIndex].quotes) {
            rfqs[rfqIndex].quotes = [];
        }
        rfqs[rfqIndex].quotes.push({
            id: Date.now(),
            ...quoteData,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('b2bRFQs', JSON.stringify(rfqs));
        return true;
    }
    
    return false;
}

// Add Message to RFQ Thread
function addRFQMessage(rfqId, message, sender) {
    const rfqs = JSON.parse(localStorage.getItem('b2bRFQs')) || [];
    const rfqIndex = rfqs.findIndex(r => r.id === rfqId);
    
    if (rfqIndex !== -1) {
        if (!rfqs[rfqIndex].messages) {
            rfqs[rfqIndex].messages = [];
        }
        rfqs[rfqIndex].messages.push({
            id: Date.now(),
            message: message,
            sender: sender,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('b2bRFQs', JSON.stringify(rfqs));
        return true;
    }
    
    return false;
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 3000);
}

// Exports
window.addProduct = addProduct;
window.removeProduct = removeProduct;
window.submitRFQ = submitRFQ;
window.saveDraft = saveDraft;
window.getRFQById = getRFQById;
window.getUserRFQs = getUserRFQs;
window.getAllRFQs = getAllRFQs;
window.updateRFQStatus = updateRFQStatus;
window.addQuoteToRFQ = addQuoteToRFQ;
window.addRFQMessage = addRFQMessage;
