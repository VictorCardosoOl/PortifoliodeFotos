

// Dados da galeria
const galleryData = [
    {
        id: 1,
        title: "Tudo o que você quer ser",
        size: "large",
        imageUrl: "/img/1galeria/a (2).webp",
        link: "/pages/galeria/visualizador/1visualizador.html",
        featured: true
    },
    {
        id: 2,
        title: "Lembre-se daquele dia perfeito",
        size: "portrait",
        imageUrl: "/img/1galeria/b (6).webp",
        link: "visualizador.html?id=2"
    },
    {
        id: 3,
        title: "Momentos Eternos",
        size: "wide",
        imageUrl: "/img/1galeria/c (1).webp",
        link: "visualizador.html?id=3"
    },
    {
        id: 4,
        title: "Expressões Únicas",
        size: "extra-wide",
        imageUrl: "/img/1galeria/c (4).webp",
        link: "visualizador.html?id=4"
    },
    {
        id: 5,
        title: "Celebração",
        size: "small",
        imageUrl: "/img/1galeria/b (3).webp",
        link: "visualizador.html?id=5"
    },
    {
        id: 6,
        title: "Olhares",
        size: "medium",
        imageUrl: "/img/1galeria/c (3).webp",
        link: "visualizador.html?id=6"
    }
];

// No scriptsG1.js, substitua a função renderGallery por esta versão atualizada
function renderGallery() {
    const galleryContainer = document.getElementById('gallery-grid');
    
    if (galleryContainer && !galleryContainer.hasChildNodes()) {
        const fragment = document.createDocumentFragment();
        
        galleryData.forEach((item, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.dataset.size = item.size;
            galleryItem.style.animationDelay = `${index * 0.1}s`;
            
            const link = document.createElement('div'); // Mudamos para div pois não será mais um link
            link.className = 'gallery-link';
            link.setAttribute('aria-label', `Ver ${item.title}`);
            link.setAttribute('role', 'button');
            link.setAttribute('tabindex', '0');
            
            const img = new Image();
            img.src = item.imageUrl;
            img.className = 'gallery-image';
            img.alt = item.title;
            img.loading = 'lazy';
            
            // Adiciona evento de clique para abrir o visualizador
            link.addEventListener('click', () => {
                openViewerPopup(index);
            });
            
            // Permite abrir com Enter também
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    openViewerPopup(index);
                }
            });
            
            link.appendChild(img);
            
            // Adiciona caption se existir título
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
    }
}

// Função para abrir o visualizador como popup
function openViewerPopup(startIndex) {
    // Cria o container do popup
    const popup = document.createElement('div');
    popup.id = 'viewer-popup';
    popup.className = 'viewer-popup';
    
    // Cria o overlay de fundo
    const overlay = document.createElement('div');
    overlay.className = 'viewer-overlay';
    
    // Cria o container do visualizador
    const viewerContainer = document.createElement('div');
    viewerContainer.className = 'viewer-container';
    
    // Adiciona a estrutura do visualizador (similar ao 1visualizador.html)
    viewerContainer.innerHTML = `
        <div class="viewer-content">
            <button class="viewer-close">&times;</button>
            <div class="main-viewer">
                <img class="main-image active" id="popupMainImage" src="${galleryData[startIndex].imageUrl}" alt="Visualização Principal">
            </div>
            <div class="thumbnails-container" id="popupThumbnailsContainer">
                ${galleryData.map((item, index) => `
                    <div class="thumbnail-item ${index === startIndex ? 'active' : ''}" data-index="${index}">
                        <img src="${item.imageUrl}" data-full="${item.imageUrl}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    popup.appendChild(overlay);
    popup.appendChild(viewerContainer);
    document.body.appendChild(popup);
    document.body.style.overflow = 'hidden'; // Impede scroll da página principal
    
    // Inicializa as funcionalidades do visualizador
    initViewerPopup(startIndex);
}

// Função para inicializar as interações do popup
function initViewerPopup(startIndex) {
    const popup = document.getElementById('viewer-popup');
    const overlay = popup.querySelector('.viewer-overlay');
    const closeBtn = popup.querySelector('.viewer-close');
    const mainImage = popup.querySelector('#popupMainImage');
    const thumbnailsContainer = popup.querySelector('#popupThumbnailsContainer');
    const thumbnails = popup.querySelectorAll('.thumbnail-item');
    let activeIndex = startIndex;
    
    // Fecha o popup ao clicar no overlay ou no botão de fechar
    overlay.addEventListener('click', closeViewerPopup);
    closeBtn.addEventListener('click', closeViewerPopup);
    
    // Navegação pelas imagens
    function updateMainImage(index) {
        const newSrc = galleryData[index].imageUrl;
        
        // Animação de transição
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
            }
        });
        
        // Atualiza thumbnails ativas
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
    
    // Eventos para thumbnails
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', (e) => {
            e.stopPropagation();
            activeIndex = index;
            updateMainImage(activeIndex);
        });
    });
    
    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeViewerPopup();
        } else if (e.key === 'ArrowLeft') {
            activeIndex = (activeIndex - 1 + galleryData.length) % galleryData.length;
            updateMainImage(activeIndex);
        } else if (e.key === 'ArrowRight') {
            activeIndex = (activeIndex + 1) % galleryData.length;
            updateMainImage(activeIndex);
        }
    });
    
    // Navegação por scroll do mouse
    popup.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const direction = e.deltaY > 0 ? 1 : -1;
        activeIndex = (activeIndex + direction + galleryData.length) % galleryData.length;
        
        updateMainImage(activeIndex);
    });
}

// Fecha o visualizador
function closeViewerPopup() {
    const popup = document.getElementById('viewer-popup');
    if (popup) {
        gsap.to(popup, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.inOut',
            onComplete: () => {
                document.body.removeChild(popup);
                document.body.style.overflow = '';
            }
        });
    }
}

// Scroll suave para o topo
function scrollToTop() {
    const targetPosition = 0;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function easeInOutQuad(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Mantém o layout consistente durante o scroll
function maintainLayout() {
    const galleryGrid = document.getElementById('gallery-grid');
    let isScrolled = false;
    
    function updateLayout() {
        if (window.scrollY > 100 && !isScrolled) {
            isScrolled = true;
            galleryGrid.style.transition = 'width 0.5s ease, margin-left 0.5s ease';
            galleryGrid.style.width = 'calc(100% - 80px)';
        } else if (window.scrollY <= 100 && isScrolled) {
            isScrolled = false;
            galleryGrid.style.transition = 'width 0.5s ease, margin-left 0.5s ease';
            galleryGrid.style.width = '100%';
        }
    }
    
    // Debounce para melhor performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateLayout();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Inicializa o layout
    updateLayout();
}

// Efeito de scroll com debounce para melhor performance
function setupScrollEffect() {
    let ticking = false;
    
    function update() {
        if (window.scrollY > 100) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    });
}


// Inicialização otimizada
function init() {
    renderGallery();
    setupScrollEffect();
    setupLogoClick();
    maintainLayout();
    
    // Verifica o estado do scroll ao carregar
    if (window.scrollY > 100) {
        document.body.classList.add('scrolled');
    }
}

// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', init);