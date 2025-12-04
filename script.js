// ================================
// DOM ELEMENTS
// ================================

const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxInfo = document.getElementById('lightbox-info');
const lightboxClose = document.querySelector('.lightbox-close');
const loader = document.querySelector('.loader');

// ================================
// LOADER
// ================================

window.addEventListener('load', () => {
    setTimeout(() => {
        if (loader) {
            loader.classList.add('hidden');
            initAOS();
        }
    }, 800);
});

// ================================
// NAVIGATION SCROLL
// ================================

let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ================================
// MOBILE MENU
// ================================

if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Smooth scroll for navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');

        if (targetId && targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ================================
// GALLERY FILTER
// ================================

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter gallery items
            galleryItems.forEach(item => {
                if (filter === 'all') {
                    item.classList.remove('hidden');
                } else {
                    if (item.classList.contains(filter)) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                }
            });
        });
    });
}

// ================================
// LIGHTBOX
// ================================

// Open lightbox
galleryItems.forEach(item => {
    const imageWrapper = item.querySelector('.gallery-image-wrapper');

    if (imageWrapper) {
        imageWrapper.addEventListener('click', () => {
            const img = item.querySelector('.gallery-image-wrapper img');
            const info = item.querySelector('.gallery-info');

            if (img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || '';

                if (info) {
                    lightboxInfo.innerHTML = info.innerHTML;
                } else {
                    lightboxInfo.innerHTML = '';
                }

                openLightbox();
            }
        });
    }
});

function openLightbox() {
    if (lightbox) {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close lightbox on close button
if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

// Close lightbox on image click
if (lightboxImg) {
    lightboxImg.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent bubbling to lightbox container
        closeLightbox();
    });
}

// Close lightbox on background click
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

// ================================
// AOS (Animate On Scroll) - simplified
// ================================

function initAOS() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ================================
// LAZY LOADING IMAGES
// ================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ================================
// UTILITY FUNCTIONS
// ================================

// Debounce function for performance
function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit = 100) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ================================
// PERFORMANCE MONITORING
// ================================

// Log page load time (dev only)
if (window.performance) {
    window.addEventListener('load', () => {
        const loadTime = window.performance.timing.domContentLoadedEventEnd -
            window.performance.timing.navigationStart;
        console.log('🎨 Portfolio loaded in: ' + loadTime + 'ms');
    });
}

// ================================
// INITIALIZATION
// ================================

console.log('✅ Portfolio scripts initialized');
console.log('📱 Gallery items:', galleryItems.length);
console.log('🎯 Filter buttons:', filterBtns.length);

// ================================
// PRODUCT IMAGE SWITCHER
// ================================

function changeImage(thumb, src) {
    // Find the main image in the same product card
    const card = thumb.closest('.product-card');
    const mainImg = card.querySelector('.product-image-main img');

    // Update source
    mainImg.style.opacity = '0';
    setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = '1';
    }, 200);

    // Update active class
    const thumbs = card.querySelectorAll('.thumb');
    thumbs.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
}

function showContactInfo(btn) {
    const container = btn.parentElement;
    const msg = container.querySelector('.contact-info-msg');

    btn.style.display = 'none';
    msg.style.display = 'block';

    // Optional: animate fade in
    msg.style.opacity = 0;
    msg.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        msg.style.opacity = 1;
    }, 10);
}