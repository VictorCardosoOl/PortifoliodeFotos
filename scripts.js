document.addEventListener('DOMContentLoaded', function () {
    // Inicializa AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
    });

    // Inicializa Locomotive Scroll
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        getDirection: true,
        getSpeed: true,
    });

    // Atualiza a barra de scroll personalizada com base no Locomotive Scroll
    const scrollThumb = document.querySelector('.c-scrollbar_thumb');

    scroll.on('scroll', (args) => {
        const scrollHeight = args.limit.y;
        const scrollTop = args.scroll.y;
        const thumbHeight = (window.innerHeight / scrollHeight) * 100;
        const thumbPosition = (scrollTop / scrollHeight) * 100;

        scrollThumb.style.height = `${thumbHeight}%`;
        scrollThumb.style.transform = `translateY(${thumbPosition}%)`;
    });

    // Recalcula a altura do conteúdo após o carregamento da página
    window.addEventListener('load', () => {
        scroll.update();
    });

    // Recalcula a altura do conteúdo após alterações dinâmicas
    function updateScroll() {
        scroll.update();
    }

    // ==================================================
    // 2. NAVBAR SCROLL
    // ==================================================

    const navbar = document.getElementById('navbar');
    scroll.on('scroll', (args) => {
        if (args.scroll.y > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==================================================
    // 3. MENU MOBILE
    // ==================================================

    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    mobileMenu.addEventListener('click', () => {
        const isExpanded = mobileMenu.getAttribute('aria-expanded') === 'true';
        mobileMenu.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
    });

    // Fechar menu mobile ao clicar em um link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenu.setAttribute('aria-expanded', 'false');
        });
    });

    // ==================================================
    // 8. GALERIA DE FOTOS
    // ==================================================

    const galleries = {
        gallery1: [
            { src: './img/Album 1/folder.jpg', caption: 'Retrato de uma pessoa sorrindo em um ambiente urbano' },
            { src: './img/Album 1/wallp (1).jpg', caption: 'Noivos se beijando em uma cerimônia de casamento' },
            { src: './img/Album 1/wallp (2).jpg', caption: 'Noivos se beijando em uma cerimônia de casamento' },
            { src: './img/Album 1/wallp (3).jpg', caption: 'Noivos se beijando em uma cerimônia de casamento' },
        ],
        gallery2: [
            { src: 'https://images.pexels.com/photos/3389528/pexels-photo-3389528.jpeg', caption: 'Cidade 4, 2023' },
            { src: 'https://images.pexels.com/photos/2217366/pexels-photo-2217366.jpeg', caption: 'Cidade 5, 2023' },
        ],
        gallery3: [
            { src: 'https://images.pexels.com/photos/3389528/pexels-photo-3389528.jpeg', caption: 'Cidade 4, 2023' },
            { src: 'https://images.pexels.com/photos/2217366/pexels-photo-2217366.jpeg', caption: 'Cidade 5, 2023' },
        ],
    };

    function openGallery(galleryId) {
        const galleryMasonry = document.getElementById('gallery-masonry');
        galleryMasonry.innerHTML = '';

        // Pausa o Locomotive Scroll
        scroll.stop();

        galleries[galleryId].forEach((image, index) => {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('gallery-item');

            const imgElement = document.createElement('img');
            imgElement.src = image.src;
            imgElement.alt = image.caption;
            imgElement.setAttribute('data-caption', image.caption);

            imgContainer.appendChild(imgElement);
            imgContainer.addEventListener('click', () => openPhotoViewer(galleryId, index));

            galleryMasonry.appendChild(imgContainer);
        });

        document.getElementById('gallery-popup').style.display = 'block';
        updateScroll(); // Atualiza o scroll após abrir a galeria
    }

    function closeGallery() {
        document.getElementById('gallery-popup').style.display = 'none';
        // Reativa o Locomotive Scroll
        scroll.start();
        updateScroll(); // Atualiza o scroll após fechar a galeria
    }

    // Fechar galeria e visualizador
    document.getElementById('close-gallery').addEventListener('click', closeGallery);

    document.getElementById('gallery-popup').addEventListener('click', (e) => {
        if (e.target === document.getElementById('gallery-popup')) {
            closeGallery();
        }
    });

    // Fechar visualizador de fotos ao clicar fora
    document.getElementById('photo-viewer').addEventListener('click', (e) => {
        if (e.target === document.getElementById('photo-viewer')) {
            document.getElementById('photo-viewer').style.display = 'none';
        }
    });

    // Abrir galeria ao clicar nos álbuns
    document.querySelectorAll('.album-cover').forEach(albumCover => {
        albumCover.addEventListener('click', () => {
            const galleryId = albumCover.getAttribute('data-gallery');
            openGallery(galleryId);
        });
    });

    // Navegação por teclado no visualizador de fotos
    document.addEventListener('keydown', (e) => {
        const photoViewer = document.getElementById('photo-viewer');
        if (photoViewer.style.display === 'block') {
            const currentGallery = galleries[galleryId];
            let currentIndex = Array.from(document.querySelectorAll('.thumbnail-container img')).indexOf(document.querySelector('.thumbnail-container img[src="' + document.getElementById('viewer-image').src + '"]'));

            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % currentGallery.length;
            }

            const nextImage = currentGallery[currentIndex];
            document.getElementById('viewer-image').src = nextImage.src;
            document.getElementById('viewer-caption').textContent = nextImage.caption;
        }
    });

    // Validação do formulário de contato
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (name === '' || email === '' || message === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Simulação de envio do formulário
        alert('Mensagem enviada com sucesso!');
        contactForm.reset();
    });
});