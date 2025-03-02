document.addEventListener("DOMContentLoaded", function() {
    // Inicialização do Locomotive Scroll
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        smartphone: { smooth: true },
        tablet: { smooth: true }
    });

    // Controle da Navbar
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('#hero');

    window.addEventListener('scroll', () => {
        if (window.scrollY > hero.offsetHeight * 0.8) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Animação de Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            scroll.scrollTo(this.getAttribute('href'));
        });
    });

    // Carregamento Suave de Imagens
    const lazyLoad = () => {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.src = img.getAttribute('data-src');
            img.onload = () => img.style.opacity = '1';
        });
    }
    window.addEventListener('load', lazyLoad);
});