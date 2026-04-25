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

// B2B Dashboard JavaScript

// Setup Reveal Animations
function initRevealAnimations() {
    const reveals = document.querySelectorAll('[data-reveal]');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(revealCallback, {
        threshold: 0.1
    });

    reveals.forEach(el => observer.observe(el));
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkB2BAuth();
    loadDashboardData();
    setupEventListeners();
    initRevealAnimations();
});

// Check if user is authenticated and verified B2B user
function checkB2BAuth() {
    const user = window.Auth ? window.Auth.getCurrentUser() : JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = 'auth.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }

    if (user.userType !== 'business') {
        window.location.href = 'profile.html';
        return;
    }

    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    const b2bUser = b2bUsers.find(u => u.id === user.id);

    if (!b2bUser || b2bUser.verificationStatus !== 'verified') {
        alert('Your B2B account is pending verification. Please wait for approval.');
        window.location.href = 'profile.html';
        return;
    }
}

// Load Dashboard Data
function loadDashboardData() {
    const user = window.Auth ? window.Auth.getCurrentUser() : JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    const b2bUser = b2bUsers.find(u => u.id === user.id);

    if (!b2bUser) return;

    // Update sidebar user info
    document.getElementById('dashboardCompanyName').textContent = b2bUser.businessInfo.companyName;
    document.getElementById('dashboardBusinessType').textContent = b2bUser.businessInfo.businessType;

    const statusBadge = document.getElementById('verificationStatus');
    statusBadge.textContent = b2bUser.verificationStatus.charAt(0).toUpperCase() + b2bUser.verificationStatus.slice(1);
    statusBadge.className = `b2b-status-badge ${b2bUser.verificationStatus}`;

    // Load overview stats
    loadOverviewStats(b2bUser);

    // Load recent orders
    loadRecentOrders(b2bUser.id);

    // Load orders table
    loadOrdersTable(b2bUser.id);

    // Load analytics
    loadAnalytics(b2bUser.id);

    // Load profile
    loadBusinessProfile(b2bUser);

    // Load RFQs
    loadRFQs(b2bUser.id);
    
    // Load invoices
    loadInvoices(b2bUser.id);
    
    // Load suppliers
    loadSuppliers();
    
    // Load credit info
    loadCreditInfo();
    
    // Load support info
    loadSupportInfo();
}

// Load Overview Stats
function loadOverviewStats(b2bUser) {
    const orders = getB2BOrders(b2bUser.id);
    
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
    
    // Calculate average discount
    let totalDiscount = 0;
    orders.forEach(order => {
        order.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product && product.price) {
                totalDiscount += (product.price - item.price) * item.quantity;
            }
        });
    });
    const avgDiscount = totalSpent > 0 ? Math.round((totalDiscount / totalSpent) * 100) : 0;

    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalSpent').textContent = `¥${totalSpent.toLocaleString()}`;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('avgDiscount').textContent = `${avgDiscount}%`;
}

// Load Recent Orders
function loadRecentOrders(userId) {
    const orders = getB2BOrders(userId);
    const recentOrders = orders.slice(-5).reverse();
    const tbody = document.getElementById('recentOrdersTableBody');

    if (recentOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">No recent orders</td></tr>';
        return;
    }

    tbody.innerHTML = recentOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>${order.items.length} items</td>
            <td>¥${order.total.toLocaleString()}</td>
            <td>
                <span class="b2b-status-badge ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
            </td>
        </tr>
    `).join('');
}

// Load Orders Table
function loadOrdersTable(userId) {
    const orders = getB2BOrders(userId);
    const tbody = document.getElementById('ordersTableBody');

    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No orders yet</td></tr>';
        return;
    }

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>${order.items.length}</td>
            <td>${order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
            <td>¥${order.total.toLocaleString()}</td>
            <td>
                <span class="b2b-status-badge ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="viewOrderDetails(${order.id})">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-sm btn-secondary" onclick="trackOrder(${order.id})">
                    <i class="fas fa-truck"></i> Track
                </button>
            </td>
        </tr>
    `).join('');
}

// Get B2B Orders (mock data for now)
function getB2BOrders(userId) {
    // In production, this would fetch from API
    const storedOrders = JSON.parse(localStorage.getItem('b2bOrders')) || [];
    const userOrders = storedOrders.filter(o => o.userId === userId);
    
    if (userOrders.length === 0) {
        // Return some mock orders for demonstration
        return [
            {
                id: 1001,
                userId: userId,
                date: new Date(Date.now() - 86400000 * 2).toISOString(),
                items: [
                    { productId: 1, quantity: 50, price: 6174 },
                    { productId: 2, quantity: 30, price: 5509 }
                ],
                total: 475870,
                status: 'delivered'
            },
            {
                id: 1002,
                userId: userId,
                date: new Date(Date.now() - 86400000 * 7).toISOString(),
                items: [
                    { productId: 3, quantity: 20, price: 8549 }
                ],
                total: 170980,
                status: 'shipped'
            },
            {
                id: 1003,
                userId: userId,
                date: new Date(Date.now() - 86400000 * 14).toISOString(),
                items: [
                    { productId: 5, quantity: 100, price: 2089 },
                    { productId: 6, quantity: 50, price: 1374 }
                ],
                total: 277700,
                status: 'processing'
            }
        ];
    }

    return userOrders;
}

// Load Analytics
function loadAnalytics(userId) {
    const orders = getB2BOrders(userId);
    
    // Calculate period stats (using all orders for now)
    const periodRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const periodOrders = orders.length;
    
    // Calculate savings
    let totalSavings = 0;
    orders.forEach(order => {
        order.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product && product.price) {
                totalSavings += (product.price - item.price) * item.quantity;
            }
        });
    });

    document.getElementById('periodRevenue').textContent = `¥${periodRevenue.toLocaleString()}`;
    document.getElementById('periodOrders').textContent = periodOrders;
    document.getElementById('periodSavings').textContent = `¥${totalSavings.toLocaleString()}`;
    document.getElementById('repeatRate').textContent = '65%'; // Mock value

    // Load category spending
    loadCategorySpending(orders);
}

// Load Category Spending
function loadCategorySpending(orders) {
    const categorySpending = {};
    
    orders.forEach(order => {
        order.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                const category = product.category;
                const amount = item.price * item.quantity;
                categorySpending[category] = (categorySpending[category] || 0) + amount;
            }
        });
    });

    const container = document.getElementById('categorySpending');
    if (Object.keys(categorySpending).length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px;">No spending data yet</p>';
        return;
    }

    const categoryNames = {
        'phones': 'Mobile Phones',
        'laptops': 'Laptops',
        'accessories': 'Accessories',
        'components': 'Components',
        'gaming': 'Gaming',
        'home': 'Home Electronics'
    };

    const totalSpending = Object.values(categorySpending).reduce((a, b) => a + b, 0);

    container.innerHTML = Object.entries(categorySpending).map(([category, amount]) => {
        const percentage = Math.round((amount / totalSpending) * 100);
        return `
            <div class="category-spending-item">
                <div class="category-name">${categoryNames[category] || category}</div>
                <div class="category-bar">
                    <div class="category-progress" style="width: ${percentage}%"></div>
                </div>
                <div class="category-amount">¥${amount.toLocaleString()} (${percentage}%)</div>
            </div>
        `;
    }).join('');
}

// Load Business Profile
function loadBusinessProfile(b2bUser) {
    const container = document.getElementById('businessProfileDetails');
    const info = b2bUser.businessInfo;

    container.innerHTML = `
        <div class="profile-row">
            <span class="profile-label">Company Name:</span>
            <span class="profile-value">${info.companyName}</span>
        </div>
        <div class="profile-row">
            <span class="profile-label">Business Type:</span>
            <span class="profile-value">${info.businessType}</span>
        </div>
        <div class="profile-row">
            <span class="profile-label">Tax ID:</span>
            <span class="profile-value">${info.taxId}</span>
        </div>
        <div class="profile-row">
            <span class="profile-label">Website:</span>
            <span class="profile-value">${info.website || 'N/A'}</span>
        </div>
        <div class="profile-row">
            <span class="profile-label">Industry:</span>
            <span class="profile-value">${info.industrySector}</span>
        </div>
        <div class="profile-row">
            <span class="profile-label">Annual Volume:</span>
            <span class="profile-value">${info.annualVolume}</span>
        </div>
        <div class="profile-row">
            <span class="profile-label">Contact Person:</span>
            <span class="profile-value">${info.contactPerson}</span>
        </div>
        <div class="profile-row">
            <span class="profile-label">Position:</span>
            <span class="profile-value">${info.contactPosition}</span>
        </div>
        <div class="profile-row">
            <span class="profile-label">Business Email:</span>
            <span class="profile-value">${info.businessEmail}</span>
        </div>
        <div class="profile-row">
            <span class="profile-label">Business Phone:</span>
            <span class="profile-value">${info.businessPhone}</span>
        </div>
        <div class="profile-row">
            <span class="profile-label">Address:</span>
            <span class="profile-value">${info.businessAddress.street}, ${info.businessAddress.city}, ${info.businessAddress.state} ${info.businessAddress.zip}, ${info.businessAddress.country}</span>
        </div>
    `;

    // Load shipping addresses
    loadShippingAddresses(b2bUser);
}

// Load Shipping Addresses
function loadShippingAddresses(b2bUser) {
    const container = document.getElementById('shippingAddresses');
    const address = b2bUser.businessInfo.businessAddress;

    container.innerHTML = `
        <div class="address-card">
            <div class="address-header">
                <span class="address-type">Primary</span>
                <span class="address-default">Default</span>
            </div>
            <div class="address-body">
                <p><strong>Business Address</strong></p>
                <p>${address.street}</p>
                <p>${address.city}, ${address.state} ${address.zip}</p>
                <p>${address.country}</p>
            </div>
        </div>
    `;
}

// Load RFQs
function loadRFQs(userId) {
    const rfqs = JSON.parse(localStorage.getItem('b2bRFQs')) || [];
    const userRFQs = rfqs.filter(r => r.userId === userId);
    const tbody = document.getElementById('rfqTableBody');

    if (userRFQs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No RFQs yet</td></tr>';
        return;
    }

    tbody.innerHTML = userRFQs.map(rfq => `
        <tr>
            <td>#${rfq.id}</td>
            <td>${new Date(rfq.date).toLocaleDateString()}</td>
            <td>${rfq.items.length}</td>
            <td>${rfq.totalQuantity}</td>
            <td>
                <span class="b2b-status-badge ${rfq.status}">${rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="viewRFQDetails(${rfq.id})">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        </tr>
    `).join('');
}

// Load Invoices
function loadInvoices(userId) {
    const invoices = invoiceGenerator.getUserInvoices(userId);
    const tbody = document.getElementById('invoicesTableBody');

    if (invoices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No invoices yet</td></tr>';
        return;
    }

    tbody.innerHTML = invoices.map(invoice => {
        const isOverdue = invoiceGenerator.isOverdue(invoice);
        const termDetails = paymentTermsManager.getTermDetails(invoice.paymentTerms);
        
        return `
            <tr>
                <td><strong>${invoice.id}</strong></td>
                <td>${new Date(invoice.createdAt).toLocaleDateString()}</td>
                <td>¥${invoice.total.toLocaleString()}</td>
                <td>${new Date(invoice.dueDate).toLocaleDateString()}</td>
                <td>${termDetails.name}</td>
                <td>
                    <span class="b2b-status-badge ${isOverdue ? 'rejected' : invoice.status}">${isOverdue ? 'Overdue' : invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="viewInvoice('${invoice.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${invoice.status === 'pending' ? `
                        <button class="btn btn-sm btn-success" onclick="markInvoicePaid('${invoice.id}')">
                            <i class="fas fa-check"></i> Pay
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-secondary" onclick="downloadInvoice('${invoice.id}')">
                        <i class="fas fa-download"></i> PDF
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Filter Invoices
function filterInvoices() {
    const filter = document.getElementById('invoiceFilter').value;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const invoices = invoiceGenerator.getUserInvoices(currentUser.id);
    const tbody = document.getElementById('invoicesTableBody');
    
    let filteredInvoices = invoices;
    
    if (filter !== 'all') {
        filteredInvoices = invoices.filter(i => {
            if (filter === 'overdue') {
                return invoiceGenerator.isOverdue(i);
            }
            return i.status === filter;
        });
    }
    
    if (filteredInvoices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No invoices found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredInvoices.map(invoice => {
        const isOverdue = invoiceGenerator.isOverdue(invoice);
        const termDetails = paymentTermsManager.getTermDetails(invoice.paymentTerms);
        
        return `
            <tr>
                <td><strong>${invoice.id}</strong></td>
                <td>${new Date(invoice.createdAt).toLocaleDateString()}</td>
                <td>¥${invoice.total.toLocaleString()}</td>
                <td>${new Date(invoice.dueDate).toLocaleDateString()}</td>
                <td>${termDetails.name}</td>
                <td>
                    <span class="b2b-status-badge ${isOverdue ? 'rejected' : invoice.status}">${isOverdue ? 'Overdue' : invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="viewInvoice('${invoice.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${invoice.status === 'pending' ? `
                        <button class="btn btn-sm btn-success" onclick="markInvoicePaid('${invoice.id}')">
                            <i class="fas fa-check"></i> Pay
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-secondary" onclick="downloadInvoice('${invoice.id}')">
                        <i class="fas fa-download"></i> PDF
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// View Invoice
function viewInvoice(invoiceId) {
    const invoices = invoiceGenerator.getUserInvoices(JSON.parse(localStorage.getItem('currentUser')).id);
    const invoice = invoices.find(i => i.id === invoiceId);
    
    if (!invoice) {
        showToast('Invoice not found');
        return;
    }
    
    const termDetails = paymentTermsManager.getTermDetails(invoice.paymentTerms);
    const compliance = taxCompliance.checkCompliance(invoice);
    
    const details = `
INVOICE DETAILS:
---------------
Invoice #: ${invoice.id}
Date: ${new Date(invoice.createdAt).toLocaleDateString()}
Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
Payment Terms: ${termDetails.name}
Status: ${invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}

COMPANY INFORMATION:
--------------------
${invoice.companyInfo ? `
Company: ${invoice.companyInfo.companyName}
Tax ID: ${invoice.companyInfo.taxId}
Email: ${invoice.companyInfo.contactEmail}
Phone: ${invoice.companyInfo.contactPhone}
Address: ${invoice.companyInfo.address.street}, ${invoice.companyInfo.address.city}
` : 'N/A'}

LINE ITEMS:
-----------
${invoice.items.map(item => `
${item.productName}
  Quantity: ${item.quantity}
  Unit Price: ¥${item.unitPrice.toLocaleString()}
  Line Total: ¥${item.lineTotal.toLocaleString()}
`).join('')}

SUMMARY:
--------
Subtotal: ¥${invoice.subtotal.toLocaleString()}
Discount: -¥${invoice.discount.toLocaleString()}
Tax: ¥${invoice.tax.toLocaleString()}
TOTAL: ¥${invoice.total.toLocaleString()}

COMPLIANCE STATUS: ${compliance.compliant ? '✓ Compliant' : '✗ Non-Compliant'}
    `;
    
    alert(details);
}

// Mark Invoice as Paid
function markInvoicePaid(invoiceId) {
    if (confirm('Mark this invoice as paid?')) {
        invoiceGenerator.updateInvoiceStatus(invoiceId, 'paid');
        loadInvoices(JSON.parse(localStorage.getItem('currentUser')).id);
        showToast('Invoice marked as paid');
    }
}

// Download Invoice (PDF)
function downloadInvoice(invoiceId) {
    showToast('Invoice PDF download coming soon');
}

// Load Suppliers
function loadSuppliers() {
    const suppliers = supplierManager.getAllSuppliers();
    const tbody = document.getElementById('suppliersTableBody');

    if (suppliers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No suppliers available</td></tr>';
        return;
    }

    tbody.innerHTML = suppliers.map(supplier => {
        const score = supplierManager.calculateSupplierScore(supplier.id);
        
        return `
            <tr>
                <td><strong>${supplier.name}</strong></td>
                <td>
                    <span class="rating-stars">
                        ${'★'.repeat(Math.floor(supplier.rating))}${'☆'.repeat(5 - Math.floor(supplier.rating))}
                    </span>
                    <span style="margin-left: 8px;">${supplier.rating}</span>
                </td>
                <td>${supplier.onTimeDelivery}%</td>
                <td>${supplier.qualityScore}/5</td>
                <td>${supplier.responseTime}h</td>
                <td>
                    <span class="b2b-status-badge ${supplier.status}">${supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="viewSupplierDetails(${supplier.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Filter Suppliers
function filterSuppliers() {
    const filter = document.getElementById('supplierCategoryFilter').value;
    const suppliers = supplierManager.getAllSuppliers();
    const tbody = document.getElementById('suppliersTableBody');
    
    let filteredSuppliers = suppliers;
    
    if (filter !== 'all') {
        filteredSuppliers = suppliers.filter(s => s.productCategories.includes(filter));
    }
    
    if (filteredSuppliers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No suppliers found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredSuppliers.map(supplier => {
        const score = supplierManager.calculateSupplierScore(supplier.id);
        
        return `
            <tr>
                <td><strong>${supplier.name}</strong></td>
                <td>
                    <span class="rating-stars">
                        ${'★'.repeat(Math.floor(supplier.rating))}${'☆'.repeat(5 - Math.floor(supplier.rating))}
                    </span>
                    <span style="margin-left: 8px;">${supplier.rating}</span>
                </td>
                <td>${supplier.onTimeDelivery}%</td>
                <td>${supplier.qualityScore}/5</td>
                <td>${supplier.responseTime}h</td>
                <td>
                    <span class="b2b-status-badge ${supplier.status}">${supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="viewSupplierDetails(${supplier.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// View Supplier Details
function viewSupplierDetails(supplierId) {
    const supplier = supplierManager.getSupplierById(supplierId);
    
    if (!supplier) {
        showToast('Supplier not found');
        return;
    }
    
    const score = supplierManager.calculateSupplierScore(supplier.id);
    
    const details = `
SUPPLIER DETAILS:
---------------
Name: ${supplier.name}
Code: ${supplier.code}
Contact: ${supplier.contact}
Email: ${supplier.email}
Phone: ${supplier.phone}
Status: ${supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}

ADDRESS:
--------
${supplier.address.street}
${supplier.address.city}, ${supplier.address.state} ${supplier.address.zip}
${supplier.address.country}

PRODUCT CATEGORIES:
-------------------
${supplier.productCategories.join(', ')}

PERFORMANCE METRICS:
--------------------
Rating: ${supplier.rating}/5
On-Time Delivery: ${supplier.onTimeDelivery}%
Quality Score: ${supplier.qualityScore}/5
Response Time: ${supplier.responseTime} hours
Total Orders: ${supplier.totalOrders}
Overall Score: ${score}/100
    `;
    
    alert(details);
}

// Load Credit Info
function loadCreditInfo() {
    const user = window.Auth ? window.Auth.getCurrentUser() : JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    const b2bUser = b2bUsers.find(u => u.id === user.id);
    
    if (!b2bUser) return;
    
    const creditScore = creditSystem.getCreditScore(b2bUser.id);
    const creditTier = creditSystem.getCreditTier(b2bUser.id);
    const creditLimit = creditSystem.getCreditLimit(b2bUser.id);
    const availableCredit = creditSystem.getAvailableCredit(b2bUser.id);
    const usedCredit = creditSystem.getUsedCredit(b2bUser.id);
    
    document.getElementById('creditScoreValue').textContent = creditScore;
    document.getElementById('creditTierValue').textContent = creditTier.name;
    document.getElementById('creditLimitValue').textContent = '¥' + creditLimit.toLocaleString();
    document.getElementById('availableCreditValue').textContent = '¥' + availableCredit.toLocaleString();
    document.getElementById('creditUtilizationValue').textContent = Math.round((usedCredit / creditLimit) * 100) + '% used';
    document.getElementById('usedCreditValue').textContent = '¥' + usedCredit.toLocaleString();
    
    // Load credit history
    const creditHistory = creditSystem.getCreditHistory(b2bUser.id);
    const tbody = document.getElementById('creditHistoryTableBody');
    
    if (creditHistory.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px;">No credit history yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = creditHistory.map(transaction => `
        <tr>
            <td>${new Date(transaction.date).toLocaleDateString()}</td>
            <td>
                <span class="b2b-status-badge ${transaction.type === 'payment' ? 'approved' : 'pending'}">
                    ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </span>
            </td>
            <td>¥${transaction.amount.toLocaleString()}</td>
            <td>Completed</td>
        </tr>
    `).join('');
}

// Load Support Info
function loadSupportInfo() {
    const user = window.Auth ? window.Auth.getCurrentUser() : JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    const b2bUser = b2bUsers.find(u => u.id === user.id);
    
    if (!b2bUser) return;
    
    const supportTier = supportManager.getSupportTier(b2bUser.id);
    const dedicatedAgent = supportManager.getDedicatedAgent(b2bUser.id);
    const tickets = supportManager.getUserTickets(b2bUser.id);
    const openTickets = tickets.filter(t => t.status === 'open').length;
    
    document.getElementById('supportTierValue').textContent = supportTier.name;
    document.getElementById('supportResponseTime').textContent = supportTier.responseTime + 'h response';
    document.getElementById('dedicatedAgentValue').textContent = dedicatedAgent ? dedicatedAgent.name : 'Not assigned';
    document.getElementById('agentAvailability').textContent = dedicatedAgent ? (dedicatedAgent.available ? 'Available' : 'Busy') : '-';
    document.getElementById('openTicketsValue').textContent = openTickets;
    
    // Load support tickets
    const tbody = document.getElementById('supportTicketsTableBody');
    
    if (tickets.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No support tickets yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = tickets.map(ticket => `
        <tr>
            <td><strong>${ticket.id}</strong></td>
            <td>${ticket.issue.substring(0, 50)}${ticket.issue.length > 50 ? '...' : ''}</td>
            <td>
                <span class="b2b-status-badge ${ticket.priority === 'high' ? 'rejected' : 'pending'}">${ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</span>
            </td>
            <td>
                <span class="b2b-status-badge ${ticket.status}">${ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</span>
            </td>
            <td>${new Date(ticket.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="viewSupportTicket('${ticket.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        </tr>
    `).join('');
}

// Show Support Ticket Modal
function showSupportTicketModal() {
    const issue = prompt('Describe your issue:');
    if (issue) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
        const b2bUser = b2bUsers.find(u => u.id === currentUser.id);
        
        if (b2bUser) {
            supportManager.createSupportTicket(b2bUser.id, issue);
            loadSupportInfo();
            showToast('Support ticket created successfully');
        }
    }
}

// View Support Ticket
function viewSupportTicket(ticketId) {
    const tickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (!ticket) {
        showToast('Ticket not found');
        return;
    }
    
    const details = `
SUPPORT TICKET DETAILS:
-----------------------
Ticket #: ${ticket.id}
Priority: ${ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
Status: ${ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
Support Tier: ${ticket.tier}
Created: ${new Date(ticket.createdAt).toLocaleString()}

ISSUE:
-------
${ticket.issue}
    `;
    
    alert(details);
}

// Show Dashboard Section
function showDashboardSection(section) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(el => el.style.display = 'none');
    
    // Show selected section
    document.getElementById(section + 'Section').style.display = 'block';
    
    // Update active nav item
    document.querySelectorAll('.b2b-sidebar-menu .nav-item').forEach(el => el.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
}

// Filter Orders
function filterB2BOrders() {
    const filter = document.getElementById('orderFilter').value;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const orders = getB2BOrders(currentUser.id);
    
    let filteredOrders = orders;
    if (filter !== 'all') {
        filteredOrders = orders.filter(o => o.status === filter);
    }

    const tbody = document.getElementById('ordersTableBody');
    if (filteredOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No orders found</td></tr>';
        return;
    }

    tbody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>${order.items.length}</td>
            <td>${order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
            <td>¥${order.total.toLocaleString()}</td>
            <td>
                <span class="b2b-status-badge ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="viewOrderDetails(${order.id})">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-sm btn-secondary" onclick="trackOrder(${order.id})">
                    <i class="fas fa-truck"></i> Track
                </button>
            </td>
        </tr>
    `).join('');
}

// Update B2B Analytics
function updateB2BAnalytics() {
    showToast('Analytics updated');
}

// View Order Details
function viewOrderDetails(orderId) {
    showToast(`Viewing order #${orderId}`);
}

// Track Order
function trackOrder(orderId) {
    showToast(`Tracking order #${orderId}`);
}

// Edit Business Profile
function editBusinessProfile() {
    showToast('Profile editor coming soon');
}

// Add Shipping Address
function addShippingAddress() {
    showToast('Address form coming soon');
}

// Change Password
function changePassword() {
    showToast('Password change form coming soon');
}

// Update Documents
function updateDocuments() {
    showToast('Document upload coming soon');
}

// Create New RFQ
function createNewRFQ() {
    showToast('RFQ creation form coming soon');
}

// View RFQ Details
function viewRFQDetails(rfqId) {
    showToast(`Viewing RFQ #${rfqId}`);
}

// Export B2B Report
function exportB2BReport(type) {
    showToast(`Exporting ${type} report`);
}

// Setup Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    window.toggleMobileMenu = toggleMobileMenu;
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 3000);
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Exports
window.showDashboardSection = showDashboardSection;
window.filterB2BOrders = filterB2BOrders;
window.updateB2BAnalytics = updateB2BAnalytics;
window.viewOrderDetails = viewOrderDetails;
window.trackOrder = trackOrder;
window.editBusinessProfile = editBusinessProfile;
window.addShippingAddress = addShippingAddress;
window.changePassword = changePassword;
window.updateDocuments = updateDocuments;
window.createNewRFQ = createNewRFQ;
window.viewRFQDetails = viewRFQDetails;
window.exportB2BReport = exportB2BReport;
window.logout = logout;
window.loadInvoices = loadInvoices;
window.filterInvoices = filterInvoices;
window.viewInvoice = viewInvoice;
window.markInvoicePaid = markInvoicePaid;
window.downloadInvoice = downloadInvoice;
window.loadSuppliers = loadSuppliers;
window.filterSuppliers = filterSuppliers;
window.viewSupplierDetails = viewSupplierDetails;
window.loadCreditInfo = loadCreditInfo;
window.loadSupportInfo = loadSupportInfo;
window.showSupportTicketModal = showSupportTicketModal;
window.viewSupportTicket = viewSupportTicket;
