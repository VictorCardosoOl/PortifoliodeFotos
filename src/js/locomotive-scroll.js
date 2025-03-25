import LocomotiveScroll from 'locomotive-scroll';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar plugin
gsap.registerPlugin(ScrollTrigger);

export const initLocomotiveScroll = () => {
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

  scroll.on('scroll', ScrollTrigger.update);

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