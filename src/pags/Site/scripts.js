// ==================================================
// 1. CONFIGURAÇÕES GERAIS
// ==================================================

// Importações
import LocomotiveScroll from 'locomotive-scroll'; // Importa Locomotive Scroll
import { gsap } from 'gsap'; // Importa GSAP para animações

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o Locomotive Scroll
    document.addEventListener('DOMContentLoaded', () => {
        const scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'), // Container do scroll
            smooth: true, // Scroll suave
            lerp: 0.07, // Suavização (quanto menor, mais suave)
            multiplier: 1.2, // Velocidade do scroll
            smartphone: {
                smooth: true, // Scroll suave em dispositivos móveis
            },
            tablet: {
                smooth: true, // Scroll suave em tablets
            },
        });

        // Atualiza o scroll ao redimensionar a janela
        window.addEventListener('resize', () => {
            scroll.update();
        });

        // Atualiza o scroll ao carregar imagens
        window.addEventListener('load', () => {
            scroll.update();
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
    // 4. MENU MOBILE
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

    // ==================================================
    // 5. HERO SLIDESHOW (ANIMADO COM GSAP)
    // ==================================================

    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function nextSlide() {
        gsap.to(slides[currentSlide], { opacity: 0, duration: 1.5, ease: "power2.inOut" }); // Fade out slide atual
        currentSlide = (currentSlide + 1) % slides.length; // Próximo slide (loop infinito)
        gsap.fromTo(slides[currentSlide], { opacity: 0 }, { opacity: 1, duration: 1.5, ease: "power2.inOut", delay: 0.5 }); // Fade in próximo slide
    }

    setInterval(nextSlide, 5000); // Troca de slide a cada 5 segundos
    slides[0].classList.add('active'); // Ativa o primeiro slide inicialmente

    // ==================================================
    // 6. HERO CONTENT ANIMATION (ANIMADO COM GSAP)
    // ==================================================

    const heroContent = document.querySelector('.hero-content');

    // Efeito de parallax no Hero Section
    gsap.to('.hero-content', {
        yPercent: -20, // Move o conteúdo para cima ao rolar
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true, // Efeito suave ao rolar
        },
    });

    // Revelação suave das seções
    gsap.utils.toArray('[data-scroll-section]').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%', // Inicia a animação quando 80% da seção estiver visível
                toggleActions: 'play none none reverse', // Reproduz a animação ao entrar e reverter ao sair
            },
        });
    });

    // Efeito de escala nas imagens dos álbuns
    gsap.utils.toArray('.album-card img').forEach(image => {
        gsap.from(image, {
            scale: 1.2,
            duration: 1,
            scrollTrigger: {
                trigger: image,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
            },
        });
    });

    // ==================================================
    // 7. ALBUMS SECTION ANIMATION (ANIMADO COM GSAP)
    // ==================================================

    const albumsTitle = document.querySelector('#albums h2');
    const albums = document.querySelectorAll('.album');

    gsap.from(albumsTitle, {
        opacity: 0, // Inicia transparente
        y: -40, // Inicia 40 pixels acima
        duration: 0.9, // Duração da animação
        ease: "power2.out", // Easing
        delay: 0.3 // Delay para iniciar após o Hero
    });

    gsap.from(albums, {
        opacity: 0, // Inicia transparente
        y: 60, // Inicia 60 pixels abaixo
        duration: 1, // Duração um pouco maior para os álbuns
        ease: "power2.out", // Easing
        stagger: 0.25, // Anima os álbuns com um escalonamento de 0.25 segundos
        delay: 0.5 // Delay adicional
    });

    // ==================================================
    // 8. CURSOR PERSONALIZADO
    // ==================================================

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

    // ==================================================
    // 9. EFEITO DE MOVIMENTO AO PASSAR O MOUSE SOBRE OS LINKS
    // ==================================================

    const link = document.querySelectorAll('nav > .hover-this');
    const cursorElement = document.querySelector('.cursor');

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
        cursorElement.style.left = x + 'px';
        cursorElement.style.top = y + 'px';
    };

    link.forEach((b) => b.addEventListener('mousemove', animateit));
    link.forEach((b) => b.addEventListener('mouseleave', animateit));
    window.addEventListener('mousemove', editCursor);
});

document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800, // Duração das animações
        easing: 'ease-in-out', // Tipo de easing
        once: true, // Animações ocorrem apenas uma vez
    });
});