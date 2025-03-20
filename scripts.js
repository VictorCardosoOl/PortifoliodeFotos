document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.getElementById('nav-links');
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;

    // Funcionalidade do menu hambúrguer
    hamburgerMenu.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // Funcionalidade de ocultar/exibir a navbar ao scroll
    window.addEventListener('scroll', function() {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > navbar.offsetHeight) {
            // Rolando para baixo e passou da altura da navbar
            navbar.classList.add('hidden');
        } else if (scrollTop < lastScrollTop) {
            // Rolando para cima
            navbar.classList.remove('hidden');
        }

        lastScrollTop = scrollTop;
    });
});