import gsap from 'gsap';

/**
 * Sets up navbar show/hide behavior based on scroll direction.
 * @param {Lenis} scroll
 * @param {HTMLElement} navbar
 * @param {object} state - Shared mutable state object.
 */
export const setupNavbarScrollBehavior = (scroll, navbar, state) => {
  if (!scroll || !navbar || !state) return;

  let lastScroll = 0;
  const SCROLL_THRESHOLD = 80;

  scroll.on('scroll', (e) => {
    if (state.isMenuOpen || state.isScrollingToSection) return;

    const currentScroll = e.scroll;
    const direction     = e.direction;
    const navbarHeight  = navbar.offsetHeight;

    if (direction === 1 && currentScroll > lastScroll && currentScroll > SCROLL_THRESHOLD) {
      gsap.to(navbar, { y: -navbarHeight, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
    } else if (direction === -1 || currentScroll <= SCROLL_THRESHOLD) {
      gsap.to(navbar, { y: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
    }

    lastScroll = currentScroll;
  });
};

/**
 * Sets up mobile menu hamburger interactions.
 * Uses visibility/opacity for the overlay so GSAP can animate smoothly
 * (previously used display:none/block which broke animation interpolation).
 *
 * @param {object} state - Shared mutable state object.
 * @returns {{ toggleMenu: Function }}
 */
export const setupMobileMenu = (state) => {
  if (!state) return { toggleMenu: () => {} };

  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navRight      = document.querySelector('.nav-right');

  // Reuse existing overlay if it exists in the DOM, create one only if not
  let overlay = document.querySelector('.overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
  }

  // Ensure overlay starts hidden via GSAP (not CSS display:none)
  gsap.set(overlay, { opacity: 0, visibility: 'hidden', pointerEvents: 'none' });

  const toggleMenu = (forcedState) => {
    state.isMenuOpen = forcedState !== undefined ? forcedState : !state.isMenuOpen;

    // Nav drawer
    gsap.to(navRight, {
      x: state.isMenuOpen ? 0 : '100%',
      duration: state.isMenuOpen ? 0.55 : 0.45,
      ease: state.isMenuOpen ? 'power3.out' : 'power2.in',
      overwrite: 'auto',
    });

    // Overlay — use visibility + opacity, NOT display (display breaks GSAP animation)
    gsap.to(overlay, {
      opacity:    state.isMenuOpen ? 1 : 0,
      visibility: state.isMenuOpen ? 'visible' : 'hidden',
      duration:   state.isMenuOpen ? 0.4 : 0.3,
      ease:       'power2.out',
      pointerEvents: state.isMenuOpen ? 'auto' : 'none',
      overwrite:  'auto',
    });

    document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
    if (hamburgerMenu) {
      hamburgerMenu.setAttribute('aria-expanded', String(state.isMenuOpen));
    }
  };

  // Ensure nav-right starts off-screen (set via GSAP so it respects the animation state)
  gsap.set(navRight, { x: '100%' });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!state.isMenuOpen) return;
    if (navRight && navRight.contains(e.target)) return;
    if (hamburgerMenu && (e.target === hamburgerMenu || hamburgerMenu.contains(e.target))) return;
    toggleMenu(false);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.isMenuOpen) toggleMenu(false);
  });

  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  return { toggleMenu };
};

/**
 * Applies smooth scroll navigation to nav links using Lenis.
 * @param {Lenis} scroll
 * @param {HTMLElement} navbar
 * @param {object} state
 * @param {Function} toggleMenu
 */
export const setupSmoothLinks = (scroll, navbar, state, toggleMenu) => {
  if (!scroll || !navbar || !state) return;

  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      if (!href || !href.includes('#')) return;
      
      const targetId = href.substring(href.indexOf('#'));
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      if (state.isMenuOpen && typeof toggleMenu === 'function') {
        toggleMenu(false);
      }

      state.isScrollingToSection = true;
      gsap.to(navbar, { y: 0, duration: 0.2, overwrite: 'auto' });

      scroll.scrollTo(target, {
        offset: -navbar.offsetHeight,
        duration: 1.2,
        onComplete: () => {
          state.isScrollingToSection = false;
          history.pushState(null, null, href);
        }
      });
    });
  });
};