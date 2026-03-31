// ============================================
// Mobile Menu Toggle
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // ============================================
    // Smooth Scroll
    // ============================================
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
    // Header Scroll Effect
    // ============================================
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
        
        lastScrollTop = scrollTop;
    });

    // ============================================
    // Scroll Animations
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.service-card, .news-item, .value-item, .feature-item');
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // ============================================
    // Contact Form Validation
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const company = document.getElementById('company').value.trim();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const category = document.getElementById('category').value;
            const message = document.getElementById('message').value.trim();
            const privacy = document.querySelector('input[name="privacy"]').checked;
            
            // Validation
            let isValid = true;
            let errorMessage = '';
            
            if (!company) {
                errorMessage += '会社名を入力してください。\n';
                isValid = false;
            }
            
            if (!name) {
                errorMessage += 'お名前を入力してください。\n';
                isValid = false;
            }
            
            if (!email) {
                errorMessage += 'メールアドレスを入力してください。\n';
                isValid = false;
            } else if (!isValidEmail(email)) {
                errorMessage += '正しいメールアドレスを入力してください。\n';
                isValid = false;
            }
            
            if (!category) {
                errorMessage += 'お問い合わせ種別を選択してください。\n';
                isValid = false;
            }
            
            if (!message) {
                errorMessage += 'お問い合わせ内容を入力してください。\n';
                isValid = false;
            }
            
            if (!privacy) {
                errorMessage += 'プライバシーポリシーに同意してください。\n';
                isValid = false;
            }
            
            if (isValid) {
                // Show success message
                alert('お問い合わせを送信しました。\n担当者より3営業日以内にご連絡させていただきます。');
                contactForm.reset();
            } else {
                alert(errorMessage);
            }
        });
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

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
// Mobile Navigation Styles (for toggle functionality)
// ============================================
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav {
            position: fixed;
            top: 70px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background-color: rgba(255, 255, 255, 0.98);
            transition: left 0.3s ease;
            z-index: 999;
        }
        
        .nav.active {
            left: 0;
        }
        
        .nav ul {
            flex-direction: column;
            padding: 2rem;
            gap: 1.5rem;
        }
        
        .nav a {
            font-size: 18px;
        }
        
        .menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(style);