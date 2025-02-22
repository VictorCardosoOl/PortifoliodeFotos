// scripts.js

// ==================================================
// 1. INICIALIZAÇÃO E CONFIGURAÇÕES GERAIS
// ==================================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa AOS (Animate On Scroll) para animações ao rolar a página
    AOS.init();

    // ==================================================
    // 2. NAVBAR SCROLL
    // ==================================================

    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled'); // Adiciona classe ao rolar a página
        } else {
            navbar.classList.remove('scrolled'); // Remove classe ao voltar ao topo
        }
    });

    // ==================================================
    // 3. MENU MOBILE
    // ==================================================

    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active'); // Alterna a visibilidade do menu mobile
    });

    // ==================================================
    // 4. GALERIAS DE ÁLBUNS
    // ==================================================

    // Dados das galerias (imagens e legendas)
    const galleries = {
        gallery1: [
            { src: 'https://images.pexels.com/photos/4275890/pexels-photo-4275890.jpeg', caption: 'Cidade 1, 2023' },
            { src: 'https://images.pexels.com/photos/1662298/pexels-photo-1662298.jpeg', caption: 'Cidade 2, 2023' },
            { src: 'https://images.pexels.com/photos/3023211/pexels-photo-3023211.jpeg', caption: 'Cidade 3, 2023' },
            { src: 'https://images.pexels.com/photos/19739301/pexels-photo-19739301/free-photo-of-tent-among-hills-in-snow.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load', caption: 'Cidade 6, 2023' },
            { src: 'https://images.pexels.com/photos/30413960/pexels-photo-30413960/free-photo-of-charming-blue-alley-in-chefchaouen-morocco.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load', caption: 'Cidade 6, 2023' },
            { src: 'https://images.pexels.com/photos/30133114/pexels-photo-30133114/free-photo-of-portrait-of-elderly-nomad-in-mhamid-desert-morocco.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load', caption: 'Cidade 6, 2023' },
        ],
        gallery2: [
            { src: 'https://images.pexels.com/photos/3389528/pexels-photo-3389528.jpeg', caption: 'Cidade 4, 2023' },
            { src: 'https://images.pexels.com/photos/2217366/pexels-photo-2217366.jpeg', caption: 'Cidade 5, 2023' },
            { src: 'https://images.pexels.com/photos/30739091/pexels-photo-30739091/free-photo-of-elegant-red-velvet-cake-and-roses-on-table.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load', caption: 'Cidade 6, 2023' },
            { src: 'https://images.pexels.com/photos/30777373/pexels-photo-30777373/free-photo-of-whimsical-abstract-of-swirling-white-flowers.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load', caption: 'Cidade 6, 2023' },
            { src: 'https://images.pexels.com/photos/28588346/pexels-photo-28588346/free-photo-of-dramatic-coastal-landscape-of-el-golfo-beach.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load', caption: 'Cidade 6, 2023' },
            { src: 'https://images.pexels.com/photos/30648973/pexels-photo-30648973/free-photo-of-delicious-chocolate-glazed-donut-top-view.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load', caption: 'Cidade 6, 2023' },
        ],
    };

    // ==================================================
    // 5. ABRIR GALERIA
    // ==================================================

    // Adiciona event listeners para abrir a galeria ao clicar nos álbuns
    const albumCovers = document.querySelectorAll('.album-cover');
    albumCovers.forEach(cover => {
        cover.addEventListener('click', () => {
            const galleryId = cover.getAttribute('data-gallery'); // Obtém o ID da galeria
            openGallery(galleryId); // Abre a galeria correspondente
        });
    });

    // Função para abrir a galeria
    function openGallery(galleryId) {
        console.log(`Abrindo galeria: ${galleryId}`); // Depuração

        const galleryMasonry = document.getElementById('gallery-masonry');
        limparElemento(galleryMasonry); // Limpa o conteúdo anterior da galeria

        if (!galleries[galleryId]) {
            console.error(`Galeria ${galleryId} não encontrada.`); // Depuração
            return;
        }

        // Adiciona as imagens e legendas à galeria
        galleries[galleryId].forEach((image, index) => {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('gallery-item'); // Contêiner para a imagem e legenda

            const imgElement = document.createElement('img');
            imgElement.src = image.src;
            imgElement.alt = `Foto ${index + 1}`;
            imgElement.setAttribute('data-caption', image.caption); // Adiciona a legenda

            const captionElement = document.createElement('div');
            captionElement.classList.add('caption');
            captionElement.textContent = image.caption; // Texto da legenda

            imgContainer.appendChild(imgElement);
            imgContainer.appendChild(captionElement);
            imgContainer.addEventListener('click', () => openPhotoViewer(galleryId, index)); // Abre o visualizador de fotos

            galleryMasonry.appendChild(imgContainer); // Adiciona o contêiner à galeria
        });

        // Exibe o pop-up da galeria
        const galleryPopup = document.getElementById('gallery-popup');
        galleryPopup.style.display = 'block';
        console.log('Galeria aberta com sucesso.'); // Depuração
    }

    // ==================================================
    // 6. FECHAR GALERIA
    // ==================================================

    const closeGalleryButton = document.getElementById('close-gallery');
    closeGalleryButton.addEventListener('click', closeGallery);

    function closeGallery() {
        const galleryPopup = document.getElementById('gallery-popup');
        galleryPopup.style.display = 'none'; // Oculta o pop-up da galeria
        console.log('Galeria fechada.'); // Depuração
    }

    // ==================================================
    // 7. VISUALIZADOR DE FOTOS
    // ==================================================

    // Função para abrir o visualizador de fotos
    function openPhotoViewer(galleryId, index) {
        const photoViewer = document.getElementById('photo-viewer');
        const viewerImage = document.getElementById('viewer-image');
        const viewerCaption = document.getElementById('viewer-caption');
        const thumbnailContainer = document.querySelector('.thumbnail-container');
        limparElemento(thumbnailContainer); // Limpa as miniaturas anteriores

        const gallery = galleries[galleryId];
        if (!gallery || !gallery[index]) {
            console.error(`Imagem não encontrada na galeria ${galleryId}.`); // Depuração
            return;
        }

        // Exibe a imagem principal no visualizador
        viewerImage.src = gallery[index].src;
        viewerCaption.textContent = gallery[index].caption;

        // Adiciona as miniaturas das fotos
        gallery.forEach((image, i) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image.src;
            thumbnail.alt = `Foto ${i + 1}`;
            thumbnail.addEventListener('click', () => {
                viewerImage.src = image.src; // Atualiza a imagem principal
                viewerCaption.textContent = image.caption; // Atualiza a legenda
            });
            thumbnailContainer.appendChild(thumbnail); // Adiciona a miniatura ao contêiner
        });

        photoViewer.style.display = 'block'; // Exibe o visualizador de fotos
        console.log('Visualizador de fotos aberto.'); // Depuração
    }

    // ==================================================
    // 8. FECHAR VISUALIZADOR DE FOTOS
    // ==================================================

    const closePhotoViewerButton = document.getElementById('close-photo-viewer');
    closePhotoViewerButton.addEventListener('click', closePhotoViewer);

    function closePhotoViewer() {
        const photoViewer = document.getElementById('photo-viewer');
        photoViewer.style.display = 'none'; // Oculta o visualizador de fotos
        console.log('Visualizador de fotos fechado.'); // Depuração
    }

    // ==================================================
    // 9. BOTÃO COMPARTILHAR
    // ==================================================

    const shareButton = document.getElementById('share-button');
    shareButton.addEventListener('click', () => {
        const imageUrl = document.getElementById('viewer-image').src;
        navigator.clipboard.writeText(imageUrl).then(() => {
            alert('Link da imagem copiado para a área de transferência!');
        });
    });

    // ==================================================
    // 10. FUNÇÕES AUXILIARES
    // ==================================================

    // Função para limpar o conteúdo de um elemento
    function limparElemento(elemento) {
        while (elemento.firstChild) {
            elemento.removeChild(elemento.firstChild); // Remove todos os filhos do elemento
        }
    }
});