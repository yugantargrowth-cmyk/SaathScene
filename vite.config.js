import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

const rootDir = fs.realpathSync(process.cwd());

export default defineConfig({
  root: rootDir,
  publicDir: resolve(rootDir, 'public'),
  server: {
    port: 3000,
    open: false
  },
  build: {
    outDir: resolve(rootDir, 'dist'),
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        privacy: resolve(rootDir, 'privacy.html'),
        terms: resolve(rootDir, 'terms.html'),
        notfound: resolve(rootDir, '404.html')
      }
    }
  }
});
