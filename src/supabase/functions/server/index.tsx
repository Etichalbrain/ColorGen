import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

/**
 * Font Pairings per Categoria
 * Selezione automatica di Google Fonts in base al settore
 */
interface FontPair {
  headline: string;
  body: string;
}

const CATEGORY_FONTS: Record<string, FontPair[]> = {
  tech: [
    { headline: 'Space Grotesk', body: 'Inter' },
    { headline: 'Poppins', body: 'Roboto' },
    { headline: 'Work Sans', body: 'Source Sans Pro' },
    { headline: 'DM Sans', body: 'IBM Plex Sans' }
  ],
  beauty: [
    { headline: 'Playfair Display', body: 'Montserrat' },
    { headline: 'Cormorant Garamond', body: 'Lato' },
    { headline: 'Bodoni Moda', body: 'Raleway' },
    { headline: 'Cinzel', body: 'Quicksand' }
  ],
  food: [
    { headline: 'Satisfy', body: 'Nunito' },
    { headline: 'Pacifico', body: 'Open Sans' },
    { headline: 'Lobster', body: 'Lato' },
    { headline: 'Righteous', body: 'Karla' }
  ],
  finance: [
    { headline: 'Montserrat', body: 'Open Sans' },
    { headline: 'Roboto Slab', body: 'Roboto' },
    { headline: 'IBM Plex Serif', body: 'IBM Plex Sans' },
    { headline: 'Merriweather', body: 'Lato' }
  ],
  health: [
    { headline: 'Quicksand', body: 'Open Sans' },
    { headline: 'Nunito', body: 'Roboto' },
    { headline: 'Rubik', body: 'Source Sans Pro' },
    { headline: 'Karla', body: 'Inter' }
  ],
  creative: [
    { headline: 'Bebas Neue', body: 'Raleway' },
    { headline: 'Oswald', body: 'Lato' },
    { headline: 'Anton', body: 'Source Sans Pro' },
    { headline: 'Archivo Black', body: 'Karla' }
  ],
  ecommerce: [
    { headline: 'Inter', body: 'Inter' },
    { headline: 'Poppins', body: 'Open Sans' },
    { headline: 'Outfit', body: 'Nunito Sans' },
    { headline: 'Urbanist', body: 'Roboto' }
  ],
  education: [
    { headline: 'Lexend', body: 'Source Sans Pro' },
    { headline: 'Manrope', body: 'Inter' },
    { headline: 'Public Sans', body: 'Open Sans' },
    { headline: 'Red Hat Display', body: 'Red Hat Text' }
  ],
  travel: [
    { headline: 'Abril Fatface', body: 'Lato' },
    { headline: 'Righteous', body: 'Raleway' },
    { headline: 'Amatic SC', body: 'Josefin Sans' },
    { headline: 'Barlow Condensed', body: 'Barlow' }
  ],
  realestate: [
    { headline: 'Playfair Display', body: 'Open Sans' },
    { headline: 'Cinzel', body: 'Raleway' },
    { headline: 'EB Garamond', body: 'Source Sans Pro' },
    { headline: 'Libre Baskerville', body: 'Lato' }
  ],
  gaming: [
    { headline: 'Russo One', body: 'Exo 2' },
    { headline: 'Orbitron', body: 'Rajdhani' },
    { headline: 'Teko', body: 'Titillium Web' },
    { headline: 'Press Start 2P', body: 'Roboto' }
  ],
  default: [
    { headline: 'Inter', body: 'Inter' },
    { headline: 'Poppins', body: 'Open Sans' },
    { headline: 'Montserrat', body: 'Lato' }
  ]
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  tech: ['tech', 'saas', 'software', 'app', 'startup', 'digital', 'ai', 'cloud', 'platform', 'api'],
  beauty: ['beauty', 'fashion', 'cosmetic', 'makeup', 'jewelry', 'style', 'boutique', 'salon', 'spa'],
  food: ['food', 'restaurant', 'cafe', 'delivery', 'kitchen', 'recipe', 'dining', 'catering', 'bakery'],
  finance: ['finance', 'bank', 'investment', 'insurance', 'accounting', 'crypto', 'trading', 'loan', 'mortgage'],
  health: ['health', 'medical', 'wellness', 'fitness', 'hospital', 'clinic', 'therapy', 'yoga', 'nutrition'],
  creative: ['creative', 'agency', 'design', 'art', 'studio', 'portfolio', 'marketing', 'advertising', 'media'],
  ecommerce: ['ecommerce', 'shop', 'store', 'retail', 'marketplace', 'shopping', 'cart', 'product'],
  education: ['education', 'learning', 'course', 'school', 'university', 'training', 'academy', 'tutorial'],
  travel: ['travel', 'tourism', 'hotel', 'vacation', 'flight', 'booking', 'adventure', 'trip', 'destination'],
  realestate: ['real estate', 'property', 'home', 'apartment', 'housing', 'realty', 'rental', 'broker'],
  gaming: ['gaming', 'game', 'esports', 'entertainment', 'streaming', 'console', 'arcade']
};

function detectCategory(text: string): string {
  const normalized = text.toLowerCase().trim();
  if (CATEGORY_FONTS[normalized]) return normalized;
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword) || keyword.includes(normalized)) {
        return category;
      }
    }
  }
  return 'default';
}

function getFontPairForCategory(category: string): FontPair {
  const detected = detectCategory(category);
  const options = CATEGORY_FONTS[detected] || CATEGORY_FONTS.default;
  const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % options.length;
  return options[index];
}

/**
 * HSL Style Definitions
 * Professional color ranges for palettes
 */
const HSL_STYLES = {
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
 * Convert HSL to HEX
 */
function hslToHex(h: number, s: number, l: number): string {
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
 * Convert HEX to RGB for contrast calculation
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate relative luminance (WCAG formula)
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate WCAG contrast ratio
 */
function getContrastRatio(color1: string, color2: string): number {
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
 * Convert HEX to HSL
 */
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const rgb = hexToRgb(hex);
  if (!rgb) return { h: 0, s: 0, l: 0 };
  
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
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
 * CRITICAL FIX #1: Ensure WCAG AA compliance (contrast ≥4.5:1)
 * Automatically darkens colors that don't meet accessibility standards
 */
function ensureWCAG_AA(color: string, background: string = '#ffffff'): string {
  let currentColor = color;
  let attempts = 0;
  const maxAttempts = 20;
  
  while (attempts < maxAttempts) {
    const contrast = getContrastRatio(currentColor, background);
    
    if (contrast >= 4.5) {
      return currentColor;
    }
    
    // Darken the color by reducing lightness in HSL
    const hsl = hexToHSL(currentColor);
    hsl.l = Math.max(0, hsl.l - 5); // Reduce L by 5%
    currentColor = hslToHex(hsl.h, hsl.s, hsl.l);
    attempts++;
  }
  
  // Fallback: use dark safe color
  console.warn(`Failed to meet WCAG AA for ${color}, using fallback #1f2937`);
  return '#1f2937'; // Gray 800 - always passes AA
}

// Utility: Clean AI JSON response by removing comments
function cleanAIJsonResponse(response: string): string {
  // Remove markdown code blocks
  let cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  // Remove JavaScript-style single-line comments (// ...)
  cleaned = cleaned.replace(/\/\/[^\n]*/g, '');
  
  // Remove multi-line comments (/* ... */)
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Try to extract JSON if there's text before/after
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }
  
  // Remove any trailing commas before closing braces/brackets
  cleaned = cleaned.replace(/,([\s]*[\}\]])/g, '$1');
  
  return cleaned;
}

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-5378c2f5/health", (c) => {
  return c.json({ status: "ok" });
});

// Debug endpoint to check API keys
app.get("/make-server-5378c2f5/check-keys", (c) => {
  const hasGoogleKey = !!Deno.env.get("GOOGLE_AI_API_KEY");
  const hasOpenAIKey = !!Deno.env.get("OPENAI_API_KEY");
  
  return c.json({ 
    googleAI: hasGoogleKey,
    openAI: hasOpenAIKey,
    message: hasGoogleKey || hasOpenAIKey ? "At least one API key is configured" : "No API keys configured"
  });
});

// Test Google AI API key and list available models
app.post("/make-server-5378c2f5/test-google-api", async (c) => {
  try {
    const { apiKey } = await c.req.json();
    
    if (!apiKey) {
      return c.json({ error: "API key is required" }, 400);
    }

    console.log("Testing Google AI API key...");
    
    // Try to list models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Google AI API test failed: ${response.status} - ${errorText}`);
      return c.json({ 
        success: false,
        error: errorText,
        status: response.status
      });
    }

    const data = await response.json();
    const models = data.models || [];
    const modelNames = models.map((m: any) => m.name);
    
    console.log("Available models:", modelNames);
    
    return c.json({ 
      success: true,
      availableModels: modelNames,
      totalModels: models.length
    });
  } catch (error) {
    console.error("Error testing Google AI API:", error);
    return c.json({ 
      success: false,
      error: String(error) 
    }, 500);
  }
});

// Generate design concept (colors, fonts, content)
app.post("/make-server-5378c2f5/generate-concept", async (c) => {
  try {
    const { category, provider, apiKey, options } = await c.req.json();
    
    if (!category) {
      return c.json({ error: "Category is required" }, 400);
    }

    if (!provider || !apiKey) {
      return c.json({ error: "Provider and API key are required" }, 400);
    }

    // User provides their own API key
    const GOOGLE_AI_API_KEY = provider === 'google' ? apiKey : null;
    const OPENAI_API_KEY = provider === 'openai' ? apiKey : null;
    
    // Get generation options with defaults
    const paletteSize = options?.paletteSize || '3';
    const paletteStyle = options?.paletteStyle || 'vibrant';
    const customHue = options?.customHue; // 0-360
    const customLightness = options?.customLightness; // 0-100 from UI
    const customSaturation = options?.customSaturation; // 0-100 from UI
    const colorScheme = options?.colorScheme || 'complementary';
    
    console.log(`Using ${provider} API with user-provided key`);
    console.log(`Palette options: ${paletteSize} colors, ${paletteStyle} style${customHue !== undefined ? `, custom HSL(${customHue}, ${customSaturation ?? 'auto'}%, ${customLightness ?? 'auto'}%), scheme: ${colorScheme}` : ''}`);

    // Pre-calculate fonts based on category
    const preCalculatedFonts = getFontPairForCategory(category);
    console.log(`Pre-calculated fonts for category "${category}": ${preCalculatedFonts.headline} + ${preCalculatedFonts.body}`);

    // Pre-calculate colors using HSL if custom hue is provided
    let preCalculatedColors: { primary: string; secondary?: string; accent: string } | null = null;
    
    if (customHue !== undefined) {
      const complementaryHue = (customHue + 180) % 360;
      const triadicHue1 = (customHue + 120) % 360;
      const triadicHue2 = (customHue + 240) % 360;
      const analogousHue1 = (customHue + 30) % 360;
      const analogousHue2 = (customHue - 30 + 360) % 360;
      const splitCompHue1 = (customHue + 150) % 360;
      const splitCompHue2 = (customHue + 210) % 360;
      
      // Get HSL values for the selected style
      let primaryLS = getHSLForStyle(paletteStyle, 'primary');
      const secondaryLS = getHSLForStyle(paletteStyle, 'secondary');
      const accentLS = getHSLForStyle(paletteStyle, 'accent');
      
      // Override primary lightness and saturation if custom values are provided
      if (customLightness !== undefined || customSaturation !== undefined) {
        primaryLS = {
          l: customLightness !== undefined ? customLightness : primaryLS.l,
          s: customSaturation !== undefined ? customSaturation : primaryLS.s
        };
        console.log(`Using custom HSL primary: H=${customHue}, S=${customSaturation ?? primaryLS.s}%, L=${customLightness ?? primaryLS.l}%`);
      }
      
      // Generate specific colors based on the selected scheme
      if (colorScheme === 'complementary') {
        const primaryColor = hslToHex(customHue, primaryLS.s, primaryLS.l);
        const accentColor = hslToHex(complementaryHue, accentLS.s, accentLS.l);
        const secondaryColor = paletteSize === '3' 
          ? hslToHex((complementaryHue - 15 + 360) % 360, secondaryLS.s, secondaryLS.l)
          : undefined;
        
        preCalculatedColors = {
          primary: primaryColor,
          ...(secondaryColor && { secondary: secondaryColor }),
          accent: accentColor
        };
        console.log(`Pre-calculated COMPLEMENTARY palette (HSL): ${JSON.stringify(preCalculatedColors)}`);
      
      } else if (colorScheme === 'triadic') {
        const primaryColor = hslToHex(customHue, primaryLS.s, primaryLS.l);
        const accentColor = hslToHex(triadicHue2, accentLS.s, accentLS.l);
        const secondaryColor = paletteSize === '3'
          ? hslToHex(triadicHue1, secondaryLS.s, secondaryLS.l)
          : undefined;
        
        preCalculatedColors = {
          primary: primaryColor,
          ...(secondaryColor && { secondary: secondaryColor }),
          accent: accentColor
        };
        console.log(`Pre-calculated TRIADIC palette (HSL): ${JSON.stringify(preCalculatedColors)}`);
      
      } else if (colorScheme === 'analogous') {
        const primaryColor = hslToHex(customHue, primaryLS.s, primaryLS.l);
        const accentColor = hslToHex(analogousHue1, accentLS.s, accentLS.l);
        const secondaryColor = paletteSize === '3'
          ? hslToHex(analogousHue2, secondaryLS.s, secondaryLS.l)
          : undefined;
        
        preCalculatedColors = {
          primary: primaryColor,
          ...(secondaryColor && { secondary: secondaryColor }),
          accent: accentColor
        };
        console.log(`Pre-calculated ANALOGOUS palette (HSL): ${JSON.stringify(preCalculatedColors)}`);
      
      } else if (colorScheme === 'split-complementary') {
        const primaryColor = hslToHex(customHue, primaryLS.s, primaryLS.l);
        const accentColor = hslToHex(splitCompHue2, Math.min(100, accentLS.s * 1.15), accentLS.l);
        const secondaryColor = paletteSize === '3'
          ? hslToHex(splitCompHue1, Math.min(100, secondaryLS.s * 1.1), secondaryLS.l - 5)
          : undefined;
        
        preCalculatedColors = {
          primary: primaryColor,
          ...(secondaryColor && { secondary: secondaryColor }),
          accent: accentColor
        };
        console.log(`Pre-calculated SPLIT-COMPLEMENTARY palette (HSL): ${JSON.stringify(preCalculatedColors)}`);
      
      } else if (colorScheme === 'monochromatic') {
        // Monochromatic: same hue, varying lightness and saturation
        const primaryColor = hslToHex(customHue, primaryLS.s, primaryLS.l);
        
        // Accent has higher saturation and different lightness for contrast
        const accentL = paletteStyle === 'dark' ? accentLS.l + 15 : accentLS.l;
        const accentS = Math.min(100, accentLS.s * 1.2);
        const accentColor = hslToHex(customHue, accentS, accentL);
        
        const secondaryColor = paletteSize === '3'
          ? hslToHex(customHue, secondaryLS.s, (primaryLS.l + accentL) / 2)
          : undefined;
        
        preCalculatedColors = {
          primary: primaryColor,
          ...(secondaryColor && { secondary: secondaryColor }),
          accent: accentColor
        };
        console.log(`Pre-calculated MONOCHROMATIC palette (HSL): ${JSON.stringify(preCalculatedColors)}`);
      }
    }

    const systemPrompt = `Sei un senior UI/UX designer con 15 anni di esperienza nella creazione di sistemi di design professionali. L'utente ti fornirà una categoria di sito web. ${preCalculatedColors ? 'I colori e i font sono già stati pre-calcolati, quindi genera SOLO il contenuto.' : 'I font sono già stati pre-calcolati, quindi genera colori e contenuto.'}

IMPORTANTE - VARIABILITA: Ogni richiesta deve generare risultati UNICI e DIVERSI. Anche se la categoria e la stessa, devi creare palette di colori COMPLETAMENTE DIVERSE, schemi cromatici DIVERSI, e contenuti CREATIVI e ORIGINALI. Non ripetere mai le stesse combinazioni. Sperimenta con tonalita, saturazioni e luminosita diverse.

IMPORTANTE: I font sono gia stati selezionati in base alla categoria:
- Headline: ${preCalculatedFonts.headline}
- Body: ${preCalculatedFonts.body}
NON generare font diversi - usa ESATTAMENTE questi.

${preCalculatedColors ? `IMPORTANTE: NON generare colori - sono già stati forniti. Genera SOLO:
- content (productName, heroDescription, features, testimonials, finalCta)

I colori già calcolati sono:
- Primary: ${preCalculatedColors.primary}
${preCalculatedColors.secondary ? `- Secondary: ${preCalculatedColors.secondary}\n` : ''}- Accent: ${preCalculatedColors.accent}` : `VINCOLI RICHIESTI:
- Numero di colori: ${paletteSize} colori (primary, ${paletteSize === '3' ? 'secondary, ' : ''}accent)
- Stile palette: ${paletteStyle === 'vibrant' ? 'VIBRANTE (HSL: L=50-65%, S=60-80%)' : paletteStyle === 'pastel' ? 'PASTELLO (HSL: L=80-90%, S=25-40%)' : 'DARK (HSL: L=25-35%, S=40-60%)'}

${paletteSize === '2' ? 'IMPORTANTE: Genera SOLO 2 colori (primary e accent). NON includere secondary. Usa primary per header/footer e accent per CTA/elementi di focus.' : ''}

TEORIA DEL COLORE PROFESSIONALE - PALETTE ARMONICHE:`}

Scegli UNO dei seguenti schemi di colore e applicalo con precisione:

1. SCHEMA COMPLEMENTARE (per contrasti forti e dinamici):
   - Primary: Colore dominante (es. blu #1e3a8a - luminosità 20-30%)
   - Secondary: Colore complementare sulla ruota cromatica, saturazione ridotta (es. arancione scuro #9a3412 - luminosità 25-35%)
   - Accent: Versione più satura del secondary o tertiary vicino (es. #ea580c - luminosità 45-55%)
   Esempi: Blu navy (#1e40af) + Arancione bruciato (#c2410c) + Corallo (#f97316)
            Verde scuro (#166534) + Rosso vinaccia (#991b1b) + Rosa intenso (#e11d48)

2. SCHEMA ANALOGO (per armonia elegante e sofisticata):
   - Primary: Colore base (es. blu-viola #4338ca - luminosità 25-35%)
   - Secondary: Colore adiacente sulla ruota (es. viola-magenta #7e22ce - luminosità 30-40%)
   - Accent: Terzo colore adiacente, più saturo (es. rosa #db2777 - luminosità 40-50%)
   Esempi: Teal (#0f766e) + Verde smeraldo (#047857) + Lime (#65a30d)
            Indigo (#4338ca) + Viola (#7c3aed) + Magenta (#c026d3)

3. SCHEMA TRIADICO (per energia bilanciata e moderna):
   - Primary: Colore base a 0° (es. blu elettrico #1e40af - luminosità 25-35%)
   - Secondary: Colore a +120° sulla ruota (es. rosso #b91c1c - luminosità 30-40%)
   - Accent: Colore a +240° sulla ruota (es. giallo ambra #d97706 - luminosità 45-55%)
   Esempi: Blu (#1d4ed8) + Rosso (#dc2626) + Giallo scuro (#ca8a04)
            Viola (#7c3aed) + Arancione (#ea580c) + Teal (#0d9488)

4. SCHEMA SPLIT-COMPLEMENTARE (per sofisticazione avanzata):
   - Primary: Colore dominante a 0° (HSL S=45-65%, L=25-35%)
   - Secondary: Primo analogo del complementare a +150° (HSL S=50-70%, L=38-48%)
   - Accent: Secondo analogo del complementare a +210° (HSL S=60-80%, L=35-45%)
   Range HSL specifici:
   Primary: S=45-65%, L=25-35%, H=base
   Secondary: S=50-70%, L=38-48%, H=base+150°
   Accent: S=60-80%, L=35-45%, H=base+210°

5. SCHEMA MONOCROMATICO AVANZATO (per eleganza minimalista):
   - Primary: Tonalità base molto scura (es. blu navy #172554 - luminosità 10-20%)
   - Secondary: Tonalità media (es. blu #1e40af - luminosità 30-40%)
   - Accent: Tonalità satura e vivace (es. blu elettrico #3b82f6 - luminosità 50-60%)

REGOLE ASSOLUTE PER ACCESSIBILITÀ WCAG AA (AGGIORNATO - CRITICAL FIX #1):

IMPORTANTE: I colori saranno validati automaticamente dal backend per contrasto WCAG ≥4.5:1.
Genera colori seguendo questi principi GENERALI (non vincoli rigidi su luminosità %):

✓ Primary/Secondary: Preferisci colori SCURI e SATURI
  Esempi buoni: blu navy, rosso profondo, verde smeraldo, viola intenso
  EVITA: Colori chiari come azzurro baby, rosa pastello chiaro, giallo limone

✓ Accent: Può essere più vivace, ma sempre con buona saturazione
  Esempi buoni: blu elettrico, ambra, fucsia, arancione vibrante
  EVITA: Gialli chiari, rosa baby, azzurri pastello

✓ Background: Sempre bianco (#ffffff) o quasi bianco (#f9fafb)

NOTA: Il sistema backend garantirà automaticamente contrasto ≥4.5:1 su sfondo bianco.
Non preoccuparti di calcolare contrasti manualmente - concentrati su palette armoniche appropriate alla categoria.

BILANCIAMENTO SATURAZIONE HSL (fondamentale):
Primary: Saturazione 40-70% (colore riconoscibile ma non aggressivo)
Secondary: Saturazione 35-65% (leggermente più tenue del primary)
Accent: Saturazione 60-90% (il più vivace, crea focus visivo)

LINEE GUIDA PER CATEGORIA:
- Tech/SaaS: Schema monocromatico blu/viola, triadico blu-viola-arancione
- Beauty/Fashion: Analogo rosa-viola-magenta, complementare rosa-verde scuro
- Food/Restaurant: Complementare rosso-verde, triadico rosso-giallo-blu scuro
- Finance/Corporate: Monocromatico blu navy, split-complementare blu-oro-bronzo
- Health/Wellness: Analogo verde-teal-blu, complementare verde-borgogna
- Creative/Agency: Triadico audace, complementare con saturazione alta
- E-commerce: Complementare con primary neutro e accent vivace

ESEMPI DI PALETTE PROFESSIONALI PER CATEGORIA (Range HSL):

Tech/SaaS (Schema Monocromatico Blu):
Primary: HSL H=220-260°, S=50-70%, L=25-35% (blu navy profondo)
Secondary: HSL H=220-260°, S=40-60%, L=15-25% (blu ancora più scuro)
Accent: HSL H=220-260°, S=70-90%, L=50-65% (blu elettrico vibrante)

Beauty/Fashion (Schema Analogo Rosa-Viola):
Primary: HSL H=330-350°, S=50-70%, L=30-40% (rosa profondo)
Secondary: HSL H=280-300°, S=45-65%, L=28-38% (viola intenso)
Accent: HSL H=330-350°, S=70-85%, L=50-60% (fucsia brillante)

Food/Restaurant (Schema Complementare Rosso-Verde):
Primary: HSL H=20-40°, S=60-80%, L=30-40% (rosso profondo/arancio bruciato)
Secondary: HSL H=140-160°, S=50-70%, L=28-38% (verde forest)
Accent: HSL H=30-50°, S=75-90%, L=50-60% (arancione caldo vibrante)

Finance/Corporate (Schema Split-Complementare Blu-Oro):
Primary: HSL H=220-250°, S=50-70%, L=28-38% (navy professionale)
Secondary: HSL H=140-160°, S=45-65%, L=22-32% (verde scuro elegante)
Accent: HSL H=80-100°, S=65-85%, L=55-65% (oro brillante ricco)

Health/Wellness (Schema Analogo Verde-Teal):
Primary: HSL H=150-170°, S=60-80%, L=32-42% (smeraldo profondo)
Secondary: HSL H=180-200°, S=55-75%, L=30-40% (teal intenso)
Accent: HSL H=150-170°, S=70-85%, L=48-58% (verde vivace energico)

Creative/Agency (Schema Triadico Viola-Arancione-Teal):
Primary: HSL H=280-300°, S=65-85%, L=42-52% (viola intenso elettrico)
Secondary: HSL H=180-200°, S=60-80%, L=35-45% (teal scuro ricco)
Accent: HSL H=30-50°, S=75-90%, L=48-58% (arancione fuoco)

E-commerce (Schema Complementare Neutro-Vivace):
Primary: HSL H=qualsiasi, S=5-15%, L=12-20% (quasi nero neutro)
Secondary: HSL H=qualsiasi, S=10-20%, L=28-38% (grigio scuro professionale)
Accent: HSL H=30-50°, S=75-90%, L=52-62% (arancione CTA vibrante)

ESEMPI PER STILE RICHIESTO:

STILE VIBRANTE (colori saturi e vivaci):
Saturazione: 60-90% (alta saturazione, colori pieni di energia)
Lightness: 45-65% (né troppo scuri né troppo chiari)
Uso: Brand giovani, tech startup, creative agency

STILE PASTELLO (colori delicati e soft):
Saturazione: 25-40% (bassa saturazione, colori desaturati e morbidi)
Lightness: 75-90% (colori chiari e ariosi)
Uso: Beauty, wellness, baby/kids, fashion delicato
IMPORTANTE: Per accessibilità, usa colori pastello su sfondi bianchi con testo scuro

STILE DARK (colori scuri e profondi):
Saturazione: 40-60% (saturazione moderata, colori ricchi ma non troppo saturi)
Lightness: 20-35% (colori molto scuri)
Uso: Luxury, finance, gaming, fotografia professionale
IMPORTANTE: Usa sempre testo bianco (#ffffff) su sfondi dark

ESEMPI PALETTE A 2 COLORI (Range HSL):

Tech Vibrante (2 colori):
Primary: HSL H=220-250°, S=60-80%, L=35-45% (blu intenso)
Accent: HSL H=60-80°, S=70-85%, L=55-65% (oro vibrante)

Beauty Pastello (2 colori):
Primary: HSL H=310-330°, S=30-45%, L=80-88% (rosa pastello)
Accent: HSL H=280-300°, S=35-50%, L=75-85% (viola pastello)

Luxury Dark (2 colori):
Primary: HSL H=qualsiasi, S=10-20%, L=15-22% (quasi nero)
Accent: HSL H=80-100°, S=70-85%, L=60-70% (oro ricco)

FONT PAIRING PROFESSIONALI (contrasto tipografico):

Classico Elegante: "Playfair Display" (headline serif) + "Inter" (body sans-serif)
Moderno Tech: "Poppins" (headline geometric) + "Roboto" (body neutral)
Corporate Solido: "Montserrat" (headline strong) + "Open Sans" (body friendly)
Creative Bold: "Bebas Neue" (headline display) + "Raleway" (body elegant)
Luxury Premium: "Cormorant Garamond" (headline serif) + "Lato" (body clean)
Startup Dinamico: "Space Grotesk" (headline modern) + "Inter" (body versatile)
Editorial Sofisticato: "Merriweather" (headline serif) + "Source Sans Pro" (body)
Minimal Clean: "Work Sans" (headline geometric) + "Nunito" (body rounded)

REGOLA: Headline deve avere personalità forte, Body deve essere leggibile e neutrale.

- Contenuto: Genera copy persuasivo e professionale con:
  * productName: Nome brand memorabile (2-3 parole max)
  * heroDescription: Value proposition chiara e concreta (max 15 parole)
  * ctaPrimary: CTA action-oriented ("Inizia Gratis", "Scopri di Più", "Prenota Demo")
  * features: 3 benefit concreti con titoli punchy (3-5 parole) e descrizioni specifiche
  * testimonials: Quote autentiche con nomi realistici e ruoli professionali
  * finalCta: Messaggio urgente ma non aggressivo

- Rispondi SOLO con il JSON, senza testo aggiuntivo, markdown o commenti
- IMPORTANTE: NON inserire commenti (//) o note inline nel JSON. Solo JSON valido puro

Formato JSON richiesto:
${paletteSize === '3' ? `{
  "palette": {
    "primary": "#XXXXXX",
    "secondary": "#XXXXXX",
    "accent": "#XXXXXX"
  },
  "fonts": {
    "headline": "Nome Font",
    "body": "Nome Font"
  },` : `{
  "palette": {
    "primary": "#XXXXXX",
    "accent": "#XXXXXX"
  },
  "fonts": {
    "headline": "Nome Font",
    "body": "Nome Font"
  },`}
  "content": {
    "productName": "Nome prodotto",
    "heroDescription": "Descrizione accattivante del prodotto",
    "ctaPrimary": "Testo CTA",
    "features": [
      {
        "title": "Titolo feature 1",
        "description": "Descrizione breve feature 1"
      },
      {
        "title": "Titolo feature 2",
        "description": "Descrizione breve feature 2"
      },
      {
        "title": "Titolo feature 3",
        "description": "Descrizione breve feature 3"
      }
    ],
    "testimonials": [
      {
        "quote": "Citazione testimonial 1",
        "author": "Nome @ Ruolo/Azienda"
      },
      {
        "quote": "Citazione testimonial 2",
        "author": "Nome @ Ruolo/Azienda"
      }
    ],
    "finalCta": {
      "title": "Titolo accattivante per CTA finale",
      "button": "Testo pulsante CTA finale"
    }
  }
}`;

    // Add variation seed to ensure different palettes each time (CRITICAL FIX #2)
    const variationSeed = Math.floor(Math.random() * 1000000);
    const randomHue = Math.floor(Math.random() * 360);
    const timestamp = Date.now();
    
    const userPrompt = `Categoria: ${category}

IMPORTANTE: Questa è la richiesta #${variationSeed} - genera una palette COMPLETAMENTE DIVERSA dalle precedenti generazioni per questa categoria.

VARIA (CRITICAL FIX #2):
- Hue base: usa ${randomHue}° ± 30° come punto di partenza
- Saturation intensity: varia tra min e max del range HSL per lo stile
- Lightness distribution: cambia il bilanciamento scuro/chiaro tra i colori
- Schema cromatico: se appropriato alla categoria, sperimenta con schemi diversi

Genera colori UNICI e FRESCHI, mai identici a generazioni precedenti.`;

    let aiResponse: string;

    // Try to auto-detect the best Google AI model
    async function tryGoogleAIModels(apiKey: string, requestBody: any): Promise<string> {
      const modelsToTry = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-pro',
        'gemini-1.5-flash-latest',
        'gemini-pro-latest'
      ];
      
      for (const model of modelsToTry) {
        try {
          console.log(`Trying Google AI model: ${model}`);
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBody),
            }
          );
          
          if (response.ok) {
            console.log(`Success with model: ${model}`);
            const data = await response.json();
            
            // Check if response was truncated
            const finishReason = data.candidates?.[0]?.finishReason;
            console.log(`Google AI finish_reason: ${finishReason}`);
            
            if (finishReason === 'MAX_TOKENS') {
              console.error("Google AI response was truncated due to maxOutputTokens limit!");
              throw new Error("AI response was truncated due to token limit. Please try again.");
            }
            
            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
              return data.candidates[0].content.parts[0].text;
            }
            
            console.error(`Model ${model} returned unexpected format:`, JSON.stringify(data).substring(0, 200));
            continue;
          }
          
          // Check for fatal errors that apply to all models
          const errorText = await response.text();
          let errorJson;
          try {
            errorJson = JSON.parse(errorText);
          } catch (e) {
            // Not JSON, continue to next model
          }
          
          // API key errors - stop immediately, no need to try other models
          if (errorJson?.error?.details?.some((d: any) => d.reason === 'API_KEY_INVALID')) {
            throw new Error('La tua API key di Google AI è scaduta o non valida. Vai su https://aistudio.google.com/apikey per creare una nuova API key gratuita, poi incollala nelle impostazioni.');
          }
          
          if (response.status === 401 || response.status === 403) {
            throw new Error('API key di Google AI non autorizzata. Verifica che la tua API key sia corretta e attiva su https://aistudio.google.com/apikey');
          }
          
          if (response.status === 404) {
            console.log(`Model ${model} not found, trying next...`);
            continue;
          }
          
          console.error(`Model ${model} failed with status ${response.status}: ${errorText}`);
          
        } catch (error) {
          // If it's our custom error, re-throw it
          if (error instanceof Error && (error.message.includes('API key') || error.message.includes('autorizzata'))) {
            throw error;
          }
          console.error(`Error trying model ${model}:`, error);
          continue;
        }
      }
      
      throw new Error(`Nessun modello Google AI ha funzionato. Prova a usare OpenAI invece (più affidabile) oppure verifica la tua API key su https://aistudio.google.com/apikey`);
    }

    // Use the provider selected by the user
    if (provider === 'openai' && OPENAI_API_KEY) {
      console.log("Using OpenAI API");
      console.log(`OpenAI API Key present: Yes (length: ${OPENAI_API_KEY.length})`);
      
      const requestBody = {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 1.0, // Increased for more variation
        max_tokens: 4096,
      };
      
      console.log("Sending request to OpenAI with model:", requestBody.model);
      
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log(`OpenAI response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error details: ${response.status} - ${errorText}`);
        
        // Return detailed error to frontend
        let errorMessage = "Failed to generate design concept with OpenAI";
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error?.message) {
            errorMessage += `: ${errorJson.error.message}`;
          }
        } catch (e) {
          errorMessage += `: ${errorText}`;
        }
        
        return c.json({ error: errorMessage }, 500);
      }

      const data = await response.json();
      console.log("OpenAI response received successfully");
      
      if (!data.choices || !data.choices[0]?.message?.content) {
        console.error("Unexpected response format from OpenAI API:", JSON.stringify(data));
        return c.json({ error: "Invalid response from OpenAI service" }, 500);
      }

      // Check if response was truncated due to token limit
      const finishReason = data.choices[0]?.finish_reason;
      console.log("OpenAI finish_reason:", finishReason);
      
      if (finishReason === 'length') {
        console.error("OpenAI response was truncated due to max_tokens limit!");
        return c.json({ 
          error: "AI response was truncated due to token limit", 
          suggestion: "The response was too long. This is a system error - please try again."
        }, 500);
      }

      aiResponse = data.choices[0].message.content;

    } else if (provider === 'google' && GOOGLE_AI_API_KEY) {
      console.log("Using Google AI API");
      console.log(`Google AI API Key present: Yes (length: ${GOOGLE_AI_API_KEY.length})`);
      
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: systemPrompt + "\n\n" + userPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 1.0, // Increased for more variation
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
      };
      
      console.log("Auto-detecting best Google AI model...");
      
      try {
        aiResponse = await tryGoogleAIModels(GOOGLE_AI_API_KEY, requestBody);
        console.log("Google AI response received successfully");
      } catch (error) {
        console.error("Error with Google AI:", error);
        return c.json({ 
          error: `Failed to generate design concept with Google AI: ${error instanceof Error ? error.message : String(error)}` 
        }, 500);
      }
    } else {
      console.error(`Invalid provider or missing API key: provider=${provider}`);
      return c.json({ error: "Invalid provider or API key configuration" }, 400);
    }
    
    // Log raw response for debugging
    console.log("Raw AI response length:", aiResponse.length);
    console.log("Raw AI response (first 500 chars):", aiResponse.substring(0, 500));
    console.log("Raw AI response (last 200 chars):", aiResponse.substring(Math.max(0, aiResponse.length - 200)));
    
    // Clean up the response - remove markdown code blocks if present
    let cleanedResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Try to extract JSON if there's text before/after
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    
    console.log("Cleaned AI response length:", cleanedResponse.length);
    console.log("Cleaned AI response (first 500 chars):", cleanedResponse.substring(0, 500));
    
    // Check if JSON appears to be truncated
    const openBraces = (cleanedResponse.match(/\{/g) || []).length;
    const closeBraces = (cleanedResponse.match(/\}/g) || []).length;
    const openBrackets = (cleanedResponse.match(/\[/g) || []).length;
    const closeBrackets = (cleanedResponse.match(/\]/g) || []).length;
    
    console.log(`JSON structure check: { ${openBraces}/${closeBraces}, [ ${openBrackets}/${closeBrackets}`);
    
    if (openBraces !== closeBraces || openBrackets !== closeBrackets) {
      console.error("JSON appears to be truncated!");
      return c.json({ 
        error: "AI response was truncated - JSON is incomplete", 
        details: `Response length: ${cleanedResponse.length} chars. Braces: ${openBraces}/${closeBraces}, Brackets: ${openBrackets}/${closeBrackets}`,
        suggestion: "Try using a different AI provider or simplify your request"
      }, 500);
    }
    
    // Parse the JSON
    let designConcept;
    try {
      designConcept = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON. Full response:", cleanedResponse);
      console.error("Parse error:", parseError);
      
      // Try one more time with the helper function (in case cleanedResponse was modified without using it)
      try {
        const reCleanedResponse = cleanAIJsonResponse(aiResponse);
        console.log("Trying to re-parse with re-cleaned response...");
        designConcept = JSON.parse(reCleanedResponse);
        console.log("Success! Re-parsing worked.");
      } catch (reParseError) {
        return c.json({ 
          error: "Failed to parse AI response", 
          details: cleanedResponse.substring(0, 200),
          parseError: parseError instanceof Error ? parseError.message : String(parseError),
          fullLength: cleanedResponse.length
        }, 500);
      }
    }

    // If we pre-calculated colors, override whatever the AI generated
    if (preCalculatedColors) {
      console.log("Overriding AI-generated colors with pre-calculated palette");
      designConcept.palette = preCalculatedColors;
    }

    // Always override fonts with category-specific fonts
    console.log("Overriding AI-generated fonts with category-specific fonts");
    designConcept.fonts = {
      headline: preCalculatedFonts.headline,
      body: preCalculatedFonts.body
    };

    // CRITICAL FIX #1: Validate and correct colors for WCAG AA compliance
    console.log("Validating palette for WCAG AA compliance (≥4.5:1 contrast)...");
    const validatedPalette = {
      primary: ensureWCAG_AA(designConcept.palette.primary, '#ffffff'),
      ...(designConcept.palette.secondary && { 
        secondary: ensureWCAG_AA(designConcept.palette.secondary, '#ffffff') 
      }),
      accent: ensureWCAG_AA(designConcept.palette.accent, designConcept.palette.primary)
    };
    
    // Check if any colors were modified
    const primaryChanged = validatedPalette.primary !== designConcept.palette.primary;
    const secondaryChanged = designConcept.palette.secondary && validatedPalette.secondary !== designConcept.palette.secondary;
    const accentChanged = validatedPalette.accent !== designConcept.palette.accent;
    
    if (primaryChanged || secondaryChanged || accentChanged) {
      console.log("⚠️ Some colors were adjusted for WCAG AA compliance:");
      if (primaryChanged) console.log(`  Primary: ${designConcept.palette.primary} → ${validatedPalette.primary}`);
      if (secondaryChanged) console.log(`  Secondary: ${designConcept.palette.secondary} → ${validatedPalette.secondary}`);
      if (accentChanged) console.log(`  Accent: ${designConcept.palette.accent} → ${validatedPalette.accent}`);
    } else {
      console.log("✓ All colors already meet WCAG AA standards");
    }
    
    designConcept.palette = validatedPalette;
    designConcept.wcagValidated = true;

    return c.json(designConcept);

  } catch (error) {
    console.error("Error in generate-concept endpoint:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Fetch hero image from Unsplash
app.post("/make-server-5378c2f5/fetch-hero-image", async (c) => {
  try {
    const { category, unsplashAccessKey } = await c.req.json();
    
    if (!category) {
      return c.json({ error: "Category is required" }, 400);
    }

    if (!unsplashAccessKey) {
      return c.json({ error: "Unsplash Access Key is required" }, 400);
    }

    console.log(`Fetching hero image for category: ${category}`);
    
    // Construct optimized search query based on category
    const imageQuery = `${category} product modern aesthetic`;
    
    try {
      const unsplashResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(imageQuery)}&client_id=${unsplashAccessKey}&per_page=1&orientation=landscape&content_filter=high`,
        {
          method: "GET",
          headers: {
            "Accept-Version": "v1"
          }
        }
      );

      if (!unsplashResponse.ok) {
        const errorText = await unsplashResponse.text();
        console.error(`Unsplash API error: ${unsplashResponse.status} - ${errorText}`);
        
        // Check for rate limit errors
        if (unsplashResponse.status === 403) {
          return c.json({ 
            error: "Limite API Unsplash raggiunto. Attendi un'ora prima di riprovare o considera un upgrade del tuo piano Unsplash."
          }, 403);
        }
        
        // Check for invalid API key
        if (unsplashResponse.status === 401) {
          return c.json({ 
            error: "API key Unsplash non valida. Verifica la tua Access Key nelle impostazioni."
          }, 401);
        }
        
        return c.json({ 
          error: `Errore Unsplash: ${unsplashResponse.status}`
        }, unsplashResponse.status);
      }

      const unsplashData = await unsplashResponse.json();
      
      if (unsplashData.results && unsplashData.results.length > 0) {
        const imageUrl = unsplashData.results[0].urls.regular;
        console.log(`Successfully fetched hero image: ${imageUrl}`);
        
        return c.json({ 
          imageUrl,
          photographer: unsplashData.results[0].user?.name,
          photographerUrl: unsplashData.results[0].user?.links?.html
        });
      } else {
        console.log(`No images found for query: ${imageQuery}`);
        return c.json({ 
          error: "Nessuna immagine trovata per questa categoria"
        }, 404);
      }
    } catch (fetchError) {
      console.error("Error fetching from Unsplash:", fetchError);
      return c.json({ 
        error: "Errore di connessione a Unsplash",
        details: String(fetchError)
      }, 500);
    }

  } catch (error) {
    console.error("Error in fetch-hero-image endpoint:", error);
    return c.json({ 
      error: "Errore interno del server",
      details: String(error)
    }, 500);
  }
});

Deno.serve(app.fetch);
