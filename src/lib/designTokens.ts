// Design tokens based on DaRoutes Wiki PRD and Wireframe specifications

export const PALETTE = {
    // Primary colors - Teal for trust and clarity
    primary: '#009688',      // Teal 600
    primaryDark: '#00796B',  // Teal 700 - hover states, dark accents

    // Accent - Cyan for fresh, tech-forward identity
    accent: '#5CE1E6',       // Cyan 400

    // Backgrounds
    bg: '#F9FAFB',           // Clean base
    surface: '#FFFFFF',      // Card backgrounds

    // Text
    text: '#1F2937',         // Primary text - near-black gray
    textMuted: '#6B7280',    // Secondary text - subtle gray

    // Status colors
    success: '#00C49A',      // Optimism and growth
    error: '#D32F2F',        // High visibility for errors

    // Route status indicators (for passed/current/upcoming)
    passed: '#D1D5DB',       // Muted gray for completed segments
} as const;

// Typography scale
export const TYPOGRAPHY = {
    fontFamily: {
        sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    fontSize: {
        xs: '0.75rem',     // 12px
        sm: '0.875rem',    // 14px
        base: '1rem',      // 16px
        lg: '1.125rem',    // 18px
        xl: '1.25rem',     // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
    },
} as const;

// Spacing scale (8px grid)
export const SPACING = {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
} as const;

// Border radius
export const RADIUS = {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
} as const;

// Shadows
export const SHADOWS = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;
