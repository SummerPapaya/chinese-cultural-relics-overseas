import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile, unlink } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = dirname(fileURLToPath(import.meta.url))
const omitIgnoredPublicAssets = {
  name: 'omit-ignored-public-assets',
  apply: 'build',
  async closeBundle() {
    // Vite copies public/ wholesale, including gitignored local-only photos.
    // Remove only explicit public/ paths listed in this repository's .gitignore.
    const ignore = await readFile(resolve(projectRoot, '.gitignore'), 'utf8')
    const files = ignore.split(/\r?\n/).filter(line => /^public\/[\w./-]+$/.test(line) && !line.includes('..'))
    for (const file of files) {
      try { await unlink(resolve(projectRoot, 'dist', file.slice('public/'.length))) }
      catch (error) { if (error.code !== 'ENOENT') throw error }
    }
  },
}

export default defineConfig({
  plugins: [react(), omitIgnoredPublicAssets],
  base: './',
  build: {
    rollupOptions: { input: { main: 'index.html', museum: 'museum.html', timeline: 'timeline.html' } },
    target: 'es2020',
    sourcemap: false,
  },
})
