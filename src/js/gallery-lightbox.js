import gsap from 'gsap';

/**
 * Escapes HTML characters to prevent XSS.
 * @param {string} str - Raw string.
 * @returns {string} Escaped string.
 */
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export class GalleryLightbox {
  /**
   * @param {Array} galleryData - Array of image objects.
   */
  constructor(galleryData) {
    if (!Array.isArray(galleryData)) {
      throw new Error("Invalid gallery data. Expected an array.");
    }
    this.galleryData = galleryData;
    this.state = {
      currentIndex: 0,
      isOpen: false,
      scrollDelay: 150,
      scrollTimeout: null
    };

    // Bind event handlers
    this.handleImageClick = this.handleImageClick.bind(this);
    this.handleImageKeyDown = this.handleImageKeyDown.bind(this);
    this.handleGlobalKeyDown = this.handleGlobalKeyDown.bind(this);
    this.handleLightboxScroll = this.handleLightboxScroll.bind(this);
    this.handleThumbnailClick = this.handleThumbnailClick.bind(this);
    this.closeLightbox = this.closeLightbox.bind(this);
  }

  init() {
    this.renderGallery();
    this.setupLightbox();
    this.setupEventListeners();
    this.setupScrollBehavior();
  }

  renderGallery() {
    const container = document.getElementById('gallery-grid');
    if (!container) return;

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    this.galleryData.forEach((item, index) => {
      const itemEl = this.createGalleryItem(item, index);
      fragment.appendChild(itemEl);
    });

    container.appendChild(fragment);
  }

  createGalleryItem(item, index) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.dataset.size = escapeHTML(item.size || 'small');
    galleryItem.style.animationDelay = `${index * 0.1}s`;

    const link = document.createElement('div');
    link.className = 'gallery-link';
    link.setAttribute('aria-label', `Ver ${escapeHTML(item.title)}`);
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');

    const img = new Image();
    img.src = escapeHTML(item.imageUrl);
    img.className = 'gallery-image';
    img.alt = escapeHTML(item.title);
    img.loading = 'lazy';
    img.dataset.index = index;

    link.appendChild(img);

    if (item.title) {
      const caption = document.createElement('div');
      caption.className = 'gallery-caption';
      
      const title = document.createElement('h3');
      title.className = 'caption-title';
      title.textContent = item.title; // Safe textContent
      
      caption.appendChild(title);
      link.appendChild(caption);
    }

    galleryItem.appendChild(link);
    return galleryItem;
  }

  setupLightbox() {
    const existing = document.getElementById('lightbox');
    if (existing) existing.remove();

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
          <button class="lightbox-close" id="lightboxClose" aria-label="Fechar galeria">&times;</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    this.populateThumbnails();
    this.setupLightboxElements();
  }

  populateThumbnails() {
    const container = document.getElementById('thumbnailsContainer');
    if (!container) return;
    container.innerHTML = '';

    this.galleryData.forEach((item, index) => {
      const thumb = document.createElement('div');
      thumb.className = 'thumbnail-item';
      thumb.dataset.index = index;
      
      const img = new Image();
      img.src = escapeHTML(item.imageUrl);
      img.alt = `Miniatura ${index + 1}`;
      
      thumb.appendChild(img);
      container.appendChild(thumb);
    });
  }

  setupLightboxElements() {
    const images = document.querySelectorAll('.gallery-image');
    images.forEach(img => {
      img.addEventListener('click', this.handleImageClick);
      img.addEventListener('keydown', this.handleImageKeyDown);
    });
  }

  setupEventListeners() {
    document.addEventListener('keydown', this.handleGlobalKeyDown);
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.addEventListener('wheel', this.handleLightboxScroll, { passive: false });
    }
  }

  setupScrollBehavior() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScroll > scrollThreshold && currentScroll > lastScroll) {
        sidebar.classList.add('scrolled');
      } else if (currentScroll < lastScroll || currentScroll <= scrollThreshold) {
        sidebar.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });

    const sidebarMinimized = document.querySelector('.sidebar-minimized');
    if (sidebarMinimized) {
      sidebarMinimized.addEventListener('click', () => {
        sidebar.classList.remove('scrolled');
      });
    }
  }

  handleImageClick(e) {
    const index = parseInt(e.target.dataset.index, 10);
    this.openLightbox(index);
  }

  handleImageKeyDown(e) {
    if (e.key === 'Enter') {
      const index = parseInt(e.target.dataset.index, 10);
      this.openLightbox(index);
    }
  }

  handleGlobalKeyDown(e) {
    if (!this.state.isOpen) return;

    switch (e.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowLeft':
        this.navigateLightbox(-1);
        break;
      case 'ArrowRight':
        this.navigateLightbox(1);
        break;
    }
  }

  handleLightboxScroll(e) {
    e.preventDefault();
    clearTimeout(this.state.scrollTimeout);
    this.state.scrollTimeout = setTimeout(() => {
      const direction = e.deltaY > 0 ? 1 : -1;
      this.navigateLightbox(direction);
    }, this.state.scrollDelay);
  }

  handleThumbnailClick(e) {
    e.stopPropagation();
    const index = parseInt(e.currentTarget.dataset.index, 10);
    this.updateMainImage(index);
  }

  openLightbox(index) {
    if (this.state.isOpen) return;

    this.state.isOpen = true;
    this.state.currentIndex = index;

    const lightbox = document.getElementById('lightbox');
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail-item');

    if (!lightbox || !mainImage) return;

    mainImage.src = escapeHTML(this.galleryData[index].imageUrl);
    document.body.style.overflow = 'hidden';

    this.updateActiveThumbnail(index);
    lightbox.classList.add('active');

    const overlay = document.getElementById('lightboxOverlay');
    const closeBtn = document.getElementById('lightboxClose');

    if (overlay) overlay.addEventListener('click', this.closeLightbox);
    if (closeBtn) closeBtn.addEventListener('click', this.closeLightbox);

    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', this.handleThumbnailClick);
    });

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
  }

  closeLightbox() {
    if (!this.state.isOpen) return;

    const lightbox = document.getElementById('lightbox');
    const mainImage = document.getElementById('mainImage');

    if (!lightbox || !mainImage) return;

    this.state.isOpen = false;
    mainImage.classList.remove('active');

    gsap.to(lightbox, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: () => {
        lightbox.classList.remove('active');
        lightbox.style.opacity = ''; // Reset opacity style
        document.body.style.overflow = '';
        this.cleanupLightboxListeners();
      }
    });
  }

  cleanupLightboxListeners() {
    const overlay = document.getElementById('lightboxOverlay');
    const closeBtn = document.getElementById('lightboxClose');
    const thumbnails = document.querySelectorAll('.thumbnail-item');

    if (overlay) overlay.removeEventListener('click', this.closeLightbox);
    if (closeBtn) closeBtn.removeEventListener('click', this.closeLightbox);

    thumbnails.forEach(thumb => {
      thumb.removeEventListener('click', this.handleThumbnailClick);
    });
  }

  navigateLightbox(direction) {
    const total = this.galleryData.length;
    this.state.currentIndex = (this.state.currentIndex + direction + total) % total;
    this.updateMainImage(this.state.currentIndex);
  }

  updateMainImage(index) {
    this.state.currentIndex = index;
    const newSrc = this.galleryData[index].imageUrl;
    const mainImage = document.getElementById('mainImage');
    if (!mainImage) return;

    gsap.to(mainImage, {
      opacity: 0,
      scale: 0.98,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: () => {
        mainImage.src = escapeHTML(newSrc);
        gsap.fromTo(mainImage,
          { opacity: 0, scale: 1.02 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
          }
        );
        this.updateActiveThumbnail(index);
      }
    });
  }

  updateActiveThumbnail(index) {
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });

    const activeThumb = thumbnails[index];
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }
}
