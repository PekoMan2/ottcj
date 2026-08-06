import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RouteData } from './routeTypes';

const routeMocks = vi.hoisted(() => ({
  leafletLoads: 0,
  loadProductionRoute: vi.fn(),
}));

vi.mock('./routeLoader', () => ({
  loadProductionRoute: routeMocks.loadProductionRoute,
}));

vi.mock('./RouteLeafletMap', () => {
  routeMocks.leafletLoads += 1;
  return {
    default: () => <div data-testid="leaflet-map">Leaflet test map</div>,
  };
});

import { RouteMapPanel } from './RouteMapPanel';

function routeFixture(): RouteData {
  const numbered = Array.from({ length: 35 }, (_, index) => ({
    coordinate: [48.9 - index * 0.01, 19.5 - index * 0.01] as const,
    distanceKm: index * 10 + 10,
    kind: 'handoff' as const,
    name: `${index + 1}. Zdrojový bod ${index + 1}`,
    sourceNumber: index + 1,
  }));

  return {
    bounds: [[48.1, 17.1], [49.1, 19.7]],
    checkpoints: [
      {
        coordinate: [48.967647, 19.573258],
        distanceKm: 0,
        kind: 'start',
        name: 'Štart Jasná',
        sourceNumber: null,
      },
      ...numbered,
      {
        coordinate: [48.136128, 17.11284],
        distanceKm: 347.32,
        kind: 'finish',
        name: '36. Cieľ Tyršovo nábrežie',
        sourceNumber: 36,
      },
    ],
    segments: [[[48.967647, 19.573258], [48.136128, 17.11284]]],
  };
}

describe('RouteMapPanel', () => {
  beforeEach(() => {
    routeMocks.loadProductionRoute.mockReset();
    routeMocks.leafletLoads = 0;
  });

  it('keeps route parsing and Leaflet deferred until manual activation', async () => {
    routeMocks.loadProductionRoute.mockResolvedValue(routeFixture());
    render(<RouteMapPanel />);

    expect(routeMocks.loadProductionRoute).not.toHaveBeenCalled();
    expect(routeMocks.leafletLoads).toBe(0);

    fireEvent.click(screen.getByRole('button', { name: 'načítať interaktívnu mapu' }));

    expect(screen.getByText('načítavam oficiálnu trasu…')).toBeInTheDocument();
    expect(await screen.findByTestId('leaflet-map')).toBeInTheDocument();
    expect(routeMocks.loadProductionRoute).toHaveBeenCalledTimes(1);
    expect(routeMocks.leafletLoads).toBe(1);

    const keyList = screen.getByRole('list', { name: 'Deväť kľúčových bodov trasy' });
    expect(within(keyList).getAllByRole('listitem')).toHaveLength(9);
    expect(within(keyList).getByText('Banská Bystrica')).toBeInTheDocument();
    expect(within(keyList).getByText('Tu si so mnou zabehnú kamaráti z Nitry, pridaj sa!'))
      .toBeInTheDocument();
    expect(within(keyList).queryByText('5. Zdrojový bod 5')).not.toBeInTheDocument();

    const allPoints = screen.getByRole('list', { name: 'Všetkých 37 bodov trasy' });
    expect(within(allPoints).getAllByRole('listitem')).toHaveLength(37);
  });

  it('shows a diagnostic development error and retries the same local asset', async () => {
    routeMocks.loadProductionRoute
      .mockRejectedValueOnce(new Error('poškodený ZIP'))
      .mockResolvedValueOnce(routeFixture());
    render(<RouteMapPanel />);

    fireEvent.click(screen.getByRole('button', { name: 'načítať interaktívnu mapu' }));

    expect(await screen.findByText(/MAJO_Od_Tatier_k_Dunaju_2026\.kmz.*poškodený ZIP/u))
      .toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'skúsiť znova' }));

    await waitFor(() => expect(routeMocks.loadProductionRoute).toHaveBeenCalledTimes(2));
    expect(await screen.findByTestId('leaflet-map')).toBeInTheDocument();
  });
});
