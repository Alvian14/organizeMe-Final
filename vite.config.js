import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/custom.css', 'resources/js/main.jsx'],
            refresh: true,
        }),
        react(),
    ],
});
