/**
 * Parse CSV file containing lat,lon coordinates
 * Supports headers: lat,lon or latitude,longitude
 */
export function parseCSV(text: string): Array<{ lat: number; lon: number }> {
    const out: Array<{ lat: number; lon: number }> = [];
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

    if (!lines.length) return out;

    // Check if first line is a header
    const firstLine = lines[0].toLowerCase();
    const hasHeader = firstLine.includes('lat') || firstLine.includes('lon');
    const dataLines = hasHeader ? lines.slice(1) : lines;

    for (const line of dataLines) {
        const parts = line.split(',').map((p) => p.trim());
        if (parts.length < 2) continue;

        const lat = parseFloat(parts[0]);
        const lon = parseFloat(parts[1]);

        if (Number.isFinite(lat) && Number.isFinite(lon)) {
            out.push({ lat, lon });
        }
    }

    return out;
}

/**
 * Parse KML file to extract coordinates
 * Naive parse: collects all <coordinates>...lon,lat(,alt)...</coordinates>
 */
export function parseKML(text: string): Array<{ lat: number; lon: number }> {
    const coords: Array<{ lat: number; lon: number }> = [];
    const regex = /<coordinates>([\s\S]*?)<\/coordinates>/gi;
    let m;

    while ((m = regex.exec(text)) !== null) {
        const block = m[1].trim();
        const pairs = block.split(/\s+/);

        for (const p of pairs) {
            const [lonStr, latStr] = p.split(',');
            const lat = parseFloat(latStr);
            const lon = parseFloat(lonStr);

            if (Number.isFinite(lat) && Number.isFinite(lon)) {
                coords.push({ lat, lon });
            }
        }
    }

    return coords;
}

/**
 * Parse uploaded file (KML or CSV) and return coordinates
 */
export async function parseRouteFile(file: File): Promise<{
    points: Array<{ lat: number; lon: number }>;
    error?: string;
}> {
    try {
        const text = await file.text();
        const ext = (file.name.split('.').pop() || '').toLowerCase();
        let pts: Array<{ lat: number; lon: number }> = [];

        if (ext === 'csv') {
            pts = parseCSV(text);
        } else if (ext === 'kml') {
            pts = parseKML(text);
        } else {
            return {
                points: [],
                error: 'Unsupported file type. Please upload .kml or .csv'
            };
        }

        if (!pts.length) {
            return {
                points: [],
                error: 'No coordinates found. Ensure your file has lat/lon pairs.'
            };
        }

        return { points: pts };
    } catch (e) {
        return {
            points: [],
            error: (e as Error).message || 'Failed to parse file'
        };
    }
}
