import gsap from 'gsap';

export const initCustomCursor = () => {
  const cursorHTML = `
    <div class="cursor">
      <div class="cursor__ball cursor__ball--big">
        <svg height="30" width="30">
          <circle cx="15" cy="15" r="12" stroke-width="0"></circle>
        </svg>
      </div>
      <div class="cursor__ball cursor__ball--small">
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="4" stroke-width="0"></circle>
        </svg>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', cursorHTML);

  const $bigBall = document.querySelector('.cursor__ball--big');
  const $smallBall = document.querySelector('.cursor__ball--small');
  const $hoverables = document.querySelectorAll('a, button, [data-hover]');

  document.body.style.cursor = 'none';

  const moveCursor = (e) => {
    gsap.to($bigBall, { duration: 0.4, x: e.clientX - 15, y: e.clientY - 15 });
    gsap.to($smallBall, { duration: 0.1, x: e.clientX - 5, y: e.clientY - 7 });
  };

  const hoverEffect = () => gsap.to($bigBall, { duration: 0.3, scale: 1.5 });
  const hoverEffectOut = () => gsap.to($bigBall, { duration: 0.3, scale: 1 });

  document.addEventListener('mousemove', moveCursor);
  
  $hoverables.forEach(item => {
    item.addEventListener('mouseenter', hoverEffect);
    item.addEventListener('mouseleave', hoverEffectOut);
    item.style.cursor = 'none';
  });

  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.style.cursor = '';
    const cursor = document.querySelector('.cursor');
    if (cursor) cursor.style.display = 'none';
  }
};