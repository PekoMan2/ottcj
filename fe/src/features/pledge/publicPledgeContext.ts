import { createContext, useContext } from 'react';
import type { PublicPledgeData, PledgeSummary } from './publicPledges';

export type PublicPledgeState =
  | { status: 'loading' }
  | { message: string; status: 'error' }
  | { data: PublicPledgeData; status: 'ready'; summary: PledgeSummary };

export const PublicPledgeContext = createContext<PublicPledgeState | null>(null);

export function usePublicPledges(): PublicPledgeState {
  const state = useContext(PublicPledgeContext);
  if (!state) throw new Error('usePublicPledges must be used inside PublicPledgeDataProvider');
  return state;
}
