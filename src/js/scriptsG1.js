// Substituir todo o conteúdo do arquivo por:

// Dados da galeria
const galleryData = [
    {
        id: 1,
        title: "Tudo o que você quer ser",
        size: "large",
        imageUrl: "/img/1galeria/a (2).webp",
        featured: true
    },
    {
        id: 1,
        title: "Tudo o que você quer ser",
        size: "small",
        imageUrl: "/img/1galeria/e (1).webp",
        featured: true
    },
    {
        id: 1,
        title: "Tudo o que você quer ser",
        size: "small",
        imageUrl: "/img/1galeria/e (8).webp",
        featured: true
    },
    {
        id: 1,
        title: "Tudo o que você quer ser",
        size: "wide",
        imageUrl: "/img/1galeria/e (8).webp",
        featured: true
    },
    // ... (manter o restante dos dados da galeria)
];

// Renderizar a galeria
function renderGallery() {
    const galleryContainer = document.getElementById('gallery-grid');

    if (galleryContainer && !galleryContainer.hasChildNodes()) {
        const fragment = document.createDocumentFragment();

        galleryData.forEach((item, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.dataset.size = item.size;
            galleryItem.style.animationDelay = `${index * 0.1}s`;

            const link = document.createElement('div');
            link.className = 'gallery-link';
            link.setAttribute('aria-label', `Ver ${item.title}`);
            link.setAttribute('role', 'button');
            link.setAttribute('tabindex', '0');

            const img = new Image();
            img.src = item.imageUrl;
            img.className = 'gallery-image';
            img.alt = item.title;
            img.loading = 'lazy';
            img.dataset.index = index;

            link.appendChild(img);

            if (item.title) {
                const caption = document.createElement('div');
                caption.className = 'gallery-caption';

                const title = document.createElement('h3');
                title.className = 'caption-title';
                title.textContent = item.title;

                caption.appendChild(title);
                link.appendChild(caption);
            }

            galleryItem.appendChild(link);
            fragment.appendChild(galleryItem);
        });

        galleryContainer.appendChild(fragment);

        // Adicionar event listeners para as imagens
        setupLightbox();
    }
}

// Atualize a função setupLightbox() com estas mudanças:

function setupLightbox() {
    const images = document.querySelectorAll('.gallery-image');
    let currentIndex = 0;
    let scrollTimeout;
    let isLightboxOpen = false;

    // Criar estrutura do lightbox
    const lightboxHTML = `
        <div class="lightbox" id="lightbox">
            <div class="lightbox-overlay" id="lightboxOverlay"></div>
            <div class="lightbox-container">
                <section class="category-panel">
                    Galeria
                </section>
                <section class="main-viewer">
                    <img class="main-image" id="mainImage" src="" alt="Visualização Principal">
                </section>
                <section class="thumbnails-container" id="thumbnailsContainer"></section>
                <button class="lightbox-close" id="lightboxClose">&times;</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    // Preencher miniaturas
    const thumbnailsContainer = document.getElementById('thumbnailsContainer');
    galleryData.forEach((item, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail-item';
        thumb.dataset.index = index;
        thumb.innerHTML = `<img src="${item.imageUrl}" data-full="${item.imageUrl}">`;
        thumbnailsContainer.appendChild(thumb);
    });

    // Elementos do lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    const closeBtn = document.getElementById('lightboxClose');

    // Abrir lightbox
 

// Event listeners
lightboxOverlay.addEventListener('click', closeLightbox);
closeBtn.addEventListener('click', closeLightbox);

thumbnails.forEach(thumb => {
    thumb.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = parseInt(thumb.dataset.index);
        updateMainImage(currentIndex);
    });
});

// Navegação por teclado
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
        updateMainImage(currentIndex);
    } else if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % galleryData.length;
        updateMainImage(currentIndex);
    }
});

// Navegação por scroll do mouse
lightbox.addEventListener('wheel', (e) => {
    e.preventDefault();

    const direction = e.deltaY > 0 ? 1 : -1;
    currentIndex = (currentIndex + direction + galleryData.length) % galleryData.length;

    updateMainImage(currentIndex);
});
}

// Inicialização
function init() {
    renderGallery();

    // Verificar se há GSAP carregado
    if (typeof gsap === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/gsap.min.js';
        document.head.appendChild(script);
    }
}

document.addEventListener('DOMContentLoaded', init);