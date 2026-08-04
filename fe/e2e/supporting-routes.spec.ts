import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const evidenceDirectory = path.resolve(
  import.meta.dirname,
  '../../docs/visual-verification/milestone-5',
);

const routes = [
  { heading: 'Zoznam príspevkov.', path: '/prispevky', slug: 'pledges' },
  { heading: 'Ďakujeme, že bežíš s nami.', path: '/dakujem', slug: 'thank-you' },
  { heading: 'Press kit.', path: '/press', slug: 'press' },
  { heading: 'Zachráňme Vilyho.', path: '/vily', slug: 'vily' },
  { heading: 'GDPR informácie.', path: '/gdpr', slug: 'gdpr' },
] as const;

for (const route of routes) {
  test(`direct-loads ${route.path} and captures its responsive composition`, async ({ page }, testInfo) => {
    await page.goto(route.path);
    await page.evaluate(() => document.fonts.ready);

    await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();
    await expect(page.locator('.site-header')).toHaveCSS('position', 'sticky');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    if (route.path === '/prispevky') {
      await expect(page.getByText('Zatiaľ nie je zverejnený žiadny príspevok.')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Podmienky príspevku.' })).toBeVisible();
    }
    if (route.path === '/vily') {
      await expect(page.locator('main')).not.toContainText(/provisional|draft|unverified|čaká na schválenie|pracovný placeholder/iu);
    }

    mkdirSync(evidenceDirectory, { recursive: true });
    await page.screenshot({
      fullPage: true,
      path: path.join(evidenceDirectory, `${route.slug}-${testInfo.project.name}.png`),
    });
  });
}

test('serves the safe pledge file as JSON', async ({ request }) => {
  const response = await request.get('/data/pledges.json');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('application/json');
  expect(await response.json()).toEqual({ updatedAt: null, pledges: [] });
});
