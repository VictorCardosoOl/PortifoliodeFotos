import { initLocomotiveScroll, setupSectionAnimations, handleHashLinks } from './locomotive-scroll';
import { initCustomCursor } from './custom-cursor';
import { setupNavbarScrollBehavior, setupMobileMenu, setupSmoothLinks } from './navbar-menu';
import { initGallery } from './gallery'; // Importa a nova função da galeria
import AOS from 'aos';
import 'aos/dist/aos.css';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa AOS (opcional, veja otimização abaixo)
    AOS.init({
        duration: 800,
        easing: 'ease-out-quart',
        once: true,
        disable: window.innerWidth < 768
    });

    // 1. INICIALIZA O LOCOMOTIVE SCROLL (APENAS UMA VEZ!)
    const scroll = initLocomotiveScroll();

    // 2. INICIALIZA OS OUTROS MÓDULOS, PASSANDO A INSTÂNCIA DO SCROLL
    initGallery(scroll); // Inicializa a galeria
    initCustomCursor(); // Cursor não depende do scroll
    setupSectionAnimations(); // Animações de seção

    const navbar = document.getElementById('navbar');
    if (navbar) {
        // Unifica os estados do menu e do scroll da navbar
        const menuAndScrollState = {
            ...setupNavbarScrollBehavior(scroll, navbar),
            ...setupMobileMenu()
        };
        setupSmoothLinks(scroll, navbar, menuAndScrollState);
    }
    
    // 3. LIDAR COM EVENTOS GLOBAIS
    window.addEventListener('load', () => {
        // O evento 'load' garante que todas as imagens foram carregadas.
        // Uma atualização final aqui garante a altura perfeita.
        scroll.update(); 
        if (navbar) handleHashLinks(scroll, navbar);
    });
});