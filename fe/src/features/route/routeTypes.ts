export type RouteCoordinate = readonly [latitude: number, longitude: number];

export type RouteBounds = readonly [southWest: RouteCoordinate, northEast: RouteCoordinate];

export type RouteCheckpointKind = 'start' | 'handoff' | 'finish';

export interface RouteCheckpoint {
  coordinate: RouteCoordinate;
  distanceKm: number;
  kind: RouteCheckpointKind;
  name: string;
  sourceNumber: number | null;
}

export interface RouteData {
  bounds: RouteBounds;
  checkpoints: readonly RouteCheckpoint[];
  segments: readonly (readonly RouteCoordinate[])[];
}

export type RouteAssetFormat = 'gpx' | 'kmz';
