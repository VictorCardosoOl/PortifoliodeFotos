export class ShoppingCart {
  constructor() {
    this.selectedPhotos = JSON.parse(localStorage.getItem('vc_cart') || '[]');
    this.whatsappNumber = '5511977440146';
    
    this.initUI();
    this.updateCartUI();
  }

  initUI() {
    // Add floating cart button
    const cartHTML = `
      <div id="floating-cart" class="floating-cart" aria-label="Carrinho de Compras" role="button" tabindex="0">
        <i class="fas fa-shopping-bag"></i>
        <span class="cart-count">0</span>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', cartHTML);

    this.cartBtn = document.getElementById('floating-cart');
    this.countEl = this.cartBtn.querySelector('.cart-count');

    this.cartBtn.addEventListener('click', () => this.checkout());
    this.cartBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.checkout();
    });
  }

  togglePhoto(photo) {
    const index = this.selectedPhotos.findIndex(p => p.id === photo.id);
    if (index > -1) {
      this.selectedPhotos.splice(index, 1);
    } else {
      this.selectedPhotos.push(photo);
    }
    
    localStorage.setItem('vc_cart', JSON.stringify(this.selectedPhotos));
    this.updateCartUI();
    return index === -1; // returns true if added, false if removed
  }

  isPhotoSelected(id) {
    return this.selectedPhotos.some(p => p.id === id);
  }

  updateCartUI() {
    const count = this.selectedPhotos.length;
    this.countEl.textContent = count;
    
    if (count > 0) {
      this.cartBtn.classList.add('visible');
    } else {
      this.cartBtn.classList.remove('visible');
    }
  }

  checkout() {
    if (this.selectedPhotos.length === 0) return;

    let message = 'Olá Victor! Gostaria de adquirir as seguintes fotos do portfólio:%0A%0A';
    
    this.selectedPhotos.forEach((photo, i) => {
      message += `${i + 1}. ${photo.title} (ID: ${photo.id})%0A`;
    });

    const url = `https://wa.me/${this.whatsappNumber}?text=${message}`;
    window.open(url, '_blank');
  }
}

export const cart = new ShoppingCart();
