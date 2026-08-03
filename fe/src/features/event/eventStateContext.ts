import { createContext, useContext } from 'react';
import type { EventState } from './eventState';

export type EventStateLoadState =
  | { status: 'loading' }
  | { message: string; status: 'error' }
  | { data: EventState; status: 'ready' };

export const EventStateContext = createContext<EventStateLoadState | null>(null);

export function useEventState(): EventStateLoadState {
  const state = useContext(EventStateContext);
  if (!state) throw new Error('useEventState must be used inside EventStateProvider');
  return state;
}
