// Authentication JavaScript

// User State Management
let currentUser = null;

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        // If on auth page and already logged in, redirect to home
        if (window.location.pathname.includes('auth.html')) {
            window.location.href = 'index.html';
        }
    }
    
    // Update header if on main page
    if (document.getElementById('userMenu')) {
        updateUserMenu();
    }
});

// Switch between login/register/forgot forms
function switchAuth(type) {
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');
    const forgotBox = document.getElementById('forgotBox');
    
    // Hide all boxes
    loginBox.classList.add('hidden');
    registerBox.classList.add('hidden');
    forgotBox.classList.add('hidden');
    
    // Show requested box
    switch(type) {
        case 'login':
            loginBox.classList.remove('hidden');
            break;
        case 'register':
            registerBox.classList.remove('hidden');
            break;
        case 'forgot':
            forgotBox.classList.remove('hidden');
            break;
    }
}

function showForgotPassword() {
    switchAuth('forgot');
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = event.currentTarget.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Password strength checker
function checkPasswordStrength() {
    const password = document.getElementById('registerPassword').value;
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    strengthBar.className = 'strength-bar';
    
    switch(strength) {
        case 0:
        case 1:
            strengthBar.classList.add('weak');
            strengthText.textContent = 'Weak password';
            strengthText.style.color = 'var(--danger)';
            break;
        case 2:
        case 3:
            strengthBar.classList.add('medium');
            strengthText.textContent = 'Medium strength';
            strengthText.style.color = 'var(--warning)';
            break;
        case 4:
            strengthBar.classList.add('strong');
            strengthText.textContent = 'Strong password';
            strengthText.style.color = 'var(--success)';
            break;
    }
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Simulate API call
    simulateAuthCall('login', { email, password })
        .then(user => {
            currentUser = user;
            
            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
            }
            
            showToast('Login successful! Welcome back.');
            
            // Redirect after short delay
            setTimeout(() => {
                const redirectUrl = localStorage.getItem('redirectAfterLogin') || 'index.html';
                localStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectUrl;
            }, 1500);
        })
        .catch(error => {
            showToast(error.message || 'Login failed. Please try again.');
        });
}

// Handle Register
function handleRegister(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (password !== confirmPassword) {
        showToast('Passwords do not match!');
        return;
    }
    
    if (password.length < 8) {
        showToast('Password must be at least 8 characters!');
        return;
    }
    
    // Simulate API call
    simulateAuthCall('register', { firstName, lastName, email, phone, password })
        .then(user => {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            showToast('Account created successfully!');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        })
        .catch(error => {
            showToast(error.message || 'Registration failed. Please try again.');
        });
}

// Handle Forgot Password
function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    
    // Simulate API call
    setTimeout(() => {
        showToast('Password reset link sent to your email!');
        switchAuth('login');
    }, 1000);
}

// Social Login
function socialLogin(provider) {
    // Simulate social authentication
    showToast(`Connecting to ${provider}...`);
    
    setTimeout(() => {
        const user = {
            id: Date.now(),
            name: `${provider} User`,
            email: `user@${provider}.com`,
            avatar: `https://ui-avatars.com/api/?name=${provider}+User&background=ff6600&color=fff`,
            provider: provider
        };
        
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        showToast(`Logged in with ${provider}!`);
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1500);
}

// Simulate API Authentication (Mock)
function simulateAuthCall(type, data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (type === 'login') {
                // Mock validation
                if (data.email && data.password) {
                    resolve({
                        id: Date.now(),
                        name: 'John Doe',
                        email: data.email,
                        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=ff6600&color=fff',
                        token: 'mock-jwt-token'
                    });
                } else {
                    reject({ message: 'Invalid credentials' });
                }
            } else if (type === 'register') {
                resolve({
                    id: Date.now(),
                    name: `${data.firstName} ${data.lastName}`,
                    email: data.email,
                    phone: data.phone,
                    avatar: `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&background=ff6600&color=fff`,
                    token: 'mock-jwt-token'
                });
            }
        }, 1000);
    });
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    
    showToast('Logged out successfully');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Check if user requires auth
function requireAuth() {
    if (!currentUser) {
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'auth.html';
        return false;
    }
    return true;
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Update UI based on auth state
function updateUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (!userMenu) return;
    
    if (currentUser) {
        userMenu.innerHTML = `
            <div class="user-dropdown">
                <button class="user-btn" onclick="toggleUserDropdown()">
                    <img src="${currentUser.avatar}" alt="${currentUser.name}" class="user-avatar">
                    <span>${currentUser.name.split(' ')[0]}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="dropdown-menu" id="userDropdown">
                    <a href="account.html"><i class="fas fa-user"></i> My Account</a>
                    <a href="orders.html"><i class="fas fa-shopping-bag"></i> My Orders</a>
                    <a href="wishlist.html"><i class="fas fa-heart"></i> Wishlist</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </div>
        `;
    } else {
        userMenu.innerHTML = `
            <a href="auth.html" class="btn btn-outline">Sign In</a>
        `;
    }
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const userDropdown = document.getElementById('userDropdown');
    const userBtn = document.querySelector('.user-btn');
    
    if (userDropdown && userBtn && !userBtn.contains(e.target)) {
        userDropdown.classList.remove('active');
    }
});

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Export for use in other files
window.Auth = {
    getCurrentUser,
    requireAuth,
    logout,
    updateUserMenu
};
