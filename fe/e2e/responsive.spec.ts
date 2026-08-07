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
  const artworkImages = [
    ...['distance', 'halusky', 'lynx', 'suhaj'].map((artwork) =>
      page.locator(`.hero-artwork--${artwork}`),
    ),
    page.locator('.hero-map-artwork__image'),
    page.locator('.hero-wordart img'),
  ];

  for (const artworkImage of artworkImages) {
    await expect(artworkImage).toBeVisible();
    await expect.poll(() => artworkImage.evaluate(
      (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
    )).toBe(true);
  }

  const routePreview = page.getByRole('img', {
    name: 'Orientačný náčrt trasy z Jasnej na Tyršovo nábrežie',
  });
  await expect(routePreview.locator('.hero-map-artwork__route-line')).toHaveCount(1);
  await expect(routePreview.locator('.hero-map-artwork__route-line'))
    .toHaveAttribute('d', /150 580$/u);
  await expect(routePreview.locator('.hero-map-artwork__route-dash')).toHaveCount(1);
  await expect(routePreview.locator('.hero-map-artwork__point')).toHaveCount(2);
  await expect(routePreview.locator('.hero-map-artwork__label--start')).toContainText('štart uuultra');
  await expect(routePreview.locator('.hero-map-artwork__label--finish'))
    .toContainText('cieľ Tyršovo nábrežie');

  const haluskyBounds = await page.locator('.hero-artwork--halusky').boundingBox();
  const suhajBounds = await page.locator('.hero-artwork--suhaj').boundingBox();
  const lynxBounds = await page.locator('.hero-artwork--lynx').boundingBox();
  const ambulanceBounds = await page.locator('.hero-doodle--ambulance').boundingBox();
  const mapBounds = await routePreview.boundingBox();
  const finishPointBounds = await routePreview
    .locator('.hero-map-artwork__point--finish')
    .boundingBox();
  const finishLabelBounds = await routePreview
    .locator('.hero-map-artwork__label--finish')
    .boundingBox();
  const titleBounds = await page.locator('.hero-wordart').boundingBox();
  const dateBounds = await page.locator('.hero-date').boundingBox();
  const statsBounds = await page.locator('.hero-stats').boundingBox();

  expect(haluskyBounds).not.toBeNull();
  expect(suhajBounds).not.toBeNull();
  expect(lynxBounds).not.toBeNull();
  expect(ambulanceBounds).not.toBeNull();
  expect(mapBounds).not.toBeNull();
  expect(finishPointBounds).not.toBeNull();
  expect(finishLabelBounds).not.toBeNull();
  expect(titleBounds).not.toBeNull();
  expect(dateBounds).not.toBeNull();
  expect(statsBounds).not.toBeNull();
  expect(suhajBounds!.x).toBeGreaterThan(haluskyBounds!.x);
  expect(lynxBounds!.x).toBeLessThan(mapBounds!.x);
  expect(lynxBounds!.y).toBeGreaterThan(mapBounds!.y + mapBounds!.height / 2);
  expect(finishPointBounds!.x).toBeGreaterThanOrEqual(mapBounds!.x);
  expect(finishPointBounds!.y).toBeGreaterThanOrEqual(mapBounds!.y);
  expect(finishPointBounds!.x + finishPointBounds!.width)
    .toBeLessThanOrEqual(mapBounds!.x + mapBounds!.width);
  expect(finishPointBounds!.y + finishPointBounds!.height)
    .toBeLessThanOrEqual(mapBounds!.y + mapBounds!.height);
  expect(finishLabelBounds!.x).toBeGreaterThanOrEqual(mapBounds!.x);
  expect(finishLabelBounds!.y).toBeGreaterThanOrEqual(mapBounds!.y);
  expect(finishLabelBounds!.x + finishLabelBounds!.width)
    .toBeLessThanOrEqual(mapBounds!.x + mapBounds!.width);
  expect(finishLabelBounds!.y + finishLabelBounds!.height)
    .toBeLessThanOrEqual(mapBounds!.y + mapBounds!.height);

  if (testInfo.project.name === 'desktop') {
    const visibleTitleStart = titleBounds!.x + titleBounds!.width * 0.03;
    const ambulanceOverlapsLynx = ambulanceBounds!.x < lynxBounds!.x + lynxBounds!.width
      && ambulanceBounds!.x + ambulanceBounds!.width > lynxBounds!.x
      && ambulanceBounds!.y < lynxBounds!.y + lynxBounds!.height
      && ambulanceBounds!.y + ambulanceBounds!.height > lynxBounds!.y;
    expect(lynxBounds!.x + lynxBounds!.width).toBeLessThanOrEqual(visibleTitleStart);
    expect(ambulanceBounds!.x + ambulanceBounds!.width).toBeLessThanOrEqual(visibleTitleStart);
    expect(ambulanceOverlapsLynx).toBe(false);
  }

  const titleLayer = await page.locator('.hero-wordart').evaluate(
    (element) => Number.parseInt(getComputedStyle(element).zIndex, 10),
  );
  const dateLayer = await page.locator('.hero-date').evaluate(
    (element) => Number.parseInt(getComputedStyle(element).zIndex, 10),
  );
  expect(dateLayer).toBeGreaterThan(titleLayer);
  expect(dateBounds!.y + dateBounds!.height / 2).toBeLessThan(statsBounds!.y);

  await expect(page.locator('.donio-progress')).toBeVisible();

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
