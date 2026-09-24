/** Natural Earth land GeoJSON → texture mask for the three.js connection globe. */

type LonLat = [number, number];
type PolygonCoords = LonLat[][];
type MultiPolygonCoords = LonLat[][][];

type GeoFeatureCollection = {
  type: string;
  features: Array<{
    type: string;
    geometry:
      | { type: 'Polygon'; coordinates: PolygonCoords }
      | { type: 'MultiPolygon'; coordinates: MultiPolygonCoords }
      | { type: string; coordinates: unknown };
  }>;
};

/** Same mapping as three's SphereGeometry UVs, so markers line up with the land texture. */
export function latLonToVector3(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

let geoCache: Promise<GeoFeatureCollection> | null = null;

export function loadLandGeo(): Promise<GeoFeatureCollection> {
  if (!geoCache) {
    geoCache = fetch('/geo/ne_110m_land.geojson').then((res) => {
      if (!res.ok) throw new Error('geo fetch failed');
      return res.json() as Promise<GeoFeatureCollection>;
    });
    geoCache.catch(() => {
      geoCache = null;
    });
  }
  return geoCache;
}

function unwrapRing(ring: LonLat[]): LonLat[] {
  if (ring.length === 0) return ring;
  const out: LonLat[] = [[ring[0][0], ring[0][1]]];
  for (let i = 1; i < ring.length; i += 1) {
    let lon = ring[i][0];
    const prev = out[i - 1][0];
    while (lon - prev > 180) lon -= 360;
    while (lon - prev < -180) lon += 360;
    out.push([lon, ring[i][1]]);
  }
  return out;
}

let cachedMask: HTMLCanvasElement | null = null;

/** White land on a transparent ocean (equirectangular). Color and grain live in the shader. */
export function paintLandMask(geo: GeoFeatureCollection, width = 1024, height = 512): HTMLCanvasElement {
  if (cachedMask) return cachedMask;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return canvas;

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = 'rgba(255,255,255,0.28)';
  ctx.lineWidth = 1.8;
  ctx.lineJoin = 'round';

  const project = (lon: number, lat: number): [number, number] => [
    ((lon + 180) / 360) * width,
    ((90 - lat) / 180) * height,
  ];

  const paintPolygon = (rings: PolygonCoords) => {
    const exterior = rings[0];
    if (!exterior) return;
    const ring = unwrapRing(exterior);
    if (ring.length < 3) return;
    // Draw three copies so polygons crossing the antimeridian wrap correctly.
    for (const shiftX of [-width, 0, width]) {
      ctx.beginPath();
      ring.forEach(([lon, lat], i) => {
        const [x, y] = project(lon, lat);
        if (i === 0) ctx.moveTo(x + shiftX, y);
        else ctx.lineTo(x + shiftX, y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  };

  for (const feature of geo.features) {
    const g = feature.geometry;
    if (!g) continue;
    if (g.type === 'Polygon') paintPolygon(g.coordinates as PolygonCoords);
    else if (g.type === 'MultiPolygon') {
      for (const poly of g.coordinates as MultiPolygonCoords) paintPolygon(poly);
    }
  }

  cachedMask = canvas;
  return canvas;
}
