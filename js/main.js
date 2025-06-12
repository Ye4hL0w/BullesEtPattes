// Animation et interactivité du site Bulles & Pattes

document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navigation mobile
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
    
    // Fermer le menu mobile quand on clique sur un lien
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Event listeners pour le menu mobile
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Navigation active selon la section visible
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Navbar background au scroll
    function updateNavbarBackground() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    }
    
    // Smooth scroll pour les liens de navigation
    function setupSmoothScroll() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Intersection Observer pour les animations au scroll
    function setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Animation spéciale pour les cartes
                    if (entry.target.classList.contains('card-reveal')) {
                        const cards = entry.target.parentElement.querySelectorAll('.card-reveal');
                        cards.forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add('revealed');
                            }, index * 100);
                        });
                    }
                }
            });
        }, observerOptions);
        
        // Observer les éléments à animer
        const animatedElements = document.querySelectorAll('.service-card, .pricing-card, .product-card, .contact-item, .about-content, .feature');
        animatedElements.forEach(el => {
            el.classList.add('card-reveal');
            observer.observe(el);
        });
    }
    
    // Effet parallaxe léger (désactivé pour éviter le décentrage)
    function setupParallax() {
        // Parallaxe désactivé pour éviter que les images bougent trop
        // const parallaxElements = document.querySelectorAll('.hero-image, .about-image');
        
        // window.addEventListener('scroll', () => {
        //     const scrolled = window.pageYOffset;
        //     const rate = scrolled * -0.1; // Réduction de l'effet
            
        //     parallaxElements.forEach(element => {
        //         element.style.transform = `translateY(${rate}px)`;
        //     });
        // });
    }
    
    // Compteur animé pour les tarifs
    function animateCounters() {
        const counters = document.querySelectorAll('.price');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const originalText = counter.textContent;
                    const realTarget = parseInt(originalText.replace(/[^\d]/g, ''));
                    
                    // Limiter l'animation à 99 max, mais garder le vrai prix pour la fin
                    const animationTarget = realTarget > 99 ? 99 : realTarget;
                    let count = 0;
                    const increment = animationTarget / 60;
                    
                    const updateCounter = () => {
                        if (count < animationTarget) {
                            count += increment;
                            counter.textContent = Math.ceil(count) + ',00€';
                            requestAnimationFrame(updateCounter);
                        } else {
                            // Remettre le prix original (le vrai prix) à la fin
                            counter.textContent = originalText;
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    }
    
    // Particules flottantes d'arrière-plan
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.classList.add('particles');
        document.body.appendChild(particlesContainer);
        
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particlesContainer.appendChild(particle);
        }
    }
    
    // Gestion des formulaires (si ajoutés plus tard)
    function setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                // Logique de validation et envoi
                showNotification('Message envoyé avec succès !', 'success');
            });
        });
    }
    
    // Système de notifications
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 10px;
            background: var(--primary-color);
            color: white;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Lazy loading pour les images
    function setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Gestion du thème (clair/sombre) - optionnel
    function setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                localStorage.setItem('theme', 
                    document.body.classList.contains('dark-theme') ? 'dark' : 'light'
                );
            });
            
            // Charger le thème sauvegardé
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-theme');
            }
        }
    }
    
    // Gestion de la performance et optimisations
    function optimizePerformance() {
        // Debounce pour les événements de scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                updateActiveNavLink();
                updateNavbarBackground();
            }, 10);
        });
        
        // Précharger les images critiques
        const criticalImages = document.querySelectorAll('.hero-image img, .logo');
        criticalImages.forEach(img => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.src;
            document.head.appendChild(link);
        });
    }
    
    // Easter egg - animation spéciale sur le logo
    function setupEasterEgg() {
        const logo = document.querySelector('.logo');
        let clickCount = 0;
        
        if (logo) {
            logo.addEventListener('click', () => {
                clickCount++;
                if (clickCount === 5) {
                    logo.style.animation = 'rotate 1s ease-in-out';
                    showNotification('🐾 Woof! Vous avez trouvé l\'easter egg! 🐾', 'success');
                    clickCount = 0;
                    
                    setTimeout(() => {
                        logo.style.animation = '';
                    }, 1000);
                }
            });
        }
    }
    
    // Gestion des erreurs globales
    function setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Erreur JavaScript:', e.error);
            // En production, vous pourriez envoyer ces erreurs à un service de monitoring
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promise rejetée:', e.reason);
        });
    }
    
    // Analytics et tracking (simulé)
    function setupAnalytics() {
        // Simuler le tracking des événements importants
        const trackEvent = (eventName, properties = {}) => {
            console.log(`Analytics Event: ${eventName}`, properties);
            // Ici, vous intégreriez Google Analytics, Matomo, etc.
        };
        
        // Tracker les clics sur les boutons CTA
        const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
        ctaButtons.forEach(button => {
            button.addEventListener('click', () => {
                trackEvent('CTA_Click', {
                    button_text: button.textContent.trim(),
                    section: button.closest('section')?.id || 'unknown'
                });
            });
        });
        
        // Tracker le temps passé sur la page
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            trackEvent('Time_On_Page', { seconds: timeSpent });
        });
    }
    
    // Initialisation de toutes les fonctionnalités
    function initializeWebsite() {
        setupSmoothScroll();
        setupScrollAnimations();
        setupParallax();
        animateCounters();
        createParticles();
        setupFormValidation();
        setupLazyLoading();
        setupThemeToggle();
        optimizePerformance();
        setupEasterEgg();
        setupErrorHandling();
        setupAnalytics();
        
        // Message de bienvenue dans la console
        console.log(`
            🐾 Bienvenue sur le site de Bulles & Pattes! 🐾
            Site développé avec amour pour nos amis à quatre pattes.
            Pour toute question technique, contactez l'équipe de développement.
        `);
    }
    
    // Lancer l'initialisation
    initializeWebsite();
    
    // Gestion du redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
        // Fermer le menu mobile si la fenêtre devient large
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
    
    // Préloader pour une expérience fluide
    window.addEventListener('load', () => {
        const loader = document.querySelector('.loader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 1000);
        }
        
        // Animer l'apparition du contenu principal
        document.body.classList.add('loaded');
    });
});

// Fonctions utilitaires globales
window.BullesEtPattes = {
    // Fonction pour scroller vers une section
    scrollToSection: function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    },
    
    // Fonction pour afficher une notification
    showNotification: function(message, type = 'info') {
        // Utilise la fonction définie plus haut
        showNotification(message, type);
    },
    
    // Fonction pour réinitialiser les animations
    resetAnimations: function() {
        const animatedElements = document.querySelectorAll('.card-reveal');
        animatedElements.forEach(el => {
            el.classList.remove('revealed');
        });
    }
}; 