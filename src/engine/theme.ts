/**
 * Generates a 50–900 color scale from a single base hex color, and injects
 * it as CSS custom properties (RGB triplets) so Tailwind's `brand` color
 * family can be swapped at runtime — one config, one primaryColor, a whole
 * themed product, no rebuild.
 */

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): Rgb {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function mix(a: Rgb, b: Rgb, ratio: number): Rgb {
  return {
    r: Math.round(a.r + (b.r - a.r) * ratio),
    g: Math.round(a.g + (b.g - a.g) * ratio),
    b: Math.round(a.b + (b.b - a.b) * ratio),
  };
}

const WHITE: Rgb = { r: 255, g: 255, b: 255 };
const BLACK: Rgb = { r: 0, g: 0, b: 0 };

/** Shade -> how much to mix toward white (positive) or black (negative). */
const SHADE_RATIOS: Record<number, number> = {
  50: 0.92,
  100: 0.83,
  200: 0.66,
  300: 0.48,
  400: 0.26,
  500: 0, // base color
  600: -0.14,
  700: -0.28,
  800: -0.42,
  900: -0.56,
};

export function generateColorScale(baseHex: string): Record<number, string> {
  const base = hexToRgb(baseHex);
  const scale: Record<number, string> = {};
  for (const [shade, ratio] of Object.entries(SHADE_RATIOS)) {
    const target = ratio >= 0 ? WHITE : BLACK;
    const mixed = ratio === 0 ? base : mix(base, target, Math.abs(ratio));
    scale[Number(shade)] = `${mixed.r} ${mixed.g} ${mixed.b}`;
  }
  return scale;
}

/** Sets --color-brand-{shade} custom properties on the document root. */
export function applyBrandTheme(baseHex: string): void {
  const scale = generateColorScale(baseHex);
  const root = document.documentElement;
  for (const [shade, rgbTriplet] of Object.entries(scale)) {
    root.style.setProperty(`--color-brand-${shade}`, rgbTriplet);
  }
}
