import gsap from 'gsap';

export const initCustomCursor = () => {
  // Verificar se não é dispositivo touch
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.style.cursor = 'auto';
    return;
  }

  // Criar elementos do cursor
  const cursorHTML = `
    <div class="cursor">
      <div class="cursor__ball cursor__ball--big">
        <svg height="30" width="30">
          <circle cx="10" cy="10" r="8" stroke-width="0"></circle>
        </svg>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', cursorHTML);

  // Elementos do DOM
  const $bigBall = document.querySelector('.cursor__ball--big');
  const $smallBall = document.querySelector('.cursor__ball--big');
  const $hoverables = document.querySelectorAll(
    'a, button, [data-hover], .gallery-list__card, .social-links a'
  );

  // Esconder cursor padrão
  document.body.style.cursor = 'none';

  // Posição do cursor
  let mouseX = 0;
  let mouseY = 0;
  let ballX = 0;
  let ballY = 0;
  let scale = 1;
  const speed = 0.2;

  // Animação de movimento (otimizada)
  const animate = () => {
    // Distância entre posição atual e destino
    const distX = mouseX - ballX;
    const distY = mouseY - ballY;
    
    // Movimento suavizado
    ballX += distX * speed;
    ballY += distY * speed;
    
    // Aplicar transformações
    gsap.set($bigBall, { x: ballX, y: ballY, scale });
    gsap.set($smallBall, { x: mouseX, y: mouseY });
    
    requestAnimationFrame(animate);
  };

  // Iniciar animação
  animate();

  // Atualizar posição do mouse
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Efeitos hover
  const handleHover = () => {
    scale = 1.5;
    $bigBall.classList.add('hover');
  };

  const handleHoverOut = () => {
    scale = 1;
    $bigBall.classList.remove('hover');
  };

  // Aplicar eventos
  $hoverables.forEach(item => {
    item.addEventListener('mouseenter', handleHover);
    item.addEventListener('mouseleave', handleHoverOut);
    item.style.cursor = 'none';
  });

  // Esconder cursor ao sair da janela
  document.addEventListener('mouseleave', () => {
    gsap.to([$bigBall, $smallBall], { opacity: 0, duration: 0.5 });
  });
  
  document.addEventListener('mouseenter', () => {
    gsap.to([$bigBall, $smallBall], { opacity: 1, duration: 0.5 });
  });
};