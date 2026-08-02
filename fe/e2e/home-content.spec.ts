import { expect, test } from '@playwright/test';

test('renders the complete editorial homepage without overflow', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-08-02T01:38:00+02:00'));
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);

  for (const id of ['trasa', 'pribeh', 'tim', 'partneri', 'kontakt']) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }

  await expect(page.getByRole('heading', { name: 'Michal Šula' })).toBeVisible();
  await expect(page.getByRole('heading', { exact: true, name: 'IontMax' })).toBeVisible();
  await expect(page.getByText('Shokz')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'interaktívna mapa trasy' })).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('scrolls anchor targets clear of the sticky header', async ({ page }, testInfo) => {
  await page.goto('/');

  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Otvoriť navigáciu' }).click();
  }

  await page.locator('.site-nav a[href="/#trasa"]').click();
  await expect(page).toHaveURL(/#trasa$/);

  await expect.poll(async () => {
    const target = await page.locator('#trasa').boundingBox();
    const header = await page.locator('.site-header').boundingBox();
    if (!target || !header) return false;
    return target.y >= header.height - 2 && target.y < page.viewportSize()!.height;
  }).toBe(true);

  if (testInfo.project.name === 'mobile') {
    await expect(page.getByRole('button', { name: 'Otvoriť navigáciu' })).toBeVisible();
  }
});
