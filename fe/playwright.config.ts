import { defineConfig } from '@playwright/test';

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'line',
  use: {
    baseURL: externalBaseUrl ?? 'http://127.0.0.1:4173',
    colorScheme: 'light',
    locale: 'sk-SK',
  },
  webServer: externalBaseUrl ? undefined : {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173',
    reuseExistingServer: true,
    timeout: 120_000,
    url: 'http://127.0.0.1:4173',
  },
  projects: [
    {
      name: 'desktop',
      use: { viewport: { height: 900, width: 1280 } },
    },
    {
      name: 'mobile',
      use: { viewport: { height: 844, width: 390 } },
    },
  ],
});
