document.addEventListener('DOMContentLoaded', function () {
  // ============ CONFIGURAÇÃO DO LOCOMOTIVE SCROLL ============
  let locoScroll;

  const initLocomotiveScroll = () => {
    const scrollEl = document.querySelector('[data-scroll-container]');
    if (scrollEl) {
      locoScroll = new LocomotiveScroll({
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

      // Atualiza o LocomotiveScroll após carregar a página
      window.addEventListener('load', () => {
        locoScroll.update();
      });
    }
  };

  // Inicializa o Locomotive Scroll
  initLocomotiveScroll();

  // ============ NAVBAR ESCONDER AO ROLAR ============
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  if (locoScroll) {
    locoScroll.on('scroll', (instance) => {
      const currentScroll = instance.scroll.y;

      if (currentScroll <= 0) {
        navbar.style.transform = 'translateY(0)';
      } else if (currentScroll > lastScroll && currentScroll > navbar.offsetHeight) {
        navbar.style.transform = 'translateY(-100%)';
      } else if (currentScroll < lastScroll) {
        navbar.style.transform = 'translateY(0)';
      }

      lastScroll = currentScroll;
    });
  }

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

  // Fecha o menu ao clicar no overlay ou em um link do menu
  const closeMenu = () => {
    navRight.classList.remove('active');
    overlay.classList.remove('active');
    hamburgerMenu.setAttribute('aria-expanded', false);
  };

  overlay.addEventListener('click', closeMenu);

  // Fecha o menu ao clicar em um link do menu
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ============ CURSOR PERSONALIZADO ============
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });

  document.querySelectorAll('a, button').forEach((element) => {
    element.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });
    element.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
  });

  // ============ ATUALIZAÇÃO DO LOCOMOTIVE SCROLL ============
  if (locoScroll) {
    locoScroll.update();
  }
});