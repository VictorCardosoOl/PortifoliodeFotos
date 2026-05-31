import LocomotiveScroll from 'locomotive-scroll';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// 120Hz: Set GSAP ticker before anything runs
// ─────────────────────────────────────────────
gsap.ticker.fps(120);
gsap.ticker.lagSmoothing(0);

/**
 * Initializes Locomotive Scroll and creates a correct, zero-lag
 * ScrollTrigger proxy. Eliminates the setTimeout debounce that
 * caused the scroll jank between sections.
 *
 * @returns {LocomotiveScroll|null} scroll instance or null on failure.
 */
export const initLocomotiveScroll = () => {
  const scrollContainer = document.querySelector('[data-scroll-container]');
  if (!scrollContainer) {
    console.error('[scroll] [data-scroll-container] element not found.');
    return null;
  }

  const scroll = new LocomotiveScroll({
    el: scrollContainer,
    smooth: true,
    inertia: 0.65,
    smartphone: { smooth: false },
    tablet:     { smooth: false },
    getDirection: true,
    multiplier: 0.9,
  });

  // ── Correct ScrollTrigger proxy ──────────────────────────────────
  // NOTE: We do NOT use setTimeout here. The previous approach
  // (debounced setTimeout) introduced 100ms of lag per scroll event,
  // causing the "stutter" between sections. Instead, we call
  // ScrollTrigger.update() synchronously on every scroll event via
  // the direct reference — this is the idiomatic GSAP + Locomotive
  // integration pattern.
  ScrollTrigger.scrollerProxy(scrollContainer, {
    scrollTop(value) {
      if (arguments.length) {
        scroll.scrollTo(value, { duration: 0, disableLerp: true });
        return;
      }
      return scroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: scrollContainer.style.transform ? 'transform' : 'fixed',
  });

  // Direct sync — no timeout, no lag
  scroll.on('scroll', ScrollTrigger.update);

  // When ScrollTrigger re-calculates positions, sync Locomotive
  ScrollTrigger.addEventListener('refresh', () => scroll.update());

  // Refresh after all images are fully loaded
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    scroll.update();
  }, { once: true, passive: true });

  return scroll;
};

/**
 * Section entrance animations moved to animations.js for centralized
 * 120Hz control. This function is kept as a no-op for backwards compat.
 */
export const setupSectionAnimations = () => {};

/**
 * Scrolls to the URL hash target after page load.
 * @param {LocomotiveScroll} scroll
 * @param {HTMLElement} navbar
 */
export const handleHashLinks = (scroll, navbar) => {
  if (!window.location.hash || !scroll || !navbar) return;

  const target = document.querySelector(window.location.hash);
  if (!target) return;

  setTimeout(() => {
    scroll.scrollTo(target, {
      offset: -navbar.offsetHeight,
      duration: 0,
      disableLerp: true,
    });
  }, 200);
};
