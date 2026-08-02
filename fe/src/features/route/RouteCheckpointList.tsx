import { selectKeyCheckpoints } from './routeSelectors';
import type { RouteCheckpoint, RouteData } from './routeTypes';

interface RouteCheckpointListProps {
  route: RouteData;
}

function checkpointDistance(checkpoint: RouteCheckpoint): string {
  return `km ${Math.round(checkpoint.distanceKm).toLocaleString('sk-SK')}`;
}

function CheckpointRow({ checkpoint }: { checkpoint: RouteCheckpoint }) {
  return (
    <li className="route-checkpoint">
      <span className="route-checkpoint__distance">{checkpointDistance(checkpoint)}</span>
      <strong>{checkpoint.name}</strong>
    </li>
  );
}

export function RouteCheckpointList({ route }: RouteCheckpointListProps) {
  const keyCheckpoints = selectKeyCheckpoints(route);

  return (
    <div className="route-checkpoints">
      <h4>kľúčové body na trati</h4>
      <ol aria-label="Deväť kľúčových bodov trasy" className="route-checkpoints__key">
        {keyCheckpoints.map((checkpoint) => (
          <CheckpointRow checkpoint={checkpoint} key={checkpoint.name} />
        ))}
      </ol>

      <details className="route-checkpoints__all">
        <summary>všetky body · štart + 36 očíslovaných bodov</summary>
        <ol aria-label="Všetkých 37 bodov trasy">
          {route.checkpoints.map((checkpoint) => (
            <CheckpointRow checkpoint={checkpoint} key={checkpoint.name} />
          ))}
        </ol>
      </details>
    </div>
  );
}
