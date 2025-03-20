// Função para o menu hambúrguer
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navRight = document.querySelector('.nav-right');
const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);

hamburgerMenu.addEventListener('click', () => {
    navRight.classList.toggle('active');
    overlay.classList.toggle('active');
    hamburgerMenu.setAttribute('aria-expanded', navRight.classList.contains('active'));
});

// Fechar o menu ao clicar no overlay
overlay.addEventListener('click', () => {
    navRight.classList.remove('active');
    overlay.classList.remove('active');
    hamburgerMenu.setAttribute('aria-expanded', false);
});

// Função para ocultar/exibir a navbar ao rolar a página
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.style.transform = 'translateY(0)'; // Exibe a navbar no topo da página
    } else if (currentScroll > lastScroll) {
        navbar.style.transform = 'translateY(-100%)'; // Oculta a navbar ao rolar para baixo
    } else {
        navbar.style.transform = 'translateY(0)'; // Exibe a navbar ao rolar para cima
    }

    lastScroll = currentScroll;
});