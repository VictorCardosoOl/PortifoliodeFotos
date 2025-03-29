

// Dados da galeria
const galleryData = [
    {
        id: 1,
        title: "Tudo o que você quer ser",
        size: "large",
        imageUrl: "../img/A/a (2).webp",
        link: "visualizador.html?id=1",
        featured: true
    },
    {
        id: 2,
        title: "Lembre-se daquele dia perfeito",
        size: "portrait",
        imageUrl: "../img/A/b (6).webp",
        link: "visualizador.html?id=2"
    },
    {
        id: 3,
        title: "Momentos Eternos",
        size: "wide",
        imageUrl: "../img/A/c (1).webp",
        link: "visualizador.html?id=3"
    },
    {
        id: 4,
        title: "Expressões Únicas",
        size: "extra-wide",
        imageUrl: "../img/A/c (4).webp",
        link: "visualizador.html?id=4"
    },
    {
        id: 5,
        title: "Celebração",
        size: "small",
        imageUrl: "../img/A/b (3).webp",
        link: "visualizador.html?id=5"
    },
    {
        id: 6,
        title: "Olhares",
        size: "medium",
        imageUrl: "../img/A/c (3).webp",
        link: "visualizador.html?id=6"
    }
];

// Função para renderizar a galeria de forma otimizada
function renderGallery() {
    const galleryContainer = document.getElementById('gallery-grid');
    
    if (galleryContainer && !galleryContainer.hasChildNodes()) {
        // Usando DocumentFragment para melhor performance
        const fragment = document.createDocumentFragment();
        
        galleryData.forEach((item, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.dataset.size = item.size;
            galleryItem.style.animationDelay = `${index * 0.1}s`;
            
            const link = document.createElement('a');
            link.href = item.link;
            link.className = 'gallery-link';
            link.setAttribute('aria-label', `Ver ${item.title}`);
            
            const img = new Image();
            img.src = item.imageUrl;
            img.className = 'gallery-image';
            img.alt = item.title;
            img.loading = 'lazy';
            
            link.appendChild(img);
            galleryItem.appendChild(link);
            fragment.appendChild(galleryItem);
        });
        
        galleryContainer.appendChild(fragment);
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