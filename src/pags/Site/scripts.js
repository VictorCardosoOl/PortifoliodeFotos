// Importações
import LocomotiveScroll from 'locomotive-scroll'; // Importa Locomotive Scroll
import { gsap } from 'gsap'; // Importa GSAP para animações

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o Locomotive Scroll
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'), // Elemento container do scroll
        smooth: true, // Ativa o scroll suave
        lerp: 0.1, // Suavização do scroll (quanto menor, mais suave)
        multiplier: 1.2, // Velocidade do scroll
        smartphone: {
            smooth: true, // Ativa o scroll suave em dispositivos móveis
        },
        tablet: {
            smooth: true, // Ativa o scroll suave em tablets
        },
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
    // 3. ATUALIZAÇÃO DO SCROLL AO REDIMENSIONAR A JANELA
    // ==================================================

    window.addEventListener('resize', () => {
        scroll.update(); // Atualiza o scroll ao redimensionar a janela
    });
});

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Animação com GSAP
    gsap.from('.album-card', {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // Seleciona as imagens dos álbuns
    const album1Img = document.querySelector('.album-card:nth-child(1) img');
    const album2Img = document.querySelector('.album-card:nth-child(2) img');
    const album3Img = document.querySelector('.album-card:nth-child(3) img');

    // Atribui as imagens aos elementos
    album1Img.src = '/img/Album 1/folder.jpg';
    album2Img.src = '/img/Album 2/folder.jpg';
    album3Img.src = '/img/Album 3/folder.jpg';

    // Selecionar o elemento <img> no HTML
    const profileImgElement = document.querySelector('.about-image img');
    if (profileImgElement) {
        profileImgElement.src = '/img/A/profile.jpg';
    } else {
        console.error("Elemento <img> com seletor '.about-image img' não encontrado no HTML.");
    }
});



// ==================================================
// 1. CONFIGURAÇÕES GERAIS
// ==================================================

document.addEventListener('DOMContentLoaded', function () {
    // Inicializa AOS (Animate On Scroll)
    AOS.init({
        duration: 800, // Duração das animações
        easing: 'ease-in-out', // Tipo de easing
        once: true, // Animações ocorrem apenas uma vez
    });


    // ==================================================
    // 2. NAVBAR SCROLL (ANIMADO COM GSAP)
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
    // 3. MENU MOBILE
    // ==================================================

    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Fechar menu mobile ao clicar em um link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });



    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    menuToggle.addEventListener('click', () => {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });


});

// Cria um cursor personalizado que segue o movimento do mouse
document.addEventListener("DOMContentLoaded", function () {
    const cursor = document.createElement("div");
    cursor.classList.add("cursor");
    document.body.appendChild(cursor);

    document.addEventListener("mousemove", (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.5,
            ease: "power2.out",
        });
    });
});


// Adiciona um efeito de movimento ao passar o mouse sobre os links do nav
(function () {
    const link = document.querySelectorAll('nav > .hover-this');
    const cursor = document.querySelector('.cursor');

    const animateit = function (e) {
        const span = this.querySelector('span');
        const { offsetX: x, offsetY: y } = e;
        const { offsetWidth: width, offsetHeight: height } = this;

        const move = 25;
        const xMove = (x / width) * (move * 2) - move;
        const yMove = (y / height) * (move * 2) - move;

        span.style.transform = `translate(${xMove}px, ${yMove}px)`;
    };

    const editCursor = (e) => {
        const { clientX: x, clientY: y } = e;
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';
    };

    link.forEach((b) => b.addEventListener('mousemove', animateit));
    link.forEach((b) => b.addEventListener('mouseleave', animateit));
    window.addEventListener('mousemove', editCursor);
})();



