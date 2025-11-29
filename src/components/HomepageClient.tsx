'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { PALETTE } from '@/lib/designTokens';

interface HomepageClientProps {
    children: React.ReactNode;
}

export function HomepageClient({ children }: HomepageClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'fare' | 'terminal'>('all');

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
            <div className="mt-8 md:mt-10">
                {children}
            </div>

            {/* Footer */}
            <footer className="mt-12 md:mt-16 text-center text-sm py-6 border-t" style={{ color: PALETTE.textMuted, backgroundColor: PALETTE.surface }}>
                <p>DARoutes © {new Date().getFullYear()} — Mapping Dar es Salaam's Public Transport Network</p>
            </footer>
        </div>
    );
}
