/**
 * 1688 Electronic Mart - Admin Panel
 */

let products = [];
let orders = [];
let customers = [];
let currentProductPage = 1;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    loadData();
    setupEventListeners();
    updateDashboard();
    renderProductsTable();
    renderOrdersTable();
    renderB2BUsersTable();
    updatePendingB2BBadge();
    renderRFQTable();
    updatePendingRFQBadge();
    renderPromotionsTable();
    renderAdminInvoicesTable();
    updatePendingInvoiceBadge();
    renderSuppliersTable();
});

function checkAdminAuth() {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        window.location.href = 'auth.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }
    const u = JSON.parse(user);
    document.getElementById('adminName').textContent = u.firstName || 'Admin';
}

function loadData() {
    // Load from localStorage or use mock data
    const savedProducts = localStorage.getItem('adminProducts');
    const savedOrders = localStorage.getItem('orders');
    
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Mock products
        products = [
            { id: 1, name: 'iPhone 15 Pro Max', sku: 'APL-001', category: 'phones', price: 899.99, stock: 45, status: 'active' },
            { id: 2, name: 'Samsung Galaxy S24', sku: 'SAM-001', category: 'phones', price: 799.99, stock: 32, status: 'active' },
            { id: 3, name: 'MacBook Pro 16"', sku: 'APL-002', category: 'laptops', price: 2499.99, stock: 12, status: 'active' },
            { id: 4, name: 'Sony WH-1000XM5', sku: 'SNY-001', category: 'accessories', price: 348.99, stock: 78, status: 'active' },
            { id: 5, name: 'Gaming Mouse RGB', sku: 'GAM-001', category: 'gaming', price: 59.99, stock: 150, status: 'active' },
            { id: 6, name: 'USB-C Cable 3-pack', sku: 'ACC-001', category: 'accessories', price: 12.99, stock: 200, status: 'active' },
            { id: 7, name: 'NVIDIA RTX 4090', sku: 'GPU-001', category: 'components', price: 1599.99, stock: 5, status: 'active' },
            { id: 8, name: 'Wireless Keyboard', sku: 'ACC-002', category: 'accessories', price: 89.99, stock: 0, status: 'outofstock' }
        ];
    }
    
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    } else {
        orders = [];
    }
}

function setupEventListeners() {
    // Tab switching in product modal
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(tab + 'Tab').classList.add('active');
        });
    });
    
    // Close modals on outside click
    document.querySelectorAll('.admin-modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
            }
        });
    });
}

// Dashboard Functions
function updateDashboard() {
    // Calculate stats
    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.totals?.total?.replace('¥', '') || 0), 0);
    const totalOrders = orders.length;
    const totalCustomers = new Set(orders.map(o => o.shipping?.email)).size;
    const totalProducts = products.length;
    
    document.getElementById('totalRevenue').textContent = '¥' + totalRevenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalCustomers').textContent = totalCustomers || 1;
    document.getElementById('totalProducts').textContent = totalProducts;
    
    // Recent orders
    renderAdminRecentOrders();
    renderTopProducts();
    renderTrafficSources();
}

function renderAdminRecentOrders() {
    const container = document.getElementById('adminRecentOrders');
    if (!container) return;
    
    const recent = orders.slice(0, 5);
    
    if (recent.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:2rem;">No orders yet</p>';
        return;
    }
    
    container.innerHTML = recent.map(order => `
        <div class="order-row">
            <div class="order-row-info">
                <span class="order-id">${order.orderNumber}</span>
                <span class="order-customer">${order.shipping?.firstName} ${order.shipping?.lastName}</span>
            </div>
            <span class="order-amount">${order.totals?.total || '¥0'}</span>
            <span class="status-badge ${order.status}">${order.status}</span>
        </div>
    `).join('');
}

function renderTopProducts() {
    const container = document.getElementById('topProducts');
    if (!container) return;
    
    const topProducts = [...products].sort((a, b) => b.stock - a.stock).slice(0, 5);
    
    container.innerHTML = topProducts.map((p, i) => `
        <div class="product-row">
            <span class="product-rank">${i + 1}</span>
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-sales">${p.stock} in stock</div>
            </div>
            <span class="product-revenue">¥${p.price}</span>
        </div>
    `).join('');
}

function renderTrafficSources() {
    const container = document.getElementById('trafficSources');
    if (!container) return;
    
    const sources = [
        { name: 'Direct', value: 45 },
        { name: 'Social', value: 30 },
        { name: 'Organic', value: 15 },
        { name: 'Referral', value: 10 }
    ];
    
    container.innerHTML = sources.map(s => `
        <div class="traffic-item">
            <span class="traffic-label">${s.name}</span>
            <div class="traffic-bar">
                <div class="traffic-fill" style="width: ${s.value}%"></div>
            </div>
            <span class="traffic-value">${s.value}%</span>
        </div>
    `).join('');
}

// Navigation
function showSection(section) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById(section + 'Section').classList.add('active');
    document.querySelector(`.nav-item[data-section="${section}"]`).classList.add('active');
    
    // On mobile, close sidebar
    if (window.innerWidth < 768) {
        document.getElementById('adminSidebar').classList.remove('show');
        document.querySelector('.sidebar-overlay')?.classList.remove('show');
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    sidebar.classList.toggle('collapsed');
    sidebar.classList.toggle('show');
}

// Products
function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    let filtered = products;
    
    // Apply filters
    const category = document.getElementById('categoryFilter')?.value;
    const status = document.getElementById('statusFilter')?.value;
    const sort = document.getElementById('sortFilter')?.value;
    const search = document.getElementById('productSearch')?.value.toLowerCase();
    
    if (category) filtered = filtered.filter(p => p.category === category);
    if (status) filtered = filtered.filter(p => p.status === status);
    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
    
    // Sort
    switch(sort) {
        case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
        case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
        case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
        default: filtered.sort((a, b) => b.id - a.id);
    }
    
    tbody.innerHTML = filtered.map(p => `
        <tr>
            <td><input type="checkbox"></td>
            <td>
                <div class="product-cell">
                    <img src="https://via.placeholder.com/50" alt="${p.name}">
                    <div class="product-cell-info">
                        <div class="product-cell-name">${p.name}</div>
                        <div class="product-cell-variant">${p.category}</div>
                    </div>
                </div>
            </td>
            <td>${p.sku}</td>
            <td>${p.category}</td>
            <td>¥${p.price.toFixed(0)}</td>
            <td>${p.stock}</td>
            <td><span class="status-badge ${p.status}">${p.status}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn" onclick="editProduct(${p.id})"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
    
    document.getElementById('productsShowing').textContent = `Showing ${filtered.length} of ${products.length} products`;
}

function searchProducts() {
    renderProductsTable();
}

function filterProducts() {
    renderProductsTable();
}

function sortProducts() {
    renderProductsTable();
}

function showProductModal() {
    document.getElementById('productModalTitle').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('productModal').classList.add('show');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('show');
}

function saveProduct(e) {
    e.preventDefault();
    
    const product = {
        id: Date.now(),
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        category: document.getElementById('productCategory').value,
        brand: document.getElementById('productBrand').value,
        price: parseFloat(document.getElementById('productPrice').value),
        sku: document.getElementById('productSKU').value,
        stock: parseInt(document.getElementById('productQuantity').value),
        status: document.getElementById('productStatus').value
    };
    
    products.push(product);
    localStorage.setItem('adminProducts', JSON.stringify(products));
    
    closeProductModal();
    renderProductsTable();
    updateDashboard();
    showToast('Product saved successfully');
}

function editProduct(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    
    document.getElementById('productModalTitle').textContent = 'Edit Product';
    document.getElementById('productName').value = p.name;
    document.getElementById('productCategory').value = p.category;
    document.getElementById('productPrice').value = p.price;
    document.getElementById('productSKU').value = p.sku;
    document.getElementById('productQuantity').value = p.stock;
    document.getElementById('productStatus').value = p.status;
    
    document.getElementById('productModal').classList.add('show');
}

function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    products = products.filter(p => p.id !== id);
    localStorage.setItem('adminProducts', JSON.stringify(products));
    renderProductsTable();
    updateDashboard();
    showToast('Product deleted');
}

function previewImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        document.getElementById('imagePreview').innerHTML = `<img src="${event.target.result}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
}

// Orders
function renderOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    
    let filtered = orders;
    
    const status = document.getElementById('orderStatusFilter')?.value;
    const search = document.getElementById('orderSearch')?.value.toLowerCase();
    
    if (status) filtered = filtered.filter(o => o.status === status);
    if (search) filtered = filtered.filter(o => 
        o.orderNumber?.toLowerCase().includes(search) ||
        o.shipping?.email?.toLowerCase().includes(search)
    );
    
    tbody.innerHTML = filtered.map(o => `
        <tr>
            <td><strong>${o.orderNumber}</strong></td>
            <td>${o.shipping?.firstName} ${o.shipping?.lastName}</td>
            <td>${new Date(o.date).toLocaleDateString()}</td>
            <td><strong>${o.totals?.total || '$0.00'}</strong></td>
            <td><span class="status-badge ${o.status}">${o.status}</span></td>
            <td>Paid</td>
            <td>
                <div class="action-btns">
                    <button class="action-btn" onclick="viewOrder('${o.orderNumber}')"><i class="fas fa-eye"></i></button>
                    <button class="action-btn" onclick="updateOrderStatus('${o.orderNumber}')"><i class="fas fa-edit"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function searchOrders() {
    renderOrdersTable();
}

function filterOrders() {
    renderOrdersTable();
}

function viewOrder(orderNumber) {
    const order = orders.find(o => o.orderNumber === orderNumber);
    if (!order) return;
    
    const content = document.getElementById('orderDetailContent');
    content.innerHTML = `
        <div style="padding:1.5rem;">
            <p><strong>Order:</strong> ${order.orderNumber}</p>
            <p><strong>Customer:</strong> ${order.shipping?.firstName} ${order.shipping?.lastName}</p>
            <p><strong>Email:</strong> ${order.shipping?.email}</p>
            <p><strong>Total:</strong> ${order.totals?.total || '¥0'}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <hr style="margin:1rem 0;">
            <p><strong>Items:</strong></p>
            <ul>${order.items?.map(i => `<li>${i.name} x${i.quantity}</li>`).join('') || '<li>No items</li>'}</ul>
        </div>
    `;
    document.getElementById('orderModal').classList.add('show');
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('show');
}

function updateOrderStatus(orderNumber) {
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const order = orders.find(o => o.orderNumber === orderNumber);
    if (!order) return;
    
    const currentIndex = statuses.indexOf(order.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    order.status = nextStatus;
    localStorage.setItem('orders', JSON.stringify(orders));
    renderOrdersTable();
    showToast(`Order status updated to ${nextStatus}`);
}

function exportOrders() {
    const csv = convertToCSV(orders);
    downloadCSV(csv, 'orders.csv');
    showToast('Orders exported');
}

// Customers
function renderCustomersTable() {
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;
    
    // Extract unique customers from orders
    const customerMap = new Map();
    orders.forEach(o => {
        const email = o.shipping?.email;
        if (!email) return;
        
        if (!customerMap.has(email)) {
            customerMap.set(email, {
                name: `${o.shipping?.firstName} ${o.shipping?.lastName}`,
                email: email,
                orders: 0,
                spent: 0,
                joined: o.date
            });
        }
        
        const c = customerMap.get(email);
        c.orders++;
        c.spent += parseFloat(o.totals?.total?.replace('¥', '') || 0);
    });
    
    customers = Array.from(customerMap.values());
    
    tbody.innerHTML = customers.map(c => `
        <tr>
            <td><strong>${c.name}</strong></td>
            <td>${c.email}</td>
            <td>${c.orders}</td>
            <td>¥${c.spent.toFixed(0)}</td>
            <td>${new Date(c.joined).toLocaleDateString()}</td>
            <td><span class="status-badge active">Active</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn"><i class="fas fa-eye"></i></button>
                    <button class="action-btn"><i class="fas fa-envelope"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function searchCustomers() {
    renderCustomersTable();
}

function exportCustomers() {
    showToast('Customers exported');
}

// Helpers
function showToast(message) {
    const toast = document.getElementById('adminToast');
    document.getElementById('adminToastMessage').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function convertToCSV(data) {
    if (!data.length) return '';
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(h => JSON.stringify(obj[h] || '')).join(','));
    return [headers.join(','), ...rows].join('\n');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

function adminLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function showNotifications() {
    showToast('No new notifications');
}

function refreshChart() {
    showToast('Chart refreshed');
}

function updateDashboard() {
    updateDashboard();
}

function updateAnalytics() {
    showToast('Analytics updated');
}

function showCategoryModal() {
    showToast('Feature coming soon');
}

// B2B User Management Functions
function renderB2BUsersTable() {
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    const tbody = document.getElementById('b2bUsersTableBody');
    
    if (!tbody) return;
    
    if (b2bUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No B2B users registered yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = b2bUsers.map(user => `
        <tr>
            <td><strong>${user.businessInfo.companyName}</strong></td>
            <td>${user.businessInfo.businessType}</td>
            <td>${user.businessInfo.contactPerson}</td>
            <td>${user.email}</td>
            <td>${user.businessInfo.annualVolume}</td>
            <td>
                <span class="b2b-status-badge ${user.verificationStatus}">
                    ${user.verificationStatus.charAt(0).toUpperCase() + user.verificationStatus.slice(1)}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="viewB2BDocuments(${user.id})">
                    <i class="fas fa-file-alt"></i> View
                </button>
            </td>
            <td>
                ${user.verificationStatus === 'pending' ? `
                    <button class="btn btn-sm btn-success" onclick="verifyB2BUser(${user.id})">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="rejectB2BUser(${user.id})">
                        <i class="fas fa-times"></i> Reject
                    </button>
                ` : user.verificationStatus === 'verified' ? `
                    <button class="btn btn-sm btn-secondary" onclick="viewB2BUser(${user.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                ` : `
                    <button class="btn btn-sm btn-secondary" onclick="viewB2BUser(${user.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                `}
            </td>
        </tr>
    `).join('');
}

function verifyB2BUser(userId) {
    if (confirm('Are you sure you want to verify this B2B user?')) {
        const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
        const userIndex = b2bUsers.findIndex(user => user.id === userId);
        
        if (userIndex !== -1) {
            b2bUsers[userIndex].verificationStatus = 'verified';
            b2bUsers[userIndex].verificationDate = new Date().toISOString();
            localStorage.setItem('b2bUsers', JSON.stringify(b2bUsers));
            
            renderB2BUsersTable();
            updatePendingB2BBadge();
            showToast('B2B user verified successfully');
        }
    }
}

function rejectB2BUser(userId) {
    const reason = prompt('Please enter rejection reason:');
    if (reason) {
        const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
        const userIndex = b2bUsers.findIndex(user => user.id === userId);
        
        if (userIndex !== -1) {
            b2bUsers[userIndex].verificationStatus = 'rejected';
            b2bUsers[userIndex].rejectionReason = reason;
            localStorage.setItem('b2bUsers', JSON.stringify(b2bUsers));
            
            renderB2BUsersTable();
            updatePendingB2BBadge();
            showToast('B2B user rejected');
        }
    }
}

function viewB2BDocuments(userId) {
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    const user = b2bUsers.find(u => u.id === userId);
    
    if (user) {
        const docs = user.documents;
        alert(`Documents for ${user.businessInfo.companyName}:\n\n` +
              `Business License: ${docs.businessLicense}\n` +
              `Tax Document: ${docs.taxDocument}\n` +
              `Address Proof: ${docs.addressProof}\n` +
              (docs.additionalDoc ? `Additional: ${docs.additionalDoc}` : ''));
    }
}

function viewB2BUser(userId) {
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    const user = b2bUsers.find(u => u.id === userId);
    
    if (user) {
        const info = user.businessInfo;
        alert(`Business Information:\n\n` +
              `Company: ${info.companyName}\n` +
              `Type: ${info.businessType}\n` +
              `Tax ID: ${info.taxId}\n` +
              `Website: ${info.website || 'N/A'}\n` +
              `Industry: ${info.industrySector}\n` +
              `Annual Volume: ${info.annualVolume}\n\n` +
              `Contact:\n` +
              `Name: ${info.contactPerson}\n` +
              `Position: ${info.contactPosition}\n` +
              `Email: ${info.businessEmail}\n` +
              `Phone: ${info.businessPhone}\n\n` +
              `Address:\n` +
              `${info.businessAddress.street}\n` +
              `${info.businessAddress.city}, ${info.businessAddress.state} ${info.businessAddress.zip}\n` +
              `${info.businessAddress.country}`);
    }
}

function filterB2BUsers() {
    const filter = document.getElementById('b2bFilter').value;
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    const tbody = document.getElementById('b2bUsersTableBody');
    
    let filteredUsers = b2bUsers;
    
    if (filter !== 'all') {
        filteredUsers = b2bUsers.filter(user => user.verificationStatus === filter);
    }
    
    if (filteredUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No B2B users found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredUsers.map(user => `
        <tr>
            <td><strong>${user.businessInfo.companyName}</strong></td>
            <td>${user.businessInfo.businessType}</td>
            <td>${user.businessInfo.contactPerson}</td>
            <td>${user.email}</td>
            <td>${user.businessInfo.annualVolume}</td>
            <td>
                <span class="b2b-status-badge ${user.verificationStatus}">
                    ${user.verificationStatus.charAt(0).toUpperCase() + user.verificationStatus.slice(1)}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="viewB2BDocuments(${user.id})">
                    <i class="fas fa-file-alt"></i> View
                </button>
            </td>
            <td>
                ${user.verificationStatus === 'pending' ? `
                    <button class="btn btn-sm btn-success" onclick="verifyB2BUser(${user.id})">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="rejectB2BUser(${user.id})">
                        <i class="fas fa-times"></i> Reject
                    </button>
                ` : user.verificationStatus === 'verified' ? `
                    <button class="btn btn-sm btn-secondary" onclick="viewB2BUser(${user.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                ` : `
                    <button class="btn btn-sm btn-secondary" onclick="viewB2BUser(${user.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                `}
            </td>
        </tr>
    `).join('');
}

function updatePendingB2BBadge() {
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    const pendingCount = b2bUsers.filter(user => user.verificationStatus === 'pending').length;
    
    const badge = document.getElementById('pendingB2BBadge');
    if (badge) {
        badge.textContent = pendingCount;
        badge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
    }
}

// RFQ Management Functions
function renderRFQTable() {
    const rfqs = JSON.parse(localStorage.getItem('b2bRFQs')) || [];
    const tbody = document.getElementById('rfqTableBody');
    
    if (!tbody) return;
    
    if (rfqs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px;">No RFQs submitted yet</td></tr>';
        return;
    }
    
    // Get company names for each RFQ
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    
    tbody.innerHTML = rfqs.map(rfq => {
        const b2bUser = b2bUsers.find(u => u.id === rfq.userId);
        const companyName = b2bUser ? b2bUser.businessInfo.companyName : 'Unknown';
        
        return `
            <tr>
                <td>#${rfq.id}</td>
                <td><strong>${rfq.title}</strong></td>
                <td>${companyName}</td>
                <td>${rfq.category}</td>
                <td>${rfq.products.length}</td>
                <td>${rfq.totalQuantity}</td>
                <td>${new Date(rfq.deadline).toLocaleDateString()}</td>
                <td>
                    <span class="b2b-status-badge ${rfq.status}">${rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="viewRFQDetails(${rfq.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${rfq.status === 'pending' ? `
                        <button class="btn btn-sm btn-success" onclick="respondToRFQ(${rfq.id})">
                            <i class="fas fa-reply"></i> Respond
                        </button>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
}

function filterRFQs() {
    const filter = document.getElementById('rfqFilter').value;
    const rfqs = JSON.parse(localStorage.getItem('b2bRFQs')) || [];
    const tbody = document.getElementById('rfqTableBody');
    
    let filteredRFQs = rfqs;
    
    if (filter !== 'all') {
        filteredRFQs = rfqs.filter(r => r.status === filter);
    }
    
    if (filteredRFQs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px;">No RFQs found</td></tr>';
        return;
    }
    
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    
    tbody.innerHTML = filteredRFQs.map(rfq => {
        const b2bUser = b2bUsers.find(u => u.id === rfq.userId);
        const companyName = b2bUser ? b2bUser.businessInfo.companyName : 'Unknown';
        
        return `
            <tr>
                <td>#${rfq.id}</td>
                <td><strong>${rfq.title}</strong></td>
                <td>${companyName}</td>
                <td>${rfq.category}</td>
                <td>${rfq.products.length}</td>
                <td>${rfq.totalQuantity}</td>
                <td>${new Date(rfq.deadline).toLocaleDateString()}</td>
                <td>
                    <span class="b2b-status-badge ${rfq.status}">${rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="viewRFQDetails(${rfq.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${rfq.status === 'pending' ? `
                        <button class="btn btn-sm btn-success" onclick="respondToRFQ(${rfq.id})">
                            <i class="fas fa-reply"></i> Respond
                        </button>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
}

function updatePendingRFQBadge() {
    const rfqs = JSON.parse(localStorage.getItem('b2bRFQs')) || [];
    const pendingCount = rfqs.filter(r => r.status === 'pending').length;
    
    const badge = document.getElementById('pendingRFQBadge');
    if (badge) {
        badge.textContent = pendingCount;
        badge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
    }
}

function viewRFQDetails(rfqId) {
    const rfqs = JSON.parse(localStorage.getItem('b2bRFQs')) || [];
    const rfq = rfqs.find(r => r.id === rfqId);
    
    if (!rfq) {
        showToast('RFQ not found');
        return;
    }
    
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    const b2bUser = b2bUsers.find(u => u.id === rfq.userId);
    const companyName = b2bUser ? b2bUser.businessInfo.companyName : 'Unknown';
    
    const details = `
RFQ Details:
----------------
ID: #${rfq.id}
Title: ${rfq.title}
Company: ${companyName}
Category: ${rfq.category}
Status: ${rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
Deadline: ${new Date(rfq.deadline).toLocaleDateString()}

Description:
${rfq.description}

Budget: ${rfq.budget ? '¥' + parseInt(rfq.budget).toLocaleString() : 'Not specified'}

Products:
${rfq.products.map(p => `- ${p.productName}: ${p.quantity} units`).join('\n')}

Shipping:
Address: ${rfq.shipping.address}
City: ${rfq.shipping.city}
Country: ${rfq.shipping.country}
Method: ${rfq.shipping.method}

Payment Terms: ${rfq.paymentTerms}
Sample Required: ${rfq.sampleRequired ? 'Yes' : 'No'}
Custom Packaging: ${rfq.customPackaging ? 'Yes' : 'No'}
    `;
    
    alert(details);
}

function respondToRFQ(rfqId) {
    const quotePrice = prompt('Enter your quote price:');
    if (quotePrice) {
        const rfqs = JSON.parse(localStorage.getItem('b2bRFQs')) || [];
        const rfqIndex = rfqs.findIndex(r => r.id === rfqId);
        
        if (rfqIndex !== -1) {
            // Add quote to RFQ
            if (!rfqs[rfqIndex].quotes) {
                rfqs[rfqIndex].quotes = [];
            }
            
            rfqs[rfqIndex].quotes.push({
                id: Date.now(),
                price: parseFloat(quotePrice),
                adminId: JSON.parse(localStorage.getItem('currentUser')).id,
                createdAt: new Date().toISOString()
            });
            
            rfqs[rfqIndex].status = 'quoted';
            localStorage.setItem('b2bRFQs', JSON.stringify(rfqs));
            
            renderRFQTable();
            updatePendingRFQBadge();
            showToast('Quote submitted successfully');
        }
    }
}

// Promotional Campaign Management Functions
function renderPromotionsTable() {
    const campaigns = JSON.parse(localStorage.getItem('promotionalCampaigns')) || [];
    const tbody = document.getElementById('promotionsTableBody');
    
    if (!tbody) return;
    
    if (campaigns.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No promotional campaigns yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = campaigns.map(campaign => {
        const productCount = campaign.productIds.includes('all') ? 'All Products' : campaign.productIds.length;
        const isActive = campaign.status === 'active' && 
                        new Date(campaign.startDate) <= new Date() && 
                        new Date(campaign.endDate) >= new Date();
        
        return `
            <tr>
                <td><strong>${campaign.name}</strong></td>
                <td>${campaign.discountRate * 100}%</td>
                <td>${productCount}</td>
                <td>${new Date(campaign.startDate).toLocaleDateString()}</td>
                <td>${new Date(campaign.endDate).toLocaleDateString()}</td>
                <td>
                    <span class="b2b-status-badge ${isActive ? 'approved' : 'rejected'}">${isActive ? 'Active' : 'Inactive'}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="editPromotion(${campaign.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deletePromotion(${campaign.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function showPromotionModal() {
    const modal = document.getElementById('promotionModal');
    modal.style.display = 'block';
    
    // Set default dates
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    document.getElementById('promotionStartDate').value = today.toISOString().split('T')[0];
    document.getElementById('promotionEndDate').value = nextMonth.toISOString().split('T')[0];
}

function closePromotionModal() {
    const modal = document.getElementById('promotionModal');
    modal.style.display = 'none';
    document.getElementById('promotionForm').reset();
}

function submitPromotion(event) {
    event.preventDefault();
    
    const productIds = Array.from(document.getElementById('promotionProducts').selectedOptions)
        .map(opt => opt.value === 'all' ? 'all' : parseInt(opt.value));
    
    const campaignData = {
        name: document.getElementById('promotionName').value,
        discountRate: parseFloat(document.getElementById('promotionDiscount').value) / 100,
        productIds: productIds,
        startDate: document.getElementById('promotionStartDate').value,
        endDate: document.getElementById('promotionEndDate').value,
        description: document.getElementById('promotionDescription').value
    };
    
    createPromotionalCampaign(campaignData);
    
    closePromotionModal();
    renderPromotionsTable();
    showToast('Promotional campaign created successfully');
}

function editPromotion(campaignId) {
    const campaigns = JSON.parse(localStorage.getItem('promotionalCampaigns')) || [];
    const campaign = campaigns.find(c => c.id === campaignId);
    
    if (!campaign) {
        showToast('Campaign not found');
        return;
    }
    
    // Fill modal with campaign data
    document.getElementById('promotionName').value = campaign.name;
    document.getElementById('promotionDiscount').value = campaign.discountRate * 100;
    document.getElementById('promotionStartDate').value = campaign.startDate.split('T')[0];
    document.getElementById('promotionEndDate').value = campaign.endDate.split('T')[0];
    document.getElementById('promotionDescription').value = campaign.description || '';
    
    // Show modal
    const modal = document.getElementById('promotionModal');
    modal.style.display = 'block';
    
    // Change form submit handler to update
    const form = document.getElementById('promotionForm');
    form.onsubmit = function(event) {
        event.preventDefault();
        
        const productIds = Array.from(document.getElementById('promotionProducts').selectedOptions)
            .map(opt => opt.value === 'all' ? 'all' : parseInt(opt.value));
        
        const updates = {
            name: document.getElementById('promotionName').value,
            discountRate: parseFloat(document.getElementById('promotionDiscount').value) / 100,
            productIds: productIds,
            startDate: document.getElementById('promotionStartDate').value,
            endDate: document.getElementById('promotionEndDate').value,
            description: document.getElementById('promotionDescription').value
        };
        
        updatePromotionalCampaign(campaignId, updates);
        
        closePromotionModal();
        renderPromotionsTable();
        showToast('Campaign updated successfully');
        
        // Reset form submit handler
        form.onsubmit = submitPromotion;
    };
}

function deletePromotion(campaignId) {
    if (confirm('Are you sure you want to delete this promotional campaign?')) {
        deletePromotionalCampaign(campaignId);
        renderPromotionsTable();
        showToast('Campaign deleted successfully');
    }
}

// Admin Invoice Management Functions
function renderAdminInvoicesTable() {
    const invoices = invoiceGenerator.getAllInvoices();
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    const tbody = document.getElementById('adminInvoicesTableBody');
    
    if (!tbody) return;
    
    if (invoices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No invoices yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = invoices.map(invoice => {
        const b2bUser = b2bUsers.find(u => u.id === invoice.userId);
        const companyName = b2bUser ? b2bUser.businessInfo.companyName : 'Unknown';
        const isOverdue = invoiceGenerator.isOverdue(invoice);
        const termDetails = paymentTermsManager.getTermDetails(invoice.paymentTerms);
        
        return `
            <tr>
                <td><strong>${invoice.id}</strong></td>
                <td>${companyName}</td>
                <td>${new Date(invoice.createdAt).toLocaleDateString()}</td>
                <td>¥${invoice.total.toLocaleString()}</td>
                <td>${new Date(invoice.dueDate).toLocaleDateString()}</td>
                <td>${termDetails.name}</td>
                <td>
                    <span class="b2b-status-badge ${isOverdue ? 'rejected' : invoice.status}">${isOverdue ? 'Overdue' : invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="adminViewInvoice('${invoice.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${invoice.status === 'pending' ? `
                        <button class="btn btn-sm btn-success" onclick="adminMarkInvoicePaid('${invoice.id}')">
                            <i class="fas fa-check"></i> Mark Paid
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-secondary" onclick="adminDownloadInvoice('${invoice.id}')">
                        <i class="fas fa-download"></i> PDF
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function filterAdminInvoices() {
    const filter = document.getElementById('adminInvoiceFilter').value;
    const invoices = invoiceGenerator.getAllInvoices();
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    const tbody = document.getElementById('adminInvoicesTableBody');
    
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
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No invoices found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredInvoices.map(invoice => {
        const b2bUser = b2bUsers.find(u => u.id === invoice.userId);
        const companyName = b2bUser ? b2bUser.businessInfo.companyName : 'Unknown';
        const isOverdue = invoiceGenerator.isOverdue(invoice);
        const termDetails = paymentTermsManager.getTermDetails(invoice.paymentTerms);
        
        return `
            <tr>
                <td><strong>${invoice.id}</strong></td>
                <td>${companyName}</td>
                <td>${new Date(invoice.createdAt).toLocaleDateString()}</td>
                <td>¥${invoice.total.toLocaleString()}</td>
                <td>${new Date(invoice.dueDate).toLocaleDateString()}</td>
                <td>${termDetails.name}</td>
                <td>
                    <span class="b2b-status-badge ${isOverdue ? 'rejected' : invoice.status}">${isOverdue ? 'Overdue' : invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="adminViewInvoice('${invoice.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${invoice.status === 'pending' ? `
                        <button class="btn btn-sm btn-success" onclick="adminMarkInvoicePaid('${invoice.id}')">
                            <i class="fas fa-check"></i> Mark Paid
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-secondary" onclick="adminDownloadInvoice('${invoice.id}')">
                        <i class="fas fa-download"></i> PDF
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function updatePendingInvoiceBadge() {
    const invoices = invoiceGenerator.getAllInvoices();
    const pendingCount = invoices.filter(i => i.status === 'pending' || invoiceGenerator.isOverdue(i)).length;
    
    const badge = document.getElementById('pendingInvoiceBadge');
    if (badge) {
        badge.textContent = pendingCount;
        badge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
    }
}

function adminViewInvoice(invoiceId) {
    const invoices = invoiceGenerator.getAllInvoices();
    const invoice = invoices.find(i => i.id === invoiceId);
    
    if (!invoice) {
        showToast('Invoice not found');
        return;
    }
    
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    const b2bUser = b2bUsers.find(u => u.id === invoice.userId);
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
${b2bUser ? `
Company: ${b2bUser.businessInfo.companyName}
Tax ID: ${b2bUser.businessInfo.taxId}
Email: ${b2bUser.businessInfo.businessEmail}
Phone: ${b2bUser.businessInfo.businessPhone}
Address: ${b2bUser.businessInfo.businessAddress.street}, ${b2bUser.businessInfo.businessAddress.city}
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

function adminMarkInvoicePaid(invoiceId) {
    if (confirm('Mark this invoice as paid?')) {
        invoiceGenerator.updateInvoiceStatus(invoiceId, 'paid');
        renderAdminInvoicesTable();
        updatePendingInvoiceBadge();
        showToast('Invoice marked as paid');
    }
}

function adminDownloadInvoice(invoiceId) {
    showToast('Invoice PDF download coming soon');
}

// Supplier Management Functions
function renderSuppliersTable() {
    const suppliers = supplierManager.getAllSuppliers();
    const tbody = document.getElementById('suppliersTableBody');
    
    if (!tbody) return;
    
    if (suppliers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No suppliers yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = suppliers.map(supplier => {
        const score = supplierManager.calculateSupplierScore(supplier.id);
        
        return `
            <tr>
                <td><strong>${supplier.name}</strong></td>
                <td>${supplier.code}</td>
                <td>${supplier.contact}</td>
                <td>
                    <span class="rating-stars">
                        ${'★'.repeat(Math.floor(supplier.rating))}${'☆'.repeat(5 - Math.floor(supplier.rating))}
                    </span>
                    <span style="margin-left: 8px;">${supplier.rating}</span>
                </td>
                <td>${supplier.onTimeDelivery}%</td>
                <td>${supplier.totalOrders}</td>
                <td>
                    <span class="b2b-status-badge ${supplier.status}">${supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="viewSupplier(${supplier.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="editSupplier(${supplier.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    ${supplier.status === 'active' ? `
                        <button class="btn btn-sm btn-danger" onclick="deactivateSupplier(${supplier.id})">
                            <i class="fas fa-ban"></i> Deactivate
                        </button>
                    ` : `
                        <button class="btn btn-sm btn-success" onclick="activateSupplier(${supplier.id})">
                            <i class="fas fa-check"></i> Activate
                        </button>
                    `}
                </td>
            </tr>
        `;
    }).join('');
}

function showSupplierModal() {
    const modal = document.getElementById('supplierModal');
    modal.style.display = 'block';
    document.getElementById('supplierModalTitle').textContent = 'Add Supplier';
}

function closeSupplierModal() {
    const modal = document.getElementById('supplierModal');
    modal.style.display = 'none';
    document.getElementById('supplierForm').reset();
}

function submitSupplier(event) {
    event.preventDefault();
    
    const categories = Array.from(document.getElementById('supplierCategories').selectedOptions)
        .map(opt => opt.value);
    
    const supplierData = {
        name: document.getElementById('supplierName').value,
        code: document.getElementById('supplierCode').value,
        contact: document.getElementById('supplierContact').value,
        email: document.getElementById('supplierEmail').value,
        phone: document.getElementById('supplierPhone').value,
        address: {
            street: document.getElementById('supplierStreet').value,
            city: document.getElementById('supplierCity').value,
            state: document.getElementById('supplierState').value,
            zip: document.getElementById('supplierZip').value,
            country: document.getElementById('supplierCountry').value
        },
        productCategories: categories
    };
    
    supplierManager.addSupplier(supplierData);
    
    closeSupplierModal();
    renderSuppliersTable();
    showToast('Supplier added successfully');
}

function viewSupplier(supplierId) {
    const supplier = supplierManager.getSupplierById(supplierId);
    
    if (!supplier) {
        showToast('Supplier not found');
        return;
    }
    
    const performance = supplierManager.getSupplierPerformance(supplierId);
    const score = supplierManager.calculateSupplierScore(supplierId);
    
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

function editSupplier(supplierId) {
    const supplier = supplierManager.getSupplierById(supplierId);
    
    if (!supplier) {
        showToast('Supplier not found');
        return;
    }
    
    // Fill modal with supplier data
    document.getElementById('supplierName').value = supplier.name;
    document.getElementById('supplierCode').value = supplier.code;
    document.getElementById('supplierContact').value = supplier.contact;
    document.getElementById('supplierEmail').value = supplier.email;
    document.getElementById('supplierPhone').value = supplier.phone;
    document.getElementById('supplierStreet').value = supplier.address.street;
    document.getElementById('supplierCity').value = supplier.address.city;
    document.getElementById('supplierState').value = supplier.address.state;
    document.getElementById('supplierZip').value = supplier.address.zip;
    document.getElementById('supplierCountry').value = supplier.address.country;
    
    // Show modal
    const modal = document.getElementById('supplierModal');
    modal.style.display = 'block';
    document.getElementById('supplierModalTitle').textContent = 'Edit Supplier';
    
    // Change form submit handler to update
    const form = document.getElementById('supplierForm');
    form.onsubmit = function(event) {
        event.preventDefault();
        
        const categories = Array.from(document.getElementById('supplierCategories').selectedOptions)
            .map(opt => opt.value);
        
        const updates = {
            name: document.getElementById('supplierName').value,
            code: document.getElementById('supplierCode').value,
            contact: document.getElementById('supplierContact').value,
            email: document.getElementById('supplierEmail').value,
            phone: document.getElementById('supplierPhone').value,
            address: {
                street: document.getElementById('supplierStreet').value,
                city: document.getElementById('supplierCity').value,
                state: document.getElementById('supplierState').value,
                zip: document.getElementById('supplierZip').value,
                country: document.getElementById('supplierCountry').value
            },
            productCategories: categories
        };
        
        supplierManager.updateSupplier(supplierId, updates);
        
        closeSupplierModal();
        renderSuppliersTable();
        showToast('Supplier updated successfully');
        
        // Reset form submit handler
        form.onsubmit = submitSupplier;
    };
}

function deactivateSupplier(supplierId) {
    if (confirm('Deactivate this supplier?')) {
        supplierManager.deactivateSupplier(supplierId);
        renderSuppliersTable();
        showToast('Supplier deactivated');
    }
}

function activateSupplier(supplierId) {
    if (confirm('Activate this supplier?')) {
        supplierManager.activateSupplier(supplierId);
        renderSuppliersTable();
        showToast('Supplier activated');
    }
}

// Exports
window.showSection = showSection;
window.toggleSidebar = toggleSidebar;
window.searchProducts = searchProducts;
window.filterProducts = filterProducts;
window.sortProducts = sortProducts;
window.showProductModal = showProductModal;
window.closeProductModal = closeProductModal;
window.saveProduct = saveProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.previewImage = previewImage;
window.searchOrders = searchOrders;
window.filterOrders = filterOrders;
window.viewOrder = viewOrder;
window.closeOrderModal = closeOrderModal;
window.updateOrderStatus = updateOrderStatus;
window.exportOrders = exportOrders;
window.searchCustomers = searchCustomers;
window.exportCustomers = exportCustomers;
window.adminLogout = adminLogout;
window.showNotifications = showNotifications;
window.refreshChart = refreshChart;
window.updateDashboard = updateDashboard;
window.updateAnalytics = updateAnalytics;
window.renderB2BUsersTable = renderB2BUsersTable;
window.verifyB2BUser = verifyB2BUser;
window.rejectB2BUser = rejectB2BUser;
window.viewB2BDocuments = viewB2BDocuments;
window.viewB2BUser = viewB2BUser;
window.filterB2BUsers = filterB2BUsers;
window.renderRFQTable = renderRFQTable;
window.filterRFQs = filterRFQs;
window.updatePendingRFQBadge = updatePendingRFQBadge;
window.viewRFQDetails = viewRFQDetails;
window.respondToRFQ = respondToRFQ;
window.renderPromotionsTable = renderPromotionsTable;
window.showPromotionModal = showPromotionModal;
window.closePromotionModal = closePromotionModal;
window.submitPromotion = submitPromotion;
window.editPromotion = editPromotion;
window.deletePromotion = deletePromotion;
window.renderAdminInvoicesTable = renderAdminInvoicesTable;
window.filterAdminInvoices = filterAdminInvoices;
window.updatePendingInvoiceBadge = updatePendingInvoiceBadge;
window.adminViewInvoice = adminViewInvoice;
window.adminMarkInvoicePaid = adminMarkInvoicePaid;
window.adminDownloadInvoice = adminDownloadInvoice;
window.renderSuppliersTable = renderSuppliersTable;
window.showSupplierModal = showSupplierModal;
window.closeSupplierModal = closeSupplierModal;
window.submitSupplier = submitSupplier;
window.viewSupplier = viewSupplier;
window.editSupplier = editSupplier;
window.deactivateSupplier = deactivateSupplier;
window.activateSupplier = activateSupplier;
window.showCategoryModal = showCategoryModal;
