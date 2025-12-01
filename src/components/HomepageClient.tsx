'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Bus, Clock, CreditCard } from 'lucide-react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { MapPreview } from '@/components/MapPreview';
import { PALETTE } from '@/lib/designTokens';
import type { Tables } from '@/lib/types';

type RouteSummaryRecord = Tables<'routes'> & {
    start_stop?: { name?: string | null } | null;
    end_stop?: { name?: string | null } | null;
};

interface HomepageClientProps {
    routes: RouteSummaryRecord[];
    children?: React.ReactNode;
}

export function HomepageClient({ routes, children }: HomepageClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'fare' | 'terminal'>('all');

    const filteredRoutes = useMemo(() => {
        let result = routes;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(route =>
                route.display_name.toLowerCase().includes(query) ||
                route.start_stop?.name?.toLowerCase().includes(query) ||
                route.end_stop?.name?.toLowerCase().includes(query) ||
                route.corridors?.some(c => c.toLowerCase().includes(query))
            );
        }

        // Category filter (mock logic for now as we don't have explicit fare/terminal sorting yet)
        // In a real app, 'fare' might sort by price, 'terminal' might group by origin.
        // For this MVP, we'll just keep 'all' as the main view, but the UI supports the switching.

        return result;
    }, [routes, searchQuery, activeFilter]);

    return (
        <div className="min-h-screen" style={{ backgroundColor: PALETTE.bg, color: PALETTE.text }}>
            {/* Search Bar */}
            <div className="flex justify-center mt-8 px-4">
                <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm px-4 py-2 w-full md:w-3/5 lg:w-1/2 max-w-2xl">
                    <Search className="text-gray-400 mr-2" size={18} />
                    <input
                        type="text"
                        placeholder="Search routes, stops, or terminals..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full outline-none text-sm text-gray-700"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex justify-center mt-4 gap-2 md:gap-4 text-sm" style={{ color: PALETTE.textMuted }}>
                <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 md:px-4 py-1 border rounded-full transition-colors ${activeFilter === 'all' ? 'bg-teal-50 border-teal-200' : 'bg-white hover:bg-teal-50'
                        }`}
                >
                    All Routes
                </button>
                <button
                    onClick={() => setActiveFilter('fare')}
                    className={`px-3 md:px-4 py-1 border rounded-full transition-colors ${activeFilter === 'fare' ? 'bg-teal-50 border-teal-200' : 'bg-white hover:bg-teal-50'
                        }`}
                >
                    By Fare
                </button>
                <button
                    onClick={() => setActiveFilter('terminal')}
                    className={`px-3 md:px-4 py-1 border rounded-full transition-colors ${activeFilter === 'terminal' ? 'bg-teal-50 border-teal-200' : 'bg-white hover:bg-teal-50'
                        }`}
                >
                    By Terminal
                </button>
            </div>

            {/* Content */}
            <div className="mt-8 md:mt-10 px-4 md:px-6">
                <header className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold" style={{ color: PALETTE.text }}>
                        {searchQuery ? `Search results (${filteredRoutes.length})` : 'Published routes'}
                    </h2>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRoutes.map((route) => (
                        <Card
                            key={route.id}
                            className="hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                        >
                            <Link href={`/route/${route.slug}`}>
                                <div className="flex items-center justify-between p-4 border-b">
                                    <div>
                                        <h2 className="font-semibold text-lg" style={{ color: PALETTE.text }}>
                                            {route.display_name}
                                        </h2>
                                        <p className="text-sm" style={{ color: PALETTE.textMuted }}>
                                            {route.start_stop?.name ?? 'TBD'} - {route.end_stop?.name ?? 'TBD'}
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        <div
                                            className="h-4 w-4 rounded-sm"
                                            style={{ backgroundColor: route.color }}
                                        />
                                        <div
                                            className="h-4 w-4 rounded-sm"
                                            style={{ backgroundColor: PALETTE.success }}
                                        />
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col gap-2">
                                    {/* Map Preview */}
                                    <div className="overflow-hidden rounded-md">
                                        <MapPreview color={route.color} secondary={PALETTE.success} />
                                    </div>
                                    {/* Route metadata */}
                                    <div className="flex justify-between text-sm mt-2" style={{ color: PALETTE.textMuted }}>
                                        <span className="flex items-center gap-1">
                                            <Bus size={14} /> Route
                                        </span>
                                        {route.hours && (
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} /> {route.hours}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <CreditCard size={14} /> TZS
                                        </span>
                                    </div>
                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {(route.corridors ?? []).map((corridor: string) => (
                                            <Badge key={corridor}>{corridor}</Badge>
                                        ))}
                                        {route.est_buses && (
                                            <Badge colorClassName="bg-emerald-100 text-emerald-800">
                                                {route.est_buses} buses
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </Card>
                    ))}
                    {!filteredRoutes.length && (
                        <Card className="p-6 text-sm text-slate-500 col-span-full text-center">
                            {searchQuery ? 'No routes match your search.' : 'No routes published yet.'}
                        </Card>
                    )}
                </div>
            </div>

            {/* Extra Content (Info Cards) */}
            {children && (
                <div className="mt-8">
                    {children}
                </div>
            )}

            {/* Footer */}
            <footer className="mt-12 md:mt-16 text-center text-sm py-6 border-t" style={{ color: PALETTE.textMuted, backgroundColor: PALETTE.surface }}>
                <p>DARoutes © {new Date().getFullYear()} — Mapping Dar es Salaam&apos;s Public Transport Network</p>
            </footer>
        </div>
    );
}
