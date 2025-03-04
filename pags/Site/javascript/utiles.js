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


document.addEventListener("DOMContentLoaded", function () {
    const whatsappButton = document.querySelector('.whatsapp-button');
    const portfolioSection = document.getElementById('albums');
    const footerSection = document.getElementById('footer'); // Adicionando referência ao footer

    window.addEventListener('scroll', () => {
        const portfolioPosition = portfolioSection.getBoundingClientRect().top;
        const footerPosition = footerSection.getBoundingClientRect().top; // Obtendo posição do footer

        // Verifica se a seção de portfólio está visível e o footer não está na parte superior da tela
        if (portfolioPosition < window.innerHeight / 2 && footerPosition > window.innerHeight) {
            whatsappButton.classList.add('visible');
        } else {
            whatsappButton.classList.remove('visible');
        }
    });
});