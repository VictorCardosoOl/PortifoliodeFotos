import { initLenisScroll } from './lenis-scroll.js';
import { setupNavbarScrollBehavior, setupMobileMenu, setupSmoothLinks } from './navbar-menu';
import { initGallery } from './gallery';
import { initAnimations } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. ── Lenis Scroll setup
  const lenis = initLenisScroll();

  // 2. ── Gallery — render cards before animations register ScrollTriggers
  initGallery();

  // 3. ── Navbar — shared state object prevents primitive copy-by-value bugs
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const navbarState = {
      isMenuOpen:         false,
      isScrollingToSection: false,
    };

    setupNavbarScrollBehavior(scroll, navbar, navbarState);
    const { toggleMenu } = setupMobileMenu(navbarState);
    setupSmoothLinks(scroll, navbar, navbarState, toggleMenu);
  }

  // 4. ── Animations — attach GSAP timelines (Lenis syncs automatically)
  initAnimations();

  // 6. ── Full page load (all images decoded) — final recalculation
  window.addEventListener('load', () => {
    scroll.update();
    if (navbar) handleHashLinks(scroll, navbar);
  }, { once: true, passive: true });
});