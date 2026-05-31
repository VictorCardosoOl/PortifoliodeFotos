import { galleryData } from './data/gallery-data-tudo';
import { GalleryLightbox } from './gallery-lightbox';

document.addEventListener('DOMContentLoaded', () => {
  const gallery = new GalleryLightbox(galleryData);
  gallery.init();
});