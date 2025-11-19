/**
 * Utility functions for WCAG AA accessibility compliance
 */

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance according to WCAG
 * https://www.w3.org/TR/WCAG20-TECHS/G17.html
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 1;

  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Determine if a background color is light or dark
 * Returns true if the color is light (should use dark text)
 */
export function isLightColor(hexColor: string): boolean {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return false;

  const luminance = getRelativeLuminance(rgb.r, rgb.g, rgb.b);
  
  // Threshold is 0.5 (midpoint between 0 and 1)
  return luminance > 0.5;
}

/**
 * Get the appropriate text color (black or white) for a given background color
 * Ensures WCAG AA compliance (4.5:1 for normal text)
 */
export function getAccessibleTextColor(backgroundColor: string): string {
  const WHITE = '#ffffff';
  const BLACK = '#000000';
  
  const contrastWithWhite = getContrastRatio(backgroundColor, WHITE);
  const contrastWithBlack = getContrastRatio(backgroundColor, BLACK);
  
  // Return the color with better contrast
  // Prefer white text if both meet AA standard (4.5:1)
  if (contrastWithWhite >= 4.5 && contrastWithWhite >= contrastWithBlack) {
    return WHITE;
  }
  
  return BLACK;
}

/**
 * Check if a color combination meets WCAG AA standards
 * @param foreground - Text color
 * @param background - Background color
 * @param isLargeText - True if text is 18pt+ or 14pt+ bold
 * @returns true if the combination meets AA standards
 */
export function meetsWCAG_AA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const requiredRatio = isLargeText ? 3 : 4.5;
  
  return ratio >= requiredRatio;
}

/**
 * Get a harmonious text color that respects AA contrast on light backgrounds
 * This function ensures consistent accessibility across all text on light backgrounds
 */
export function getSafeTextColorOnLight(): string {
  return '#1f2937'; // gray-800 - excellent contrast on white/light backgrounds (ratio > 12:1)
}

/**
 * Get a harmonious text color that respects AA contrast on dark backgrounds
 * This function ensures consistent accessibility across all text on dark backgrounds
 */
export function getSafeTextColorOnDark(): string {
  return '#ffffff'; // white - excellent contrast on dark backgrounds
}

/**
 * Get a safe secondary text color (like gray-600) for body text on light backgrounds
 */
export function getSafeSecondaryTextColorOnLight(): string {
  return '#4b5563'; // gray-600 - good contrast on white/light backgrounds (ratio > 7:1)
}
