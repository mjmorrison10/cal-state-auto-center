/* ============================================
   CAL STATE AUTO CENTER — SCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // --- Scroll Progress Bar ---
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (scrollProgress) scrollProgress.style.width = progress + '%';
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function() {
            mobileToggle.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close mobile menu on link click
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Open/Closed Indicator ---
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    function checkOpenStatus() {
        const now = new Date();
        const day = now.getDay(); // 0=Sun, 6=Sat
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const time = hours + minutes / 60;

        let isOpen = false;

        if (day >= 1 && day <= 6) { // Mon-Sat
            if (time >= 8 && time < 18) {
                isOpen = true;
            }
        }

        if (statusDot && statusText) {
            if (isOpen) {
                statusDot.classList.remove('closed');
                statusText.textContent = 'Open Now';
                statusText.style.color = '#16a34a';
            } else {
                statusDot.classList.add('closed');
                statusText.textContent = 'Closed';
                statusText.style.color = '#dc2626';
            }
        }
    }

    checkOpenStatus();
    setInterval(checkOpenStatus, 60000);

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function(el) {
        revealObserver.observe(el);
    });

    // --- Savings Counter Animation ---
    const savingsCounter = document.getElementById('savingsCounter');
    if (savingsCounter) {
        let counted = false;
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !counted) {
                    counted = true;
                    animateCounter(savingsCounter, 0, 40, 1500, '%');
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counterObserver.observe(savingsCounter);
    }

    function animateCounter(element, start, end, duration, suffix) {
        let startTime = null;
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * eased);
            element.textContent = current + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    // --- Mobile CTA Bar ---
    const mobileCtaBar = document.getElementById('mobileCtaBar');
    if (mobileCtaBar) {
        let lastScroll = 0;
        window.addEventListener('scroll', function() {
            const currentScroll = window.scrollY;
            if (currentScroll > 400) {
                mobileCtaBar.classList.add('visible');
            } else {
                mobileCtaBar.classList.remove('visible');
            }
            lastScroll = currentScroll;
        });
    }

    // --- Back to Top ---
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Form Validation ---
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Clear previous errors
            const errorFields = contactForm.querySelectorAll('.error');
            errorFields.forEach(function(f) { f.classList.remove('error'); });

            let isValid = true;

            // Validate name
            const nameField = document.getElementById('name');
            if (nameField && nameField.value.trim().length < 2) {
                nameField.classList.add('error');
                isValid = false;
            }

            // Validate phone
            const phoneField = document.getElementById('phone');
            if (phoneField) {
                const phoneVal = phoneField.value.replace(/\D/g, '');
                if (phoneVal.length < 7) {
                    phoneField.classList.add('error');
                    isValid = false;
                }
            }

            // Validate email if provided
            const emailField = document.getElementById('email');
            if (emailField && emailField.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value.trim())) {
                    emailField.classList.add('error');
                    isValid = false;
                }
            }

            if (isValid) {
                contactForm.style.display = 'none';
                if (formSuccess) {
                    formSuccess.classList.add('show');
                }
            }
        });

        // Remove error on focus
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(function(input) {
            input.addEventListener('focus', function() {
                this.classList.remove('error');
            });
        });
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

});
