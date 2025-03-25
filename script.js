const words = ['Deals', 'Products', 'Prices', 'Fashion', 'Quality'];
let currentIndex = 0;
const changingText = document.getElementById('changing-text');

function typeWriter(text, index, callback) {
    if (index < text.length) {
        changingText.innerHTML += text.charAt(index);
        setTimeout(() => typeWriter(text, index + 1, callback), 100);
    } else {
        setTimeout(callback, 1000);
    }
}

function eraseText(callback) {
    const text = changingText.innerHTML;
    if (text.length > 0) {
        changingText.innerHTML = text.substring(0, text.length - 1);
        setTimeout(() => eraseText(callback), 50);
    } else {
        callback();
    }
}

function changeWord() {
    eraseText(() => {
        currentIndex = (currentIndex + 1) % words.length;
        typeWriter(words[currentIndex], 0, changeWord);
    });
}

// Initialize the typewriter effect when the element is available
document.addEventListener('DOMContentLoaded', function() {
    if (changingText) {
        typeWriter(words[0], 0, changeWord);
    }
});

function animateBox(element) {
    element.classList.add('animate');
    setTimeout(() => {
        element.classList.remove('animate');
    }, 300);
}

// Improved navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Navigation toggle for mobile
    const hamburger = document.querySelector('#hamburger-menu');
    const navMenu = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });
    }
    
    // Close menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Hide navbar on scroll down, show on scroll up
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('#header');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.style.transform = 'translateY(0)';
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', e => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Adjust for header height
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
});

// Add to cart functionality
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const productName = card.querySelector('.pt') ? card.querySelector('.pt').textContent : 'Product';
            const price = card.querySelector('.price') ? card.querySelector('.price').textContent : '$0.00';
            
            // Animation for button click
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            // Update cart count
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                let count = parseInt(cartCount.textContent) || 0;
                cartCount.textContent = count + 1;
            }
            
            // You can add more cart functionality here
            console.log(`Added to cart: ${productName} - ${price}`);
        });
    });
    
    // Image hover effect
    const productImages = document.querySelectorAll('.product-image img');
    
    productImages.forEach(img => {
        img.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        img.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Modal functionality
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeButtons = document.querySelectorAll('.close, .close-cart');
    
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'block';
        });
    }
    
    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', () => {
            cartModal.style.display = 'block';
        });
    }
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
});

// Intersection Observer for footer animations
document.addEventListener('DOMContentLoaded', function() {
    const footerSections = document.querySelectorAll('.footer-section');
    
    if (footerSections.length > 0 && 'IntersectionObserver' in window) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.2
        });
        
        footerSections.forEach(section => {
            footerObserver.observe(section);
        });
    }
});

// Settings Modal Logic
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.querySelector('.close-settings');
const saveSettingsBtn = document.getElementById('saveSettings');
const resetSettingsBtn = document.getElementById('resetSettings');

// Default settings
const defaultSettings = {
    theme: 'light',
    accentColor: '#088178',
    fontSize: 'medium',
    currency: 'USD',
    defaultSorting: 'featured',
    notifications: {
        email: true,
        orderUpdates: true,
        newArrivals: false,
        promoEmails: false
    },
    privacy: {
        saveHistory: true,
        acceptCookies: true
    }
};

// Currency conversion rates (approximate)
const currencyRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.75,
    JPY: 110,
    INR: 75
};

// Currency symbols
const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    INR: '₹'
};

// Get settings from localStorage or use defaults
let userSettings = JSON.parse(localStorage.getItem('userSettings')) || { ...defaultSettings };

// Open settings modal
settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'block';
    loadCurrentSettings();
});

// Close settings modal
closeSettings.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
});

// Save settings
saveSettingsBtn.addEventListener('click', () => {
    saveSettings();
    showToast('Settings saved successfully!');
    settingsModal.style.display = 'none';
});

// Reset settings to default
resetSettingsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        userSettings = { ...defaultSettings };
        localStorage.setItem('userSettings', JSON.stringify(userSettings));
        loadCurrentSettings();
        applySettings();
        showToast('Settings reset to default!');
    }
});

// Load current settings into UI
function loadCurrentSettings() {
    // Theme
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === userSettings.theme);
    });

    // Accent Color
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === userSettings.accentColor);
    });

    // Font Size
    document.querySelectorAll('.font-size-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.size === userSettings.fontSize);
    });

    // Currency
    document.getElementById('currencySelect').value = userSettings.currency;

    // Default Sorting
    document.getElementById('sortingSelect').value = userSettings.defaultSorting;

    // Notifications
    document.getElementById('emailNotif').checked = userSettings.notifications.email;
    document.getElementById('orderUpdates').checked = userSettings.notifications.orderUpdates;
    document.getElementById('newArrivals').checked = userSettings.notifications.newArrivals;
    document.getElementById('promoEmails').checked = userSettings.notifications.promoEmails;

    // Privacy
    document.getElementById('saveHistory').checked = userSettings.privacy.saveHistory;
    document.getElementById('acceptCookies').checked = userSettings.privacy.acceptCookies;
}

// Save settings from UI to localStorage
function saveSettings() {
    // Theme
    const activeTheme = document.querySelector('.theme-btn.active');
    if (activeTheme) {
        userSettings.theme = activeTheme.dataset.theme;
    }

    // Accent Color
    const activeColor = document.querySelector('.color-btn.active');
    if (activeColor) {
        userSettings.accentColor = activeColor.dataset.color;
    }

    // Font Size
    const activeFontSize = document.querySelector('.font-size-btn.active');
    if (activeFontSize) {
        userSettings.fontSize = activeFontSize.dataset.size;
    }

    // Currency
    userSettings.currency = document.getElementById('currencySelect').value;

    // Default Sorting
    userSettings.defaultSorting = document.getElementById('sortingSelect').value;

    // Notifications
    userSettings.notifications = {
        email: document.getElementById('emailNotif').checked,
        orderUpdates: document.getElementById('orderUpdates').checked,
        newArrivals: document.getElementById('newArrivals').checked,
        promoEmails: document.getElementById('promoEmails').checked
    };

    // Privacy
    userSettings.privacy = {
        saveHistory: document.getElementById('saveHistory').checked,
        acceptCookies: document.getElementById('acceptCookies').checked
    };

    // Save to localStorage
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
    
    // Apply settings to page
    applySettings();
}

// Apply all settings to the page
function applySettings() {
    // Apply theme
    document.body.classList.remove('dark-theme', 'light-theme');
    if (userSettings.theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else if (userSettings.theme === 'light') {
        document.body.classList.add('light-theme');
    } else if (userSettings.theme === 'system') {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.add('light-theme');
        }
    }

    // Apply accent color
    document.documentElement.style.setProperty('--primary-color', userSettings.accentColor);

    // Apply font size
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${userSettings.fontSize}`);

    // Apply currency to all price elements
    updatePricesForCurrency();
}

// Update prices based on selected currency
function updatePricesForCurrency() {
    const priceElements = document.querySelectorAll('.price');
    priceElements.forEach(element => {
        if (element.dataset.basePrice) {
            const basePrice = parseFloat(element.dataset.basePrice);
            const convertedPrice = convertPrice(basePrice, 'USD', userSettings.currency);
            element.textContent = formatPrice(convertedPrice, userSettings.currency);
        } else {
            // Store original price as USD if not already stored
            const originalText = element.textContent;
            const priceValue = parseFloat(originalText.replace(/[^0-9.-]+/g, ''));
            if (!isNaN(priceValue)) {
                element.dataset.basePrice = priceValue;
                const convertedPrice = convertPrice(priceValue, 'USD', userSettings.currency);
                element.textContent = formatPrice(convertedPrice, userSettings.currency);
            }
        }
    });
}

// Convert price from one currency to another
function convertPrice(amount, fromCurrency, toCurrency) {
    return amount * (currencyRates[toCurrency] / currencyRates[fromCurrency]);
}

// Format price with currency symbol
function formatPrice(amount, currency) {
    const symbol = currencySymbols[currency];
    
    // Handle specific formatting for different currencies
    if (currency === 'USD' || currency === 'EUR' || currency === 'GBP') {
        return `${symbol}${amount.toFixed(2)}`;
    } else if (currency === 'JPY') {
        return `${symbol}${Math.round(amount)}`;
    } else if (currency === 'INR') {
        return `${symbol} ${amount.toFixed(2)}`;
    }
    
    return `${symbol}${amount.toFixed(2)}`;
}

// Show a toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Add event listeners for theme buttons
document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Add event listeners for color buttons
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Preview color change immediately
        document.documentElement.style.setProperty('--primary-color', btn.dataset.color);
    });
});

// Add event listeners for font size buttons
document.querySelectorAll('.font-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.font-size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Preview font size change immediately
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        document.body.classList.add(`font-${btn.dataset.size}`);
    });
});

// Apply settings on page load
document.addEventListener('DOMContentLoaded', () => {
    applySettings();
});