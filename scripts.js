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

  console.log('Locomotive Scroll inicializado:', locoScroll);

  // ============ NAVBAR ESCONDER AO ROLAR ============
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      navbar.style.transform = 'translateY(0)';
      navbar.style.transition = 'transform 0.3s ease-in-out';
    } else if (currentScroll > lastScroll && currentScroll > navbar.offsetHeight) {
      navbar.style.transform = 'translateY(-100%)';
      navbar.style.transition = 'transform 0.3s ease-in-out';
    } else if (currentScroll < lastScroll) {
      navbar.style.transform = 'translateY(0)';
      navbar.style.transition = 'transform 0.3s ease-in-out';
    }

    lastScroll = currentScroll;
  });

  console.log('Altura da Navbar:', navbar.offsetHeight);

  // ============ MENU HAMBÚRGUER ============
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navRight = document.querySelector('.nav-right');
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  document.body.appendChild(overlay);

  // Abre/fecha o menu hambúrguer
  hamburgerMenu.addEventListener('click', () => {
    navRight.classList.toggle('active');
    overlay.classList.toggle('active');
    hamburgerMenu.setAttribute('aria-expanded', navRight.classList.contains('active'));
    console.log('Menu hambúrguer clicado:', navRight.classList.contains('active'));
  });

  // Fecha o menu ao clicar no overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      navRight.classList.remove('active');
      overlay.classList.remove('active');
      hamburgerMenu.setAttribute('aria-expanded', false);
      console.log('Overlay clicado:', e.target);
    }
  });

  // ============ SCROLL SUAVE PARA LINKS DO MENU ============
  document.querySelectorAll('.nav-links li a').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      console.log('Link clicado:', targetId, targetSection);

      // Fecha o menu hambúrguer e remove o overlay
      navRight.classList.remove('active');
      overlay.classList.remove('active');
      hamburgerMenu.setAttribute('aria-expanded', false);

      // Verifica se a seção alvo existe
      if (targetSection) {
        console.log('Rolando para:', targetId);
        locoScroll.scrollTo(targetSection, {
          offset: -navbar.offsetHeight,
          duration: 800,
          easing: [0.25, 0.0, 0.35, 1.0],
        });
      }
    });
  });

  // ============ ATUALIZAÇÃO DO LOCOMOTIVE SCROLL ============
  locoScroll.update();
});