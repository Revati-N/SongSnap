import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  // For GitHub Pages: set base to your repo name (e.g., '/SongSnap/')
  // For custom domain or local dev: use '/'
  base: process.env.GITHUB_PAGES ? '/SongSnap/' : '/',
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
