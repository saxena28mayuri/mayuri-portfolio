import { defineConfig } from 'vite';

// GitHub Pages serves this project site from /mayuri-portfolio/.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/mayuri-portfolio/' : '/',
}));
