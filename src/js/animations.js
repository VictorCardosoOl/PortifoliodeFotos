import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registra o plugin ScrollTrigger com o GSAP
gsap.registerPlugin(ScrollTrigger);

/**
 * Animação de Parallax para imagens.
 * A imagem dentro de um contêiner se move a uma velocidade diferente do scroll.
 * @param {object} scroller - A instância do Locomotive Scroll.
 */
function setupImageParallax(scroller) {
  gsap.utils.toArray('.parallax-image').forEach(container => {
    const image = container.querySelector('img');

    gsap.to(image, {
      yPercent: 20, // Move a imagem 20% para baixo
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        scroller: scroller, // Essencial para funcionar com Locomotive Scroll
        scrub: true, // A animação acompanha o scroll
        start: 'top bottom', // Inicia quando o topo do contêiner atinge a base da tela
        end: 'bottom top',   // Termina quando a base do contêiner atinge o topo da tela
      }
    });
  });
}

/**
 * Animação de texto "Stagger" (letra por letra ou palavra por palavra).
 * @param {object} scroller - A instância do Locomotive Scroll.
 */
function setupTextStagger(scroller) {
  gsap.utils.toArray('[data-anim="text-reveal"]').forEach(textElement => {
    // Divide o texto em letras, envolvendo cada uma em um <span>
    const letters = textElement.innerText.split('').map(letter => 
      letter === ' ' ? '&nbsp;' : `<span class="letter">${letter}</span>`
    ).join('');
    textElement.innerHTML = letters;

    gsap.from(textElement.querySelectorAll('.letter'), {
      yPercent: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.04, // Atraso entre a animação de cada letra
      scrollTrigger: {
        trigger: textElement,
        scroller: scroller,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    });
  });
}


/**
 * Função principal que inicializa todas as animações do site.
 * @param {object} scroll - A instância principal do Locomotive Scroll.
 */
export function initAnimations(scroll) {
  const scroller = '[data-scroll-container]'; // Seletor do contêiner de scroll

  console.log('Inicializando animações...'); // Para ter certeza de que o arquivo está a ser chamado

  // Chame aqui todas as funções de animação que criar
  setupImageParallax(scroller);
  setupTextStagger(scroller);
  // Adicione outras animações aqui...
}