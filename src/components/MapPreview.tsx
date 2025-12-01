import React from 'react';


interface MapPreviewProps {
    color?: string;
    secondary?: string;
}

/**
 * MapPreview component - Lightweight SVG map thumbnail for route cards
 * Based on DaRoutes Wiki Wireframe specifications
 * Simulates a route preview without external embeds
 */
export function MapPreview({ color = '#2B7FFF', secondary = '#00C49A' }: MapPreviewProps) {
    return (
        <svg viewBox="0 0 320 120" className="w-full h-24 rounded-md bg-gray-100">
            {/* Grid pattern */}
            <defs>
                <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                </pattern>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.25" />
                </filter>
            </defs>
            <rect x="0" y="0" width="320" height="120" fill="url(#grid)" />

            {/* Terminal markers */}
            <g filter="url(#shadow)">
                <circle cx="24" cy="96" r="6" fill={secondary} />
                <circle cx="296" cy="24" r="6" fill={secondary} />
            </g>

            {/* Route polyline */}
            <polyline
                points="24,96 80,84 112,72 140,68 168,60 196,48 228,40 260,32 296,24"
                fill="none"
                stroke={color}
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    );
}
