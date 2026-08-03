import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { configDefaults, defineConfig } from 'vitest/config';
import { parsePublicPledgeData } from './src/features/pledge/publicPledges.ts';

function validatePublicPledges() {
  return {
    name: 'validate-public-pledges',
    async buildStart() {
      const pledgePath = path.resolve(import.meta.dirname, 'public/data/pledges.json');
      const source = await readFile(pledgePath, 'utf8');
      parsePublicPledgeData(JSON.parse(source) as unknown);
    },
  };
}

export default defineConfig({
  plugins: [validatePublicPledges(), react(), tailwindcss()],

  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/**'],
    setupFiles: ['./src/test/setup.ts'],
  },

  server: {
    port: 5173,

    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
