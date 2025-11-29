import React, { useMemo } from 'react';
import { PALETTE } from '@/lib/designTokens';

interface FareCalculatorProps {
    peak: boolean;
    stages: Array<{ id: number; name: string }>;
    fares: {
        currency: string;
        peakMultiplier: number;
        offpeakMultiplier: number;
        table: Array<{ from: number; to: number; price: number }>;
    };
    onSelectionChange?: (from: number, to: number) => void;
}

/**
 * FareCalculator component - Interactive fare estimation tool
 * Based on DaRoutes Wiki Wireframe specifications
 * Calculates fare between two stops with peak/off-peak pricing
 */
export function FareCalculator({ peak, stages, fares, onSelectionChange }: FareCalculatorProps) {
    const [sel, setSel] = React.useState<{ from: number; to: number }>({
        from: stages[0]?.id || 1,
        to: stages[1]?.id || 2,
    });

    const price = useMemo(() => {
        const [a, b] = [Math.min(sel.from, sel.to), Math.max(sel.from, sel.to)];
        const base = fares.table
            .filter((r) => r.from >= a && r.to <= b)
            .reduce((sum, r) => sum + r.price, 0);
        const mult = peak ? fares.peakMultiplier : fares.offpeakMultiplier;
        return Math.round(base * mult);
    }, [sel, fares, peak]);

    const handleChange = (field: 'from' | 'to', value: number) => {
        const newSel = { ...sel, [field]: value };
        setSel(newSel);
        onSelectionChange?.(newSel.from, newSel.to);
    };

    return (
        <div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs text-gray-600" htmlFor="fare-from">
                        From
                    </label>
                    <select
                        id="fare-from"
                        value={sel.from}
                        onChange={(e) => handleChange('from', Number(e.target.value))}
                        className="mt-1 w-full rounded-md border px-2 py-2 text-sm"
                    >
                        {stages.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.id}. {s.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-xs text-gray-600" htmlFor="fare-to">
                        To
                    </label>
                    <select
                        id="fare-to"
                        value={sel.to}
                        onChange={(e) => handleChange('to', Number(e.target.value))}
                        className="mt-1 w-full rounded-md border px-2 py-2 text-sm"
                    >
                        {stages.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.id}. {s.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-gray-600">Estimated Fare ({peak ? 'Peak' : 'Off-peak'})</div>
                <div className="text-lg font-semibold">
                    {fares.currency} {price.toLocaleString()}
                </div>
            </div>
        </div>
    );
}
