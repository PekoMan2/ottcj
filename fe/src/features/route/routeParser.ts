import JSZip from 'jszip';
import type {
  RouteAssetFormat,
  RouteBounds,
  RouteCheckpoint,
  RouteCheckpointKind,
  RouteCoordinate,
  RouteData,
} from './routeTypes';

const EARTH_RADIUS_KM = 6_371.0088;
const PRODUCTION_CHECKPOINT_COUNT = 37;

export type RouteDataErrorCode =
  | 'invalid-archive'
  | 'invalid-contract'
  | 'invalid-xml'
  | 'missing-geometry'
  | 'missing-kml';

export class RouteDataError extends Error {
  readonly code: RouteDataErrorCode;

  constructor(code: RouteDataErrorCode, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'RouteDataError';
    this.code = code;
  }
}

interface ParsedCheckpoint {
  coordinate: RouteCoordinate;
  kind: RouteCheckpointKind;
  name: string;
  sourceNumber: number | null;
}

interface ParsedGeometry {
  checkpoints: ParsedCheckpoint[];
  segments: RouteCoordinate[][];
}

function elementsByLocalName(parent: Element | Document, localName: string): Element[] {
  return Array.from(parent.getElementsByTagNameNS('*', localName));
}

function firstDirectChild(parent: Element, localName: string): Element | undefined {
  return Array.from(parent.children).find((child) => child.localName === localName);
}

function parseXml(source: string): Document {
  const document = new DOMParser().parseFromString(source, 'application/xml');

  if (elementsByLocalName(document, 'parsererror').length > 0) {
    throw new RouteDataError('invalid-xml', 'Súbor trasy neobsahuje platné XML.');
  }

  return document;
}

function assertCoordinate(latitude: number, longitude: number): RouteCoordinate {
  if (
    !Number.isFinite(latitude)
    || !Number.isFinite(longitude)
    || latitude < -90
    || latitude > 90
    || longitude < -180
    || longitude > 180
  ) {
    throw new RouteDataError('invalid-xml', 'Súbor trasy obsahuje neplatnú súradnicu.');
  }

  return [latitude, longitude];
}

function parseKmlCoordinates(value: string): RouteCoordinate[] {
  const tokens = value.trim().split(/\s+/).filter(Boolean);

  return tokens.map((token) => {
    const [longitudeValue, latitudeValue] = token.split(',');
    return assertCoordinate(Number(latitudeValue), Number(longitudeValue));
  });
}

function parseGpxCoordinate(element: Element): RouteCoordinate {
  return assertCoordinate(Number(element.getAttribute('lat')), Number(element.getAttribute('lon')));
}

function checkpointIdentity(name: string): Pick<ParsedCheckpoint, 'kind' | 'sourceNumber'> {
  const numberedMatch = name.match(/^\s*(\d+)\.\s*/u);
  const sourceNumber = numberedMatch ? Number(numberedMatch[1]) : null;
  const normalizedName = name.toLocaleLowerCase('sk');

  if (normalizedName.includes('štart')) {
    return { kind: 'start', sourceNumber };
  }

  if (normalizedName.includes('cieľ')) {
    return { kind: 'finish', sourceNumber };
  }

  return { kind: 'handoff', sourceNumber };
}

function parsedCheckpoint(name: string, coordinate: RouteCoordinate): ParsedCheckpoint {
  const normalizedName = name.trim();

  if (!normalizedName) {
    throw new RouteDataError('invalid-xml', 'Bod trasy nemá názov.');
  }

  return {
    coordinate,
    name: normalizedName,
    ...checkpointIdentity(normalizedName),
  };
}

function parseKmlDocument(document: Document): ParsedGeometry {
  const geometry: ParsedGeometry = { checkpoints: [], segments: [] };

  for (const placemark of elementsByLocalName(document, 'Placemark')) {
    const name = firstDirectChild(placemark, 'name')?.textContent ?? '';

    for (const lineString of elementsByLocalName(placemark, 'LineString')) {
      const coordinates = elementsByLocalName(lineString, 'coordinates')[0]?.textContent ?? '';
      const segment = parseKmlCoordinates(coordinates);

      if (segment.length >= 2) geometry.segments.push(segment);
    }

    for (const point of elementsByLocalName(placemark, 'Point')) {
      const coordinates = elementsByLocalName(point, 'coordinates')[0]?.textContent ?? '';
      const [coordinate] = parseKmlCoordinates(coordinates);

      if (!coordinate) {
        throw new RouteDataError('invalid-xml', 'Bod trasy nemá súradnicu.');
      }

      geometry.checkpoints.push(parsedCheckpoint(name, coordinate));
    }
  }

  return geometry;
}

function parseGpxDocument(document: Document): ParsedGeometry {
  const geometry: ParsedGeometry = { checkpoints: [], segments: [] };

  for (const trackSegment of elementsByLocalName(document, 'trkseg')) {
    const segment = elementsByLocalName(trackSegment, 'trkpt').map(parseGpxCoordinate);
    if (segment.length >= 2) geometry.segments.push(segment);
  }

  for (const route of elementsByLocalName(document, 'rte')) {
    const segment = elementsByLocalName(route, 'rtept').map(parseGpxCoordinate);
    if (segment.length >= 2) geometry.segments.push(segment);
  }

  for (const waypoint of elementsByLocalName(document, 'wpt')) {
    const name = firstDirectChild(waypoint, 'name')?.textContent ?? '';
    geometry.checkpoints.push(parsedCheckpoint(name, parseGpxCoordinate(waypoint)));
  }

  return geometry;
}

function degreesToRadians(value: number): number {
  return value * Math.PI / 180;
}

export function distanceBetweenCoordinates(
  [latitudeA, longitudeA]: RouteCoordinate,
  [latitudeB, longitudeB]: RouteCoordinate,
): number {
  const latitudeDelta = degreesToRadians(latitudeB - latitudeA);
  const longitudeDelta = degreesToRadians(longitudeB - longitudeA);
  const firstLatitude = degreesToRadians(latitudeA);
  const secondLatitude = degreesToRadians(latitudeB);
  const haversine = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(firstLatitude) * Math.cos(secondLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(haversine));
}

function routeBounds(segments: readonly (readonly RouteCoordinate[])[]): RouteBounds {
  const coordinates = segments.flat();

  if (coordinates.length === 0) {
    throw new RouteDataError('missing-geometry', 'Súbor neobsahuje trasu.');
  }

  let south = 90;
  let west = 180;
  let north = -90;
  let east = -180;

  for (const [latitude, longitude] of coordinates) {
    south = Math.min(south, latitude);
    west = Math.min(west, longitude);
    north = Math.max(north, latitude);
    east = Math.max(east, longitude);
  }

  return [[south, west], [north, east]];
}

interface IndexedCoordinate {
  coordinate: RouteCoordinate;
  cumulativeKm: number;
}

function indexedRoute(segments: readonly (readonly RouteCoordinate[])[]): IndexedCoordinate[] {
  const indexed: IndexedCoordinate[] = [];
  let cumulativeKm = 0;

  for (const segment of segments) {
    segment.forEach((coordinate, index) => {
      if (index > 0) cumulativeKm += distanceBetweenCoordinates(segment[index - 1], coordinate);
      indexed.push({ coordinate, cumulativeKm });
    });
  }

  return indexed;
}

function addCheckpointDistances(
  checkpoints: readonly ParsedCheckpoint[],
  segments: readonly (readonly RouteCoordinate[])[],
): RouteCheckpoint[] {
  const route = indexedRoute(segments);
  let searchStartIndex = 0;

  return checkpoints.map((checkpoint) => {
    let nearestIndex = searchStartIndex;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (let index = searchStartIndex; index < route.length; index += 1) {
      const distance = distanceBetweenCoordinates(checkpoint.coordinate, route[index].coordinate);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    }

    searchStartIndex = nearestIndex;

    return {
      ...checkpoint,
      distanceKm: route[nearestIndex].cumulativeKm,
    };
  });
}

function normalizeGeometry({ checkpoints, segments }: ParsedGeometry): RouteData {
  if (segments.length === 0 || checkpoints.length === 0) {
    throw new RouteDataError('missing-geometry', 'Súbor neobsahuje trasu a body odovzdávok.');
  }

  return {
    bounds: routeBounds(segments),
    checkpoints: addCheckpointDistances(checkpoints, segments),
    segments,
  };
}

export function parseKml(source: string): RouteData {
  return normalizeGeometry(parseKmlDocument(parseXml(source)));
}

export function parseGpx(source: string): RouteData {
  return normalizeGeometry(parseGpxDocument(parseXml(source)));
}

export async function parseKmz(source: ArrayBuffer | Uint8Array): Promise<RouteData> {
  let archive: JSZip;

  try {
    archive = await JSZip.loadAsync(source);
  } catch (error) {
    throw new RouteDataError('invalid-archive', 'KMZ súbor sa nepodarilo otvoriť.', { cause: error });
  }

  const kmlFiles = Object.values(archive.files).filter(
    (file) => !file.dir && file.name.toLowerCase().endsWith('.kml'),
  );
  const kmlFile = kmlFiles.find((file) => file.name.toLowerCase() === 'doc.kml') ?? kmlFiles[0];

  if (!kmlFile) {
    throw new RouteDataError('missing-kml', 'KMZ archív neobsahuje KML súbor.');
  }

  return parseKml(await kmlFile.async('text'));
}

export async function parseRouteAsset(
  source: ArrayBuffer,
  format: RouteAssetFormat,
): Promise<RouteData> {
  if (format === 'gpx') return parseGpx(new TextDecoder().decode(source));
  return parseKmz(source);
}

export function assertProductionRouteContract(route: RouteData): RouteData {
  const { checkpoints } = route;
  const start = checkpoints[0];
  const finish = checkpoints.at(-1);
  const hasExpectedStart = start?.kind === 'start'
    && start.sourceNumber === null
    && start.name === 'Štart Jasná';
  const hasExpectedHandoffs = checkpoints.slice(1, 36).every(
    (checkpoint, index) => checkpoint.kind === 'handoff'
      && checkpoint.sourceNumber === index + 1,
  );
  const hasExpectedFinish = finish?.kind === 'finish'
    && finish.sourceNumber === 36
    && finish.name === '36. Cieľ Tyršovo nábrežie';

  if (
    checkpoints.length !== PRODUCTION_CHECKPOINT_COUNT
    || !hasExpectedStart
    || !hasExpectedHandoffs
    || !hasExpectedFinish
  ) {
    throw new RouteDataError(
      'invalid-contract',
      'Súbor trasy nezodpovedá schválenej zostave 37 bodov.',
    );
  }

  return route;
}
