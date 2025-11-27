// ============================================
// Smooth Scroll
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ============================================
    // Scroll Animations
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.award-card, .company-section');
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // ============================================
    // Award Card Click Handler
    // ============================================
    const awardCards = document.querySelectorAll('.award-card');
    
    awardCards.forEach(card => {
        card.addEventListener('click', function() {
            // Navigate to company detail page
            window.location.href = 'company.html';
        });
    });

    // ============================================
    // Header Scroll Effect
    // ============================================
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop;
    });

    // ============================================
    // Page Load Animation
    // ============================================
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(function() {
            document.body.style.opacity = '1';
        }, 100);
    });
});

// ============================================
// Responsive Navigation Toggle
// ============================================
function createMobileMenu() {
    const nav = document.querySelector('.nav');
    const headerContent = document.querySelector('.header-content');
    
    // Create mobile menu toggle button
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    // Insert toggle button
    if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-toggle')) {
        headerContent.appendChild(menuToggle);
        
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

// Initialize mobile menu on load and resize
window.addEventListener('load', createMobileMenu);
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const nav = document.querySelector('.nav');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (nav) nav.classList.remove('active');
        if (menuToggle) menuToggle.remove();
    } else {
        createMobileMenu();
    }
});