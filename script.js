document.addEventListener("DOMContentLoaded", function () {
    // Inicializa o Locomotive Scroll
    const scroll = new LocomotiveScroll({
        el: document.querySelector("[data-scroll-container]"),
        smooth: true,
        smartphone: { smooth: true },
        tablet: { smooth: true },
    });

    // Atualiza o Locomotive Scroll após o carregamento da página
    window.addEventListener("load", () => {
        scroll.update();
    });

    // Navbar scroll animation
    const navbar = document.querySelector(".navbar");
    const hero = document.querySelector("#hero");

    window.addEventListener("scroll", () => {
        if (window.scrollY > hero.offsetHeight * 0.8) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Menu hambúrguer
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    // Animações de fade-in nas seções
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
        section.style.opacity = "0";
        section.style.transform = "translateY(20px)";
        section.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }
            });
        },
        { threshold: 0.2 }
    );

    sections.forEach((section) => observer.observe(section));

    // Animação do Hero
    const heroContent = document.querySelector(".hero-content");
    const heroText = document.querySelector(".hero-text");

    if (heroContent) {
        heroContent.classList.add("visible");
    }

    // Efeito de cursor personalizado
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

    document.addEventListener("mouseleave", () => {
        gsap.to(cursor, {
            scale: 0,
            duration: 0.5,
        });
    });

    document.addEventListener("mouseenter", () => {
        gsap.to(cursor, {
            scale: 1,
            duration: 0.5,
        });
    });
});
(function () {

    const link = document.querySelectorAll('nav > .hover-this');
    const cursor = document.querySelector('.cursor');

    const animateit = function (e) {
          const span = this.querySelector('span');
          const { offsetX: x, offsetY: y } = e,
          { offsetWidth: width, offsetHeight: height } = this,

          move = 25,
          xMove = x / width * (move * 2) - move,
          yMove = y / height * (move * 2) - move;

          span.style.transform = `translate(${xMove}px, ${yMove}px)`;

          if (e.type === 'mouseleave') span.style.transform = '';
    };

    const editCursor = e => {
          const { clientX: x, clientY: y } = e;
          cursor.style.left = x + 'px';
          cursor.style.top = y + 'px';
    };

    link.forEach(b => b.addEventListener('mousemove', animateit));
    link.forEach(b => b.addEventListener('mouseleave', animateit));
    window.addEventListener('mousemove', editCursor);

})();
// Mostrar/ocultar botão do WhatsApp ao rolar a página
const whatsappButton = document.querySelector('.whatsapp-button');

window.addEventListener('scroll', () => {
    const portfolioSection = document.getElementById('portfolio');
    const portfolioPosition = portfolioSection.getBoundingClientRect().top;

    if (portfolioPosition < window.innerHeight / 2) {
        whatsappButton.classList.add('visible'); // Mostra o botão com animação
    } else {
        whatsappButton.classList.remove('visible'); // Oculta o botão com animação
    }
});