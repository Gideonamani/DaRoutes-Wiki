import type { Feature, FeatureCollection, LineString, Point } from 'geojson';

export interface StopLike {
  local_id: string;
  stop_id?: string;
  name: string;
  lat: number;
  lng: number;
}

export function stopToPointFeature(stop: StopLike): Feature<Point> {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [stop.lng, stop.lat]
    },
    properties: {
      title: stop.name,
      local_id: stop.local_id,
      stop_id: stop.stop_id ?? null
    }
  };
}

export function stopsToFeatureCollection(stops: StopLike[]): FeatureCollection<Point> {
  return {
    type: 'FeatureCollection',
    features: stops.map(stopToPointFeature)
  };
}

export function stopsToLineString(stops: StopLike[]): Feature<LineString> | null {
  if (stops.length < 2) return null;
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: stops.map((stop) => [stop.lng, stop.lat])
    },
    properties: {}
  };
}

export function getBoundsFromStops(stops: StopLike[]): [[number, number], [number, number]] | null {
  if (!stops.length) return null;
  const lats = stops.map((stop) => stop.lat);
  const lngs = stops.map((stop) => stop.lng);
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)]
  ];
}
