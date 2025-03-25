import LocomotiveScroll from 'locomotive-scroll';
import gsap from 'gsap';
import AOS from 'aos';
import 'aos/dist/aos.css';

document.addEventListener('DOMContentLoaded', function () {
  // ============ LOCOMOTIVE SCROLL INIT ============
  const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    inertia: 0.8,
    smartphone: { smooth: true },
    tablet: { smooth: true },
    getDirection: true,
    scrollbar: {
      el: document.querySelector('.c-scrollbar'),
      draggable: true,
    },
  });

  // ============ CUSTOM DUAL CURSOR (FIXED VERSION) ============
  const initCustomCursor = () => {
    // Create cursor elements if they don't exist
    const cursorHTML = `
      <div class="cursor">
        <div class="cursor__ball cursor__ball--big">
          <svg height="30" width="30">
            <circle cx="15" cy="15" r="12" stroke-width="0"></circle>
          </svg>
        </div>
        <div class="cursor__ball cursor__ball--small">
          <svg height="10" width="10">
            <circle cx="5" cy="5" r="4" stroke-width="0"></circle>
          </svg>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', cursorHTML);

    const $bigBall = document.querySelector('.cursor__ball--big');
    const $smallBall = document.querySelector('.cursor__ball--small');
    const $hoverables = document.querySelectorAll('a, button, [data-hover]');

    // Hide default cursor
    document.body.style.cursor = 'none';

    const moveCursor = (e) => {
      gsap.to($bigBall, {
        duration: 0.4,
        x: e.clientX - 15,
        y: e.clientY - 15
      });
      gsap.to($smallBall, {
        duration: 0.1,
        x: e.clientX - 5,
        y: e.clientY - 7
      });
    };

    const hoverEffect = () => {
      gsap.to($bigBall, {
        duration: 0.3,
        scale: 1.5
      });
    };

    const hoverEffectOut = () => {
      gsap.to($bigBall, {
        duration: 0.3,
        scale: 1
      });
    };

    document.addEventListener('mousemove', moveCursor);
    
    $hoverables.forEach(item => {
      item.addEventListener('mouseenter', hoverEffect);
      item.addEventListener('mouseleave', hoverEffectOut);
      item.style.cursor = 'none';
    });

    // Disable on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.body.style.cursor = '';
      document.querySelector('.cursor').style.display = 'none';
    }
  };

  // ============ NAVBAR BEHAVIOR (FIXED VERSION) ============
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  let isMenuOpen = false;
  let isScrollingToSection = false;

  const handleNavbarScroll = (instance) => {
    if (isMenuOpen || isScrollingToSection) return;

    const currentScroll = instance.scroll.y;
    const direction = instance.direction;
    const navbarHeight = navbar.offsetHeight;
    const scrollThreshold = 100; // Aumentei o threshold para melhor comportamento

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

  // ============ MOBILE MENU (FIXED CLICK OUTSIDE) ============
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navRight = document.querySelector('.nav-right');
  const navLinks = document.querySelectorAll('.nav-links a');
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);

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
        if (!isMenuOpen) {
          overlay.style.pointerEvents = 'none';
        } else {
          overlay.style.pointerEvents = 'auto';
        }
      }
    });

    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    hamburgerMenu.setAttribute('aria-expanded', isMenuOpen);
  };

  // FIX: Close menu when clicking outside (including hero section)
  document.addEventListener('click', (e) => {
    if (isMenuOpen && 
        !navRight.contains(e.target) && 
        e.target !== hamburgerMenu &&
        !hamburgerMenu.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close menu on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) toggleMenu(false);
  });

  hamburgerMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // ============ SMOOTH ANCHOR LINKS ============
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      
      if (target) {
        if (isMenuOpen) toggleMenu(false);
        
        isScrollingToSection = true;
        gsap.to(navbar, { y: 0, duration: 0.2 });
        
        scroll.scrollTo(target, {
          offset: -navbar.offsetHeight,
          duration: 1.2,
          easing: [0.25, 0.0, 0.35, 1.0],
          callback: () => {
            isScrollingToSection = false;
            history.pushState(null, null, link.href);
          }
        });
      }
    });
  });

  // ============ GSAP ANIMATIONS ============
  gsap.registerPlugin(ScrollTrigger);
  
  ScrollTrigger.scrollerProxy('[data-scroll-container]', {
    scrollTop(value) {
      return arguments.length ? 
        scroll.scrollTo(value, 0, 0) : 
        scroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0, 
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      };
    }
  });

  // Section animations
  gsap.utils.toArray('section').forEach(section => {
    gsap.from(section, {
      opacity: 0,
      y: 80,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        scroller: '[data-scroll-container]',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  scroll.on('scroll', ScrollTrigger.update);

  // ============ AOS INIT ============
  AOS.init({
    duration: 800,
    easing: 'ease-out-quart',
    once: true,
    disable: window.innerWidth < 768
  });

  // ============ INITIALIZE COMPONENTS ============
  initCustomCursor();
  
  window.addEventListener('load', () => {
    scroll.update();
    
    // Handle hash links on page load
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          scroll.scrollTo(target, {
            offset: -navbar.offsetHeight,
            duration: 0
          });
        }, 100);
      }
    }
  });
});