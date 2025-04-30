/**
 * =============================================
 * GALERIA DINÂMICA - JAVASCRIPT
 * =============================================
 * 
 * Funcionalidades:
 * 1. Injeção dinâmica dos itens da galeria
 * 2. Filtragem por categorias
 * 3. Controle de animações
 * 4. Integração com Locomotive Scroll
 */

// Dados da galeria (pode ser substituído por uma API)
const galleryData = [
    {
        id: 1,
        title: "Tudo o que você quer ser",
        price: "20.000 DIRHAMS",
        category: "destaque",
        size: "large", // large, medium, wide, small, extra-wide, portrait
        imageUrl: "/img/body/e (3).webp",
        link: "/pages/galeria/galeria.html",
        featured: true
    },
    {
        id: 2,
        title: "India",
        price: "O coração que está em paz vê uma festa em todas as aldeias.",
        category: "paises",
        size: "portrait",
        imageUrl: "/img/india/a (11).jpg",
        link: "/pages/galeria/india.html"
    },
    {
        id: 3,
        title: "Lembre-se daquele dia perfeito",
        price: "15.000 DIRHAMS",
        category: "retratos",
        size: "portrait",
        imageUrl: "/img/body/b (6).webp",
        link: "#"
    },
    {
        id: 3,
        title: "Momentos Eternos",
        price: "18.000 DIRHAMS",
        category: "casamentos",
        size: "wide",
        imageUrl: "/img/body/c (1).webp",
        link: "#"
    },
    {
        id: 4,
        title: "Expressões Únicas",
        price: "12.000 DIRHAMS",
        category: "retratos",
        size: "extra-wide",
        imageUrl: "/img/body/e (4).webp",
        link: "#"
    },
    {
        id: 5,
        title: "Celebração",
        price: "25.000 DIRHAMS",
        category: "eventos",
        size: "small",
        imageUrl: "/img/body/b (3).webp",
        link: "#"
    },
    {
        id: 6,
        title: "Olhares",
        price: "14.000 DIRHAMS",
        category: "retratos",
        size: "medium",
        imageUrl: "/img/body/e (1).jpg",
        link: "#"
    },
    {
        id: 4,
        title: "Expressões Únicas",
        price: "12.000 DIRHAMS",
        category: "retratos",
        size: "extra-wide",
        imageUrl: "/img/body/e (7).webp",
        link: "#"
    },
  
    {
        id: 5,
        title: "Expressões Únicas",
        price: "12.000 DIRHAMS",
        category: "retratos",
        size: "extra-wide",
        imageUrl: "/img/body/e (9).webp",
        link: "#"
 
    }
];

/**
 * Cria o HTML para um item da galeria
 * @param {Object} item - O objeto contendo os dados do item
 * @param {number} index - Índice do item para animação
 * @returns {string} HTML do item
 */
function createGalleryItem(item, index) {
    return `
      <li class="gallery-list__item" 
          data-category="${item.category}" 
          data-size="${item.size}"
          style="--item-index: ${index}">
        <a href="${item.link}" class="gallery-list__card" aria-label="Ver álbum ${item.title}">
          <div class="card">
            <div class="card-thumb">
              <img src="${item.imageUrl}" class="card-image" alt="${item.title}" loading="lazy">
            </div>
            <div class="card-content">
              <h3 class="card-title">${item.title}</h3>
              <span class="card-price">${item.price}</span>
            </div>
          </div>
        </a>
      </li>
    `;
}

/**
 * Renderiza todos os itens da galeria
 */
function renderGallery() {
    const galleryContainer = document.getElementById('gallery-container');

    if (galleryContainer) {
        // Ordena para que os destaques apareçam primeiro
        const sortedData = [...galleryData].sort((a, b) =>
            (b.featured || false) - (a.featured || false)
        );

        galleryContainer.innerHTML = sortedData.map((item, index) =>
            createGalleryItem(item, index)
        ).join('');

        // Atualiza o scroll se estiver usando Locomotive
        if (typeof LocomotiveScroll !== 'undefined') {
            const scroll = new LocomotiveScroll();
            scroll.update();
        }
    }
}

/**
 * Filtra os itens da galeria por categoria
 * @param {string} category - Categoria para filtrar
 */
function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-list__item');
    let visibleCount = 0;

    items.forEach((item, index) => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
            // Ajusta o delay da animação para os itens visíveis
            item.style.animationDelay = `${visibleCount * 0.1}s`;
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Inicializa a galeria quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', () => {
    renderGallery();

    // Adiciona eventos aos botões de filtro
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Adiciona a classe active ao botão clicado
            button.classList.add('active');
            // Filtra a galeria
            filterGallery(button.dataset.filter);
        });
    });

    // Inicializa com o filtro 'all' ativo
    filterGallery('all');

    // Adiciona efeito de hover via JavaScript para melhor controle
    const galleryItems = document.querySelectorAll('.gallery-list__item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.zIndex = '10';
        });

        item.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (!item.matches(':hover')) {
                    item.style.zIndex = '';
                }
            }, 300);
        });
    });

    function setupHoverZoom() {
        const galleryItems = document.querySelectorAll('.gallery-list__item');

        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const size = item.dataset.size;
                // Ajusta o zoom baseado no tamanho do item
                const zoomScale = size === 'large' ? 1.05 :
                    size === 'wide' ? 1.06 :
                        size === 'extra-wide' ? 1.03 : 1.08;

                const img = item.querySelector('.card-image');
                img.style.transform = `scale(${zoomScale})`;
            });

            item.addEventListener('mouseleave', () => {
                const img = item.querySelector('.card-image');
                img.style.transform = 'scale(1)';
            });
        });
    }

    // Chame esta função após renderizar a galeria
    document.addEventListener('DOMContentLoaded', () => {
        renderGallery();
        setupHoverZoom();
        // ... resto do seu código
    });
});

// Integração com Locomotive Scroll
if (typeof LocomotiveScroll !== 'undefined') {
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        getDirection: true,
        multiplier: 0.8 // Suaviza um pouco o scroll
    });

    // Atualiza o scroll quando novos itens são adicionados
    scroll.update();
}