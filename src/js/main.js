import { initLocomotiveScroll, setupSectionAnimations, handleHashLinks } from './locomotive-scroll';
import { initCustomCursor } from './custom-cursor';
import { setupNavbarScrollBehavior, setupMobileMenu, setupSmoothLinks } from './navbar-menu';
import { initGallery } from './gallery';
import { initAnimations } from './animations.js';
import AOS from 'aos';
import 'aos/dist/aos.css';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-out-quart',
        once: true,
        disable: window.innerWidth < 768
    });

    // 1. Initialize Locomotive Scroll
    const scroll = initLocomotiveScroll();

    // 2. Initialize other modules
    initGallery(scroll);
    initCustomCursor();
    setupSectionAnimations();
    initAnimations(scroll); // Correctly invoke unused animation initializers (parallax/text reveal)

    const navbar = document.getElementById('navbar');
    if (navbar) {
        // Shared state object to prevent copying primitive values by value
        const navbarState = {
            isMenuOpen: false,
            isScrollingToSection: false
        };

        setupNavbarScrollBehavior(scroll, navbar, navbarState);
        const { toggleMenu } = setupMobileMenu(navbarState);
        setupSmoothLinks(scroll, navbar, navbarState, toggleMenu);
    }
    
    // 3. Global window load handlers
    window.addEventListener('load', () => {
        scroll.update(); 
        if (navbar) handleHashLinks(scroll, navbar);
    }, { passive: true });
});