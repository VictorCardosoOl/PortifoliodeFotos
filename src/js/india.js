document.addEventListener('DOMContentLoaded', () => {
    // Dados da galeria
    const galleryData = [
        {
            id: 1,
            title: "Tudo o que você quer ser",
            size: "large",
            imageUrl: "/img/india/a (1).jpg",
            featured: true
        },
        {
            id: 2,
            title: "Tudo o que você quer ser",
            size: "small",
            imageUrl: "/img/india/a (2).jpg",
            featured: true
        },
        {
            id: 3,
            title: "Tudo o que você quer ser",
            size: "small",
            imageUrl: "/img/india/a (3).jpg",
            featured: true
        },
        {
            id: 4,
            title: "Tudo o que você quer ser",
            size: "wide",
            imageUrl: "/img/india/a (4).jpg",
            featured: true
        },
        {
            id: 5,
            title: "Tudo o que você quer ser",
            size: "extra-wide",
            imageUrl: "/img/india/a (5).jpg",
            featured: true
        },
        {
            id: 6,
            title: "Tudo o que você quer ser",
            size: "small",
            imageUrl: "/img/india/a (6).jpg",
            featured: true
        },
    ];

    // Estado do lightbox
    let lightboxState = {
        currentIndex: 0,
        isOpen: false,
        scrollDelay: 150,
        scrollTimeout: null
    };

    // Inicialização
    function init() {
        renderGallery();
        setupLightbox();
        setupEventListeners();
        setupScrollBehavior();
        loadGSAP();
    }

    // Renderizar a galeria
    function renderGallery() {
        const galleryContainer = document.getElementById('gallery-grid');
        if (!galleryContainer) return;

        // Limpa o container se já houver conteúdo
        galleryContainer.innerHTML = '';

        const fragment = document.createDocumentFragment();

        galleryData.forEach((item, index) => {
            const galleryItem = createGalleryItem(item, index);
            fragment.appendChild(galleryItem);
        });

        galleryContainer.appendChild(fragment);
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
        // Remove o lightbox existente se houver
        const existingLightbox = document.getElementById('lightbox');
        if (existingLightbox) existingLightbox.remove();

        const lightboxHTML = `
            <div class="lightbox" id="lightbox">
                <div class="lightbox-overlay" id="lightboxOverlay"></div>
                <div class="lightbox-container">
                    <section class="category-panel">
                        <a href="/index.html" class="back-to-home">Galeria</a>
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
        thumbnailsContainer.innerHTML = ''; // Limpa as miniaturas existentes

        galleryData.forEach((item, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail-item';
            thumb.dataset.index = index;
            thumb.innerHTML = `<img src="${item.imageUrl}" alt="Miniatura ${index + 1}">`;
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

    // Comportamento de scroll
    function setupScrollBehavior() {
        const sidebar = document.getElementById('sidebar');
        let lastScroll = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > scrollThreshold && currentScroll > lastScroll) {
                sidebar.classList.add('scrolled');
            } else if (currentScroll < lastScroll || currentScroll <= scrollThreshold) {
                sidebar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
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

    function handleThumbnailClick(e) {
        e.stopPropagation();
        lightboxState.currentIndex = parseInt(e.currentTarget.dataset.index);
        updateMainImage(lightboxState.currentIndex);
    }

    // Controles do lightbox
    function openLightbox(index) {
        if (lightboxState.isOpen) return;
        
        cleanupLightboxListeners();
        lightboxState.isOpen = true;
        lightboxState.currentIndex = index;
        
        const lightbox = document.getElementById('lightbox');
        const mainImage = document.getElementById('mainImage');
        const thumbnails = document.querySelectorAll('.thumbnail-item');

        mainImage.src = galleryData[index].imageUrl;
        document.body.style.overflow = 'hidden';
        
        updateActiveThumbnail(index);
        
        lightbox.classList.add('active');
        
        // Configurar eventos
        const lightboxOverlay = document.getElementById('lightboxOverlay');
        const closeBtn = document.getElementById('lightboxClose');
        
        lightboxOverlay.addEventListener('click', closeLightbox);
        closeBtn.addEventListener('click', closeLightbox);
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', handleThumbnailClick);
        });

        // Animação com GSAP ou fallback
        if (typeof gsap !== 'undefined') {
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
        } else {
            mainImage.classList.add('active');
        }
    }

    function closeLightbox() {
        if (!lightboxState.isOpen) return;

        const lightbox = document.getElementById('lightbox');
        const mainImage = document.getElementById('mainImage');

        lightboxState.isOpen = false;
        mainImage.classList.remove('active');
        
        if (typeof gsap !== 'undefined') {
            gsap.to(lightbox, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.inOut',
                onComplete: () => {
                    finalizeClose();
                }
            });
        } else {
            finalizeClose();
        }
    }

    function finalizeClose() {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        cleanupLightboxListeners();
    }

    function cleanupLightboxListeners() {
        const lightboxOverlay = document.getElementById('lightboxOverlay');
        const closeBtn = document.getElementById('lightboxClose');
        const thumbnails = document.querySelectorAll('.thumbnail-item');
        
        if (lightboxOverlay) lightboxOverlay.removeEventListener('click', closeLightbox);
        if (closeBtn) closeBtn.removeEventListener('click', closeLightbox);
        
        thumbnails.forEach(thumb => {
            thumb.removeEventListener('click', handleThumbnailClick);
        });
    }

    function navigateLightbox(direction) {
        lightboxState.currentIndex = (lightboxState.currentIndex + direction + galleryData.length) % galleryData.length;
        updateMainImage(lightboxState.currentIndex);
    }

    function updateMainImage(index) {
        const newSrc = galleryData[index].imageUrl;
        const mainImage = document.getElementById('mainImage');

        if (typeof gsap !== 'undefined') {
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
        } else {
            mainImage.src = newSrc;
            updateActiveThumbnail(index);
        }
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