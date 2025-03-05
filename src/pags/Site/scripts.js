// Importando GSAP para animações
import { gsap } from 'gsap';

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
// Importando as imagens dos álbuns
import album1Cover from '../../img/Album 1/folder.jpg';
import album2Cover from '../../img/Album 2/folder.jpg';
import album3Cover from '../../img/Album 3/folder.jpg';


// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona as imagens dos álbuns
    const album1Img = document.querySelector('.album-card:nth-child(1) img');
    const album2Img = document.querySelector('.album-card:nth-child(2) img');
    const album3Img = document.querySelector('.album-card:nth-child(3) img');

    // Atribui as imagens aos elementos
    album1Img.src = album1Cover;
    album2Img.src = album2Cover;
    album3Img.src = album3Cover;
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
let navbarFixed = false;

window.addEventListener('scroll', () => {
    requestAnimationFrame(() => { // Usando requestAnimationFrame para suavizar ainda mais
        if (window.scrollY > 50 && !navbarFixed) {
            navbarFixed = true;
            gsap.to(navbar, {
                backgroundColor: "rgba(255, 255, 255, 0.95)", // Branco levemente transparente
                padding: "10px 20px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)", // Sombra mais sutil
                duration: 0.9, // Duração ligeiramente menor
                ease: "power3.out", // Easing power3.out
                color: "black",
                y: 0, // Desliza para baixo até a posição original
                opacity: 1 // Fade-in completo
            });
            gsap.to(".logo a", { color: "black", duration: 0.6, ease: "power3.out" }); // Duração e easing ajustados
            gsap.to(".nav-links li a", { color: "black", duration: 0.6, ease: "power3.out" }); // Duração e easing ajustados
        } else if (window.scrollY <= 50 && navbarFixed) {
            navbarFixed = false;
            gsap.to(navbar, {
                backgroundColor: "transparent", // Fundo transparente
                padding: "20px",
                boxShadow: "none", // Sem sombra
                duration: 0.4, // Duração ligeiramente menor para o retorno
                ease: "power3.out", // Easing power3.out
                color: "var(--primary-color)",
                y: -10, // Desliza para cima (posição inicial)
                opacity: 0.95 // Fade-out para transparência inicial
            });
            gsap.to(".logo a", { color: "var(--primary-color)", duration: 0.4, ease: "power3.out" }); // Duração e easing ajustados
            gsap.to(".nav-links li a", { color: "var(--primary-color)", duration: 0.4, ease: "power3.out" }); // Duração e easing ajustados
        }
    });
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

