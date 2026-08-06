import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cwd } from 'node:process';
import JSZip from 'jszip';
import { describe, expect, it } from 'vitest';
import {
  assertProductionRouteContract,
  parseGpx,
  parseKml,
  parseKmz,
  RouteDataError,
} from './routeParser';

const kmlFixture = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <Placemark><name>Štart Jasná</name><Point><coordinates>19.5,48.9,0</coordinates></Point></Placemark>
    <Placemark><name>1. Medzibod</name><Point><coordinates>19.0,48.7,0</coordinates></Point></Placemark>
    <Placemark><name>2. Cieľ Test</name><Point><coordinates>18.5,48.5,0</coordinates></Point></Placemark>
    <Placemark><name>Prvá časť</name><LineString><coordinates>
      19.5,48.9,0 19.0,48.7,0
    </coordinates></LineString></Placemark>
    <Placemark><name>Druhá časť</name><LineString><coordinates>
      19.0,48.7,0 18.5,48.5,0
    </coordinates></LineString></Placemark>
  </Document>
</kml>`;
const productionAssetPath = resolve(cwd(), 'public/routes/MAJO_Od_Tatier_k_Dunaju_2026.kmz');

describe('route parser', () => {
  it('parses namespace-aware KML segments, markers and coordinate order', () => {
    const route = parseKml(kmlFixture);

    expect(route.segments).toHaveLength(2);
    expect(route.segments[0][0]).toEqual([48.9, 19.5]);
    expect(route.checkpoints.map(({ kind, sourceNumber }) => ({ kind, sourceNumber }))).toEqual([
      { kind: 'start', sourceNumber: null },
      { kind: 'handoff', sourceNumber: 1 },
      { kind: 'finish', sourceNumber: 2 },
    ]);
    expect(route.checkpoints[0].distanceKm).toBe(0);
    expect(route.checkpoints[2].distanceKm).toBeGreaterThan(route.checkpoints[1].distanceKm);
    expect(route.bounds).toEqual([[48.5, 18.5], [48.9, 19.5]]);
  });

  it('opens KMZ data with JSZip and selects doc.kml', async () => {
    const archive = new JSZip();
    archive.file('ignored.kml', '<not-kml>');
    archive.file('doc.kml', kmlFixture);

    const route = await parseKmz(await archive.generateAsync({ type: 'uint8array' }));

    expect(route.checkpoints).toHaveLength(3);
    expect(route.segments).toHaveLength(2);
  });

  it('parses GPX tracks, routes and named waypoints into the same model', () => {
    const route = parseGpx(`<?xml version="1.0"?>
      <gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1">
        <wpt lat="48.9" lon="19.5"><name>Štart Jasná</name></wpt>
        <wpt lat="48.5" lon="18.5"><name>36. Cieľ Tyršovo nábrežie</name></wpt>
        <trk><trkseg>
          <trkpt lat="48.9" lon="19.5"/><trkpt lat="48.7" lon="19.0"/>
        </trkseg></trk>
        <rte><rtept lat="48.7" lon="19.0"/><rtept lat="48.5" lon="18.5"/></rte>
      </gpx>`);

    expect(route.segments).toHaveLength(2);
    expect(route.checkpoints.map((checkpoint) => checkpoint.kind)).toEqual(['start', 'finish']);
  });

  it('reports malformed archives, XML and missing geometry without guessing', async () => {
    await expect(parseKmz(new Uint8Array([1, 2, 3]))).rejects.toMatchObject({
      code: 'invalid-archive',
    });
    const archiveWithoutKml = new JSZip();
    archiveWithoutKml.file('readme.txt', 'bez trasy');
    await expect(
      parseKmz(await archiveWithoutKml.generateAsync({ type: 'uint8array' })),
    ).rejects.toMatchObject({ code: 'missing-kml' });
    expect(() => parseKml('<kml><Document>')).toThrow(RouteDataError);
    expect(() => parseKml('<kml><Document /></kml>')).toThrow(
      expect.objectContaining({ code: 'missing-geometry' }),
    );
  });
});

describe('production KMZ contract', () => {
  it('contains the approved route and exact 37-point classification', async () => {
    const source = await readFile(productionAssetPath);
    const route = assertProductionRouteContract(await parseKmz(source));

    expect(route.segments.length).toBeGreaterThan(0);
    expect(route.segments.flat().length).toBeGreaterThan(0);
    expect(route.checkpoints).toHaveLength(37);
    expect(route.checkpoints[0]).toMatchObject({
      kind: 'start',
      name: 'Štart Jasná',
      sourceNumber: null,
    });
    expect(route.checkpoints.slice(1, 36).map((checkpoint) => checkpoint.sourceNumber)).toEqual(
      Array.from({ length: 35 }, (_, index) => index + 1),
    );
    expect(route.checkpoints[36]).toMatchObject({
      kind: 'finish',
      name: '36. Cieľ Tyršovo nábrežie',
      sourceNumber: 36,
    });
    expect(route.bounds[0][0]).toBeLessThan(route.bounds[1][0]);
    expect(route.bounds[0][1]).toBeLessThan(route.bounds[1][1]);
  });

  it('rejects a source that does not match the production point contract', () => {
    const route = parseKml(kmlFixture);
    expect(() => assertProductionRouteContract(route)).toThrow(
      expect.objectContaining({ code: 'invalid-contract' }),
    );
  });
});
