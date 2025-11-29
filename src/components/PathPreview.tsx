'use client';

import React from 'react';
import { PALETTE } from '@/lib/designTokens';

interface PathPreviewProps {
    points: Array<{ lat: number; lon: number }>;
    height?: number;
}

/**
 * Simple SVG preview for uploaded route path
 * Displays coordinates as a polyline with grid background
 */
export function PathPreview({ points, height = 256 }: PathPreviewProps) {
    const pad = 16;
    const width = 480;

    if (!points || points.length < 2) {
        return (
            <div className="h-64 w-full rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                Upload a .kml or .csv to see a route path preview
            </div>
        );
    }

    const lats = points.map((p) => p.lat);
    const lons = points.map((p) => p.lon);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const spanLat = Math.max(maxLat - minLat, 1e-6);
    const spanLon = Math.max(maxLon - minLon, 1e-6);

    const project = (pt: { lat: number; lon: number }): [number, number] => {
        const x = pad + ((pt.lon - minLon) / spanLon) * (width - 2 * pad);
        const y = pad + (1 - (pt.lat - minLat) / spanLat) * (height - 2 * pad);
        return [x, y];
    };

    const d = points
        .map(project)
        .map(([x, y]) => `${x},${y}`)
        .join(' ');

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-64 rounded-lg bg-gray-100"
        >
            <defs>
                <pattern
                    id="grid16"
                    width="16"
                    height="16"
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d="M 16 0 L 0 0 0 16"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                    />
                </pattern>
            </defs>
            <rect x={0} y={0} width={width} height={height} fill="url(#grid16)" />
            <polyline
                points={d}
                fill="none"
                stroke={PALETTE.primary}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {points.map((p, i) => {
                const [x, y] = project(p);
                return <circle key={i} cx={x} cy={y} r={3} fill={PALETTE.text} />;
            })}
        </svg>
    );
}
