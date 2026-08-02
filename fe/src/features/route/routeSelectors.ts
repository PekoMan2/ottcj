import type { RouteCheckpoint, RouteData } from './routeTypes';

const KEY_CHECKPOINT_NUMBERS = new Set([5, 10, 15, 20, 25, 30, 35]);

export function selectKeyCheckpoints(route: RouteData): readonly RouteCheckpoint[] {
  return route.checkpoints.filter(
    (checkpoint) => checkpoint.kind === 'start'
      || checkpoint.kind === 'finish'
      || (checkpoint.sourceNumber !== null && KEY_CHECKPOINT_NUMBERS.has(checkpoint.sourceNumber)),
  );
}
