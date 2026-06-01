// ============================================
// TYPING ANIMATION
// ============================================

const typed = new Typed(".typing-text", {
    strings: [
        "AI Engineer",
        "ML Developer",
        "GenAI Specialist",
        "Backend Developer",
        "RAG Systems Expert",
        "Python Developer"
    ],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 1500,
    loop: true,
    showCursor: false
});

// ============================================
// SMOOTH SCROLL AND ACTIVE NAV
// ============================================

const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// ============================================
// MOBILE MENU TOGGLE
// ============================================

const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');

menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
    });
});

// ============================================
// ENHANCED SCROLL ANIMATIONS WITH REVEAL EFFECTS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            // Add stagger effect for child elements
            const children = entry.target.querySelectorAll('*');
            children.forEach((child, index) => {
                child.style.animation = `slideUp 0.6s ease-out ${index * 0.05}s both`;
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.skill-category, .project-card, .cert-card, .service-card, .timeline-item').forEach(el => {
    el.classList.add('observe-element');
    observer.observe(el);
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .observe-element {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .observe-element.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    /* Text reveal animation */
    .reveal-text {
        position: relative;
        overflow: hidden;
    }

    .reveal-text::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        animation: reveal-shine 0.8s ease;
    }

    @keyframes reveal-shine {
        0% { left: -100%; }
        100% { left: 100%; }
    }

    /* Entrance animations */
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// CONTACT FORM HANDLING WITH ANIMATIONS
// ============================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Create success message with animation
        const successMessage = document.createElement('div');
        successMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #00d4ff 0%, #a855f7 100%);
            color: #000;
            padding: 1.5rem 2rem;
            border-radius: 10px;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.4s ease, bounce 0.6s ease 0.4s;
            box-shadow: 0 10px 40px rgba(0, 212, 255, 0.3);
        `;
        successMessage.innerHTML = '✓ <span style="margin-left: 10px;">Message sent successfully!</span>';
        document.body.appendChild(successMessage);

        // Add button feedback
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.style.animation = 'button-success 0.6s ease';
            submitBtn.disabled = true;
            setTimeout(() => {
                submitBtn.disabled = false;
            }, 3000);
        }

        // Remove message after 4 seconds with animation
        setTimeout(() => {
            successMessage.style.animation = 'slideOut 0.4s ease';
            setTimeout(() => successMessage.remove(), 400);
        }, 4000);

        // Reset form with animation
        contactForm.style.animation = 'form-shake 0.3s ease';
        contactForm.reset();
        setTimeout(() => {
            contactForm.style.animation = '';
        }, 300);
    });
}

// Add form animations
const formStyles = document.createElement('style');
formStyles.textContent = `
    @keyframes button-success {
        0% { background: linear-gradient(135deg, #00d4ff 0%, #a855f7 100%); }
        50% { background: linear-gradient(135deg, #10b981 0%, #34d399 100%); }
        100% { background: linear-gradient(135deg, #00d4ff 0%, #a855f7 100%); }
    }

    @keyframes form-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    .form-group input:focus,
    .form-group textarea:focus {
        animation: input-glow 0.3s ease;
    }

    @keyframes input-glow {
        from {
            box-shadow: none;
        }
        to {
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.2), inset 0 0 10px rgba(0, 212, 255, 0.05);
        }
    }
`;
document.head.appendChild(formStyles);

// ============================================
// PROJECT CARD HOVER EFFECTS
// ============================================

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.cursor = 'pointer';
    });

    const projectLink = card.querySelector('.project-link');
    if (projectLink) {
        projectLink.addEventListener('click', (e) => {
            if (projectLink.href === '#') {
                e.preventDefault();
                showComingSoon();
            }
        });
    }
});

// ============================================
// SKILL TAG ANIMATION
// ============================================

const skillTags = document.querySelectorAll('.skill-tag');

skillTags.forEach((tag, index) => {
    tag.style.animationDelay = `${index * 0.05}s`;
    tag.classList.add('tag-animate');
});

const tagStyles = document.createElement('style');
tagStyles.textContent = `
    .skill-tag {
        animation: tagFadeIn 0.6s ease backwards;
    }

    @keyframes tagFadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(tagStyles);

// ============================================
// COMING SOON POPUP
// ============================================

function showComingSoon() {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(26, 31, 58, 0.95) 100%);
        border: 2px solid rgba(0, 212, 255, 0.3);
        border-radius: 15px;
        padding: 2rem;
        max-width: 400px;
        text-align: center;
        z-index: 10001;
        backdrop-filter: blur(10px);
        animation: popupAppear 0.3s ease;
    `;

    popup.innerHTML = `
        <h3 style="color: #00d4ff; margin-bottom: 1rem; font-size: 1.5rem;">Coming Soon</h3>
        <p style="color: #9ca3af; margin-bottom: 1.5rem;">Detailed project information will be available shortly.</p>
        <button onclick="this.parentElement.style.animation='popupDisappear 0.3s ease'; setTimeout(() => this.parentElement.remove(), 300);" style="
            background: linear-gradient(135deg, #00d4ff 0%, #a855f7 100%);
            border: none;
            color: #000;
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        ">Close</button>
    `;

    document.body.appendChild(popup);
}

// Add popup animations
const popupStyles = document.createElement('style');
popupStyles.textContent = `
    @keyframes popupAppear {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }

    @keyframes popupDisappear {
        from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
        }
    }
`;
document.head.appendChild(popupStyles);

// ============================================
// PARALLAX EFFECT ON SCROLL & ENHANCED ANIMATIONS
// ============================================

const parallaxElements = document.querySelectorAll('.ai-orb, .floating-particle');
let scrollProgress = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    scrollProgress = (scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.3 + (index * 0.05);
        element.style.transform = `translate(var(--x, 0), var(--y, 0)) translateY(${scrollY * speed}px)`;
    });

    // Add scroll progress bar effect (optional)
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        progressBar.style.width = scrollProgress + '%';
    }

    // Add subtle background color shift on scroll
    const scrollAmount = scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    document.body.style.backgroundColor = `hsla(${220 + scrollAmount * 10}, ${25}%, ${8 + scrollAmount * 3}%, 1)`;
});

// ============================================
// SMOOTH SCROLL ANCHOR LINKS WITH ANIMATION
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Add highlight animation
            target.style.animation = 'highlight-section 0.8s ease-out';
        }
    });
});

// Add section highlight animation
const highlightStyle = document.createElement('style');
highlightStyle.textContent = `
    @keyframes highlight-section {
        0% {
            box-shadow: inset 0 0 0 rgba(0, 212, 255, 0);
        }
        50% {
            box-shadow: inset 0 0 20px rgba(0, 212, 255, 0.2);
        }
        100% {
            box-shadow: inset 0 0 0 rgba(0, 212, 255, 0);
        }
    }
`;
document.head.appendChild(highlightStyle);

// ============================================
// PAGE LOAD ANIMATION
// ============================================

window.addEventListener('load', () => {
    document.body.style.animation = 'fadeIn 0.8s ease';
});

const loadStyles = document.createElement('style');
loadStyles.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    /* Enhanced button animations */
    button, a[class*="btn"] {
        position: relative;
        overflow: hidden;
        background-clip: padding-box;
    }

    /* Glow effect for active buttons */
    button:active, a[class*="btn"]:active {
        animation: press 0.2s ease;
    }

    @keyframes press {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(loadStyles);

// ============================================
// CUSTOM CURSOR TRACKING & ANIMATION
// ============================================

const cursor = document.querySelector('.cursor');
const cursorBorder = document.querySelector('.cursor-border');
const cursorText = document.querySelector('.cursor-text');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

// Track mouse movement
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Update cursor position with smooth animation
    if (cursor) {
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    }
    
    // Update cursor border with lag effect
    if (cursorBorder) {
        cursorBorder.style.left = (mouseX - 15) + 'px';
        cursorBorder.style.top = (mouseY - 15) + 'px';
    }
});

// Change cursor on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-tag, .nav-link, input, textarea');

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        if (cursor) {
            cursor.style.width = '8px';
            cursor.style.height = '8px';
            cursor.style.background = 'var(--secondary-color)';
            cursor.style.boxShadow = '0 0 30px rgba(168, 85, 247, 0.8)';
            cursor.style.transition = 'all 0.2s ease';
        }
        if (cursorBorder) {
            cursorBorder.style.width = '45px';
            cursorBorder.style.height = '45px';
            cursorBorder.style.borderColor = 'var(--secondary-color)';
            cursorBorder.style.opacity = '0.8';
            cursorBorder.style.transition = 'all 0.2s ease';
        }
    });
    
    element.addEventListener('mouseleave', () => {
        if (cursor) {
            cursor.style.width = '12px';
            cursor.style.height = '12px';
            cursor.style.background = 'var(--primary-color)';
            cursor.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.6)';
        }
        if (cursorBorder) {
            cursorBorder.style.width = '30px';
            cursorBorder.style.height = '30px';
            cursorBorder.style.borderColor = 'var(--primary-color)';
            cursorBorder.style.opacity = '0.6';
        }
    });
});

// Hide custom cursor on touch devices
if (window.matchMedia('(hover: none)').matches) {
    document.body.style.cursor = 'auto';
    if (cursor) cursor.style.display = 'none';
    if (cursorBorder) cursorBorder.style.display = 'none';
}

const mouse = { x: 0, y: 0 };
document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// ============================================
// TEXT ANIMATION ON HOVER
// ============================================

const animatedTexts = document.querySelectorAll('h1, h2, h3, .btn, .nav-link');

animatedTexts.forEach(text => {
    text.addEventListener('mouseenter', function() {
        this.style.animation = 'text-pop 0.3s ease';
    });
});

const textPopStyle = document.createElement('style');
textPopStyle.textContent = `
    @keyframes text-pop {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(textPopStyle);

// ============================================
// ACCESSIBILITY - KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navbar.classList.remove('active');
    }
});

// ============================================
// ENHANCED MOUSE TRACKING & PARTICLE EFFECTS
// ============================================

// Create mouse trail effect
let mouseTrail = [];
const maxTrailLength = 10;

document.addEventListener('mousemove', (e) => {
    mouseTrail.push({ x: e.clientX, y: e.clientY });
    if (mouseTrail.length > maxTrailLength) {
        mouseTrail.shift();
    }
});

// Add click ripple effect
function createRipple(event) {
    const buttons = event.target.closest('button, a[class*=\"btn\"]');
    if (!buttons) return;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        pointer-events: none;
        animation: ripple-effect 0.6s ease-out;
    `;
    
    const rect = buttons.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    buttons.style.position = 'relative';
    buttons.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

document.addEventListener('click', createRipple);

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple-effect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ============================================
// INTERSECTION OBSERVER FOR COUNTERS
// ============================================

const statElements = document.querySelectorAll('.stat h3');

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
            entry.target.setAttribute('data-animated', 'true');
            // Add animation here if needed
        }
    });
}, { threshold: 0.5 });

statElements.forEach(stat => {
    statsObserver.observe(stat);
});

// ============================================
// LAZY LOADING FOR IMAGES
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log('%cWelcome to Abdul Razaque\'s Portfolio!', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with modern web technologies and AI expertise.', 'color: #a855f7; font-size: 14px;');
console.log('%cLet\'s build something amazing together!', 'color: #ec4899; font-size: 14px;');
