// Copiado de /vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: __dirname, // Apontar para o diretório `frontend`
  base: '/static/', // URL base para os assets
  build: {
    outDir: path.resolve(__dirname, '../static/dist'), // Saída para a pasta static/dist do Django
    manifest: true, // Gera um manifest.json que o django-vite usa
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/main.tsx'), // Ponto de entrada da sua app
      },
    },
  },
  server: {
    origin: 'http://localhost:8000', // Servidor de desenvolvimento do Django
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
