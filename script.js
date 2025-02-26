// Inicializa o Locomotive Scroll
const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    lerp: 0.05,
    multiplier: 1.2,
    smartphone: {
        smooth: true,
    },
    tablet: {
        smooth: true,
    },
});

// Sincroniza a scrollbar personalizada com o Locomotive Scroll
const scrollbar = document.querySelector('.c-scrollbar_thumb');

scroll.on('scroll', (instance) => {
    const scrollProgress = instance.scroll.y / (instance.limit.y - window.innerHeight);
    const scrollbarHeight = scrollbar.parentElement.clientHeight * scrollProgress;

    scrollbar.style.transform = `translateY(${scrollbarHeight}px)`;
});