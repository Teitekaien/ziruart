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

// Function to apply filter programmatically
function applyFilter(filterName) {
    // Update active button
    filterBtns.forEach(btn => {
        if (btn.getAttribute('data-filter') === filterName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Filter gallery items
    galleryItems.forEach(item => {
        if (filterName === 'all') {
            item.classList.remove('hidden');
        } else {
            if (item.classList.contains(filterName)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        }
    });
}

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            applyFilter(filter);
        });
    });
}

// Handle #geometric-animals link - show only animals in gallery
document.querySelectorAll('a[href="#geometric-animals"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Apply animals filter
        applyFilter('animals');

        // Scroll to gallery section
        const worksSection = document.getElementById('works');
        if (worksSection) {
            const offsetTop = worksSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

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

// ================================
// PRODUCT IMAGE LIGHTBOX
// ================================

// Open lightbox for product images (for-sale section)
document.querySelectorAll('.product-image-main img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
        if (lightbox && lightboxImg) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || '';

            // Clear info for product images (no overlay text needed)
            if (lightboxInfo) {
                lightboxInfo.innerHTML = '';
            }

            openLightbox();
        }
    });
});

// ================================
// SWIPE FOR PRODUCT IMAGES (Mobile)
// ================================

document.querySelectorAll('.product-card').forEach(card => {
    const imageMain = card.querySelector('.product-image-main');
    const thumbs = card.querySelectorAll('.thumb');
    const mainImg = imageMain?.querySelector('img');

    if (!imageMain || thumbs.length < 2) return;

    // Create swipe dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'swipe-dots';
    thumbs.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'swipe-dot' + (i === 0 ? ' active' : '');
        dotsContainer.appendChild(dot);
    });
    imageMain.parentNode.insertBefore(dotsContainer, imageMain.nextSibling);

    // Create swipe hint
    const swipeHint = document.createElement('div');
    swipeHint.className = 'swipe-hint';
    swipeHint.innerHTML = '← Przesuń →';
    imageMain.appendChild(swipeHint);

    // Show hint on first visit
    setTimeout(() => {
        swipeHint.classList.add('visible');
        setTimeout(() => swipeHint.classList.remove('visible'), 3000);
    }, 1500);

    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const imageSources = Array.from(thumbs).map(thumb => {
        const onclick = thumb.getAttribute('onclick');
        const match = onclick?.match(/'([^']+)'\s*\)/);
        return match ? match[1] : thumb.querySelector('img')?.src;
    });

    function updateImage(index) {
        currentIndex = index;
        if (mainImg && imageSources[index]) {
            mainImg.style.opacity = '0';
            setTimeout(() => {
                mainImg.src = imageSources[index];
                mainImg.style.opacity = '1';
            }, 150);
        }

        // Update dots
        dotsContainer.querySelectorAll('.swipe-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // Update thumb active state
        thumbs.forEach((t, i) => t.classList.toggle('active', i === index));
    }

    // Touch events
    imageMain.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        imageMain.classList.add('swiping');
    }, { passive: true });

    imageMain.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        if (mainImg) {
            mainImg.style.transform = `translateX(${diff * 0.3}px)`;
        }
    }, { passive: true });

    imageMain.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        imageMain.classList.remove('swiping');

        const diff = currentX - startX;
        if (mainImg) mainImg.style.transform = '';

        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex > 0) {
                updateImage(currentIndex - 1);
            } else if (diff < 0 && currentIndex < imageSources.length - 1) {
                updateImage(currentIndex + 1);
            }
        }
        currentX = 0;
    });
});

// ================================
// STICKY CTA ON MOBILE
// ================================

const forSaleSection = document.getElementById('for-sale');

if (forSaleSection && window.innerWidth <= 768) {
    // Create sticky CTA
    const stickyCta = document.createElement('div');
    stickyCta.className = 'sticky-cta';
    stickyCta.innerHTML = `
        <a href="#for-sale" class="btn btn-primary" onclick="scrollToFirstProduct()">
            Zobacz dostępne obrazy
        </a>
    `;
    document.body.appendChild(stickyCta);

    let lastScrollY = 0;

    window.addEventListener('scroll', throttle(() => {
        const sectionTop = forSaleSection.offsetTop;
        const sectionBottom = sectionTop + forSaleSection.offsetHeight;
        const scrollY = window.pageYOffset;
        const viewportHeight = window.innerHeight;

        // Show sticky CTA when scrolling down and past hero, hide when in for-sale section
        if (scrollY > viewportHeight * 0.5 &&
            (scrollY < sectionTop - 100 || scrollY > sectionBottom)) {
            stickyCta.classList.add('visible');
        } else {
            stickyCta.classList.remove('visible');
        }

        lastScrollY = scrollY;
    }, 100));
}

function scrollToFirstProduct() {
    const firstProduct = document.querySelector('.product-card');
    if (firstProduct) {
        const offsetTop = firstProduct.offsetTop - 100;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// ================================
// LIGHTBOX SWIPE NAVIGATION
// ================================

let lightboxStartX = 0;
let lightboxCurrentX = 0;
let lightboxImages = [];
let lightboxCurrentIndex = 0;

// Collect all gallery images for navigation
function collectLightboxImages() {
    lightboxImages = [];
    document.querySelectorAll('.gallery-item:not(.hidden) .gallery-image-wrapper img').forEach(img => {
        lightboxImages.push({
            src: img.src,
            alt: img.alt,
            info: img.closest('.gallery-item')?.querySelector('.gallery-info')?.innerHTML || ''
        });
    });
}

// Update existing lightbox open logic
const originalGalleryClickHandler = () => {
    collectLightboxImages();
};

// Override gallery click to track index
galleryItems.forEach((item, index) => {
    const imageWrapper = item.querySelector('.gallery-image-wrapper');
    if (imageWrapper) {
        imageWrapper.addEventListener('click', () => {
            collectLightboxImages();
            // Find current image index in filtered list
            const img = item.querySelector('.gallery-image-wrapper img');
            lightboxCurrentIndex = lightboxImages.findIndex(i => i.src === img?.src);
        });
    }
});

function navigateLightbox(direction) {
    const newIndex = lightboxCurrentIndex + direction;
    if (newIndex >= 0 && newIndex < lightboxImages.length) {
        lightboxCurrentIndex = newIndex;
        const imageData = lightboxImages[newIndex];
        if (lightboxImg) {
            lightboxImg.style.opacity = '0';
            lightboxImg.style.transform = `translateX(${direction * 50}px)`;
            setTimeout(() => {
                lightboxImg.src = imageData.src;
                lightboxImg.alt = imageData.alt;
                lightboxImg.style.transform = '';
                lightboxImg.style.opacity = '1';
                if (lightboxInfo) {
                    lightboxInfo.innerHTML = imageData.info;
                }
            }, 150);
        }
    }
}

// Add swipe support to lightbox
if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
        if (e.target === lightboxImg || e.target.closest('.lightbox-image')) {
            lightboxStartX = e.touches[0].clientX;
        }
    }, { passive: true });

    lightbox.addEventListener('touchmove', (e) => {
        lightboxCurrentX = e.touches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', () => {
        const diff = lightboxCurrentX - lightboxStartX;
        if (Math.abs(diff) > 80) {
            if (diff > 0) {
                navigateLightbox(-1); // Previous
            } else {
                navigateLightbox(1); // Next
            }
        }
        lightboxCurrentX = 0;
        lightboxStartX = 0;
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        }
    });
}

// ================================
// IMAGE LOAD ANIMATION
// ================================

document.querySelectorAll('.product-image-main img, .gallery-image-wrapper img').forEach(img => {
    if (img.complete) {
        img.classList.add('loaded');
    } else {
        img.addEventListener('load', () => img.classList.add('loaded'));
    }
});