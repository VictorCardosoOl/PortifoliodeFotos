import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        galeria: resolve(__dirname, 'src/pages/galeria1.html')
      }
    }
  },
  server: {
    port: 3000
  }
})