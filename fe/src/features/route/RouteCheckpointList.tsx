import type { RouteCheckpoint, RouteData } from './routeTypes';

interface RouteCheckpointListProps {
  route: RouteData;
}

interface KeyRoutePoint {
  distance: string;
  name: string;
  note?: string;
}

const keyRoutePoints: readonly KeyRoutePoint[] = [
  {
    distance: '0 km',
    name: 'Jasná, Demänovská dolina (Nízke Tatry)',
    note: 'Štart',
  },
  { distance: 'cca 35 km', name: 'Partizánska Ľupča' },
  {
    distance: 'cca 95 km',
    name: 'Banská Bystrica',
    note: 'Tu si rád spravím nočný prebeh mestom s kýmkoľvek.',
  },
  { distance: 'cca 145 km', name: 'Žiar nad Hronom' },
  { distance: 'cca 175 km', name: 'Žarnovica' },
  {
    distance: 'cca 210 km',
    name: 'Vráble',
    note: 'Tu si so mnou zabehnú kamaráti z Nitry, pridaj sa!',
  },
  { distance: 'cca 265 km', name: 'Šaľa' },
  { distance: 'cca 315 km', name: 'Šamorín' },
  {
    distance: '345 km',
    name: 'Bratislava, Tyršovo nábrežie',
    note: 'Cieľ. Tu musíš byť proste…',
  },
];

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
  return (
    <div className="route-checkpoints">
      <h4>kľúčové body na trati</h4>
      <ol aria-label="Deväť kľúčových bodov trasy" className="route-checkpoints__key">
        {keyRoutePoints.map((point) => (
          <li className="route-checkpoint" key={point.name}>
            <span className="route-checkpoint__distance">{point.distance}</span>
            <strong>{point.name}</strong>
            {point.note ? <span className="route-checkpoint__note">{point.note}</span> : null}
          </li>
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
