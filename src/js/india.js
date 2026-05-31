import { galleryData } from './data/gallery-data-india';
import { GalleryLightbox } from './gallery-lightbox';

document.addEventListener('DOMContentLoaded', () => {
  const gallery = new GalleryLightbox(galleryData);
  gallery.init();
});