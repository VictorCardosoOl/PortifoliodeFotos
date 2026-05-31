import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── 120Hz mode: must be set before any animation runs ──────────────
gsap.ticker.fps(120);
gsap.ticker.lagSmoothing(0);

// ── Reduced-motion guard ───────────────────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Helpers ────────────────────────────────────────────────────────

/**
 * Creates a ScrollTrigger that fires once when the element enters view.
 * @param {Element|string} trigger
 * @param {string} scroller
 * @param {Function} onEnter
 * @param {string} [start='top 78%']
 */
function onScrollEnter(trigger, onEnter, start = 'top 78%') {
  ScrollTrigger.create({ trigger, start, once: true, onEnter });
}

// ─────────────────────────────────────────────────────────────────
// 1. HERO ENTRANCE — Editorial staggered reveal
// ─────────────────────────────────────────────────────────────────

/**
 * Orchestrates the hero entrance animation.
 * Plays immediately on page load (not scroll-triggered).
 */
export function animateHeroEntrance() {
  if (prefersReducedMotion) {
    gsap.set(
      ['.hero-meta-line', '.hero-meta-text', '.hero-title-inner',
       '.hero-subtitle', '.hero-cta-link', '.hero-scroll-indicator', '.hero-corner-info'],
      { opacity: 1, y: 0, scaleX: 1 }
    );
    return;
  }

  // Set starting states
  gsap.set('.hero-title-inner',       { y: '105%' });
  gsap.set('.hero-meta-line',         { scaleX: 0, transformOrigin: 'left center' });
  gsap.set('.hero-meta-text',         { opacity: 0, y: 8 });
  gsap.set('.hero-subtitle',          { opacity: 0, y: 12 });
  gsap.set('.hero-cta-link',          { opacity: 0, y: 10 });
  gsap.set('.hero-scroll-indicator',  { opacity: 0 });
  gsap.set('.hero-corner-info',       { opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.15 });

  tl
    .to('.hero-meta-line',   { scaleX: 1, duration: 1.1 })
    .to('.hero-meta-text',   { opacity: 1, y: 0, duration: 0.9 }, '-=0.65')
    .to('.hero-title-inner', { y: '0%', duration: 1.4, stagger: 0.18 }, '-=0.55')
    .to('.hero-subtitle',    { opacity: 1, y: 0, duration: 1.0 }, '-=1.0')
    .to('.hero-cta-link',    { opacity: 1, y: 0, duration: 0.8 }, '-=0.75')
    .to('.hero-scroll-indicator', { opacity: 1, duration: 0.9 }, '-=0.6')
    .to('.hero-corner-info', { opacity: 1, duration: 0.8 }, '<');
}

// ─────────────────────────────────────────────────────────────────
// 2. HERO PARALLAX — Image moves at 60% scroll speed
// ─────────────────────────────────────────────────────────────────

function setupHeroParallax() {
  const heroBg = document.querySelector('.hero-bg-img');
  if (!heroBg || prefersReducedMotion) return;

  gsap.fromTo(
    heroBg,
    { y: '0%' },
    {
      y: '18%',
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end:   'bottom top',
        scrub: 0.5,
      }
    }
  );
}

// ─────────────────────────────────────────────────────────────────
// 3. SCROLL-TRIGGERED SECTION ENTRANCES
// ─────────────────────────────────────────────────────────────────

function setupSectionEntrances() {
  if (prefersReducedMotion) return;

  // Gallery heading
  gsap.set('.titulo-galeria', { opacity: 0, y: 36 });
  onScrollEnter('.titulo-galeria', () => {
    gsap.to('.titulo-galeria', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
  });

  // Filter buttons stagger
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    gsap.set(filterBtns, { opacity: 0, y: 16 });
    onScrollEnter('.gallery-filters', () => {
      gsap.to(filterBtns, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' });
    });
  }

  // Gallery cards stagger (deferred until cards are rendered by JS)
  ScrollTrigger.create({
    trigger: '.gallery-list',
    start: 'top 85%',
    once: true,
    onEnter() {
      const items = document.querySelectorAll('.gallery-list__item');
      gsap.set(items, { opacity: 0, y: 48 });
      gsap.to(items, { opacity: 1, y: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out' });
    }
  });

  // About label
  gsap.set('.about-label', { opacity: 0, x: -16 });
  onScrollEnter('#about', () => {
    gsap.to('.about-label', { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' });
  }, 'top 72%');

  // About title
  gsap.set('.about-title', { opacity: 0, y: 60 });
  onScrollEnter('.about-title', () => {
    gsap.to('.about-title', { opacity: 1, y: 0, duration: 1.3, ease: 'power4.out' });
  });

  // About bio
  gsap.set('.about-bio', { opacity: 0, y: 28 });
  onScrollEnter('.about-bio', () => {
    gsap.to('.about-bio', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
  });

  // About image subtle parallax
  gsap.fromTo('.about-image',
    { y: '-4%' },
    {
      y: '4%',
      ease: 'none',
      scrollTrigger: {
        trigger: '#about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      }
    }
  );

  // About CTA
  gsap.set('.about-cta', { opacity: 0, y: 16 });
  onScrollEnter('.about-cta', () => {
    gsap.to('.about-cta', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 });
  });
}

// ─────────────────────────────────────────────────────────────────
// 4. COUNTER ANIMATION — Number odometer effect
// ─────────────────────────────────────────────────────────────────

function setupCounters() {
  const counters = document.querySelectorAll('.about-stat-number[data-count]');
  if (!counters.length) return;

  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count, 10);
    if (isNaN(target)) return;

    const suffix = target >= 100 ? '+' : '';

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 88%',
      once:  true,
      onEnter() {
        const obj = { val: 0 };
        gsap.to(obj, {
          val:      target,
          duration: 2,
          ease:     'power2.out',
          onUpdate() {
            counter.textContent = Math.round(obj.val) + suffix;
          },
          onComplete() {
            counter.textContent = target + suffix;
          }
        });
      }
    });
  });
}


// PUBLIC API
// ─────────────────────────────────────────────────────────────────

/**
 * Initializes the full animation system.
 * @param {LocomotiveScroll} scroll - The scroll instance.
 */
export function initAnimations() {
  animateHeroEntrance();
  setupHeroParallax();
  setupSectionEntrances();
  setupCounters();
}