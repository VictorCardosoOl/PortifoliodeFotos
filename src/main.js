import { gsap } from 'gsap';
import LocomotiveScroll from 'locomotive-scroll';
import { useInView } from 'react-intersection-observer';

// Inicializa o Locomotive Scroll
const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
});

// Exemplo de uso do GSAP
gsap.to('.minha-classe', { x: 100, duration: 1 });

// Exemplo de uso do React Intersection Observer
const { ref, inView } = useInView({
    triggerOnce: true,
});

console.log('Elemento visível:', inView);