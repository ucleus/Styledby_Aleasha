import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: '/aleasha/',
    plugins: [
        laravel({
            input: ['resources/js/index.jsx', 'resources/css/app.css'],
            refresh: true,
        }),
        react({
            // React plugin configuration
            jsxRuntime: 'automatic',
            babel: {
                plugins: ['@babel/plugin-transform-react-jsx'],
                presets: ['@babel/preset-react']
            }
        }),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
});
