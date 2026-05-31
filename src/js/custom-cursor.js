import gsap from 'gsap';

export const initCustomCursor = () => {
  // Guard clause: disable on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.style.cursor = 'auto';
    return;
  }

  // Create markup for both big and small balls
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

  // DOM Elements
  const $bigBall = document.querySelector('.cursor__ball--big');
  const $smallBall = document.querySelector('.cursor__ball--small');
  
  if (!$bigBall || !$smallBall) return;

  const $hoverables = document.querySelectorAll(
    'a, button, [data-hover], .gallery-list__card, .social-links a'
  );

  // Hide default cursor
  document.body.style.cursor = 'none';

  let mouseX = 0;
  let mouseY = 0;
  let ballX = 0;
  let ballY = 0;
  let scale = 1;
  const speed = 0.2;

  // Optimized animation loop using RAF
  const animate = () => {
    const distX = mouseX - ballX;
    const distY = mouseY - ballY;
    
    ballX += distX * speed;
    ballY += distY * speed;
    
    gsap.set($bigBall, { x: ballX, y: ballY, scale });
    gsap.set($smallBall, { x: mouseX, y: mouseY });
    
    requestAnimationFrame(animate);
  };

  animate();

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  const handleHover = () => {
    scale = 1.5;
    $bigBall.classList.add('hover');
  };

  const handleHoverOut = () => {
    scale = 1;
    $bigBall.classList.remove('hover');
  };

  $hoverables.forEach(item => {
    item.addEventListener('mouseenter', handleHover, { passive: true });
    item.addEventListener('mouseleave', handleHoverOut, { passive: true });
    item.style.cursor = 'none';
  });

  // Fade out cursor when leaving window
  document.addEventListener('mouseleave', () => {
    gsap.to([$bigBall, $smallBall], { opacity: 0, duration: 0.5 });
  });
  
  document.addEventListener('mouseenter', () => {
    gsap.to([$bigBall, $smallBall], { opacity: 1, duration: 0.5 });
  });
};