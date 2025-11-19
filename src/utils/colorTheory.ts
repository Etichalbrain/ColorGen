/**
 * Color Theory utilities using HSL color space
 * HSL provides intuitive color control for professional palettes
 * 
 * HSL components:
 * - H (Hue): 0-360, color wheel position
 * - S (Saturation): 0-100%, color intensity
 * - L (Lightness): 0-100%, brightness level
 */

interface HSL {
  h: number; // 0-360 (hue)
  s: number; // 0-100 (saturation %)
  l: number; // 0-100 (lightness %)
}

/**
 * Style definitions in HSL space
 * These ranges ensure professional colors across all hues
 */
export const HSL_STYLES = {
  vibrant: {
    primary: { l: [45, 55], s: [60, 80] },
    secondary: { l: [50, 60], s: [50, 70] },
    accent: { l: [60, 70], s: [70, 90] }
  },
  pastel: {
    primary: { l: [80, 90], s: [25, 40] },
    secondary: { l: [82, 92], s: [20, 35] },
    accent: { l: [75, 85], s: [35, 50] }
  },
  dark: {
    primary: { l: [25, 35], s: [40, 60] },
    secondary: { l: [30, 40], s: [35, 55] },
    accent: { l: [50, 60], s: [60, 80] }
  }
} as const;

/**
 * Convert HSL to HEX color
 */
export function hslToHex(h: number, s: number, l: number): string {
  // Normalize values
  h = h % 360;
  if (h < 0) h += 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert HEX to HSL
 */
export function hexToHSL(hex: string | undefined): HSL {
  if (!hex || hex.trim() === '') {
    return { h: 0, s: 0, l: 0 };
  }

  try {
    // Remove # if present
    hex = hex.replace(/^#/, '').trim();
    
    // Validate hex format
    if (hex.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(hex)) {
      console.warn(`Invalid hex color: ${hex}, returning default`);
      return { h: 0, s: 0, l: 0 };
    }

    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (delta !== 0) {
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / delta + 2) / 6;
          break;
        case b:
          h = ((r - g) / delta + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  } catch (error) {
    console.error('Error converting HEX to HSL:', error);
    return { h: 0, s: 0, l: 0 };
  }
}

/**
 * Get color name from hue value
 */
export function getColorNameFromHue(hue: number): string {
  hue = hue % 360;
  if (hue < 0) hue += 360;
  
  if (hue >= 0 && hue < 30) return 'Rosso';
  if (hue >= 30 && hue < 60) return 'Arancione';
  if (hue >= 60 && hue < 90) return 'Giallo';
  if (hue >= 90 && hue < 150) return 'Verde';
  if (hue >= 150 && hue < 210) return 'Ciano';
  if (hue >= 210 && hue < 270) return 'Blu';
  if (hue >= 270 && hue < 310) return 'Viola';
  if (hue >= 310 && hue < 340) return 'Magenta';
  return 'Rosa';
}

/**
 * Get HSL values for a specific style and role
 */
function getHSLForStyle(
  style: 'vibrant' | 'pastel' | 'dark',
  role: 'primary' | 'secondary' | 'accent'
): { l: number; s: number } {
  const styleConfig = HSL_STYLES[style][role];
  
  // Use middle of the range for consistency
  const l = (styleConfig.l[0] + styleConfig.l[1]) / 2;
  const s = (styleConfig.s[0] + styleConfig.s[1]) / 2;
  
  return { l, s };
}

/**
 * Generate a complementary color palette (180° apart)
 */
export function generateComplementaryPalette(
  baseHue: number,
  style: 'vibrant' | 'pastel' | 'dark',
  paletteSize: number
): { primary: string; secondary?: string; accent: string } {
  const complementaryHue = (baseHue + 180) % 360;
  
  const primaryLS = getHSLForStyle(style, 'primary');
  const accentLS = getHSLForStyle(style, 'accent');
  
  const primary = hslToHex(baseHue, primaryLS.s, primaryLS.l);
  const accent = hslToHex(complementaryHue, accentLS.s, accentLS.l);
  
  if (paletteSize === 3) {
    const secondaryLS = getHSLForStyle(style, 'secondary');
    const secondaryHue = (complementaryHue - 15 + 360) % 360;
    const secondary = hslToHex(secondaryHue, secondaryLS.s, secondaryLS.l);
    return { primary, secondary, accent };
  }
  
  return { primary, accent };
}

/**
 * Generate a triadic color palette (120° apart)
 */
export function generateTriadicPalette(
  baseHue: number,
  style: 'vibrant' | 'pastel' | 'dark',
  paletteSize: number
): { primary: string; secondary?: string; accent: string } {
  const triadicHue1 = (baseHue + 120) % 360;
  const triadicHue2 = (baseHue + 240) % 360;
  
  const primaryLS = getHSLForStyle(style, 'primary');
  const accentLS = getHSLForStyle(style, 'accent');
  
  const primary = hslToHex(baseHue, primaryLS.s, primaryLS.l);
  const accent = hslToHex(triadicHue2, accentLS.s, accentLS.l);
  
  if (paletteSize === 3) {
    const secondaryLS = getHSLForStyle(style, 'secondary');
    const secondary = hslToHex(triadicHue1, secondaryLS.s, secondaryLS.l);
    return { primary, secondary, accent };
  }
  
  return { primary, accent };
}

/**
 * Generate an analogous color palette (±30° from base)
 */
export function generateAnalogousPalette(
  baseHue: number,
  style: 'vibrant' | 'pastel' | 'dark',
  paletteSize: number
): { primary: string; secondary?: string; accent: string } {
  const analogousHue1 = (baseHue + 30) % 360;
  const analogousHue2 = (baseHue - 30 + 360) % 360;
  
  const primaryLS = getHSLForStyle(style, 'primary');
  const accentLS = getHSLForStyle(style, 'accent');
  
  const primary = hslToHex(baseHue, primaryLS.s, primaryLS.l);
  const accent = hslToHex(analogousHue1, accentLS.s, accentLS.l);
  
  if (paletteSize === 3) {
    const secondaryLS = getHSLForStyle(style, 'secondary');
    const secondary = hslToHex(analogousHue2, secondaryLS.s, secondaryLS.l);
    return { primary, secondary, accent };
  }
  
  return { primary, accent };
}

/**
 * Generate a monochromatic color palette (same hue, varying lightness and saturation)
 */
export function generateMonochromaticPalette(
  baseHue: number,
  style: 'vibrant' | 'pastel' | 'dark',
  paletteSize: number
): { primary: string; secondary?: string; accent: string } {
  const primaryLS = getHSLForStyle(style, 'primary');
  const accentLS = getHSLForStyle(style, 'accent');
  
  // For monochromatic, we use the same hue but vary lightness and saturation
  const primary = hslToHex(baseHue, primaryLS.s, primaryLS.l);
  
  // Accent has higher saturation and different lightness for contrast
  const accentL = style === 'dark' ? accentLS.l + 15 : accentLS.l;
  const accentS = Math.min(100, accentLS.s * 1.2);
  const accent = hslToHex(baseHue, accentS, accentL);
  
  if (paletteSize === 3) {
    const secondaryLS = getHSLForStyle(style, 'secondary');
    // Secondary sits between primary and accent in lightness
    const secondaryL = (primaryLS.l + accentL) / 2;
    const secondary = hslToHex(baseHue, secondaryLS.s, secondaryL);
    return { primary, secondary, accent };
  }
  
  return { primary, accent };
}

/**
 * Analyze color harmony type using HSL
 */
export function analyzeColorHarmony(primary: string, secondary: string | undefined, accent: string): {
  type: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
} {
  const hslPrimary = hexToHSL(primary);
  const hslSecondary = hexToHSL(secondary);
  const hslAccent = hexToHSL(accent);
  
  // Calculate hue differences
  const hueDiff1 = Math.abs(hslPrimary.h - hslSecondary.h);
  const hueDiff2 = Math.abs(hslPrimary.h - hslAccent.h);
  const hueDiff3 = Math.abs(hslSecondary.h - hslAccent.h);
  
  // Normalize to 0-180 range
  const normalizeDiff = (diff: number) => diff > 180 ? 360 - diff : diff;
  const diff1 = normalizeDiff(hueDiff1);
  const diff2 = normalizeDiff(hueDiff2);
  const diff3 = normalizeDiff(hueDiff3);
  
  // Check for monochromatic (all hues within 30°)
  if (diff1 < 30 && diff2 < 30 && diff3 < 30) {
    const satRange = Math.max(hslPrimary.s, hslSecondary.s, hslAccent.s) - 
                        Math.min(hslPrimary.s, hslSecondary.s, hslAccent.s);
    const lightRange = Math.max(hslPrimary.l, hslSecondary.l, hslAccent.l) - 
                           Math.min(hslPrimary.l, hslSecondary.l, hslAccent.l);
    
    if (satRange > 20 && lightRange > 30) {
      return {
        type: 'Monocromatico Avanzato',
        quality: 'excellent',
        description: 'Schema monocromatico con ottimo bilanciamento di saturazione e luminosità'
      };
    }
    return {
      type: 'Monocromatico',
      quality: 'good',
      description: 'Palette basata su variazioni di un singolo colore'
    };
  }
  
  // Check for analogous (colors within 30-60°)
  if (diff1 < 60 && diff2 < 60) {
    return {
      type: 'Analogo',
      quality: 'excellent',
      description: 'Colori adiacenti sulla ruota cromatica - armonia naturale'
    };
  }
  
  // Check for complementary (colors around 180° apart)
  if (Math.abs(diff1 - 180) < 30 || Math.abs(diff2 - 180) < 30) {
    return {
      type: 'Complementare',
      quality: 'excellent',
      description: 'Colori opposti sulla ruota cromatica - contrasto dinamico'
    };
  }
  
  // Check for split-complementary
  if ((diff1 > 150 && diff1 < 210) && (diff2 > 30 && diff2 < 90)) {
    return {
      type: 'Split-Complementare',
      quality: 'excellent',
      description: 'Variazione sofisticata dello schema complementare'
    };
  }
  
  // Check for triadic (colors 120° apart)
  const isTriadic = [diff1, diff2, diff3].filter(d => Math.abs(d - 120) < 30).length >= 2;
  if (isTriadic) {
    return {
      type: 'Triadico',
      quality: 'excellent',
      description: 'Tre colori equidistanti sulla ruota - energia bilanciata'
    };
  }
  
  // Default case - custom/arbitrary
  return {
    type: 'Personalizzato',
    quality: 'fair',
    description: 'Schema di colori personalizzato'
  };
}

/**
 * Validate professional palette quality using HSL
 */
export function validatePaletteQuality(palette: {
  primary: string;
  secondary?: string;
  accent: string;
}): {
  score: number; // 0-100
  issues: string[];
  recommendations: string[];
} {
  const hslPrimary = hexToHSL(palette.primary);
  const hslSecondary = palette.secondary ? hexToHSL(palette.secondary) : null;
  const hslAccent = hexToHSL(palette.accent);
  
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;
  
  // Check primary lightness (should be very dark or very light)
  if (hslPrimary.l > 40 && hslPrimary.l < 80) {
    issues.push('Primary: lightness nella zona intermedia (non ottimale per contrasto)');
    recommendations.push('Usa un colore più scuro (L<40%) o molto chiaro (L>80%) per il primary');
    score -= 20;
  }
  
  // Check secondary lightness (only if present)
  if (hslSecondary && hslSecondary.l > 45 && hslSecondary.l < 75) {
    issues.push('Secondary: lightness insufficiente per buon contrasto');
    recommendations.push('Il secondary dovrebbe essere scuro (L<45%) o molto chiaro (L>75%)');
    score -= 15;
  }
  
  // Check accent saturation (should be high for visibility)
  if (hslAccent.s < 40) {
    issues.push('Accent: saturazione troppo bassa (poco vivace)');
    recommendations.push('Aumenta la saturazione dell\'accent a >50% per creare focus visivo');
    score -= 15;
  }
  
  // Check accent lightness (should be in mid-range for maximum visibility)
  if (hslAccent.l < 40 || hslAccent.l > 70) {
    issues.push('Accent: lightness fuori dal range ottimale (40-70%)');
    recommendations.push('L\'accent dovrebbe avere lightness media per massima visibilità');
    score -= 10;
  }
  
  // Check overall saturation balance
  const avgSat = hslSecondary 
    ? (hslPrimary.s + hslSecondary.s + hslAccent.s) / 3
    : (hslPrimary.s + hslAccent.s) / 2;
  if (avgSat < 20) {
    issues.push('Palette troppo desaturata (saturazione troppo bassa)');
    recommendations.push('Aumenta la saturazione complessiva per più personalità');
    score -= 10;
  }
  
  // Check color diversity (avoid too similar colors)
  const hueDiffs = hslSecondary
    ? [
        Math.abs(hslPrimary.h - hslSecondary.h),
        Math.abs(hslPrimary.h - hslAccent.h),
        Math.abs(hslSecondary.h - hslAccent.h)
      ]
    : [
        Math.abs(hslPrimary.h - hslAccent.h)
      ];
  
  if (hueDiffs.every(d => d < 15 || d > 345)) {
    issues.push('Colori troppo simili tra loro (hue troppo vicine)');
    recommendations.push('Aumenta la differenza di tonalità tra i colori');
    score -= 15;
  }
  
  return {
    score: Math.max(0, score),
    issues,
    recommendations
  };
}

/**
 * Get category-specific color suggestions
 */
export function getCategorySuggestions(category: string): string {
  const suggestions: Record<string, string> = {
    tech: 'Consiglia: blu navy + grigio scuro + blu elettrico',
    saas: 'Consiglia: indigo + slate + viola',
    beauty: 'Consiglia: rosa profondo + viola scuro + fucsia',
    fashion: 'Consiglia: nero + burgundy + oro',
    food: 'Consiglia: rosso scuro + verde forest + arancione',
    restaurant: 'Consiglia: marrone + rosso vinaccia + ambra',
    finance: 'Consiglia: blu navy + verde scuro + oro scuro',
    corporate: 'Consiglia: grigio scuro + blu professionale + teal',
    health: 'Consiglia: verde smeraldo + teal + lime',
    wellness: 'Consiglia: verde salvia + blu oceano + menta',
    creative: 'Consiglia: viola + arancione + magenta',
    agency: 'Consiglia: nero + viola elettrico + rosa neon',
    ecommerce: 'Consiglia: grigio antracite + blu + arancione',
  };
  
  const lowerCategory = category.toLowerCase();
  
  for (const [key, value] of Object.entries(suggestions)) {
    if (lowerCategory.includes(key)) {
      return value;
    }
  }
  
  return 'Usa schemi complementari o triadici per massimo impatto visivo';
}
