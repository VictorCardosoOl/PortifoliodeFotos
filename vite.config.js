import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: path.resolve(__dirname, 'src/pags/Site'),
    build: {
        outDir: path.resolve(__dirname, 'dist'),
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'src/pags/Site/index.html'),
                galeria: path.resolve(__dirname, 'src/pags/Galeria/galeria.html'),
            },
        },
    },
    server: {
        port: 3000,
        open: true,
    },
    resolve: {
        alias: {
            '@img': path.resolve(__dirname, 'src/img'),
        },
    },
});