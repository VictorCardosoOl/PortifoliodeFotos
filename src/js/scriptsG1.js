// scriptsG1.js - Versão Atualizada
document.addEventListener('DOMContentLoaded', () => {
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
            id: 2,
            title: "Tudo o que você quer ser",
            size: "small",
            imageUrl: "/img/1galeria/e (1).webp",
            featured: true
        },
        {
            id: 3,
            title: "Tudo o que você quer ser",
            size: "small",
            imageUrl: "/img/1galeria/e (8).webp",
            featured: true
        },
        {
            id: 4,
            title: "Tudo o que você quer ser",
            size: "wide",
            imageUrl: "/img/1galeria/e (4).webp",
            featured: true
        }
        // Adicione mais itens conforme necessário
    ];

    // Estado do lightbox
    let lightboxState = {
        currentIndex: 0,
        isOpen: false,
        scrollDelay: 150, // Delay para navegação por scroll
        scrollTimeout: null
    };

    // Inicialização
    function init() {
        renderGallery();
        loadGSAP();
        setupEventListeners();
    }

    // Renderizar a galeria
    function renderGallery() {
        const galleryContainer = document.getElementById('gallery-grid');
        if (!galleryContainer || galleryContainer.hasChildNodes()) return;

        const fragment = document.createDocumentFragment();

        galleryData.forEach((item, index) => {
            const galleryItem = createGalleryItem(item, index);
            fragment.appendChild(galleryItem);
        });

        galleryContainer.appendChild(fragment);
        setupLightbox();
    }

    // Criar item da galeria
    function createGalleryItem(item, index) {
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
        return galleryItem;
    }

    // Configurar o lightbox
    function setupLightbox() {
        createLightboxHTML();
        setupLightboxElements();
    }

    // Criar estrutura HTML do lightbox
    function createLightboxHTML() {
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
        populateThumbnails();
    }

    // Popular miniaturas
    function populateThumbnails() {
        const thumbnailsContainer = document.getElementById('thumbnailsContainer');
        galleryData.forEach((item, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail-item';
            thumb.dataset.index = index;
            thumb.innerHTML = `<img src="${item.imageUrl}" data-full="${item.imageUrl}">`;
            thumbnailsContainer.appendChild(thumb);
        });
    }

    // Configurar elementos do lightbox
    function setupLightboxElements() {
        const images = document.querySelectorAll('.gallery-image');
        images.forEach(img => {
            img.addEventListener('click', handleImageClick);
            img.addEventListener('keydown', handleImageKeyDown);
        });
    }

    // Configurar listeners de eventos
    function setupEventListeners() {
        document.addEventListener('keydown', handleGlobalKeyDown);
        
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.addEventListener('wheel', handleLightboxScroll, { passive: false });
        }
    }

    // Handlers de eventos
    function handleImageClick(e) {
        lightboxState.currentIndex = parseInt(e.target.dataset.index);
        openLightbox(lightboxState.currentIndex);
    }

    function handleImageKeyDown(e) {
        if (e.key === 'Enter') {
            lightboxState.currentIndex = parseInt(e.target.dataset.index);
            openLightbox(lightboxState.currentIndex);
        }
    }

    function handleGlobalKeyDown(e) {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox || !lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
        }
    }

    function handleLightboxScroll(e) {
        e.preventDefault();
        
        clearTimeout(lightboxState.scrollTimeout);
        lightboxState.scrollTimeout = setTimeout(() => {
            const direction = e.deltaY > 0 ? 1 : -1;
            navigateLightbox(direction);
        }, lightboxState.scrollDelay);
    }

    // Controles do lightbox
    function openLightbox(index) {
        if (lightboxState.isOpen) return;

        lightboxState.isOpen = true;
        lightboxState.currentIndex = index;
        
        const lightbox = document.getElementById('lightbox');
        const mainImage = document.getElementById('mainImage');
        const thumbnails = document.querySelectorAll('.thumbnail-item');

        mainImage.src = galleryData[index].imageUrl;
        document.body.style.overflow = 'hidden';
        
        updateActiveThumbnail(index);
        
        lightbox.classList.add('active');
        
        gsap.fromTo(mainImage,
            { opacity: 0, scale: 0.95 },
            { 
                opacity: 1, 
                scale: 1, 
                duration: 0.6, 
                ease: 'power2.out',
                onComplete: () => {
                    mainImage.classList.add('active');
                }
            }
        );

        // Configurar eventos após abertura
        const lightboxOverlay = document.getElementById('lightboxOverlay');
        const closeBtn = document.getElementById('lightboxClose');
        
        lightboxOverlay.addEventListener('click', closeLightbox);
        closeBtn.addEventListener('click', closeLightbox);
        
        const thumbnailsContainer = document.getElementById('thumbnailsContainer');
        thumbnailsContainer.querySelectorAll('.thumbnail-item').forEach(thumb => {
            thumb.addEventListener('click', handleThumbnailClick);
        });
    }

    function closeLightbox() {
        if (!lightboxState.isOpen) return;

        const lightbox = document.getElementById('lightbox');
        const mainImage = document.getElementById('mainImage');

        lightboxState.isOpen = false;
        mainImage.classList.remove('active');
        
        gsap.to(lightbox, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.inOut',
            onComplete: () => {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    function navigateLightbox(direction) {
        lightboxState.currentIndex = (lightboxState.currentIndex + direction + galleryData.length) % galleryData.length;
        updateMainImage(lightboxState.currentIndex);
    }

    function updateMainImage(index) {
        const newSrc = galleryData[index].imageUrl;
        const mainImage = document.getElementById('mainImage');

        gsap.to(mainImage, {
            opacity: 0,
            scale: 0.98,
            duration: 0.3,
            ease: 'power2.inOut',
            onComplete: () => {
                mainImage.src = newSrc;
                
                gsap.fromTo(mainImage,
                    { opacity: 0, scale: 1.02 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power2.out',
                    }
                );
                
                updateActiveThumbnail(index);
            }
        });
    }

    function updateActiveThumbnail(index) {
        const thumbnails = document.querySelectorAll('.thumbnail-item');
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });

        // Scroll para a thumbnail ativa
        thumbnails[index].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }

    function handleThumbnailClick(e) {
        e.stopPropagation();
        lightboxState.currentIndex = parseInt(e.currentTarget.dataset.index);
        updateMainImage(lightboxState.currentIndex);
    }

    // Carregar GSAP se necessário
    function loadGSAP() {
        if (typeof gsap === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/gsap.min.js';
            document.head.appendChild(script);
        }
    }

    // Iniciar a aplicação
    init();
});

// Adicione esta função junto com as outras
function setupScrollBehavior() {
    const sidebar = document.getElementById('sidebar');
    const sidebarContent = document.querySelector('.sidebar-content');
    const sidebarMinimized = document.querySelector('.sidebar-minimized');
    let lastScroll = 0;
    const scrollThreshold = 100; // Quantidade de scroll antes de minimizar

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > scrollThreshold && currentScroll > lastScroll) {
            // Scroll para baixo - minimizar
            sidebar.classList.add('scrolled');
        } else if (currentScroll < lastScroll) {
            // Scroll para cima - restaurar
            sidebar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Click no ícone minimizado para restaurar
    if (sidebarMinimized) {
        sidebarMinimized.addEventListener('click', () => {
            sidebar.classList.remove('scrolled');
        });
    }
}