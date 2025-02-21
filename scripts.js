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

    // Abrir Galeria
    function openGallery(galleryId) {
        const galleryMasonry = document.getElementById('gallery-masonry');
        galleryMasonry.innerHTML = ''; // Limpa o conteúdo anterior

        galleries[galleryId].forEach((image, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = image.src;
            imgElement.alt = `Foto ${index + 1}`;
            imgElement.setAttribute('data-caption', image.caption);
            imgElement.addEventListener('click', () => openPhotoViewer(galleryId, index));
            galleryMasonry.appendChild(imgElement);
        });

        document.getElementById('gallery-popup').style.display = 'block';
    }

    // Fechar Galeria
    function closeGallery() {
        document.getElementById('gallery-popup').style.display = 'none';
    }

    // Abrir Visualizador de Fotos
    function openPhotoViewer(galleryId, index) {
        const photoViewer = document.getElementById('photo-viewer');
        const viewerImage = document.getElementById('viewer-image');
        const thumbnailContainer = document.querySelector('.thumbnail-container');
        thumbnailContainer.innerHTML = ''; // Limpa o conteúdo anterior

        const gallery = galleries[galleryId];
        viewerImage.src = gallery[index].src;

        gallery.forEach((image, i) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image.src;
            thumbnail.alt = `Foto ${i + 1}`;
            thumbnail.addEventListener('click', () => {
                viewerImage.src = image.src;
            });
            thumbnailContainer.appendChild(thumbnail);
        });

        photoViewer.style.display = 'block';
    }

    // Fechar Visualizador de Fotos
    function closePhotoViewer() {
        document.getElementById('photo-viewer').style.display = 'none';
    }

    // Proteção de Direitos Autorais
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const copyright = document.createElement('div');
        copyright.textContent = '© 2023 Fotógrafo. Todos os direitos reservados.';
        copyright.style.position = 'fixed';
        copyright.style.top = `${e.clientY}px`;
        copyright.style.left = `${e.clientX}px`;
        copyright.style.color = 'white';
        copyright.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        copyright.style.padding = '10px';
        copyright.style.borderRadius = '5px';
        copyright.style.zIndex = '10000';
        document.body.appendChild(copyright);
        setTimeout(() => document.body.removeChild(copyright), 2000);
    });

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
            e.preventDefault();
            const copyright = document.createElement('div');
            copyright.textContent = '© 2023 Fotógrafo. Todos os direitos reservados.';
            copyright.style.position = 'fixed';
            copyright.style.top = '50%';
            copyright.style.left = '50%';
            copyright.style.transform = 'translate(-50%, -50%)';
            copyright.style.color = 'white';
            copyright.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            copyright.style.padding = '10px';
            copyright.style.borderRadius = '5px';
            copyright.style.zIndex = '10000';
            document.body.appendChild(copyright);
            setTimeout(() => document.body.removeChild(copyright), 2000);
        }
        if (e.key === 'F12') {
            e.preventDefault();
            const copyright = document.createElement('div');
            copyright.textContent = '© 2023 Fotógrafo. Todos os direitos reservados.';
            copyright.style.position = 'fixed';
            copyright.style.top = '50%';
            copyright.style.left = '50%';
            copyright.style.transform = 'translate(-50%, -50%)';
            copyright.style.color = 'white';
            copyright.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            copyright.style.padding = '10px';
            copyright.style.borderRadius = '5px';
            copyright.style.zIndex = '10000';
            document.body.appendChild(copyright);
            setTimeout(() => document.body.removeChild(copyright), 2000);
        }
    });
});