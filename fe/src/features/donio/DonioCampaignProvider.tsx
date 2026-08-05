import { type ReactNode, useEffect, useState } from 'react';
import {
  donioCampaignUrl,
  parseDonioCampaign,
  type DonioCampaign,
} from './donioCampaign';
import {
  DonioCampaignContext,
  type DonioCampaignState,
} from './donioCampaignContext';

interface DonioCampaignProviderProps {
  children: ReactNode;
  initialData?: DonioCampaign;
}

const refreshIntervalMilliseconds = 5 * 60_000;

export function DonioCampaignProvider({
  children,
  initialData,
}: DonioCampaignProviderProps) {
  const [state, setState] = useState<DonioCampaignState>(() =>
    initialData ? { data: initialData, status: 'ready' } : { status: 'loading' },
  );

  useEffect(() => {
    if (initialData) return;
    let active = true;
    let controller: AbortController | null = null;

    const load = async () => {
      controller?.abort();
      controller = new AbortController();
      try {
        const response = await fetch(donioCampaignUrl, {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = parseDonioCampaign(await response.json());
        if (active) setState({ data, status: 'ready' });
      } catch {
        if (!active || controller.signal.aborted) return;
        setState((current) =>
          current.status === 'ready' ? current : { status: 'unavailable' },
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
  }, [initialData]);

  return (
    <DonioCampaignContext.Provider value={state}>
      {children}
    </DonioCampaignContext.Provider>
  );
}
