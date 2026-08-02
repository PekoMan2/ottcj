import { expect, test } from '@playwright/test';

test('loads the production route lazily and exposes every source point', async ({ page }) => {
  await page.goto('/');

  const routeMap = page.locator('[data-route-map-state]');
  await routeMap.scrollIntoViewIfNeeded();
  await expect(routeMap).toHaveAttribute('data-route-map-state', 'ready');

  await expect(page.getByRole('region', { name: 'Interaktívna mapa oficiálnej trasy' })).toBeVisible();
  await expect(routeMap.locator('.leaflet-overlay-pane path')).toHaveCount(2);
  await expect(routeMap.locator('.leaflet-marker-icon')).toHaveCount(37);
  await expect(routeMap.getByText('OpenStreetMap', { exact: true })).toBeVisible();
  await expect(routeMap.getByRole('button', { name: 'celá trasa' })).toBeVisible();

  const keyPoints = routeMap.getByRole('list', { name: 'Deväť kľúčových bodov trasy' });
  const keyPointsHeading = routeMap.getByRole('heading', { name: 'kľúčové body na trati' });
  await expect(keyPointsHeading).toHaveCSS('font-family', /Prompt/u);
  await expect(keyPointsHeading).toHaveCSS('font-style', 'italic');
  await expect(keyPointsHeading).toHaveCSS('font-weight', '200');
  await expect(keyPoints.getByRole('listitem')).toHaveCount(9);
  await expect(keyPoints).toContainText('5. Liptovská Osada');
  await expect(keyPoints).toContainText('35. Jamaica');

  await routeMap.getByText('všetky body · štart + 36 očíslovaných bodov').click();
  await expect(routeMap.getByRole('list', { name: 'Všetkých 37 bodov trasy' }).getByRole('listitem'))
    .toHaveCount(37);

  const mapBounds = await routeMap.locator('.route-map__leaflet').boundingBox();
  const startBounds = await routeMap.locator('.leaflet-marker-icon[title="Štart Jasná"]').boundingBox();
  const finishBounds = await routeMap
    .locator('.leaflet-marker-icon[title="36. Cieľ Tyršovo nábrežie"]')
    .boundingBox();
  expect(mapBounds).not.toBeNull();
  expect(startBounds).not.toBeNull();
  expect(finishBounds).not.toBeNull();
  expect(startBounds!.x).toBeGreaterThanOrEqual(mapBounds!.x);
  expect(finishBounds!.x).toBeGreaterThanOrEqual(mapBounds!.x);
  expect(startBounds!.x).toBeLessThan(mapBounds!.x + mapBounds!.width);
  expect(finishBounds!.x).toBeLessThan(mapBounds!.x + mapBounds!.width);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
