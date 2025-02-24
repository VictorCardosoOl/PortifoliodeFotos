// ==================================================
// 1. CONFIGURAÇÕES GERAIS
// ==================================================

document.addEventListener('DOMContentLoaded', function () {
    // Inicializa AOS (Animate On Scroll)
    AOS.init({
        duration: 800, // Duração das animações
        easing: 'ease-in-out', // Tipo de easing
        once: true, // Animações ocorrem apenas uma vez
    });

    // ==================================================
    // 2. NAVBAR SCROLL
    // ==================================================

    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==================================================
    // 3. MENU MOBILE
    // ==================================================

    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Fechar menu mobile ao clicar em um link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // ==================================================
    // 4. HERO SLIDESHOW
    // ==================================================

    const slides = document.querySelectorAll('.hero-slideshow .slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Troca de slide a cada 5 segundos
    setInterval(nextSlide, 5000);

    // ==================================================
    // 5. SCROLL SUAVE PARA LINKS INTERNOS
    // ==================================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    });

    // ==================================================
    // 6. BARRA DE SCROLL PERSONALIZADA
    // ==================================================

    // Barra de Scroll Personalizada
const scrollThumb = document.querySelector('.c-scrollbar_thumb');

window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = document.documentElement.scrollTop;
    const thumbHeight = (window.innerHeight / scrollHeight) * 100;
    const thumbPosition = (scrollTop / scrollHeight) * 100;

    scrollThumb.style.height = `${thumbHeight}%`;
    scrollThumb.style.transform = `translateY(${thumbPosition}%)`;
});
    // ==================================================
    // 7. INTERNACIONALIZAÇÃO (i18n)
    // ==================================================

    const translations = {
        'pt-BR': {
            home: 'Início',
            albums: 'Álbuns',
            about: 'Sobre',
            contact: 'Contato',
            heroTitle: 'Capturando Momentos, Criando Memórias',
            heroSubtitle: 'Bem-vindo ao meu portfólio fotográfico.',
            exploreAlbums: 'Explorar Álbuns',
            albumsTitle: 'Álbuns',
            album1Title: 'Álbum 1: Retratos',
            album1Description: 'Uma coleção de retratos que capturam a essência das pessoas.',
            album2Title: 'Álbum 2: Casamentos',
            album2Description: 'Momentos especiais de cerimônias e festas de casamento.',
            aboutTitle: 'Sobre Mim',
            aboutDescription: 'Olá! Sou um fotógrafo profissional com mais de 10 anos de experiência, especializado em retratos, casamentos e eventos. Minha paixão é capturar momentos únicos e transformá-los em memórias eternas.',
            testimonialsTitle: 'Depoimentos',
            testimonial1: '"As fotos do nosso casamento foram incríveis! Recomendo muito!"',
            testimonial1Author: '- Maria e João',
            testimonial2: '"Adorei o ensaio de retratos. Foi uma experiência maravilhosa!"',
            testimonial2Author: '- Ana',
            contactTitle: 'Contato',
            terms: 'Termos de Uso',
            privacy: 'Política de Privacidade',
            rights: 'Todos os direitos reservados.',
            language: 'Idioma:',
        },
        'en': {
            home: 'Home',
            albums: 'Albums',
            about: 'About',
            contact: 'Contact',
            heroTitle: 'Capturing Moments, Creating Memories',
            heroSubtitle: 'Welcome to my photography portfolio.',
            exploreAlbums: 'Explore Albums',
            albumsTitle: 'Albums',
            album1Title: 'Album 1: Portraits',
            album1Description: 'A collection of portraits that capture the essence of people.',
            album2Title: 'Album 2: Weddings',
            album2Description: 'Special moments from wedding ceremonies and parties.',
            aboutTitle: 'About Me',
            aboutDescription: 'Hello! I am a professional photographer with over 10 years of experience, specializing in portraits, weddings, and events. My passion is capturing unique moments and turning them into eternal memories.',
            testimonialsTitle: 'Testimonials',
            testimonial1: '"The photos from our wedding were amazing! Highly recommended!"',
            testimonial1Author: '- Maria and João',
            testimonial2: '"I loved the portrait session. It was a wonderful experience!"',
            testimonial2Author: '- Ana',
            contactTitle: 'Contact',
            terms: 'Terms of Use',
            privacy: 'Privacy Policy',
            rights: 'All rights reserved.',
            language: 'Language:',
        },
    };

    const languageSwitcher = document.getElementById('language-switcher');
    languageSwitcher.addEventListener('change', function () {
        const lang = this.value;
        updateLanguage(lang);
    });

    function updateLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = translations[lang][key];
        });
    }

    // Inicializa com o idioma padrão (pt-BR)
    updateLanguage('pt-BR');

    // ==================================================
    // 8. GALERIA DE FOTOS
    // ==================================================

    const galleries = {
        gallery1: [
            { src: 'https://images.pexels.com/photos/4275890/pexels-photo-4275890.jpeg', caption: 'Retrato de uma pessoa sorrindo em um ambiente urbano' },
            { src: 'https://images.pexels.com/photos/1662298/pexels-photo-1662298.jpeg', caption: 'Noivos se beijando em uma cerimônia de casamento' },
            // Adicione mais imagens aqui
        ],
        gallery2: [
            { src: 'https://images.pexels.com/photos/3389528/pexels-photo-3389528.jpeg', caption: 'Cidade 4, 2023' },
            { src: 'https://images.pexels.com/photos/2217366/pexels-photo-2217366.jpeg', caption: 'Cidade 5, 2023' },
            // Adicione mais imagens aqui
        ],
    };

    function openGallery(galleryId) {
        const galleryMasonry = document.getElementById('gallery-masonry');
        galleryMasonry.innerHTML = ''; // Limpa a galeria anterior

        galleries[galleryId].forEach((image, index) => {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('gallery-item');

            const imgElement = document.createElement('img');
            imgElement.src = image.src;
            imgElement.alt = image.caption;
            imgElement.setAttribute('data-caption', image.caption);

            imgContainer.appendChild(imgElement);
            imgContainer.addEventListener('click', () => openPhotoViewer(galleryId, index));

            galleryMasonry.appendChild(imgContainer);
        });

        document.getElementById('gallery-popup').style.display = 'block';
    }

    function openPhotoViewer(galleryId, index) {
        const photoViewer = document.getElementById('photo-viewer');
        const viewerImage = document.getElementById('viewer-image');
        const viewerCaption = document.getElementById('viewer-caption');
        const thumbnailContainer = document.querySelector('.thumbnail-container');
        thumbnailContainer.innerHTML = ''; // Limpa as miniaturas anteriores

        const gallery = galleries[galleryId];
        viewerImage.src = gallery[index].src;
        viewerCaption.textContent = gallery[index].caption;

        gallery.forEach((image, i) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image.src;
            thumbnail.alt = image.caption;
            thumbnail.addEventListener('click', () => {
                viewerImage.src = image.src;
                viewerCaption.textContent = image.caption;
            });
            thumbnailContainer.appendChild(thumbnail);
        });

        photoViewer.style.display = 'block';
    }

    // Fechar galeria e visualizador
    document.getElementById('close-gallery').addEventListener('click', () => {
        document.getElementById('gallery-popup').style.display = 'none';
    });

    document.getElementById('close-photo-viewer').addEventListener('click', () => {
        document.getElementById('photo-viewer').style.display = 'none';
    });

    // Fechar galeria ao clicar fora
    document.getElementById('gallery-popup').addEventListener('click', (e) => {
        if (e.target === document.getElementById('gallery-popup')) {
            document.getElementById('gallery-popup').style.display = 'none';
        }
    });

    // Fechar visualizador de fotos ao clicar fora
    document.getElementById('photo-viewer').addEventListener('click', (e) => {
        if (e.target === document.getElementById('photo-viewer')) {
            document.getElementById('photo-viewer').style.display = 'none';
        }
    });

    // Abrir galeria ao clicar nos álbuns
    document.querySelectorAll('.album-cover').forEach(albumCover => {
        albumCover.addEventListener('click', () => {
            const galleryId = albumCover.getAttribute('data-gallery');
            openGallery(galleryId);
        });
    });
});