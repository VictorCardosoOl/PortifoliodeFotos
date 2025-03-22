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

  // ============ NAVBAR ESCONDER AO ROLAR ============
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      navbar.style.transform = 'translateY(0)';
    } else if (currentScroll > lastScroll) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  });

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

  // ============ SCROLL SUAVE PARA LINKS DO MENU ============
  document.querySelectorAll('.nav-links li a').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      // Fecha o menu hambúrguer e remove o overlay
      navRight.classList.remove('active');
      overlay.classList.remove('active');
      hamburgerMenu.setAttribute('aria-expanded', false);

      // Rola suavemente até a seção alvo
      if (targetSection) {
        locoScroll.scrollTo(targetSection, {
          offset: -navbar.offsetHeight,
          duration: 800,
          easing: [0.25, 0.0, 0.35, 1.0],
        });
      }
    });
  });
});