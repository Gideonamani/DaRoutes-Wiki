'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import maplibregl, { type Map, type MapMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { stopsToFeatureCollection, stopsToLineString, type StopLike } from '@/lib/geo';

interface MapEditorProps {
  stops: StopLike[];
  color: string;
  styleUrl?: string;
  interactive?: boolean;
  onMapAdd?: (coordinates: { lat: number; lng: number }) => void;
}

export function MapEditor({
  stops,
  color,
  styleUrl = process.env.NEXT_PUBLIC_MAPLIBRE_STYLE_URL ?? 'https://demotiles.maplibre.org/style.json',
  interactive = true,
  onMapAdd
}: MapEditorProps) {
  const mapRef = useRef<Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const stopsGeoJson = useMemo(() => stopsToFeatureCollection(stops), [stops]);
  const lineGeoJson = useMemo(() => stopsToLineString(stops), [stops]);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: stops.length
        ? [stops[0].lng, stops[0].lat]
        : [39.288, -6.81], // Dar CBD default
      zoom: stops.length ? 12 : 11,
      interactive
    });
    mapRef.current = map;

    map.on('load', () => {
      map.addSource('route-stops', {
        type: 'geojson',
        data: stopsGeoJson
      });
      map.addLayer({
        id: 'route-stops-layer',
        type: 'circle',
        source: 'route-stops',
        paint: {
          'circle-radius': 6,
          'circle-color': '#ffffff',
          'circle-stroke-width': 3,
          'circle-stroke-color': color
        }
      });

      map.addSource('route-line', {
        type: 'geojson',
        data: lineGeoJson ?? {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: []
          },
          properties: {}
        }
      });

      map.addLayer({
        id: 'route-line-layer',
        type: 'line',
        source: 'route-line',
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-width': 4,
          'line-color': color
        }
      });
    });

    if (interactive && onMapAdd) {
      map.on('click', (event: MapMouseEvent) => {
        onMapAdd({ lat: event.lngLat.lat, lng: event.lngLat.lng });
      });
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [color, interactive, onMapAdd, stopsGeoJson, styleUrl, lineGeoJson, stops.length, stops]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const source = map.getSource('route-stops') as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData(stopsGeoJson);
    }
    const lineSource = map.getSource('route-line') as maplibregl.GeoJSONSource | undefined;
    if (lineSource) {
      lineSource.setData(
        lineGeoJson ?? {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: [] },
          properties: {}
        }
      );
    }
  }, [stopsGeoJson, lineGeoJson]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (stops.length < 2) return;
    const bounds = stops.reduce((acc, stop) => acc.extend([stop.lng, stop.lat]), new maplibregl.LngLatBounds());
    mapRef.current.fitBounds(bounds, { padding: 32, maxZoom: 16, duration: 400 });
  }, [stops]);

  const memoizedColor = useMemo(() => color, [color]);
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (map.getLayer('route-line-layer')) {
      map.setPaintProperty('route-line-layer', 'line-color', memoizedColor);
    }
    if (map.getLayer('route-stops-layer')) {
      map.setPaintProperty('route-stops-layer', 'circle-stroke-color', memoizedColor);
    }
  }, [memoizedColor]);

  const handlePreventScroll = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    if (!interactive) {
      event.preventDefault();
    }
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      onWheel={handlePreventScroll}
      className="h-80 w-full overflow-hidden rounded-lg border border-slate-200"
      aria-label="Route map editor"
    />
  );
}
