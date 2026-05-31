import gsap from 'gsap';

/**
 * Sets up navbar show/hide scroll behavior based on scroll direction.
 * @param {object} scroll - LocomotiveScroll instance.
 * @param {HTMLElement} navbar - Navbar element.
 * @param {object} state - Shared navbar state.
 */
export const setupNavbarScrollBehavior = (scroll, navbar, state) => {
  if (!scroll || !navbar || !state) return;
  let lastScroll = 0;

  const handleNavbarScroll = (instance) => {
    // If mobile menu is open or we are animating scroll to a section, do not toggle navbar visibility.
    if (state.isMenuOpen || state.isScrollingToSection) return;

    const currentScroll = instance.scroll.y;
    const direction = instance.direction;
    const navbarHeight = navbar.offsetHeight;
    const scrollThreshold = 100;

    if (direction === 'down' && currentScroll > lastScroll && currentScroll > scrollThreshold) {
      gsap.to(navbar, { 
        y: -navbarHeight, 
        duration: 0.4,
        ease: "power2.out"
      });
    } else if (direction === 'up' || currentScroll <= scrollThreshold) {
      gsap.to(navbar, { 
        y: 0, 
        duration: 0.4,
        ease: "power2.out"
      });
    }

    lastScroll = currentScroll;
  };

  scroll.on('scroll', handleNavbarScroll);
};

/**
 * Sets up mobile menu hamburger toggle behavior.
 * @param {object} state - Shared navbar state.
 * @returns {object} Object with toggle function.
 */
export const setupMobileMenu = (state) => {
  if (!state) return { toggleMenu: () => {} };

  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navRight = document.querySelector('.nav-right');
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);

  const toggleMenu = (forcedState) => {
    state.isMenuOpen = forcedState !== undefined ? forcedState : !state.isMenuOpen;
    
    gsap.to(navRight, {
      right: state.isMenuOpen ? 0 : '-300px',
      duration: state.isMenuOpen ? 0.5 : 0.4,
      ease: state.isMenuOpen ? 'power3.out' : 'power2.in'
    });

    gsap.to(overlay, {
      opacity: state.isMenuOpen ? 1 : 0,
      display: state.isMenuOpen ? 'block' : 'none',
      duration: state.isMenuOpen ? 0.3 : 0.2,
      onComplete: () => {
        overlay.style.pointerEvents = state.isMenuOpen ? 'auto' : 'none';
      }
    });

    document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
    if (hamburgerMenu) hamburgerMenu.setAttribute('aria-expanded', state.isMenuOpen);
  };

  // Close menu on overlay or external click
  document.addEventListener('click', (e) => {
    if (state.isMenuOpen && navRight && !navRight.contains(e.target) && 
        hamburgerMenu && e.target !== hamburgerMenu && !hamburgerMenu.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close menu on Escape key
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
 * Sets up smooth scrolling link transitions.
 * @param {object} scroll - LocomotiveScroll instance.
 * @param {HTMLElement} navbar - Navbar element.
 * @param {object} state - Shared navbar state.
 * @param {function} toggleMenu - Function to close mobile menu.
 */
export const setupSmoothLinks = (scroll, navbar, state, toggleMenu) => {
  if (!scroll || !navbar || !state) return;
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return; // Allow normal links to navigate

      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        if (state.isMenuOpen && typeof toggleMenu === 'function') {
          toggleMenu(false);
        }
        
        state.isScrollingToSection = true;
        gsap.to(navbar, { y: 0, duration: 0.2 });
        
        scroll.scrollTo(target, {
          offset: -navbar.offsetHeight,
          duration: 1.2,
          easing: [0.25, 0.0, 0.35, 1.0],
          callback: () => {
            state.isScrollingToSection = false;
            history.pushState(null, null, link.href);
          }
        });
      }
    });
  });
};