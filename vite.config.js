import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: path.resolve(__dirname, 'src/pags/Site'), // Define a raiz do projeto
    publicDir: path.resolve(__dirname, 'public'), // Define explicitamente a pasta public
    build: {
        outDir: path.resolve(__dirname, 'dist'), // Define a pasta de saída
        emptyOutDir: true, // Limpa a pasta de saída antes de construir
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'src/pags/Site/index.html'), // Ponto de entrada principal
                galeria: path.resolve(__dirname, 'src/pags/Galeria/galeria.html'), // Ponto de entrada da galeria
            },
        },
    },
    server: {
        port: 3000, // Porta do servidor de desenvolvimento
        open: true, // Abre o navegador automaticamente
    },
    resolve: {
        alias: {
            '@img': path.resolve(__dirname, 'public/img'), // Alias para a pasta de imagens
            '@components': path.resolve(__dirname, 'src/components'),
            '@styles': path.resolve(__dirname, 'src/styles'),
            '@utils': path.resolve(__dirname, 'src/utils'),
        },
    },
});