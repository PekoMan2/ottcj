import { expect, test } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const evidenceDirectory = path.resolve(
  import.meta.dirname,
  '../../docs/visual-verification/milestone-2',
);
const referenceUrl = pathToFileURL(
  path.resolve(import.meta.dirname, '../../majootkd_skicar_max_chaos_v5.html'),
).href;

test('preserves the collage identity without responsive overflow', async ({ page }, testInfo) => {
  await page.clock.setFixedTime(new Date('2026-08-02T01:38:00+02:00'));
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);

  await expect(page.getByRole('heading', { level: 1, name: 'Od Tatier k Dunaju' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'bež so mnou. zachráňme Vilyho.' })).toBeVisible();
  await expect(page.locator('.hero-doodle--cat')).toBeVisible();
  await expect(page.locator('.bracket-row--max')).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.locator('.site-header')).toHaveCSS('position', 'sticky');

  if (testInfo.project.name === 'mobile') {
    const menuButton = page.getByRole('button', { name: 'Otvoriť navigáciu' });
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(page.getByRole('navigation', { name: 'Hlavná navigácia' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menuButton).toBeFocused();
  }

  await page.screenshot({
    fullPage: true,
    path: path.join(evidenceDirectory, `react-${testInfo.project.name}.png`),
  });

  await page.goto(referenceUrl);
  await page.addStyleTag({ content: '.browser-bar { display: none !important; }' });
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.site').screenshot({
    path: path.join(evidenceDirectory, `reference-${testInfo.project.name}.png`),
  });
});
