import {
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  calculatePledgeSummary,
  parsePublicPledgeData,
  publicPledgesUrl,
  type PublicPledgeData,
} from './publicPledges';
import { PublicPledgeContext, type PublicPledgeState } from './publicPledgeContext';

interface PublicPledgeDataProviderProps {
  children: ReactNode;
  initialData?: PublicPledgeData;
}

export function PublicPledgeDataProvider({ children, initialData }: PublicPledgeDataProviderProps) {
  const [state, setState] = useState<PublicPledgeState>(() => initialData
    ? { data: initialData, status: 'ready', summary: calculatePledgeSummary(initialData.pledges) }
    : { status: 'loading' });

  useEffect(() => {
    if (initialData) return;
    const controller = new AbortController();
    fetch(publicPledgesUrl, { cache: 'no-cache', signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return parsePublicPledgeData(await response.json());
      })
      .then((data) => setState({ data, status: 'ready', summary: calculatePledgeSummary(data.pledges) }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const detail = error instanceof Error ? ` ${error.message}` : '';
        setState({ message: `Verejné príspevky sa nepodarilo načítať.${detail}`, status: 'error' });
      });
    return () => controller.abort();
  }, [initialData]);

  const value = useMemo(() => state, [state]);
  return <PublicPledgeContext.Provider value={value}>{children}</PublicPledgeContext.Provider>;
}
