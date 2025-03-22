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
  });

  // Fecha o menu ao clicar no overlay
  overlay.addEventListener('click', () => {
    navRight.classList.remove('active');
    overlay.classList.remove('active');
    hamburgerMenu.setAttribute('aria-expanded', false);
  });

  // ============ SCROLL SUAVE PARA LINKS DO MENU ============
  document.querySelectorAll('.nav-links li a').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Evita o comportamento padrão do link
      const targetId = link.getAttribute('href'); // Obtém o ID da seção alvo
      const targetSection = document.querySelector(targetId); // Seleciona a seção alvo

      // Fecha o menu hambúrguer e remove o overlay
      navRight.classList.remove('active');
      overlay.classList.remove('active');
      hamburgerMenu.setAttribute('aria-expanded', false);

      // Rola suavemente até a seção alvo
      if (targetSection) {
        locoScroll.scrollTo(targetSection, {
          offset: -navbar.offsetHeight, // Ajusta o offset para compensar a altura da navbar
          duration: 800, // Duração da animação de scroll
          easing: [0.25, 0.0, 0.35, 1.0], // Curva de easing para a animação
        });
      }
    });
  });
});