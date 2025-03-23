import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/pages/index.html'),
        gallery: resolve(__dirname, 'src/pages/galeria.html')
      }
    }
  },
  server: {
    port: 3000
  }
})