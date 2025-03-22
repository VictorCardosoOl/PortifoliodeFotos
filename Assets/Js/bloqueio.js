// Função para exibir notificação ao lado do cursor
function showCursorNotification(message) {
    const notification = document.getElementById('cursor-notification');
    notification.textContent = message;
    notification.classList.add('show');
  
    // Oculta a notificação após 2 segundos
    setTimeout(() => {
      notification.classList.remove('show');
    }, 1000);
  }
  
  // Bloqueio de clique direito e inspeção
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showCursorNotification('© 2024 Victor Cardoso');
  });
  
  document.addEventListener('keydown', (e) => {
    // Bloqueia Ctrl+U, Ctrl+Shift+I e F12
    if (
      (e.ctrlKey && (e.key === 'u' || e.key === 'U')) ||
      (e.ctrlKey && e.shiftKey && e.key === 'I') ||
      e.key === 'F12'
    ) {
      e.preventDefault();
      showCursorNotification('© 2024 Victor Cardoso');
    }
  });