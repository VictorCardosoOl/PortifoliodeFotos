// ==================================================
// 1. CONFIGURAÇÕES GERAIS
// ==================================================

// Importações
import LocomotiveScroll from 'locomotive-scroll'; // Importa Locomotive Scroll
import { gsap } from 'gsap'; // Importa GSAP para animações

// Inicializa o Locomotive Scroll
const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'), // Container do scroll
    smooth: true, // Scroll suave
    lerp: 0.07, // Suavização (quanto menor, mais suave)
    multiplier: 1.2, // Velocidade do scroll
});

// Atualiza o scroll ao redimensionar a janela
window.addEventListener('resize', () => {
    scroll.update();
});

// Atualiza o scroll ao carregar imagens
window.addEventListener('load', () => {
    scroll.update();
});
// Inicializa AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800, // Duração das animações
        easing: 'ease-in-out', // Tipo de easing
        once: true, // Animações ocorrem apenas uma vez
    });
});

// ==================================================
// 2. ANIMAÇÕES DURANTE O SCROLL
// ==================================================

// Seleciona elementos que devem ser animados durante o scroll
const animatedElements = document.querySelectorAll('[data-scroll-animate]');

animatedElements.forEach(element => {
    scroll.on('scroll', (args) => {
        const elementTop = element.getBoundingClientRect().top; // Posição do elemento em relação à viewport
        const viewportHeight = window.innerHeight; // Altura da viewport

        // Verifica se o elemento está visível na tela
        if (elementTop < viewportHeight * 0.8) {
            gsap.to(element, {
                opacity: 1, // Torna o elemento visível
                y: 0, // Remove o deslocamento Y
                duration: 1, // Duração da animação
                ease: 'power2.out', // Easing da animação
            });
        }
    });
});

// ==================================================
// 3. NAVBAR SCROLL (ANIMADO COM GSAP)
// ==================================================

const navbar = document.getElementById('navbar');
let navbarFixed = false; // Variável para controlar o estado da navbar

window.addEventListener('scroll', () => {
    if (window.scrollY > 50 && !navbarFixed) {
        navbarFixed = true;
        gsap.to(navbar, {
            backgroundColor: "white", // Cor de fundo sólida ao fixar
            padding: "10px 20px", // Padding menor ao fixar
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Sombra suave
            duration: 0.6, // Duração da animação
            ease: "easeOut", // Easing (suavização) da animação
            color: "black", // Cor do texto escura ao fixar (se necessário)
        });
        gsap.to(".logo a", { color: "black", duration: 0.5, ease: "easeOut" }); // Anima cor do logo
        gsap.to(".nav-links li a", { color: "black", duration: 0.5, ease: "easeOut" }); // Anima cor dos links
    } else if (window.scrollY <= 50 && navbarFixed) {
        navbarFixed = false;
        gsap.to(navbar, {
            backgroundColor: "transparent", // Fundo transparente ao retornar ao topo
            padding: "20px", // Padding original
            boxShadow: "none", // Remove sombra
            duration: 0.5,
            ease: "easeOut",
            color: "var(--primary-color)", // Cor do texto original
        });
        gsap.to(".logo a", { color: "var(--primary-color)", duration: 0.5, ease: "easeOut" }); // Anima cor do logo original
        gsap.to(".nav-links li a", { color: "var(--primary-color)", duration: 0.5, ease: "easeOut" }); // Anima cor dos links originais
    }
});

// ==================================================
// 4. ANIMAÇÕES DE ENTRADA (AOS)
// ==================================================

document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800, // Duração das animações
        easing: 'ease-in-out', // Tipo de easing
        once: true, // Animações ocorrem apenas uma vez
    });
});