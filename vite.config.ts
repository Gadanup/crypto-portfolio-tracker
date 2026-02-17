import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    proxy: {
      '/api/cmc': {
        target: 'https://pro-api.coinmarketcap.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cmc/, ''),
      },
      '/api/coincap': {
        target: 'https://rest.coincap.io/v3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coincap/, ''),
      },
    },
  },
});
