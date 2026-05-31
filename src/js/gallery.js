import { galleryData } from './data/gallery-data-home';

/**
 * Sanitizes input string to prevent XSS (Cross-Site Scripting).
 * @param {string} val - Unsafe string.
 * @returns {string} Sanitized string.
 */
function sanitize(val) {
    if (!val) return '';
    return val
        .toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Creates the HTML markup for a gallery item securely.
 * @param {object} item - Gallery item data.
 * @returns {string} Safe HTML string.
 */
function createGalleryItem(item) {
    if (!item || !item.imageUrl || !item.title) {
        console.warn("Skipping invalid gallery item rendering:", item);
        return '';
    }

    const safeUrl = sanitize(item.imageUrl);
    const safeTitle = sanitize(item.title);
    const safeCategory = sanitize(item.category || 'all');
    const safeSize = sanitize(item.size || 'small');
    const safeLink = sanitize(item.link || '#');
    const safePrice = sanitize(item.price || '');

    return `
      <li class="gallery-list__item" 
          data-category="${safeCategory}" 
          data-size="${safeSize}">
        <a href="${safeLink}" class="gallery-list__card" aria-label="Ver álbum ${safeTitle}">
          <div class="card">
            <div class="card-thumb">
              <img src="${safeUrl}" class="card-image" alt="${safeTitle}" loading="lazy">
            </div>
            <div class="card-content">
              <h3 class="card-title">${safeTitle}</h3>
              <span class="card-price">${safePrice}</span>
            </div>
          </div>
        </a>
      </li>
    `;
}

/**
 * Filters the gallery items visible in the DOM.
 * @param {string} category - Category identifier to show.
 */
function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-list__item');
    items.forEach(item => {
        const itemCategory = item.dataset.category;
        const isVisible = category === 'all' || itemCategory === category;
        item.style.display = isVisible ? 'block' : 'none';
    });
}

/**
 * Initializes the home page gallery component.
 * @param {object} scroll - LocomotiveScroll instance.
 */
export function initGallery(scroll) {
    const galleryContainer = document.getElementById('gallery-container');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (!galleryContainer) return;

    // Render gallery items sorted by featured status
    const sortedData = [...galleryData].sort((a, b) => (b.featured || false) - (a.featured || false));
    galleryContainer.innerHTML = sortedData.map(createGalleryItem).join('');

    // Trigger scroll update after DOM renders
    setTimeout(() => {
        if (scroll && typeof scroll.update === 'function') {
            scroll.update();
        }
    }, 100);

    // Setup filter click interactions
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.dataset.filter || 'all';
            filterGallery(category);
            
            setTimeout(() => {
                if (scroll && typeof scroll.update === 'function') {
                    scroll.update();
                }
            }, 100);
        });
    });

    filterGallery('all');
}