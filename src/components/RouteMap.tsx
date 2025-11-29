import React from 'react';
import { PALETTE } from '@/lib/designTokens';

interface RouteMapProps {
    color?: string;
    totalStops: number;
    currentIndex: number;
    className?: string;
}

/**
 * RouteMap component - SVG visualization showing route progress
 * Based on DaRoutes Wiki Wireframe specifications
 * Shows passed/current/upcoming stops with visual indicators
 */
export function RouteMap({
    color = PALETTE.primary,
    totalStops,
    currentIndex,
    className = ''
}: RouteMapProps) {
    const width = 800;
    const height = 320;
    const start = { x: 60, y: 260 };
    const end = { x: 740, y: 60 };

    // Generate stop positions along a curved path
    const pts = Array.from({ length: totalStops }, (_, i) => {
        const t = i / (totalStops - 1);
        const x = start.x + (end.x - start.x) * t;
        const y = start.y + (end.y - start.y) * t - Math.sin(t * Math.PI) * 30;
        return { x, y };
    });

    // Generate segments between stops
    const segs = pts.slice(0, -1).map((p, i) => ({ a: p, b: pts[i + 1], i }));

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className={`w-full h-64 md:h-80 rounded-xl bg-gray-100 ${className}`}
        >
            <defs>
                <pattern id="grid32" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                </pattern>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.25" />
                </filter>
            </defs>
            <rect x={0} y={0} width={width} height={height} fill="url(#grid32)" />

            {/* Route segments */}
            {segs.map(({ a, b, i }) => {
                const isPassed = i < currentIndex - 1;
                const isCurrent = i === currentIndex - 1;
                const stroke = isPassed ? PALETTE.passed : color;
                const dash = isCurrent ? '6,6' : '0';
                return (
                    <line
                        key={i}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke={stroke}
                        strokeWidth={isCurrent ? 6 : 5}
                        strokeDasharray={dash}
                        strokeLinecap="round"
                    />
                );
            })}

            {/* Stop markers */}
            {pts.map((p, i) => {
                const isPassed = i < currentIndex;
                const isCurrent = i === currentIndex;
                const fill = isCurrent ? color : isPassed ? PALETTE.passed : '#111827';
                return (
                    <g key={i}>
                        <circle cx={p.x} cy={p.y} r={isCurrent ? 7 : 5} fill={fill} />
                        {isCurrent && (
                            <circle cx={p.x} cy={p.y} r={12} fill="none" stroke={color} strokeWidth={2} opacity={0.6} />
                        )}
                    </g>
                );
            })}
        </svg>
    );
}
