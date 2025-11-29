'use client';

import React, { useState, useEffect } from 'react';
import { PALETTE } from '@/lib/designTokens';

// Mock live arrivals - in production this would come from real-time data
const LIVE_ARRIVALS = [
    { route: '14', head: 'Gerezani', etaMin: 3, crowd: 'Moderate', color: '#2B7FFF' },
    { route: '15B', head: 'Kariakoo', etaMin: 6, crowd: 'Light', color: '#10B981' },
    { route: '14', head: 'T/Nyuki', etaMin: 9, crowd: 'Busy', color: '#2B7FFF' },
];

export function LiveArrivals() {
    const [now, setNow] = useState<Date>(new Date());

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between text-sm mb-2">
                <span style={{ color: PALETTE.textMuted }}>Live arrivals</span>
                <span style={{ color: PALETTE.textMuted }} className="text-xs">{now.toLocaleTimeString()}</span>
            </div>
            <div className="divide-y border rounded-xl overflow-hidden bg-white">
                {LIVE_ARRIVALS.map((r, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center h-6 w-8 rounded-md text-white text-xs font-semibold" style={{ background: r.color }}>{r.route}</span>
                            <span style={{ color: PALETTE.text }}>{r.head}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-medium" style={{ color: PALETTE.text }}>{r.etaMin} min</span>
                            <span className="text-xs" style={{ color: PALETTE.textMuted }}>{r.crowd}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
