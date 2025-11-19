export interface DesignConcept {
  palette: {
    primary: string;
    secondary?: string; // Optional for 2-color palettes
    accent: string;
  };
  fonts: {
    headline: string;
    body: string;
  };
  content: {
    productName: string;
    heroDescription: string;
    ctaPrimary: string;
    features: Array<{
      title: string;
      description: string;
    }>;
    testimonials: Array<{
      quote: string;
      author: string;
    }>;
    finalCta: {
      title: string;
      button: string;
    };
  };
}

export interface UserApiConfig {
  provider: 'google' | 'openai';
  apiKey: string;
  unsplashAccessKey?: string;
}

export type PaletteSize = '2' | '3';
export type PaletteStyle = 'vibrant' | 'pastel' | 'dark';
export type ColorScheme = 'complementary' | 'triadic' | 'analogous' | 'split-complementary' | 'monochromatic';

export interface GenerationOptions {
  paletteSize: PaletteSize;
  paletteStyle: PaletteStyle;
  customHue?: number; // 0-360, optional custom hue (HSL H)
  customLightness?: number; // 0-100, optional custom lightness (HSL L)
  customSaturation?: number; // 0-100, optional custom saturation (HSL S)
  colorScheme?: ColorScheme; // Color harmony scheme (only used when custom colors are set)
}
