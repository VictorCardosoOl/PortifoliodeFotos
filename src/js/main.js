import LocomotiveScroll from 'locomotive-scroll';
import gsap from 'gsap';
import AOS from 'aos';
import 'aos/dist/aos.css';

document.addEventListener('DOMContentLoaded', function () {
  // ============ CONFIGURAÇÃO DO LOCOMOTIVE SCROLL ============
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

  // Atualiza o scroll quando o conteúdo mudar
  window.addEventListener('load', () => {
    scroll.update();
  });

  // ============ NAVBAR ESCONDER AO ROLAR ============
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  let isMenuOpen = false;

  scroll.on('scroll', (instance) => {
    const currentScroll = instance.scroll.y;
    const scrollDirection = instance.direction;

    // Não esconde a navbar se o menu estiver aberto
    if (isMenuOpen) return;

    if (currentScroll <= 0) {
      navbar.style.transform = 'translateY(0)';
    } else if (scrollDirection === 'down' && currentScroll > navbar.offsetHeight) {
      navbar.style.transform = 'translateY(-100%)';
    } else if (scrollDirection === 'up') {
      navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  });

  // ============ MENU HAMBÚRGUER ============
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navRight = document.querySelector('.nav-right');
  const navLinks = document.querySelectorAll('.nav-links a');
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  document.body.appendChild(overlay);

  // Animação do menu hambúrguer
  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
      // Abre o menu com animação
      gsap.to(navRight, {
        right: 0,
        duration: 0.5,
        ease: 'power3.out'
      });
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.3,
        display: 'block'
      });
      document.body.style.overflow = 'hidden';
    } else {
      // Fecha o menu com animação
      gsap.to(navRight, {
        right: '-300px',
        duration: 0.4,
        ease: 'power2.in'
      });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.2,
        display: 'none'
      });
      document.body.style.overflow = '';
    }
    
    hamburgerMenu.setAttribute('aria-expanded', isMenuOpen);
  };

  // Fecha o menu ao clicar fora (no overlay)
  overlay.addEventListener('click', () => {
    if (isMenuOpen) toggleMenu();
  });

  // Fecha o menu ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) toggleMenu();
  });

  // Abre/fecha o menu hambúrguer
  hamburgerMenu.addEventListener('click', toggleMenu);

  // Navegação suave para seções
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Fecha o menu
      if (isMenuOpen) toggleMenu();
      
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Scroll suave para a seção com Locomotive
        scroll.scrollTo(targetElement, {
          offset: -navbar.offsetHeight,
          duration: 1.2,
          easing: [0.25, 0.0, 0.35, 1.0],
          callback: () => {
            // Atualiza a URL sem recarregar a página
            history.pushState(null, null, targetId);
          }
        });
      }
    });
  });

  // ============ CURSOR PERSONALIZADO ============
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  // Cursor com física suavizada
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  const speed = 0.1;

  const animateCursor = () => {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * speed;
    cursorY += dy * speed;
    
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(animateCursor);
  };

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  animateCursor();

  // Efeitos de hover
  document.querySelectorAll('a, button, [data-hover]').forEach((element) => {
    element.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      if (element.dataset.cursorSize) {
        cursor.style.width = element.dataset.cursorSize;
        cursor.style.height = element.dataset.cursorSize;
      }
    });
    
    element.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursor.style.width = '';
      cursor.style.height = '';
    });
  });

  // ============ GSAP PARA TRANSIÇÕES SUAVES ============
  gsap.registerPlugin(ScrollTrigger);
  
  // Configura o ScrollTrigger para trabalhar com Locomotive
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

  // Animações de seção
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
        toggleActions: 'play none none none',
      }
    });
  });

  // Reconecta ScrollTrigger após cada atualização do Locomotive
  scroll.on('scroll', ScrollTrigger.update);

  // ============ AOS INICIALIZAÇÃO ============
  AOS.init({
    duration: 800,
    easing: 'ease-out-quart',
    once: true,
    disable: window.innerWidth < 768
  });

  // ============ CORREÇÃO PARA LINKS INTERNOS ============
  // Garante que o scroll funcione corretamente ao carregar uma página com hash
  window.addEventListener('load', () => {
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