// B2B Platform JavaScript

// B2B Registration Handler
function handleB2BRegistration(event) {
    event.preventDefault();
    
    const form = document.getElementById('b2bRegistrationForm');
    const formData = new FormData(form);
    
    // Validate passwords match
    const password = formData.get('b2bPassword');
    const confirmPassword = formData.get('b2bConfirmPassword');
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match!');
        return;
    }
    
    // Validate password strength
    if (password.length < 8) {
        showToast('Password must be at least 8 characters long!');
        return;
    }
    
    // Validate file uploads
    const businessLicense = document.getElementById('businessLicense').files[0];
    const taxDocument = document.getElementById('taxDocument').files[0];
    const addressProof = document.getElementById('addressProof').files[0];
    
    if (!businessLicense || !taxDocument || !addressProof) {
        showToast('Please upload all required documents!');
        return;
    }
    
    // Validate file sizes (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const files = [businessLicense, taxDocument, addressProof];
    
    for (let file of files) {
        if (file.size > maxSize) {
            showToast(`File ${file.name} exceeds 5MB limit!`);
            return;
        }
    }
    
    // Create B2B user object
    const b2bUser = {
        id: Date.now(),
        userType: 'business',
        email: formData.get('b2bEmail'),
        password: password,
        firstName: formData.get('contactPerson').split(' ')[0],
        lastName: formData.get('contactPerson').split(' ').slice(1).join(' ') || '',
        businessInfo: {
            companyName: formData.get('companyName'),
            businessType: formData.get('businessType'),
            taxId: formData.get('taxId'),
            website: formData.get('website'),
            industrySector: formData.get('industrySector'),
            annualVolume: formData.get('annualVolume'),
            contactPerson: formData.get('contactPerson'),
            contactPosition: formData.get('contactPosition'),
            businessEmail: formData.get('businessEmail'),
            businessPhone: formData.get('businessPhone'),
            businessAddress: {
                street: formData.get('businessAddress'),
                city: formData.get('businessCity'),
                state: formData.get('businessState'),
                zip: formData.get('businessZip'),
                country: formData.get('businessCountry')
            }
        },
        documents: {
            businessLicense: businessLicense.name,
            taxDocument: taxDocument.name,
            addressProof: addressProof.name,
            additionalDoc: document.getElementById('additionalDoc').files[0]?.name || null
        },
        verificationStatus: 'pending',
        verificationDate: null,
        createdAt: new Date().toISOString(),
        marketingOptIn: formData.get('agreeMarketing') === 'on'
    };
    
    // Store B2B user in localStorage
    let b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    b2bUsers.push(b2bUser);
    localStorage.setItem('b2bUsers', JSON.stringify(b2bUsers));
    
    // Also store in regular users for authentication
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({
        id: b2bUser.id,
        email: b2bUser.email,
        password: b2bUser.password,
        firstName: b2bUser.firstName,
        lastName: b2bUser.lastName,
        userType: 'business'
    });
    localStorage.setItem('users', JSON.stringify(users));
    
    // Show success message
    showToast('Registration submitted successfully! Your account is pending verification.');
    
    // Redirect to home page after 3 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
}

// Get B2B User by ID
function getB2BUserById(userId) {
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    return b2bUsers.find(user => user.id === userId);
}

// Get B2B User by Email
function getB2BUserByEmail(email) {
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    return b2bUsers.find(user => user.email === email);
}

// Update B2B User Verification Status
function updateB2BVerificationStatus(userId, status) {
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    const userIndex = b2bUsers.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
        b2bUsers[userIndex].verificationStatus = status;
        b2bUsers[userIndex].verificationDate = status === 'verified' ? new Date().toISOString() : null;
        localStorage.setItem('b2bUsers', JSON.stringify(b2bUsers));
        return true;
    }
    
    return false;
}

// Get All Pending B2B Users
function getPendingB2BUsers() {
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    return b2bUsers.filter(user => user.verificationStatus === 'pending');
}

// Get All Verified B2B Users
function getVerifiedB2BUsers() {
    const b2bUsers = JSON.parse(localStorage.getItem('b2bUsers')) || [];
    return b2bUsers.filter(user => user.verificationStatus === 'verified');
}

// Get All B2B Users
function getAllB2BUsers() {
    return JSON.parse(localStorage.getItem('b2bUsers')) || [];
}

// Check if current user is B2B user
function isB2BUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser && currentUser.userType === 'business';
}

// Check if B2B user is verified
function isB2BVerified() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.userType !== 'business') {
        return false;
    }
    
    const b2bUser = getB2BUserById(currentUser.id);
    return b2bUser && b2bUser.verificationStatus === 'verified';
}

// Navigate to B2B Dashboard
function goToB2BDashboard() {
    if (!isB2BUser()) {
        showToast('Please register as a business user first!');
        window.location.href = 'b2b-register.html';
        return;
    }
    
    if (!isB2BVerified()) {
        showToast('Your account is pending verification!');
        window.location.href = 'profile.html';
        return;
    }
    
    window.location.href = 'b2b-dashboard.html';
}

// Show B2B Verification Status
function showB2BVerificationStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.userType !== 'business') {
        return null;
    }
    
    const b2bUser = getB2BUserById(currentUser.id);
    if (!b2bUser) {
        return null;
    }
    
    return {
        status: b2bUser.verificationStatus,
        companyName: b2bUser.businessInfo.companyName,
        verificationDate: b2bUser.verificationDate
    };
}

// Format verification status for display
function formatVerificationStatus(status) {
    const statusMap = {
        'pending': 'Pending Verification',
        'verified': 'Verified',
        'rejected': 'Rejected'
    };
    return statusMap[status] || status;
}

// Get status badge class
function getStatusBadgeClass(status) {
    const classMap = {
        'pending': 'b2b-status-badge pending',
        'verified': 'b2b-status-badge verified',
        'rejected': 'b2b-status-badge rejected'
    };
    return classMap[status] || '';
}

// Load B2B Dashboard Data
function loadB2BDashboard() {
    if (!isB2BUser()) {
        window.location.href = 'index.html';
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const b2bUser = getB2BUserById(currentUser.id);
    
    if (!b2bUser) {
        showToast('Business profile not found!');
        window.location.href = 'index.html';
        return;
    }
    
    // Update dashboard with user data
    const companyName = document.getElementById('dashboardCompanyName');
    const verificationStatus = document.getElementById('verificationStatus');
    const businessType = document.getElementById('businessType');
    const annualVolume = document.getElementById('annualVolume');
    
    if (companyName) companyName.textContent = b2bUser.businessInfo.companyName;
    if (verificationStatus) {
        verificationStatus.textContent = formatVerificationStatus(b2bUser.verificationStatus);
        verificationStatus.className = getStatusBadgeClass(b2bUser.verificationStatus);
    }
    if (businessType) businessType.textContent = b2bUser.businessInfo.businessType;
    if (annualVolume) annualVolume.textContent = b2bUser.businessInfo.annualVolume;
}

// Initialize B2B page
document.addEventListener('DOMContentLoaded', function() {
    // Check if on B2B registration page
    if (document.getElementById('b2bRegistrationForm')) {
        // Add file input change handlers for preview
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                    const small = this.parentElement.querySelector('small');
                    if (small) {
                        small.textContent = `${file.name} (${sizeMB} MB)`;
                        small.style.color = 'var(--primary)';
                    }
                }
            });
        });
    }
    
    // Check if on B2B dashboard page
    if (document.querySelector('.b2b-dashboard-page')) {
        loadB2BDashboard();
    }
});

// Export functions for use in other files
window.handleB2BRegistration = handleB2BRegistration;
window.getB2BUserById = getB2BUserById;
window.getB2BUserByEmail = getB2BUserByEmail;
window.updateB2BVerificationStatus = updateB2BVerificationStatus;
window.getPendingB2BUsers = getPendingB2BUsers;
window.getVerifiedB2BUsers = getVerifiedB2BUsers;
window.getAllB2BUsers = getAllB2BUsers;
window.isB2BUser = isB2BUser;
window.isB2BVerified = isB2BVerified;
window.goToB2BDashboard = goToB2BDashboard;
window.showB2BVerificationStatus = showB2BVerificationStatus;
window.formatVerificationStatus = formatVerificationStatus;
window.getStatusBadgeClass = getStatusBadgeClass;
window.loadB2BDashboard = loadB2BDashboard;
