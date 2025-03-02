document.addEventListener("DOMContentLoaded", function () {
    // Inicializa o Locomotive Scroll
    const scroll = new LocomotiveScroll({
        el: document.querySelector("[data-scroll-container]"),
        smooth: true,
        smartphone: { smooth: true },
        tablet: { smooth: true },
    });

    // Atualiza o scroll ao redimensionar a janela
    window.addEventListener("resize", () => {
        scroll.update();
    });

    // Adiciona efeito de fade-in nas seções ao rolar
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
        section.style.opacity = "0";
        section.style.transform = "translateY(20px)";
        section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
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
        { threshold: 0.1 }
    );

    sections.forEach((section) => observer.observe(section));
});