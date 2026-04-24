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
window.showCategoryModal = showCategoryModal;
