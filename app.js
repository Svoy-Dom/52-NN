// Enhanced Navigation with smooth scrolling and accessibility
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navbarToggle = document.querySelector('.navbar__toggle');
        this.navbarMenu = document.querySelector('.navbar__menu');
        this.init();
    }

    init() {
        if (this.navbarToggle) {
            this.navbarToggle.addEventListener('click', this.toggleMenu.bind(this));
        }

        // Smooth scrolling for internal links
        this.setupSmoothScrolling();
        
        // Navbar scroll effect
        this.setupScrollEffect();
        
        // Close menu on escape
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    toggleMenu() {
        this.navbarToggle.classList.toggle('active');
        this.navbarMenu.classList.toggle('active');
        
        // Update aria attributes
        const isExpanded = this.navbarMenu.classList.contains('active');
        this.navbarToggle.setAttribute('aria-expanded', isExpanded);
        this.navbarMenu.setAttribute('aria-hidden', !isExpanded);
    }

    setupSmoothScrolling() {
        const internalLinks = document.querySelectorAll('a[href^="#"]');
        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                    
                    // Close mobile menu after click
                    if (this.navbarMenu.classList.contains('active')) {
                        this.toggleMenu();
                    }
                }
            });
        });
    }

    setupScrollEffect() {
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                this.navbar.classList.add('navbar--hidden');
            } else {
                this.navbar.classList.remove('navbar--hidden');
            }
            
            // Add background on scroll
            if (scrollTop > 50) {
                this.navbar.classList.add('navbar--scrolled');
            } else {
                this.navbar.classList.remove('navbar--scrolled');
            }
            
            lastScrollTop = scrollTop;
        });
    }

    handleKeydown(e) {
        if (e.key === 'Escape' && this.navbarMenu.classList.contains('active')) {
            this.toggleMenu();
        }
    }
}

// Enhanced Calculator with validation and animations
class Calculator {
    constructor() {
        this.prices = {
            base: {
                'Семейный 40': 4000000,
                'МиниДом 36': 3200000,
                'Дом Куб 30': 2900000
            },
            foundation: {
                'Свайно-винтовой': 0,
                'МЗЛФ': 150000,
                'Плита': 350000
            },
            options: {
                'Терраса': 250000,
                'Кровля металло-черепица': 120000,
                'Панорамные окна': 200000
            }
        };
        
        this.init();
    }

    init() {
        this.houseType = document.getElementById('houseType');
        this.foundationType = document.getElementById('foundationType');
        this.optionCheckboxes = document.querySelectorAll('.options__grid input[type="checkbox"]');
        this.totalPriceEl = document.getElementById('totalPrice');

        if (this.houseType && this.foundationType) {
            [this.houseType, this.foundationType].forEach(select => {
                select.addEventListener('change', this.calculateTotal.bind(this));
            });

            this.optionCheckboxes.forEach(cb => {
                cb.addEventListener('change', this.calculateTotal.bind(this));
            });

            // Initial calculation
            this.calculateTotal();
        }
    }

    formatPrice(num) {
        return new Intl.NumberFormat('ru-RU').format(num) + ' ₽';
    }

    calculateTotal() {
        const base = this.prices.base[this.houseType.value] || 0;
        const foundation = this.prices.foundation[this.foundationType.value] || 0;
        const optionsSum = Array.from(this.optionCheckboxes)
            .filter(cb => cb.checked)
            .reduce((acc, cb) => acc + (this.prices.options[cb.value] || 0), 0);

        const total = base + foundation + optionsSum;
        this.animatePrice(total);
        return total;
    }

    animatePrice(value) {
        this.totalPriceEl.classList.add('animate');
        this.totalPriceEl.textContent = this.formatPrice(value);
        setTimeout(() => this.totalPriceEl.classList.remove('animate'), 500);
    }

    getCurrentData() {
        return {
            houseType: this.houseType.value,
            foundation: this.foundationType.value,
            options: Array.from(this.optionCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value),
            total: this.calculateTotal()
        };
    }
}

// Enhanced Modal Manager
class ModalManager {
    constructor() {
        this.projectsData = {
            'semeiny-40': {
                title: 'Семейный 40',
                gallery: [
                    'https://i.postimg.cc/Wz2s1pkQ/photo-5467925983140117215-y-1.jpg',
                    'https://i.postimg.cc/NjVGkw3H/photo-5467372104157624624-y.jpg',
                    'https://i.postimg.cc/7hmwGv1b/photo-5467925983140117216-y.jpg',
                    'https://i.postimg.cc/02kN8nGb/photo-5467372104157624620-y.jpg'
                ]
            },
            'minidom-36': {
                title: 'МиниДом 36',
                gallery: [
                    'https://github.com/domdom610/Svoy-Dom/blob/main/images/photo_5443011784094118439_x.jpg?raw=true',
                    'https://github.com/domdom610/Svoy-Dom/blob/main/images/photo_5443140577278424523_y.jpg?raw=true',
                    'https://github.com/domdom610/Svoy-Dom/blob/main/images/photo_5443140577278424536_y.jpg?raw=true'
                ]
            },
            'dom-kub-30': {
                title: 'Дом Куб 30',
                gallery: [
                    'https://i.postimg.cc/htSQ5xtq/photo-5467925983140117240-y.jpg',
                    'https://i.postimg.cc/x8MNW3m9/photo-5467372104157624690-y.jpg',
                    'https://i.postimg.cc/66vZ2tmF/photo-5467372104157624691-y.jpg'
                ]
            }
        };

        this.init();
    }

    init() {
        // Close modals on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Close modals on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
    }

    openProjectModal(key) {
        const data = this.projectsData[key];
        if (!data) return;

        const modal = document.getElementById('projectModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalGallery = document.getElementById('modalGallery');

        modalTitle.textContent = data.title;
        modalGallery.innerHTML = data.gallery
            .map(src => `<img src="${src}" alt="${data.title}" loading="lazy">`)
            .join('');

        this.openModal(modal);
    }

    closeProjectModal() {
        const modal = document.getElementById('projectModal');
        this.closeModal(modal);
    }

    openContactModal() {
        const modal = document.getElementById('contactModal');
        const calculatorDataInput = document.getElementById('calculatorData');
        
        // Save current calculator data if calculator exists
        if (window.calculator) {
            const data = window.calculator.getCurrentData();
            calculatorDataInput.value = JSON.stringify(data);
        }

        this.openModal(modal);
    }

    closeContactModal() {
        const modal = document.getElementById('contactModal');
        this.closeModal(modal);
    }

    openModal(modal) {
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const firstFocusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    closeModal(modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    closeAllModals() {
        document.querySelectorAll('.modal.show').forEach(modal => {
            this.closeModal(modal);
        });
    }
}

// Enhanced Form Handler
class FormHandler {
    constructor() {
        this.init();
    }

    init() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const formStatus = document.getElementById('formStatus');

        // Basic validation
        if (!this.validateForm(form)) {
            this.showFormStatus('Пожалуйста, заполните все обязательные поля', 'error');
            return;
        }

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Simulate API call - replace with your actual endpoint
            const response = await this.submitForm(formData);
            
            if (response.ok) {
                this.showFormStatus('Спасибо! Мы скоро свяжемся с вами.', 'success');
                form.reset();
                setTimeout(() => window.modalManager.closeContactModal(), 2000);
            } else {
                throw new Error('Ошибка сервера');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormStatus('Не удалось отправить заявку. Попробуйте позже.', 'error');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    }

    async submitForm(formData) {
        // Replace with your actual form submission endpoint
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ ok: true });
            }, 1000);
        });
    }

    showFormStatus(message, type) {
        const formStatus = document.getElementById('formStatus');
        formStatus.textContent = message;
        formStatus.className = `status status--${type}`;
        formStatus.classList.remove('hidden');
        
        setTimeout(() => {
            formStatus.classList.add('hidden');
        }, 5000);
    }
}

// Video Background Handler
class VideoHandler {
    constructor() {
        this.init();
    }

    init() {
        const video = document.querySelector('.hero__video');
        if (video) {
            this.setupVideo(video);
        }
    }

    setupVideo(video) {
        // Ensure video plays on mobile devices
        video.muted = true;
        video.playsInline = true;
        
        // Handle video load errors
        video.addEventListener('error', () => {
            console.warn('Video failed to load, showing fallback image');
            video.style.display = 'none';
        });

        // Ensure video plays when ready
        video.addEventListener('canplaythrough', () => {
            video.play().catch(error => {
                console.warn('Video autoplay failed:', error);
            });
        });

        // Lazy load video on intersection
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.load();
                        observer.unobserve(video);
                    }
                });
            });
            observer.observe(video);
        } else {
            video.load();
        }
    }
}

// Text Animation Handler
class TextAnimationHandler {
    constructor() {
        this.init();
    }

    init() {
        this.animateWords();
        this.setupScrollAnimations();
    }

    animateWords() {
        const animatedText = document.querySelector('.animated-text');
        if (animatedText) {
            const words = animatedText.querySelectorAll('.word');
            words.forEach((word, index) => {
                word.style.animationDelay = `${index * 0.3}s`;
                word.classList.add('animate-word');
            });
        }
    }

    setupScrollAnimations() {
        // Counter animation for numbers
        const counters = document.querySelectorAll('[data-counter]');
        if (counters.length > 0) {
            this.setupCounterAnimations(counters);
        }
    }

    setupCounterAnimations(counters) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.counter);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }
}

// Preloader Handler
class PreloaderHandler {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }
        });
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Monitor Core Web Vitals
        this.monitorLCP();
        this.monitorFID();
        this.monitorCLS();
    }

    monitorLCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    monitorFID() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            });
            observer.observe({ entryTypes: ['first-input'] });
        }
    }

    monitorCLS() {
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                console.log('CLS:', clsValue);
            });
            observer.observe({ entryTypes: ['layout-shift'] });
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({ 
            once: true, 
            duration: 700, 
            offset: 80,
            easing: 'ease-out-cubic'
        });
    }

    // Initialize all components
    window.navigation = new Navigation();
    window.calculator = new Calculator();
    window.modalManager = new ModalManager();
    window.formHandler = new FormHandler();
    window.videoHandler = new VideoHandler();
    window.textAnimationHandler = new TextAnimationHandler();
    window.preloaderHandler = new PreloaderHandler();
    window.performanceMonitor = new PerformanceMonitor();
});

// Global functions for backwards compatibility
function openProjectModal(key) {
    window.modalManager.openProjectModal(key);
}

function closeProjectModal() {
    window.modalManager.closeProjectModal();
}

function openContactModal() {
    window.modalManager.openContactModal();
}

function closeContactModal() {
    window.modalManager.closeContactModal();
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
