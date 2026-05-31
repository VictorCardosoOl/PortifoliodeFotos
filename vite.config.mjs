import { defineConfig } from 'vite';
import { resolve } from 'path';
import htmlInclude from 'vite-plugin-html-include';

export default defineConfig({
  base: '/',
  publicDir: resolve(__dirname, 'public'),
  plugins: [
    htmlInclude(),
  ],
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
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
    strictPort: true,
  },
});