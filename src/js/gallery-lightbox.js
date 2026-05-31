import gsap from 'gsap';

/**
 * Sanitizes a value to prevent XSS when used in HTML attributes or content.
 * @param {string} val
 * @returns {string}
 */
function sanitize(val) {
  if (!val) return '';
  return val.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export class GalleryLightbox {
  /**
   * @param {Array<{id: number, imageUrl: string, title: string, size?: string}>} galleryData
   */
  constructor(galleryData) {
    if (!Array.isArray(galleryData) || galleryData.length === 0) {
      throw new Error('[GalleryLightbox] galleryData must be a non-empty array.');
    }

    this.galleryData = galleryData;
    this.state = {
      currentIndex: 0,
      isOpen: false,
      scrollDelay: 120,
      scrollTimeout: null,
    };

    // Bind event handlers once so we can add/remove them cleanly
    this.handleImageClick      = this.handleImageClick.bind(this);
    this.handleImageKeyDown    = this.handleImageKeyDown.bind(this);
    this.handleGlobalKeyDown   = this.handleGlobalKeyDown.bind(this);
    this.handleLightboxScroll  = this.handleLightboxScroll.bind(this);
    this.handleThumbnailClick  = this.handleThumbnailClick.bind(this);
    this.closeLightbox         = this.closeLightbox.bind(this);
  }

  init() {
    this.renderGallery();
    this.setupLightbox();
    this.setupEventListeners();
    this.setupScrollBehavior();
  }

  // ── Rendering ──────────────────────────────────────────────────────

  renderGallery() {
    const container = document.getElementById('gallery-grid');
    if (!container) return;

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    this.galleryData.forEach((item, index) => {
      fragment.appendChild(this.createGalleryItem(item, index));
    });

    container.appendChild(fragment);
  }

  createGalleryItem(item, index) {
    const el = document.createElement('div');
    el.className = 'gallery-item';
    el.dataset.size = sanitize(item.size || 'small');
    el.style.animationDelay = `${index * 0.08}s`;

    const link = document.createElement('div');
    link.className = 'gallery-link';
    link.setAttribute('aria-label', `Ver foto: ${sanitize(item.title)}`);
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');

    const img = new Image();
    img.src = sanitize(item.imageUrl);
    img.className = 'gallery-image';
    img.alt = sanitize(item.title);
    img.loading = 'lazy';
    img.dataset.index = index;

    link.appendChild(img);

    if (item.title) {
      const caption = document.createElement('div');
      caption.className = 'gallery-caption';
      const title = document.createElement('h3');
      title.className = 'caption-title';
      title.textContent = item.title; // textContent is XSS-safe
      caption.appendChild(title);
      link.appendChild(caption);
    }

    el.appendChild(link);
    return el;
  }

  // ── Lightbox setup ─────────────────────────────────────────────────

  setupLightbox() {
    const existing = document.getElementById('lightbox');
    if (existing) existing.remove();

    // FIXED: Lightbox uses visibility+opacity instead of display:none.
    // The previous display:none → display:flex jump made GSAP unable to
    // interpolate the opacity, causing the jarring "snap in" animation.
    const lightboxHTML = `
      <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Visualizador de imagens">
        <div class="lightbox-overlay" id="lightboxOverlay"></div>
        <div class="lightbox-container">
          <section class="category-panel">
            <a href="/index.html" class="back-to-home">Galeria</a>
          </section>
          <section class="main-viewer">
            <img class="main-image" id="mainImage" src="" alt="Visualização Principal">
          </section>
          <section class="thumbnails-container" id="thumbnailsContainer" aria-label="Miniaturas"></section>
          <button class="lightbox-close" id="lightboxClose" aria-label="Fechar galeria">&times;</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    // Set initial state via GSAP (not CSS) for consistent animation baseline
    gsap.set('#lightbox', { opacity: 0, visibility: 'hidden', pointerEvents: 'none' });

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
      img.src = sanitize(item.imageUrl);
      img.alt = `Miniatura ${index + 1}`;
      img.loading = 'lazy';

      thumb.appendChild(img);
      container.appendChild(thumb);
    });
  }

  setupLightboxElements() {
    document.querySelectorAll('.gallery-image').forEach(img => {
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
    const SCROLL_THRESHOLD = 100;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      if (currentScroll > SCROLL_THRESHOLD && currentScroll > lastScroll) {
        sidebar.classList.add('scrolled');
      } else if (currentScroll < lastScroll || currentScroll <= SCROLL_THRESHOLD) {
        sidebar.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });

    const sidebarMinimized = document.querySelector('.sidebar-minimized');
    if (sidebarMinimized) {
      sidebarMinimized.addEventListener('click', () => sidebar.classList.remove('scrolled'));
    }
  }

  // ── Event handlers ─────────────────────────────────────────────────

  handleImageClick(e) {
    const index = parseInt(e.target.dataset.index, 10);
    if (!isNaN(index)) this.openLightbox(index);
  }

  handleImageKeyDown(e) {
    if (e.key !== 'Enter') return;
    const index = parseInt(e.target.dataset.index, 10);
    if (!isNaN(index)) this.openLightbox(index);
  }

  handleGlobalKeyDown(e) {
    if (!this.state.isOpen) return;
    const actions = {
      Escape:     () => this.closeLightbox(),
      ArrowLeft:  () => this.navigateLightbox(-1),
      ArrowRight: () => this.navigateLightbox(1),
    };
    actions[e.key]?.();
  }

  handleLightboxScroll(e) {
    e.preventDefault();
    clearTimeout(this.state.scrollTimeout);
    this.state.scrollTimeout = setTimeout(() => {
      this.navigateLightbox(e.deltaY > 0 ? 1 : -1);
    }, this.state.scrollDelay);
  }

  handleThumbnailClick(e) {
    e.stopPropagation();
    const index = parseInt(e.currentTarget.dataset.index, 10);
    if (!isNaN(index)) this.updateMainImage(index);
  }

  // ── Lightbox controls ──────────────────────────────────────────────

  openLightbox(index) {
    if (this.state.isOpen) return;

    this.state.isOpen = true;
    this.state.currentIndex = index;

    const lightbox  = document.getElementById('lightbox');
    const mainImage = document.getElementById('mainImage');
    if (!lightbox || !mainImage) return;

    // GSAP sets initial image state before it becomes visible
    gsap.set(mainImage, { opacity: 0, scale: 0.97 });
    mainImage.src = sanitize(this.galleryData[index].imageUrl);
    document.body.style.overflow = 'hidden';

    this.updateActiveThumbnail(index);

    // FIXED: visibility:visible + GSAP opacity fade — no display:none jump
    gsap.to(lightbox, {
      opacity: 1,
      visibility: 'visible',
      pointerEvents: 'auto',
      duration: 0.45,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(mainImage, { opacity: 1, scale: 1, duration: 0.55, ease: 'power3.out' });
      }
    });

    const overlay  = document.getElementById('lightboxOverlay');
    const closeBtn = document.getElementById('lightboxClose');
    if (overlay)  overlay.addEventListener('click', this.closeLightbox);
    if (closeBtn) closeBtn.addEventListener('click', this.closeLightbox);

    document.querySelectorAll('.thumbnail-item').forEach(thumb => {
      thumb.addEventListener('click', this.handleThumbnailClick);
    });
  }

  closeLightbox() {
    if (!this.state.isOpen) return;

    const lightbox  = document.getElementById('lightbox');
    const mainImage = document.getElementById('mainImage');
    if (!lightbox || !mainImage) return;

    this.state.isOpen = false;

    gsap.to(mainImage, { opacity: 0, scale: 0.97, duration: 0.25, ease: 'power2.in' });
    gsap.to(lightbox, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      delay: 0.1,
      onComplete: () => {
        gsap.set(lightbox, { visibility: 'hidden', pointerEvents: 'none' });
        document.body.style.overflow = '';
        this.cleanupLightboxListeners();
      }
    });
  }

  cleanupLightboxListeners() {
    const overlay  = document.getElementById('lightboxOverlay');
    const closeBtn = document.getElementById('lightboxClose');

    if (overlay)  overlay.removeEventListener('click', this.closeLightbox);
    if (closeBtn) closeBtn.removeEventListener('click', this.closeLightbox);

    document.querySelectorAll('.thumbnail-item').forEach(thumb => {
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
    const mainImage = document.getElementById('mainImage');
    if (!mainImage) return;

    gsap.to(mainImage, {
      opacity: 0,
      scale: 0.97,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        mainImage.src = sanitize(this.galleryData[index].imageUrl);
        gsap.to(mainImage, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' });
        this.updateActiveThumbnail(index);
      }
    });
  }

  updateActiveThumbnail(index) {
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    thumbnails.forEach((thumb, i) => thumb.classList.toggle('active', i === index));

    const active = thumbnails[index];
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }
}
