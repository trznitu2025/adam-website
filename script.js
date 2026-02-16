// ADAM Landing Page - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe feature cards, pricing cards, etc.
    document.querySelectorAll('.feature-card, .pricing-card, .usecase-card, .faq-item, .step').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animate-in class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Chat window animation
    const chatMessages = document.querySelectorAll('.chat-messages .message');
    chatMessages.forEach((msg, index) => {
        msg.style.opacity = '0';
        setTimeout(() => {
            msg.style.opacity = '1';
        }, 500 + (index * 800));
    });

    // Typing animation for bot messages
    const botMessages = document.querySelectorAll('.message.bot');
    botMessages.forEach((msg, index) => {
        const typingIndicator = msg.querySelector('.typing-indicator');
        const messageText = msg.querySelector('.message-text');
        
        if (typingIndicator && messageText) {
            messageText.style.display = 'none';
            setTimeout(() => {
                typingIndicator.style.display = 'none';
                messageText.style.display = 'inline';
            }, 1500 + (index * 2000));
        }
    });

    // Counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + (element.dataset.suffix || '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + (element.dataset.suffix || '');
            }
        }, 16);
    }

    // Animate stats when hero section is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.stat-number').forEach(stat => {
                    const text = stat.textContent;
                    if (text.includes('%')) {
                        stat.dataset.suffix = '%';
                        animateCounter(stat, parseInt(text));
                    } else if (text.includes('+')) {
                        stat.dataset.suffix = '+';
                        animateCounter(stat, parseInt(text));
                    }
                });
                heroObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const hero = document.querySelector('.hero');
    if (hero) {
        heroObserver.observe(hero);
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-open');
            this.textContent = navLinks.classList.contains('mobile-open') ? '✕' : '☰';
        });
    }

    // Add mobile menu styles
    const mobileStyle = document.createElement('style');
    mobileStyle.textContent = `
        @media (max-width: 768px) {
            .nav-links.mobile-open {
                display: flex !important;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(10, 10, 15, 0.98);
                padding: 20px;
                border-bottom: 1px solid var(--border);
            }
        }
    `;
    document.head.appendChild(mobileStyle);

    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Wird gesendet...';
            submitBtn.disabled = true;
            
            // Re-enable after form submission (Formspree handles the actual submit)
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        });
    }

    // Add parallax effect to hero background
    window.addEventListener('scroll', function() {
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            const scrolled = window.scrollY;
            heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });

    // Add hover effect sound (optional - commented out)
    // const buttons = document.querySelectorAll('.btn');
    // buttons.forEach(btn => {
    //     btn.addEventListener('mouseenter', () => {
    //         // Play subtle hover sound
    //     });
    // });

    console.log('🤖 ADAM Landing Page loaded successfully!');
});
