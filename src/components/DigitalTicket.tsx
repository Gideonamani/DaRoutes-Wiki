import React from 'react';


interface DigitalTicketProps {
    operatorName: string;
    brandColor: string;
    routeName: string;
    routeCode: string;
    origin: string;
    destination: string;
    fare: string;
    currency: string;
    validFrom: string;
    validTo: string;
}

/**
 * DigitalTicket component - Visual ticket representation
 * Based on DaRoutes Wiki Wireframe specifications
 * Shows a styled digital ticket with route and fare information
 */
export function DigitalTicket({
    operatorName,
    brandColor,
    routeName,
    routeCode,
    origin,
    destination,
    fare,
    currency,
    validFrom,
    validTo
}: DigitalTicketProps) {
    return (
        <div className="rounded-2xl border shadow-sm overflow-hidden bg-white">
            {/* Header with operator branding */}
            <div
                className="px-4 py-3 flex items-center justify-between text-white"
                style={{ backgroundColor: brandColor }}
            >
                <div className="text-sm font-semibold tracking-wide">DARoutes Ticket</div>
                <div className="text-xs opacity-90">Operator: {operatorName}</div>
            </div>

            {/* Ticket body */}
            <div className="p-4">
                {/* Route info */}
                <div className="flex items-center justify-between text-sm">
                    <div>
                        <div className="text-gray-500">Route</div>
                        <div className="font-semibold">
                            {routeName} ({routeCode})
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-gray-500">Valid</div>
                        <div className="font-semibold">Today • {validFrom}–{validTo}</div>
                    </div>
                </div>

                {/* Perforation line */}
                <div className="relative w-full h-0.5 border-t border-dashed border-gray-300 my-2" />

                {/* Journey details */}
                <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                        <div className="text-gray-500">From</div>
                        <div className="font-medium">{origin}</div>
                    </div>
                    <div>
                        <div className="text-gray-500">To</div>
                        <div className="font-medium">{destination}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-gray-500">Fare</div>
                        <div className="font-semibold">{currency} {fare}</div>
                    </div>
                </div>

                {/* Footer notes */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                        Sample design — fares are governed by city rules; styling may vary by operator.
                    </div>
                    <div className="text-[10px] text-gray-500">No refund • Non-transferable</div>
                </div>

                {/* QR code placeholder */}
                <div className="mt-3 flex justify-end">
                    <div className="grid grid-cols-5 grid-rows-5 gap-0.5">
                        {Array.from({ length: 25 }).map((_, i) => (
                            <div
                                key={i}
                                className={`${i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-200'} w-2 h-2`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
