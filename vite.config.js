// Dev server config. Production builds go through scripts/build.mjs, which encrypts the app.
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: { host: 'localhost', port: 5173, strictPort: false },
  build: { sourcemap: false },
});
