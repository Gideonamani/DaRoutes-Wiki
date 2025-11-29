'use client';

import React, { useState } from 'react';
import { RouteMap } from '@/components/RouteMap';
import { FareCalculator } from '@/components/FareCalculator';
import { DigitalTicket } from '@/components/DigitalTicket';
import { Card } from '@/components/Card';
import { PALETTE } from '@/lib/designTokens';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface RoutePageClientProps {
    routeColor: string;
    routeName: string;
    routeCode: string;
    stops: Array<{ id: number; name: string }>;
    fares: {
        currency: string;
        peakMultiplier: number;
        offpeakMultiplier: number;
        table: Array<{ from: number; to: number; price: number }>;
    };
    operators: Array<{ name: string; brandColor: string }>;
}

export function RoutePageClient({
    routeColor,
    routeName,
    routeCode,
    stops,
    fares,
    operators
}: RoutePageClientProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [tracking, setTracking] = useState(false);
    const [peak, setPeak] = useState(false);

    // Auto-advance when tracking is enabled
    React.useEffect(() => {
        if (!tracking) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                if (prev >= stops.length - 1) {
                    setTracking(false);
                    return prev;
                }
                return prev + 1;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, [tracking, stops.length]);

    return (
        <div className="space-y-6">
            {/* Route Map with Progress */}
            <Card className="border border-gray-100">
                <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm" style={{ color: PALETTE.textMuted }}>
                            Live Route Preview
                            <span className="ml-2 inline-flex items-center text-[11px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                                Demo: Stop {currentIndex + 1} of {stops.length}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
                                className="p-1 rounded border hover:bg-gray-50"
                                aria-label="Previous stop"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {tracking ? (
                                <button
                                    onClick={() => setTracking(false)}
                                    className="px-2 py-1 rounded-full border bg-white inline-flex items-center gap-1 text-xs"
                                >
                                    <Pause size={14} /> Pause
                                </button>
                            ) : (
                                <button
                                    onClick={() => setTracking(true)}
                                    className="px-2 py-1 rounded-full border bg-white inline-flex items-center gap-1 text-xs"
                                >
                                    <Play size={14} /> Track route
                                </button>
                            )}
                            <button
                                onClick={() => setCurrentIndex((i) => Math.min(i + 1, stops.length - 1))}
                                className="p-1 rounded border hover:bg-gray-50"
                                aria-label="Next stop"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                    <RouteMap color={routeColor} totalStops={stops.length} currentIndex={currentIndex} />
                </div>
            </Card>

            {/* Fare Calculator */}
            <Card className="border border-gray-100">
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="font-semibold">Fare Estimator</div>
                        <div className="flex items-center gap-2 text-xs">
                            <button
                                onClick={() => setPeak(true)}
                                className={`px-3 py-1 rounded-full border ${peak ? 'bg-teal-600 text-white border-transparent' : 'bg-white'}`}
                            >
                                Peak
                            </button>
                            <button
                                onClick={() => setPeak(false)}
                                className={`px-3 py-1 rounded-full border ${!peak ? 'bg-teal-600 text-white border-transparent' : 'bg-white'}`}
                            >
                                Off-peak
                            </button>
                        </div>
                    </div>
                    <FareCalculator peak={peak} stages={stops} fares={fares} />
                </div>
            </Card>

            {/* Digital Ticket */}
            {operators.length > 0 && (
                <Card className="border border-gray-100">
                    <div className="p-4">
                        <div className="font-semibold mb-3">Sample Ticket</div>
                        <DigitalTicket
                            operatorName={operators[0].name}
                            brandColor={operators[0].brandColor}
                            routeName={routeName}
                            routeCode={routeCode}
                            origin={stops[0]?.name || 'Start'}
                            destination={stops[stops.length - 1]?.name || 'End'}
                            fare="750"
                            currency="TZS"
                            validFrom="05:30"
                            validTo="22:00"
                        />
                    </div>
                </Card>
            )}
        </div>
    );
}
