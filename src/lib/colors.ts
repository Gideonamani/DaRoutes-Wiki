const HEX_REGEX = /^#?([0-9a-fA-F]{6})$/;

type RGB = { r: number; g: number; b: number };

const DEFAULT_ROUTE_COLORS = [
  '#0ea5e9',
  '#1e3a8a',
  '#16a34a',
  '#f97316',
  '#dc2626',
  '#7c3aed',
  '#0f766e',
  '#d946ef'
];

function hexToRgb(hex: string): RGB | null {
  const match = HEX_REGEX.exec(hex);
  if (!match) return null;
  const value = match[1];
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

function relativeLuminance({ r, g, b }: RGB): number {
  const srgb = [r, g, b].map((v) => {
    const channel = v / 255;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

export function contrastRatio(bgHex: string, textHex: string): number | null {
  const bgRgb = hexToRgb(bgHex);
  const textRgb = hexToRgb(textHex);
  if (!bgRgb || !textRgb) return null;
  const l1 = relativeLuminance(bgRgb) + 0.05;
  const l2 = relativeLuminance(textRgb) + 0.05;
  return Math.max(l1, l2) / Math.min(l1, l2);
}

export function isReadableOn(background: string, text = '#ffffff', minimum = 4.5): boolean {
  const ratio = contrastRatio(background, text);
  return ratio !== null && ratio >= minimum;
}

export { DEFAULT_ROUTE_COLORS };
