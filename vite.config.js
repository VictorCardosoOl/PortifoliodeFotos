import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: resolve(__dirname, 'src'), // Pasta raiz do projeto
  publicDir: resolve(__dirname, 'public'), // Pasta de arquivos públicos
  build: {
    outDir: resolve(__dirname, 'dist'), // Pasta de build
    emptyOutDir: true, // Limpa a pasta dist antes de cada build
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        galeria: resolve(__dirname, 'src/pages/galeria1.html')
      }
    }
  },
  server: {
    port: 3000,
    strictPort: true // Impede a troca automática de porta
  }
})