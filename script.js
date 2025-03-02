document.addEventListener("DOMContentLoaded", function () {
    const scrollContainer = document.querySelector('[data-scroll-container]');
    const scroll = new LocomotiveScroll({
        el: scrollContainer,
        smooth: true,
        lerp: 0.08,
        multiplier: 0.8,
        smartphone: { smooth: true },
        tablet: { smooth: true },
    });

    const scrollbarThumb = document.querySelector('.c-scrollbar_thumb');
    const scrollbarTrack = document.querySelector('.c-scrollbar');

    const updateScrollbar = (instance) => {
        const scrollProgress = instance.scroll.y / instance.limit.y;
        const trackHeight = scrollbarTrack.offsetHeight;
        const thumbHeight = scrollbarThumb.offsetHeight;
        const maxScroll = trackHeight - thumbHeight;
        scrollbarThumb.style.transform = `translateY(${scrollProgress * maxScroll}px)`;
    };

    scroll.on('scroll', (instance) => {
        updateScrollbar(instance);
    });

    window.addEventListener('resize', () => {
        scroll.update();
        updateScrollbar(scroll);
    });

    setTimeout(() => {
        scroll.update();
    }, 1000);
});