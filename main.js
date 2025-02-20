document.addEventListener('DOMContentLoaded', () => {
    // Proteção de imagens
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG') e.preventDefault();
    });

    // Galeria modal
    const initGallery = () => {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const modal = document.querySelector('.gallery-modal');
        const closeModal = document.querySelector('.close-modal');

        if (!modal || !closeModal) return;

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                modal.style.display = 'block';
                // Implementar lógica do Glide.js aqui
            });
        });

        closeModal.addEventListener('click', () => modal.style.display = 'none');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    };

    initGallery();
});

https://codepen.io/Juxtopposed/pen/MWZWpVQ