import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { eventStateUrl, parseEventState, type EventState } from './eventState';
import {
  EventStateContext,
  type EventStateLoadState,
} from './eventStateContext';

interface EventStateProviderProps {
  children: ReactNode;
  initialState?: EventState;
}

const refreshIntervalMilliseconds = 60_000;

export function EventStateProvider({
  children,
  initialState,
}: EventStateProviderProps) {
  const [state, setState] = useState<EventStateLoadState>(() =>
    initialState ? { data: initialState, status: 'ready' } : { status: 'loading' },
  );

  useEffect(() => {
    if (initialState) return;
    let active = true;
    let controller: AbortController | null = null;

    const load = async () => {
      controller?.abort();
      controller = new AbortController();
      try {
        const response = await fetch(eventStateUrl, {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = parseEventState(await response.json());
        if (active) setState({ data, status: 'ready' });
      } catch (error) {
        if (!active || controller.signal.aborted) return;
        const detail = error instanceof Error ? ` ${error.message}` : '';
        setState((current) =>
          current.status === 'ready'
            ? current
            : {
                message: `Stav behu sa nepodarilo načítať.${detail}`,
                status: 'error',
              },
        );
      }
    };

    void load();
    const interval = window.setInterval(() => void load(), refreshIntervalMilliseconds);
    return () => {
      active = false;
      controller?.abort();
      window.clearInterval(interval);
    };
  }, [initialState]);

  const value = useMemo(() => state, [state]);
  return <EventStateContext.Provider value={value}>{children}</EventStateContext.Provider>;
}
