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
    const heroSubtext = document.querySelector(".hero-subtext");

    if (heroContent) {
        heroContent.classList.add("visible");
    }

    // Inicializa o Swiper
    const swiper = new Swiper(".swiper-container", {
        loop: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
});