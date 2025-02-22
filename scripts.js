// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa AOS (Animate On Scroll)
    AOS.init();

    // Navbar scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Menu mobile
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Galerias de Álbuns
    const galleries = {
        gallery1: [
            { src: 'https://images.pexels.com/photos/4275890/pexels-photo-4275890.jpeg', caption: 'Cidade 1, 2023' },
            { src: 'https://images.pexels.com/photos/1662298/pexels-photo-1662298.jpeg', caption: 'Cidade 2, 2023' },
            { src: 'https://images.pexels.com/photos/3023211/pexels-photo-3023211.jpeg', caption: 'Cidade 3, 2023' },
        ],
        gallery2: [
            { src: 'https://images.pexels.com/photos/3389528/pexels-photo-3389528.jpeg', caption: 'Cidade 4, 2023' },
            { src: 'https://images.pexels.com/photos/2217366/pexels-photo-2217366.jpeg', caption: 'Cidade 5, 2023' },
            { src: 'https://images.pexels.com/photos/2217366/pexels-photo-2217366.jpeg', caption: 'Cidade 6, 2023' },
        ],
    };

    // Adiciona event listeners para abrir a galeria
    const albumCovers = document.querySelectorAll('.album-cover');
    albumCovers.forEach(cover => {
        cover.addEventListener('click', () => {
            const galleryId = cover.getAttribute('data-gallery');
            openGallery(galleryId);
        });
    });

    // Função para abrir a galeria
    function openGallery(galleryId) {
        console.log(`Abrindo galeria: ${galleryId}`); // Depuração
        const galleryMasonry = document.getElementById('gallery-masonry');
        limparElemento(galleryMasonry);

        if (!galleries[galleryId]) {
            console.error(`Galeria ${galleryId} não encontrada.`); // Depuração
            return;
        }

        galleries[galleryId].forEach((image, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = image.src;
            imgElement.alt = `Foto ${index + 1}`;
            imgElement.setAttribute('data-caption', image.caption);
            imgElement.addEventListener('click', () => openPhotoViewer(galleryId, index));
            galleryMasonry.appendChild(imgElement);
        });

        // Exibe o pop-up da galeria
        const galleryPopup = document.getElementById('gallery-popup');
        galleryPopup.style.display = 'block';
        console.log('Galeria aberta com sucesso.'); // Depuração
    }

    // Fechar Galeria
    const closeGalleryButton = document.getElementById('close-gallery');
    closeGalleryButton.addEventListener('click', closeGallery);

    function closeGallery() {
        const galleryPopup = document.getElementById('gallery-popup');
        galleryPopup.style.display = 'none';
        console.log('Galeria fechada.'); // Depuração
    }

    // Função para abrir o visualizador de fotos
    function openPhotoViewer(galleryId, index) {
        const photoViewer = document.getElementById('photo-viewer');
        const viewerImage = document.getElementById('viewer-image');
        const viewerCaption = document.getElementById('viewer-caption');
        const thumbnailContainer = document.querySelector('.thumbnail-container');
        limparElemento(thumbnailContainer);

        const gallery = galleries[galleryId];
        if (!gallery || !gallery[index]) {
            console.error(`Imagem não encontrada na galeria ${galleryId}.`); // Depuração
            return;
        }

        viewerImage.src = gallery[index].src;
        viewerCaption.textContent = gallery[index].caption;

        gallery.forEach((image, i) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image.src;
            thumbnail.alt = `Foto ${i + 1}`;
            thumbnail.addEventListener('click', () => {
                viewerImage.src = image.src;
                viewerCaption.textContent = image.caption;
            });
            thumbnailContainer.appendChild(thumbnail);
        });

        photoViewer.style.display = 'block';
        console.log('Visualizador de fotos aberto.'); // Depuração
    }

    // Fechar Visualizador de Fotos
    const closePhotoViewerButton = document.getElementById('close-photo-viewer');
    closePhotoViewerButton.addEventListener('click', closePhotoViewer);

    function closePhotoViewer() {
        const photoViewer = document.getElementById('photo-viewer');
        photoViewer.style.display = 'none';
        console.log('Visualizador de fotos fechado.'); // Depuração
    }

    // Função para limpar um elemento
    function limparElemento(elemento) {
        while (elemento.firstChild) {
            elemento.removeChild(elemento.firstChild);
        }
    }
});