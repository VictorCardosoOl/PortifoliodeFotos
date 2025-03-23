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

  // Depuração: Verifica a posição do scroll
  locoScroll.on('scroll', (instance) => {
    console.log('Scroll position:', instance.scroll.y);
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

      console.log('Link clicado:', targetId);
      console.log('Seção alvo:', targetSection);

      // Fecha o menu hambúrguer e remove o overlay
      navRight.classList.remove('active');
      overlay.classList.remove('active');
      hamburgerMenu.setAttribute('aria-expanded', false);

      // Verifica se a seção alvo existe e se o Locomotive Scroll está inicializado
      if (targetSection && locoScroll) {
        console.log('Rolando para:', targetId);
        locoScroll.scrollTo(targetSection, {
          offset: -navbar.offsetHeight,
          duration: 800,
          easing: [0.25, 0.0, 0.35, 1.0],
        });
      } else {
        console.error('Seção não encontrada ou Locomotive Scroll não inicializado:', targetId);
      }
    });
  });

  // ============ SCROLL ACELERADO COM BOLINHA DO MOUSE ============
  let isAutoScrolling = false;
  let scrollDirection = 1; // 1 para baixo, -1 para cima
  let scrollSpeed = 20; // Velocidade do scroll (ajuste conforme necessário)

  // Detecta o clique na bolinha do mouse (scroll do meio)
  document.addEventListener('mousedown', (e) => {
    if (e.button === 1) { // Botão do meio do mouse (scroll)
      isAutoScrolling = true;
      console.log('Scroll acelerado ativado');
      requestAnimationFrame(autoScroll); // Inicia o scroll acelerado
    }
  });

  // Para o scroll acelerado ao soltar o botão do mouse
  document.addEventListener('mouseup', (e) => {
    if (e.button === 1) {
      isAutoScrolling = false;
      console.log('Scroll acelerado desativado');
    }
  });

  // Rola a página enquanto o scroll acelerado estiver ativo
  function autoScroll() {
    if (isAutoScrolling && locoScroll) {
      const currentScroll = locoScroll.scroll.instance.scroll.y;
      const newScroll = currentScroll + scrollSpeed * scrollDirection;

      // Limita o scroll para não ultrapassar o topo ou o final da página
      if (newScroll < 0) {
        scrollDirection = 1; // Inverte a direção para baixo
      } else if (newScroll > document.body.scrollHeight - window.innerHeight) {
        scrollDirection = -1; // Inverte a direção para cima
      }

      // Aplica o scroll usando Locomotive Scroll
      locoScroll.scrollTo(newScroll, {
        duration: 50, // Duração curta para um scroll suave
        easing: [0.25, 0.0, 0.35, 1.0],
      });

      // Continua o scroll acelerado
      requestAnimationFrame(autoScroll);
    }
  }

  // ============ ATUALIZAÇÃO DO LOCOMOTIVE SCROLL ============
  locoScroll.update();
});