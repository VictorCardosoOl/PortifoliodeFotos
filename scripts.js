document.addEventListener('DOMContentLoaded', function () {
  // ============ CONFIGURAÇÃO DO LOCOMOTIVE SCROLL ============
  // Inicializa o Locomotive Scroll para criar um scroll suave e personalizado
  const scrollEl = document.querySelector('[data-scroll-container]');
  const locoScroll = new LocomotiveScroll({
    el: scrollEl,
    smooth: true, // Ativa o scroll suave
    inertia: 0.5, // Controla a suavidade do scroll
    smartphone: { smooth: true }, // Ativa o scroll suave em dispositivos móveis
    tablet: { smooth: true }, // Ativa o scroll suave em tablets
    scrollbar: {
      el: document.querySelector('.c-scrollbar'), // Seleciona a barra de scroll personalizada
      draggable: true, // Permite arrastar a barra de scroll
    },
  });

  // ============ INTEGRAÇÃO DO LOCOMOTIVE SCROLL COM GSAP SCROLLTRIGGER ============
  // Registra o plugin ScrollTrigger do GSAP
  gsap.registerPlugin(ScrollTrigger);

  // Conecta o Locomotive Scroll ao ScrollTrigger
  locoScroll.on('scroll', ScrollTrigger.update);

  // Configura o ScrollTrigger para trabalhar com o Locomotive Scroll
  ScrollTrigger.scrollerProxy(scrollEl, {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0) // Rola para a posição especificada
        : locoScroll.scroll.instance.scroll.y; // Retorna a posição atual do scroll
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: scrollEl.style.transform ? 'transform' : 'fixed', // Define o tipo de pinagem
  });

  // Atualiza o ScrollTrigger quando o Locomotive Scroll é atualizado
  ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
  ScrollTrigger.refresh();

  // ============ MENU HAMBÚRGUER ============
  // Seleciona os elementos do menu hambúrguer
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navRight = document.querySelector('.nav-right');
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  document.body.appendChild(overlay);

  // Adiciona um evento de clique para abrir/fechar o menu hambúrguer
  hamburgerMenu.addEventListener('click', () => {
    navRight.classList.toggle('active');
    overlay.classList.toggle('active');
    hamburgerMenu.setAttribute('aria-expanded', navRight.classList.contains('active'));
  });

  // Fecha o menu hambúrguer ao clicar no overlay
  overlay.addEventListener('click', () => {
    navRight.classList.remove('active');
    overlay.classList.remove('active');
    hamburgerMenu.setAttribute('aria-expanded', false);
  });

  // ============ NAVBAR ESCONDER AO ROLAR ============
  // Seleciona a navbar
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  // Adiciona um evento de scroll para esconder/mostrar a navbar
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      // Se estiver no topo da página, mostra a navbar
      navbar.style.transform = 'translateY(0)';
    } else if (currentScroll > lastScroll) {
      // Se estiver rolando para baixo, esconde a navbar
      navbar.style.transform = 'translateY(-100%)';
    } else {
      // Se estiver rolando para cima, mostra a navbar
      navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  });

  // ============ SCROLL SUAVE PARA LINKS DO MENU ============
  // Seleciona todos os links do menu
  document.querySelectorAll('.nav-links li a').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Evita o comportamento padrão do link
      const targetId = link.getAttribute('href'); // Obtém o ID da seção alvo
      const targetSection = document.querySelector(targetId); // Seleciona a seção alvo

      // Fecha o menu hambúrguer ao clicar em um link
      navRight.classList.remove('active');
      overlay.classList.remove('active');
      hamburgerMenu.setAttribute('aria-expanded', false);

      // Rola suavemente até a seção alvo usando o Locomotive Scroll
      locoScroll.scrollTo(targetSection, {
        offset: -navbar.offsetHeight, // Ajusta o offset para compensar a altura da navbar
        duration: 800, // Duração da animação de scroll
        easing: [0.25, 0.0, 0.35, 1.0], // Curva de easing para a animação
      });
    });
  });
});