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

    // Typewriter effect function
    function typeWriter(element, text, speed = 30, callback) {
        let i = 0;
        element.textContent = '';
        element.style.visibility = 'visible';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        }
        type();
    }

    // Chat animation sequence
    function animateChat() {
        const chatWindow = document.querySelector('.chat-window');
        if (!chatWindow) return;

        const messages = [
            { type: 'user', text: 'Erstelle ein Aufmaß für Projekt Düsseldorf', delay: 1000 },
            { type: 'bot', text: 'Aufmaß wird erstellt... ✅ Fertig! 47 Positionen, 3 Etagen. Excel exportiert.', delay: 2000, typing: true },
            { type: 'user', text: 'Schicke die Rechnung an Müller GmbH', delay: 1500 },
            { type: 'bot', text: '📧 E-Mail-Entwurf erstellt. Rechnung #2024-047 angehängt. Soll ich absenden?', delay: 2000, typing: true }
        ];

        const chatMessagesContainer = chatWindow.querySelector('.chat-messages');
        chatMessagesContainer.innerHTML = '';

        let totalDelay = 500;

        messages.forEach((msg, index) => {
            setTimeout(() => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.type}`;
                chatMessagesContainer.appendChild(messageDiv);
                
                // Scroll to bottom
                chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

                if (msg.type === 'bot' && msg.typing) {
                    // Show typing indicator first
                    messageDiv.innerHTML = '<span class="typing-indicator"><span></span><span></span><span></span></span>';
                    
                    setTimeout(() => {
                        messageDiv.innerHTML = '';
                        const textSpan = document.createElement('span');
                        textSpan.className = 'message-text';
                        messageDiv.appendChild(textSpan);
                        typeWriter(textSpan, msg.text, 25);
                    }, 1200);
                } else {
                    typeWriter(messageDiv, msg.text, 20);
                }
            }, totalDelay);

            totalDelay += msg.delay + (msg.type === 'bot' ? 1500 : 800);
        });

        // Restart animation after it completes
        setTimeout(() => {
            animateChat();
        }, totalDelay + 5000);
    }

    // Start chat animation when hero is visible
    const chatObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateChat, 1000);
                chatObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const chatWindow = document.querySelector('.chat-window');
    if (chatWindow) {
        chatObserver.observe(chatWindow);
    }

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
