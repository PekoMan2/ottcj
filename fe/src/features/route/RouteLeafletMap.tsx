import 'leaflet/dist/leaflet.css';
import { divIcon, type Map as LeafletMap } from 'leaflet';
import { useMemo, useRef } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip } from 'react-leaflet';
import type { RouteBounds, RouteCheckpoint, RouteCoordinate, RouteData } from './routeTypes';

interface RouteLeafletMapProps {
  route: RouteData;
}

type LeafletCoordinate = [number, number];
type LeafletBounds = [LeafletCoordinate, LeafletCoordinate];

function leafletCoordinate([latitude, longitude]: RouteCoordinate): LeafletCoordinate {
  return [latitude, longitude];
}

function leafletBounds([[south, west], [north, east]]: RouteBounds): LeafletBounds {
  return [[south, west], [north, east]];
}

function checkpointLabel(checkpoint: RouteCheckpoint): string {
  if (checkpoint.kind === 'start') return 'Š';
  if (checkpoint.kind === 'finish') return 'C';
  return String(checkpoint.sourceNumber);
}

function checkpointIcon(checkpoint: RouteCheckpoint) {
  const isEndpoint = checkpoint.kind !== 'handoff';
  const size = isEndpoint ? 28 : 14;
  const label = document.createElement('span');
  label.className = `route-marker__label route-marker__label--${checkpoint.kind}`;
  label.textContent = isEndpoint ? checkpointLabel(checkpoint) : '';

  return divIcon({
    className: 'route-marker',
    html: label,
    iconAnchor: [size / 2, size / 2],
    iconSize: [size, size],
    popupAnchor: [0, -size / 2],
  });
}

function CheckpointDetails({ checkpoint }: { checkpoint: RouteCheckpoint }) {
  return (
    <>
      <strong>{checkpoint.name}</strong>
      <br />
      približne km {Math.round(checkpoint.distanceKm).toLocaleString('sk-SK')}
    </>
  );
}

export default function RouteLeafletMap({ route }: RouteLeafletMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const bounds = useMemo(() => leafletBounds(route.bounds), [route.bounds]);
  const segments = useMemo(
    () => route.segments.map((segment) => segment.map(leafletCoordinate)),
    [route.segments],
  );

  return (
    <div aria-label="Interaktívna mapa oficiálnej trasy" className="route-map__canvas" role="region">
      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: [28, 28] }}
        className="route-map__leaflet"
        maxZoom={17}
        ref={mapRef}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {segments.map((segment, index) => (
          <Polyline
            key={`outline-${index}`}
            pathOptions={{ color: '#0f1419', lineCap: 'round', lineJoin: 'round', weight: 9 }}
            positions={segment}
          />
        ))}
        {segments.map((segment, index) => (
          <Polyline
            key={`route-${index}`}
            pathOptions={{ color: '#e8622d', lineCap: 'round', lineJoin: 'round', weight: 5 }}
            positions={segment}
          />
        ))}
        {route.checkpoints.map((checkpoint) => (
          <Marker
            alt={checkpoint.name}
            icon={checkpointIcon(checkpoint)}
            key={checkpoint.name}
            keyboard
            position={leafletCoordinate(checkpoint.coordinate)}
            title={checkpoint.name}
          >
            <Tooltip
              className="route-map__tooltip"
              direction="top"
              offset={[0, -10]}
              opacity={1}
            >
              <CheckpointDetails checkpoint={checkpoint} />
            </Tooltip>
            <Popup>
              <CheckpointDetails checkpoint={checkpoint} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <button
        className="route-map__reset"
        onClick={() => mapRef.current?.fitBounds(bounds, { padding: [28, 28] })}
        type="button"
      >
        celá trasa
      </button>
    </div>
  );
}
