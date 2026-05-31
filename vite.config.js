import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/', // Define o caminho base para o deploy
  publicDir: resolve(__dirname, 'public'), // Pasta de arquivos públicos
  build: {
    outDir: resolve(__dirname, 'dist'), // Pasta de build
    emptyOutDir: true, // Limpa a pasta dist antes de cada build
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        galeria: resolve(__dirname, 'pages/galeria/galeria.html'),
        india: resolve(__dirname, 'pages/galeria/india.html'),
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true, // Impede a troca automática de porta
  },
});