import { expect, test } from '@playwright/test';

test('renders the complete editorial homepage without overflow', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-08-02T01:38:00+02:00'));
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);

  for (const id of ['vily', 'trasa', 'pridaj-sa', 'pribeh', 'partneri', 'kontakt']) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }

  await expect(page.locator('#partneri').getByAltText('Shokz slúchadlá')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'interaktívna mapa trasy' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Pridaj sa ku mne počas behu.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Neboj sa, nekúšem.' })).toBeVisible();
  await expect(
    page.getByRole('complementary', { name: 'Stav zbierky Zachráňme Vilyho' }),
  ).toBeVisible();

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
