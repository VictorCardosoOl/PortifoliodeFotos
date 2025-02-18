// Proteção de Imagens e Bloqueio de Inspeção
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      showCopyrightMessage(e);
    }
  });
  
  function showCopyrightMessage(e) {
    const msg = document.createElement('div');
    msg.className = 'copyright-message';
    msg.textContent = '© [Seu Nome] - Todos os direitos reservados';
    Object.assign(msg.style, {
      position: 'fixed',
      left: `${e.clientX}px`,
      top: `${e.clientY}px`,
      backgroundColor: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      zIndex: '999999',
      pointerEvents: 'none'
    });
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
  }
  
  // Galeria Modal
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <div class="slider-container"></div>
    </div>
  `;
  document.body.appendChild(modal);
  
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      modal.style.display = 'block';
      const sliderContent = `
        <div class="glide">
          <div class="glide__track" data-glide-el="track">
            <ul class="glide__slides">
              ${Array.from(galleryItems).map(img => `
                <li class="glide__slide">
                  <img src="${img.querySelector('img').src}" alt="${img.querySelector('img').alt}">
                </li>
              `).join('')}
            </ul>
          </div>
          <div class="glide__arrows" data-glide-el="controls">
            <button class="glide__arrow glide__arrow--left" data-glide-dir="<">←</button>
            <button class="glide__arrow glide__arrow--right" data-glide-dir=">">→</button>
          </div>
        </div>
      `;
      modal.querySelector('.slider-container').innerHTML = sliderContent;
      
      new Glide('.glide', {
        type: 'slider',
        startAt: index,
        perView: 1,
        gap: 0
      }).mount();
    });
  });
  
  // Fechar Modal
  modal.querySelector('.close-modal').addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Animação de Scroll
  const sections = document.querySelectorAll('section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  sections.forEach(section => {
    observer.observe(section);
  });

  