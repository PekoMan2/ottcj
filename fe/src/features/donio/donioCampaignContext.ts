import { createContext, useContext } from 'react';
import type { DonioCampaign } from './donioCampaign';

export type DonioCampaignState =
  | { status: 'loading' }
  | { status: 'unavailable' }
  | { data: DonioCampaign; status: 'ready' };

export const DonioCampaignContext = createContext<DonioCampaignState>({
  status: 'loading',
});

export function useDonioCampaignState(): DonioCampaignState {
  return useContext(DonioCampaignContext);
}
