document.addEventListener('DOMContentLoaded', function () {
  // ============ CONFIGURAÇÃO DO LOCOMOTIVE SCROLL ============
  const scrollEl = document.querySelector('[data-scroll-container]');
  const locoScroll = new LocomotiveScroll({
    el: scrollEl,
    smooth: true,
    inertia: 0.5,
    smartphone: { smooth: true },
    tablet: { smooth: true },
    scrollbar: {
      el: document.querySelector('.c-scrollbar'),
      draggable: true,
    },
  });

  // ============ INTEGRAÇÃO DO LOCOMOTIVE SCROLL COM GSAP SCROLLTRIGGER ============
  gsap.registerPlugin(ScrollTrigger);
  locoScroll.on('scroll', ScrollTrigger.update);
  ScrollTrigger.scrollerProxy(scrollEl, {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: scrollEl.style.transform ? 'transform' : 'fixed',
  });
  ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
  ScrollTrigger.refresh();

  // ============ MENU HAMBÚRGUER ============
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navRight = document.querySelector('.nav-right');
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  document.body.appendChild(overlay);

  hamburgerMenu.addEventListener('click', () => {
    navRight.classList.toggle('active');
    overlay.classList.toggle('active');
    hamburgerMenu.setAttribute('aria-expanded', navRight.classList.contains('active'));
  });

  overlay.addEventListener('click', () => {
    navRight.classList.remove('active');
    overlay.classList.remove('active');
    hamburgerMenu.setAttribute('aria-expanded', false);
  });

  // ============ NAVBAR ESCONDER AO ROLAR ============
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      navbar.style.transform = 'translateY(0)';
    } else if (currentScroll > lastScroll && currentScroll > navbar.offsetHeight) {
      navbar.style.transform = 'translateY(-100%)';
    } else if (currentScroll < lastScroll) {
      navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  });

  // ============ SCROLL SUAVE PARA LINKS DO MENU ============
  document.querySelectorAll('.nav-links li a').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      setTimeout(() => {
        navRight.classList.remove('active');
        overlay.classList.remove('active');
        hamburgerMenu.setAttribute('aria-expanded', false);
      }, 500);

      locoScroll.scrollTo(targetSection, {
        offset: -navbar.offsetHeight,
        duration: 800,
        easing: [0.25, 0.0, 0.35, 1.0],
      });
    });
  });

  // ============ ATIVAR LINK DO MENU CONFORME A SEÇÃO VISÍVEL ============
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links li a');

  const checkVisibleSection = () => {
    let currentSection = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navbar.offsetHeight;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionBottom) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
    });

    const activeLink = document.querySelector(`.nav-links li a[href="#${currentSection}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  };

  window.addEventListener('scroll', checkVisibleSection);
  checkVisibleSection();
});