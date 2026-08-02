import { assertProductionRouteContract, parseRouteAsset, RouteDataError } from './routeParser';
import type { RouteAssetFormat, RouteData } from './routeTypes';
import { routeAssetUrl } from './routeConfig';

function assetFormat(url: string): RouteAssetFormat {
  return url.toLowerCase().split(/[?#]/u)[0].endsWith('.gpx') ? 'gpx' : 'kmz';
}

export async function loadProductionRoute(
  url = routeAssetUrl,
  signal?: AbortSignal,
): Promise<RouteData> {
  let response: Response;

  try {
    response = await fetch(url, { signal });
  } catch (error) {
    throw new RouteDataError('invalid-archive', 'Súbor trasy nie je dostupný.', { cause: error });
  }

  if (!response.ok) {
    throw new RouteDataError(
      'invalid-archive',
      `Súbor trasy nie je dostupný (HTTP ${response.status}).`,
    );
  }

  const route = await parseRouteAsset(await response.arrayBuffer(), assetFormat(url));
  return assertProductionRouteContract(route);
}
