import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: { input: { main: 'index.html', museum: 'museum.html', timeline: 'timeline.html' } },
    target: 'es2020',
    sourcemap: false,
  },
})
