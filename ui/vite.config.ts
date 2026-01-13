import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default defineConfig({
    // prettier-ignore
    plugins: [
        tanstackRouter({ target: 'react', autoCodeSplitting: true }), 
        react()
    ],
    server: {
        allowedHosts: ['www.jodspace.work', 'jodspace.work'],
    },
});
