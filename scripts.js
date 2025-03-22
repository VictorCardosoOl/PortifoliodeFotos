document.addEventListener('DOMContentLoaded', function() {
    // ============ Locomotive Scroll ============
    const scrollEl = document.querySelector('[data-scroll-container]');
    
    const locoScroll = new LocomotiveScroll({
      el: scrollEl,
      smooth: true,
      inertia: 0.5,
      smartphone: { smooth: true },
      tablet: { smooth: true },
      scrollbar: {
        el: document.querySelector('.c-scrollbar'),
        draggable: true
      }
    });
  
    // ============ Integração com GSAP ScrollTrigger ============
    gsap.registerPlugin(ScrollTrigger);
  
    // Conectar Locomotive Scroll ao ScrollTrigger
    locoScroll.on("scroll", ScrollTrigger.update);
  
    ScrollTrigger.scrollerProxy(scrollEl, {
      scrollTop(value) {
        return arguments.length ? 
          locoScroll.scrollTo(value, 0, 0) : 
          locoScroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },
      pinType: scrollEl.style.transform ? "transform" : "fixed"
    });
  
    // Atualizações recíprocas
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();
  

    
    // ============ Seu código existente ============
    // Menu hambúrguer
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
  
    // Ocultar navbar ao rolar
    let lastScroll = 0;
    const navbar = document.getElementById('navbar');
  
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
  });