/**
 * G Tarım Website JavaScript
 * Mobile-optimized functionality
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    initMobileNavigation();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize form validation
    initFormValidation();
    
    // Initialize lazy loading for images
    initLazyLoading();
    
    // Detect scroll position for various effects
    initScrollEffects();
    
    // Add touch support for better mobile interactions
    initTouchSupport();
});

/**
 * Mobile Navigation Functionality
 */
function initMobileNavigation() {
    const bottomNav = document.querySelector('.bottom-nav');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelectorAll('.bottom-nav a');
    
    // Show/hide bottom navigation based on scroll
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show bottom nav after scrolling down 100px
        if (scrollTop > 100) {
            bottomNav.classList.add('show');
        } else {
            // Hide bottom nav when at the top of the page
            bottomNav.classList.remove('show');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Mobile menu toggle button
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            bottomNav.classList.toggle('show');
        });
    }
    
    // Handle active links in navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Set active class
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            
            // If we're on mobile, briefly hide the nav after clicking
            if (window.innerWidth < 768) {
                setTimeout(() => {
                    bottomNav.classList.remove('show');
                    // Show it again after navigation completes
                    setTimeout(() => {
                        bottomNav.classList.add('show');
                    }, 1000);
                }, 100);
            }
        });
    });
    
    // Update active link based on scroll position
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        // Get all sections
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const id = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/**
 * Smooth Scrolling Functionality
 */
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 800;
            let start = null;
            
            window.requestAnimationFrame(step);
            
            function step(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                
                // Easing function: easeInOutCubic
                const easeInOutCubic = t => t < 0.5 
                    ? 4 * t * t * t 
                    : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
                
                window.scrollTo(0, startPosition + distance * easeInOutCubic(Math.min(progress / duration, 1)));
                
                if (progress < duration) {
                    window.requestAnimationFrame(step);
                }
            }
        });
    });
}

/**
 * Form Validation
 */
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const formElements = this.elements;
            
            for (let i = 0; i < formElements.length; i++) {
                if (formElements[i].hasAttribute('required') && !formElements[i].value.trim()) {
                    isValid = false;
                    formElements[i].classList.add('error');
                } else if (formElements[i].type === 'email' && formElements[i].value) {
                    // Simple email validation
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(formElements[i].value)) {
                        isValid = false;
                        formElements[i].classList.add('error');
                    } else {
                        formElements[i].classList.remove('error');
                    }
                } else {
                    formElements[i].classList.remove('error');
                }
            }
            
            if (isValid) {
                // Show success message
                showNotification('Teşekkürler! Mesajınız gönderildi. En kısa sürede size dönüş yapacağız.', 'success');
                
                // Reset form
                this.reset();
            } else {
                showNotification('Lütfen tüm zorunlu alanları doldurun.', 'error');
            }
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation for newsletter
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(emailInput.value)) {
                    showNotification('Bültenimize başarıyla abone oldunuz!', 'success');
                    this.reset();
                } else {
                    showNotification('Lütfen geçerli bir e-posta adresi girin.', 'error');
                }
            } else {
                showNotification('Lütfen e-posta adresinizi girin.', 'error');
            }
        });
    }
    
    // Add input event listeners to remove error class when typing
    document.querySelectorAll('input, textarea').forEach(element => {
        element.addEventListener('input', function() {
            this.classList.remove('error');
        });
    });
}

/**
 * Show notification messages to users
 */
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
        
        // Add styles
        notification.style.position = 'fixed';
        notification.style.bottom = '80px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        notification.style.zIndex = '9999';
        notification.style.fontWeight = '500';
        notification.style.maxWidth = '90%';
        notification.style.transition = 'all 0.3s ease';
        notification.style.opacity = '0';
    }
    
    // Set colors based on notification type
    if (type === 'success') {
        notification.style.backgroundColor = '#789174';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#e74c3c';
        notification.style.color = 'white';
    } else {
        notification.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        notification.style.color = '#333';
        notification.style.border = '1px solid #ddd';
    }
    
    // Set message and show notification
    notification.textContent = message;
    notification.style.opacity = '1';
    
    // Hide notification after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        
        // Remove element after fade out
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Lazy Loading for Images
 */
function initLazyLoading() {
    // Only initialize if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        // Target all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
            }
        });
    }
}

/**
 * Scroll-based effects
 */
function initScrollEffects() {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrollValue = window.scrollY;
            if (scrollValue < window.innerHeight) {
                hero.style.backgroundPositionY = `${20 + (scrollValue * 0.1)}%`;
            }
        });
    }
    
    // Fade-in effect for sections when scrolling
    if ('IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.about-content, .product-card, .vision-content, .contact-content, .future-product').forEach(el => {
            el.classList.add('fade-in-element');
            fadeObserver.observe(el);
        });
    }
}

/**
 * Touch Support for Mobile
 */
function initTouchSupport() {
    // Add swipe detection for product cards
    const productCards = document.querySelectorAll('.product-card');
    
    let touchStartX = 0;
    let touchEndX = 0;
    let currentCard = null;
    
    productCards.forEach(card => {
        // Touch start
        card.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            currentCard = card;
        }, false);
        
        // Touch end
        card.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
    });
    
    function handleSwipe() {
        if (!currentCard) return;
        
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        // Detect left or right swipe
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Right swipe - show previous product
                const prevCard = currentCard.previousElementSibling;
                if (prevCard && prevCard.classList.contains('product-card')) {
                    currentCard.style.transform = 'translateX(100%)';
                    prevCard.style.transform = 'translateX(0)';
                    setTimeout(() => {
                        currentCard.style.transform = '';
                        prevCard.style.transform = '';
                    }, 300);
                }
            } else {
                // Left swipe - show next product
                const nextCard = currentCard.nextElementSibling;
                if (nextCard && nextCard.classList.contains('product-card')) {
                    currentCard.style.transform = 'translateX(-100%)';
                    nextCard.style.transform = 'translateX(0)';
                    setTimeout(() => {
                        currentCard.style.transform = '';
                        nextCard.style.transform = '';
                    }, 300);
                }
            }
        }
        
        currentCard = null;
    }
    
    // Add feedback on touch
    document.querySelectorAll('button, .btn, a, .product-card').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        ['touchend', 'touchcancel'].forEach(eventType => {
            element.addEventListener(eventType, function() {
                this.classList.remove('touch-active');
            }, { passive: true });
        });
    });
}

// Add CSS styles for animations and touch feedback
const style = document.createElement('style');
style.textContent = `
    .fade-in-element {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .fade-in-element.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .touch-active {
        transform: scale(0.98);
        transition: transform 0.2s ease;
    }
    
    input.error, textarea.error {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 1px #e74c3c !important;
    }
`;
document.head.appendChild(style);
