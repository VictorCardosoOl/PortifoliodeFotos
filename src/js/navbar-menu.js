import gsap from 'gsap';

export const setupNavbarScrollBehavior = (scroll, navbar) => {
  let lastScroll = 0;
  let isMenuOpen = false;
  let isScrollingToSection = false;

  const handleNavbarScroll = (instance) => {
    if (isMenuOpen || isScrollingToSection) return;

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

  return { isMenuOpen, isScrollingToSection };
};

export const setupMobileMenu = () => {
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navRight = document.querySelector('.nav-right');
  const navLinks = document.querySelectorAll('.nav-links a');
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);

  let isMenuOpen = false;

  const toggleMenu = (state) => {
    isMenuOpen = state !== undefined ? state : !isMenuOpen;
    
    gsap.to(navRight, {
      right: isMenuOpen ? 0 : '-300px',
      duration: isMenuOpen ? 0.5 : 0.4,
      ease: isMenuOpen ? 'power3.out' : 'power2.in'
    });

    gsap.to(overlay, {
      opacity: isMenuOpen ? 1 : 0,
      display: isMenuOpen ? 'block' : 'none',
      duration: isMenuOpen ? 0.3 : 0.2,
      onComplete: () => {
        overlay.style.pointerEvents = isMenuOpen ? 'auto' : 'none';
      }
    });

    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    if (hamburgerMenu) hamburgerMenu.setAttribute('aria-expanded', isMenuOpen);
  };

  document.addEventListener('click', (e) => {
    if (isMenuOpen && navRight && !navRight.contains(e.target) && 
        hamburgerMenu && e.target !== hamburgerMenu && !hamburgerMenu.contains(e.target)) {
      toggleMenu(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) toggleMenu(false);
  });

  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  return { toggleMenu, isMenuOpen };
};

export const setupSmoothLinks = (scroll, navbar, menuState) => {
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      
      if (target) {
        if (menuState.isMenuOpen) menuState.toggleMenu(false);
        
        menuState.isScrollingToSection = true;
        gsap.to(navbar, { y: 0, duration: 0.2 });
        
        scroll.scrollTo(target, {
          offset: -navbar.offsetHeight,
          duration: 1.2,
          easing: [0.25, 0.0, 0.35, 1.0],
          callback: () => {
            menuState.isScrollingToSection = false;
            history.pushState(null, null, link.href);
          }
        });
      }
    });
  });
};