import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { StickerButton } from '../../components/ui';
import { RouteCheckpointList } from './RouteCheckpointList';
import { routeAssetUrl } from './routeConfig';
import type { RouteData } from './routeTypes';

const RouteLeafletMap = lazy(() => import('./RouteLeafletMap'));

type RouteLoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { route: RouteData; status: 'ready' }
  | { message: string; status: 'error' };

function routeErrorMessage(error: unknown): string {
  const productionMessage = 'Mapu trasy sa teraz nepodarilo načítať. Základné údaje zostávajú dostupné.';

  if (!import.meta.env.DEV) return productionMessage;
  const detail = error instanceof Error ? ` ${error.message}` : '';
  return `${productionMessage} Očakávaný súbor: ${routeAssetUrl}.${detail}`;
}

export function RouteMapPanel() {
  const boundaryRef = useRef<HTMLElement | null>(null);
  const [loadRequest, setLoadRequest] = useState(0);
  const [state, setState] = useState<RouteLoadState>({ status: 'idle' });
  const startLoading = useCallback(() => {
    setState({ status: 'loading' });
    setLoadRequest((request) => request + 1);
  }, []);

  useEffect(() => {
    if (loadRequest > 0 || !boundaryRef.current || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          startLoading();
          observer.disconnect();
        }
      },
      { rootMargin: '400px 0px' },
    );

    observer.observe(boundaryRef.current);
    return () => observer.disconnect();
  }, [loadRequest, startLoading]);

  useEffect(() => {
    if (loadRequest === 0) return;

    const controller = new AbortController();

    void import('./routeLoader')
      .then(({ loadProductionRoute }) => loadProductionRoute(routeAssetUrl, controller.signal))
      .then((route) => setState({ route, status: 'ready' }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({ message: routeErrorMessage(error), status: 'error' });
        }
      });

    return () => controller.abort();
  }, [loadRequest]);

  return (
    <section
      aria-labelledby="route-map-title"
      className="route-map"
      data-route-map-state={state.status}
      ref={boundaryRef}
    >
      <div className="route-map__heading">
        <h3 id="route-map-title">interaktívna mapa trasy</h3>
        <span>Jasná → Tyršovo nábrežie</span>
      </div>

      {state.status === 'idle' && (
        <div className="route-map__status">
          <p>Mapa sa načíta až vtedy, keď sa k nej priblížiš.</p>
          <StickerButton onClick={startLoading} size="small">
            načítať interaktívnu mapu
          </StickerButton>
        </div>
      )}

      {state.status === 'loading' && (
        <div aria-live="polite" className="route-map__status route-map__status--loading">
          <span aria-hidden="true" className="route-map__loader" />
          <p>načítavam oficiálnu trasu…</p>
        </div>
      )}

      {state.status === 'error' && (
        <div aria-live="polite" className="route-map__status route-map__status--error">
          <p>{state.message}</p>
          <StickerButton
            onClick={startLoading}
            size="small"
          >
            skúsiť znova
          </StickerButton>
        </div>
      )}

      {state.status === 'ready' && (
        <>
          <Suspense
            fallback={(
              <div aria-live="polite" className="route-map__status route-map__status--loading">
                <p>pripravujem interaktívnu mapu…</p>
              </div>
            )}
          >
            <RouteLeafletMap route={state.route} />
          </Suspense>
          <RouteCheckpointList route={state.route} />
        </>
      )}
    </section>
  );
}
