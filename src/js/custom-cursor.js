import gsap from 'gsap';

export const initCustomCursor = () => {
  // 1. VERIFICAÇÃO DE DISPOSITIVO TOUCH
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.style.cursor = 'auto';
    return;
  }

  // 2. CRIAÇÃO E INJEÇÃO DO HTML
  const cursorHTML = `
    <div class="cursor">
      <div class="cursor__ring"></div>
      <div class="cursor__dot"></div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', cursorHTML);

  // 3. SELEÇÃO DOS ELEMENTOS
  const cursor = document.querySelector('.cursor');

  // Esconde o cursor padrão do sistema
  document.body.style.cursor = 'none';

  // 4. ESTADO DO CURSOR
  const mouse = { x: 0, y: 0 };
  const smoothed = { x: 0, y: 0 };
  const speed = 1;

  // 5. EVENTOS DO MOUSE
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Esconde/mostra o cursor ao sair/entrar na janela
  document.addEventListener('mouseleave', () => gsap.to(cursor, { opacity: 0, duration: 0.3 }));
  document.addEventListener('mouseenter', () => gsap.to(cursor, { opacity: 1, duration: 0.3 }));
  
  // A LÓGICA DE HOVER FOI COMPLETAMENTE REMOVIDA

  // 6. LOOP DE ANIMAÇÃO
  gsap.ticker.add(() => {
    // Calcula a posição suavizada
    smoothed.x += (mouse.x - smoothed.x) * speed;
    smoothed.y += (mouse.y - smoothed.y) * speed;

    // **A MUDANÇA PRINCIPAL ESTÁ AQUI**
    // Move o contêiner principal do cursor para a posição suavizada.
    // Como o anel e o ponto são filhos dele, ambos se moverão juntos.
    gsap.set(cursor, { x: smoothed.x, y: smoothed.y });
  });
};