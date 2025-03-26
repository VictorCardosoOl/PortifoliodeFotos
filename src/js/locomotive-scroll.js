import LocomotiveScroll from 'locomotive-scroll';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar plugin
gsap.registerPlugin(ScrollTrigger);

export const initLocomotiveScroll = () => {
  const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    inertia: 0.8, // Reduzi de 1.1 para 0.8
    smartphone: { 
      smooth: false // Desativei para mobile
    },
    tablet: { 
      smooth: false // Desativei para tablet
    },
    getDirection: true,
    multiplier: 0.8, // Adicionei para reduzir velocidade
    scrollbar: {
      el: document.querySelector('.c-scrollbar'),
      draggable: false // Desativei arrastar para melhor performance
    }
  });

  // Otimizei o scrollerProxy
  ScrollTrigger.scrollerProxy('[data-scroll-container]', {
    scrollTop(value) {
      return arguments.length ? 
        scroll.scrollTo(value, { duration: 0, disableLerp: true }) : 
        scroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0, 
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      };
    },
    pinType: document.querySelector('[data-scroll-container]').style.transform ? "transform" : "fixed"
  });

  // Atualização mais eficiente
  let timeout;
  scroll.on('scroll', (args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => ScrollTrigger.update(), 100);
  });

  // Atualização após imagens carregarem
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('load', () => scroll.update(), { once: true });
  });

  return scroll;
};
export const setupSectionAnimations = () => {
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
};

export const handleHashLinks = (scroll, navbar) => {
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
};

