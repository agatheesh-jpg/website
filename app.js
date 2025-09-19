// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Smooth Scrolling for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active Navigation Link Highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.getBoundingClientRect().top + window.pageYOffset - 100;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`a[href="#${id}"]`);
            
            if (scrollPos >= top && scrollPos <= bottom) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current section's nav link
                if (correspondingNavLink) {
                    correspondingNavLink.classList.add('active');
                }
            }
        });
    }

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Set initial active nav link
    updateActiveNavLink();

    // Navbar Background Change on Scroll
    const navbar = document.getElementById('navbar');
    
    function updateNavbarBackground() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(var(--color-surface-rgb, 255, 255, 253), 0.95)';
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.background = 'rgba(var(--color-surface-rgb, 255, 255, 253), 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
    
    window.addEventListener('scroll', updateNavbarBackground);
    updateNavbarBackground();

    // Contact Form Validation and Submission
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    
    // Form validation rules
    const validators = {
        name: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Please enter a valid name (letters and spaces only, minimum 2 characters)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        message: {
            required: true,
            minLength: 10,
            message: 'Please enter a message (minimum 10 characters)'
        }
    };
    
    // Validate individual field
    function validateField(fieldName, value) {
        const rules = validators[fieldName];
        if (!rules) return { isValid: true };
        
        // Check required
        if (rules.required && (!value || value.trim() === '')) {
            return { 
                isValid: false, 
                message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required` 
            };
        }
        
        // Check minimum length
        if (rules.minLength && value.trim().length < rules.minLength) {
            return { 
                isValid: false, 
                message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${rules.minLength} characters long` 
            };
        }
        
        // Check pattern
        if (rules.pattern && !rules.pattern.test(value.trim())) {
            return { 
                isValid: false, 
                message: rules.message 
            };
        }
        
        return { isValid: true };
    }
    
    // Display error message
    function showError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const inputElement = document.getElementById(fieldName);
        
        if (errorElement && inputElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            inputElement.style.borderColor = 'var(--color-error)';
        }
    }
    
    // Clear error message
    function clearError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const inputElement = document.getElementById(fieldName);
        
        if (errorElement && inputElement) {
            errorElement.style.display = 'none';
            inputElement.style.borderColor = 'var(--color-border)';
        }
    }
    
    // Real-time validation
    ['name', 'email', 'message'].forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', function() {
                const validation = validateField(fieldName, this.value);
                if (!validation.isValid) {
                    showError(fieldName, validation.message);
                } else {
                    clearError(fieldName);
                }
            });
            
            field.addEventListener('input', function() {
                // Clear error on input if field becomes valid
                const validation = validateField(fieldName, this.value);
                if (validation.isValid) {
                    clearError(fieldName);
                }
            });
        }
    });
    
    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Validate all fields
            let isFormValid = true;
            const fields = { name, email, message };
            
            Object.keys(fields).forEach(fieldName => {
                const validation = validateField(fieldName, fields[fieldName]);
                if (!validation.isValid) {
                    showError(fieldName, validation.message);
                    isFormValid = false;
                } else {
                    clearError(fieldName);
                }
            });
            
            if (isFormValid) {
                // Simulate form submission
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                // Simulate API call delay
                setTimeout(() => {
                    // Show success message
                    formSuccess.classList.remove('hidden');
                    
                    // Reset form
                    this.reset();
                    
                    // Reset button
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        formSuccess.classList.add('hidden');
                    }, 5000);
                    
                }, 1500);
            }
        });
    }

    // Scroll Animation - Fade in elements
    function animateOnScroll() {
        const animatedElements = document.querySelectorAll('.card, .project-card, .achievement-item, .about-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Initialize scroll animations
    animateOnScroll();

    // Smooth scroll for hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons a');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerOffset = 80;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Add loading class removal for better performance
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Close mobile menu with Escape key
        if (e.key === 'Escape') {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Add focus management for accessibility
    navLinks.forEach(link => {
        link.addEventListener('focus', function() {
            // Ensure focused link is visible in mobile menu
            if (window.innerWidth <= 768) {
                navMenu.classList.add('active');
            }
        });
    });

    // Performance optimization - throttle scroll events
    let scrollTimeout;
    function throttleScroll(func, delay) {
        return function() {
            if (scrollTimeout) {
                return;
            }
            scrollTimeout = setTimeout(() => {
                func.apply(this, arguments);
                scrollTimeout = null;
            }, delay);
        };
    }

    // Apply throttling to scroll events
    window.addEventListener('scroll', throttleScroll(updateActiveNavLink, 100));
    window.addEventListener('scroll', throttleScroll(updateNavbarBackground, 100));

    // Initialize everything
    console.log('Portfolio website initialized successfully!');
});