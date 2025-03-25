import { initLocomotiveScroll, setupSectionAnimations, handleHashLinks } from './locomotive-scroll';
import { initCustomCursor } from './custom-cursor';
import { setupNavbarScrollBehavior, setupMobileMenu, setupSmoothLinks } from './navbar-menu';
import AOS from 'aos';
import 'aos/dist/aos.css';

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar AOS
  AOS.init({
    duration: 800,
    easing: 'ease-out-quart',
    once: true,
    disable: window.innerWidth < 768
  });

  // Inicializar componentes
  const scroll = initLocomotiveScroll();
  const navbar = document.getElementById('navbar');
  
  if (navbar) {
    const scrollBehaviorState = setupNavbarScrollBehavior(scroll, navbar);
    const menuState = setupMobileMenu();
    
    Object.assign(scrollBehaviorState, menuState);
    setupSmoothLinks(scroll, navbar, scrollBehaviorState);
  }

  initCustomCursor();
  setupSectionAnimations();

  window.addEventListener('load', () => {
    scroll.update();
    if (navbar) handleHashLinks(scroll, navbar);
  });
});