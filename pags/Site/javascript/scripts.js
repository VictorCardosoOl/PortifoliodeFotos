

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
    // 2. NAVBAR SCROLL
    // ==================================================

    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
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
        navLinks.classList.toggle('active');
    });

    // Fechar menu mobile ao clicar em um link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // ==================================================
    // 6. BARRA DE SCROLL PERSONALIZADA
    // ==================================================

    // Barra de Scroll Personalizada
const scrollThumb = document.querySelector('.c-scrollbar_thumb');

window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = document.documentElement.scrollTop;
    const thumbHeight = (window.innerHeight / scrollHeight) * 100;
    const thumbPosition = (scrollTop / scrollHeight) * 100;

    scrollThumb.style.height = `${thumbHeight}%`;
    scrollThumb.style.transform = `translateY(${thumbPosition}%)`;
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
            // Adicione mais imagens aqui
        ],
        gallery2: [
            { src: 'https://images.pexels.com/photos/3389528/pexels-photo-3389528.jpeg', caption: 'Cidade 4, 2023' },
            { src: 'https://images.pexels.com/photos/2217366/pexels-photo-2217366.jpeg', caption: 'Cidade 5, 2023' },
            // Adicione mais imagens aqui
        ],
        gallery3: [
            { src: 'https://images.pexels.com/photos/3389528/pexels-photo-3389528.jpeg', caption: 'Cidade 4, 2023' },
            { src: 'https://images.pexels.com/photos/2217366/pexels-photo-2217366.jpeg', caption: 'Cidade 5, 2023' },
            // Adicione mais imagens aqui
        ],
    };

    function openGallery(galleryId) {
        const galleryMasonry = document.getElementById('gallery-masonry');
        galleryMasonry.innerHTML = ''; // Limpa a galeria anterior

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
    }

    function openPhotoViewer(galleryId, index) {
        const photoViewer = document.getElementById('photo-viewer');
        const viewerImage = document.getElementById('viewer-image');
        const viewerCaption = document.getElementById('viewer-caption');
        const thumbnailContainer = document.querySelector('.thumbnail-container');
        thumbnailContainer.innerHTML = ''; // Limpa as miniaturas anteriores

        const gallery = galleries[galleryId];
        viewerImage.src = gallery[index].src;
        viewerCaption.textContent = gallery[index].caption;

        gallery.forEach((image, i) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image.src;
            thumbnail.alt = image.caption;
            thumbnail.addEventListener('click', () => {
                viewerImage.src = image.src;
                viewerCaption.textContent = image.caption;
            });
            thumbnailContainer.appendChild(thumbnail);
        });

        photoViewer.style.display = 'block';
    }

    // Fechar galeria e visualizador
    document.getElementById('close-gallery').addEventListener('click', () => {
        document.getElementById('gallery-popup').style.display = 'none';
    });

    document.getElementById('close-photo-viewer').addEventListener('click', () => {
        document.getElementById('photo-viewer').style.display = 'none';
    });

    // Fechar galeria ao clicar fora
    document.getElementById('gallery-popup').addEventListener('click', (e) => {
        if (e.target === document.getElementById('gallery-popup')) {
            document.getElementById('gallery-popup').style.display = 'none';
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
});

const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

menuToggle.addEventListener('click', () => {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});