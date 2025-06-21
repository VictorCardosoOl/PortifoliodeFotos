import { galleryData } from './data/gallery-data-home'; // Importa os dados

/**
 * Cria o HTML para um item da galeria.
 * @param {object} item - Objeto do item.
 * @returns {string} String de HTML do item.
 */
function createGalleryItem(item) {
    return `
      <li class="gallery-list__item" 
          data-category="${item.category}" 
          data-size="${item.size}">
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
 * Filtra os itens da galeria por categoria.
 * @param {string} category - A categoria para filtrar.
 */
function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-list__item');
    items.forEach(item => {
        const isVisible = category === 'all' || item.dataset.category === category;
        item.style.display = isVisible ? 'block' : 'none';
    });
}

/**
 * Inicializa toda a funcionalidade da galeria.
 * @param {object} scroll - A instância principal do Locomotive Scroll.
 */
export function initGallery(scroll) {
    const galleryContainer = document.getElementById('gallery-container');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (!galleryContainer) return;

    // 1. Renderiza a galeria
    const sortedData = [...galleryData].sort((a, b) => (b.featured || false) - (a.featured || false));
    galleryContainer.innerHTML = sortedData.map(createGalleryItem).join('');

    // 2. APLICA A ATUALIZAÇÃO DO SCROLL (CRÍTICO!)
    // Aguarda um pequeno instante para o DOM ser atualizado antes de chamar o update.
    setTimeout(() => {
        scroll.update();
    }, 100);

    // 3. Configura os filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.dataset.filter;
            filterGallery(category);
            
            // Atualiza o scroll toda vez que o filtro muda a altura
            setTimeout(() => scroll.update(), 100);
        });
    });

    // Inicia com o filtro 'all'
    filterGallery('all');
}