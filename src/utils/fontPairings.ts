/**
 * Google Font Pairings per Categoria
 * 
 * Sistema di abbinamento tipografico professionale che seleziona
 * automaticamente combinazioni di font Google appropriate in base
 * alla categoria del sito web.
 * 
 * Principio: Headline forte + Body leggibile
 */

export interface FontPair {
  headline: string;
  body: string;
  description: string;
  mood: string;
}

/**
 * Font Pairings categorizzati per settore
 * Ogni categoria ha multiple opzioni per varietà
 */
export const CATEGORY_FONTS: Record<string, FontPair[]> = {
  // Tech, SaaS, Software, Startup
  tech: [
    {
      headline: 'Space Grotesk',
      body: 'Inter',
      description: 'Moderno e tech-forward',
      mood: 'innovative'
    },
    {
      headline: 'Poppins',
      body: 'Roboto',
      description: 'Geometrico e clean',
      mood: 'modern'
    },
    {
      headline: 'Work Sans',
      body: 'Source Sans Pro',
      description: 'Professionale e versatile',
      mood: 'corporate'
    },
    {
      headline: 'DM Sans',
      body: 'IBM Plex Sans',
      description: 'Tech minimale',
      mood: 'minimal'
    }
  ],

  // Beauty, Fashion, Cosmetics, Jewelry
  beauty: [
    {
      headline: 'Playfair Display',
      body: 'Montserrat',
      description: 'Elegante e sofisticato',
      mood: 'luxury'
    },
    {
      headline: 'Cormorant Garamond',
      body: 'Lato',
      description: 'Premium e raffinato',
      mood: 'elegant'
    },
    {
      headline: 'Bodoni Moda',
      body: 'Raleway',
      description: 'Fashion-forward',
      mood: 'chic'
    },
    {
      headline: 'Cinzel',
      body: 'Quicksand',
      description: 'Classico moderno',
      mood: 'sophisticated'
    }
  ],

  // Food, Restaurant, Delivery, Cafe
  food: [
    {
      headline: 'Satisfy',
      body: 'Nunito',
      description: 'Friendly e appetitoso',
      mood: 'warm'
    },
    {
      headline: 'Pacifico',
      body: 'Open Sans',
      description: 'Casual e invitante',
      mood: 'friendly'
    },
    {
      headline: 'Lobster',
      body: 'Lato',
      description: 'Giocoso e delizioso',
      mood: 'playful'
    },
    {
      headline: 'Righteous',
      body: 'Karla',
      description: 'Energetico e gustoso',
      mood: 'vibrant'
    }
  ],

  // Finance, Banking, Investment, Insurance
  finance: [
    {
      headline: 'Montserrat',
      body: 'Open Sans',
      description: 'Solido e affidabile',
      mood: 'trustworthy'
    },
    {
      headline: 'Roboto Slab',
      body: 'Roboto',
      description: 'Professionale e stabile',
      mood: 'corporate'
    },
    {
      headline: 'IBM Plex Serif',
      body: 'IBM Plex Sans',
      description: 'Serio e credibile',
      mood: 'authoritative'
    },
    {
      headline: 'Merriweather',
      body: 'Lato',
      description: 'Tradizionale e sicuro',
      mood: 'established'
    }
  ],

  // Health, Wellness, Medical, Fitness
  health: [
    {
      headline: 'Quicksand',
      body: 'Open Sans',
      description: 'Calmo e accessibile',
      mood: 'caring'
    },
    {
      headline: 'Nunito',
      body: 'Roboto',
      description: 'Friendly e rassicurante',
      mood: 'approachable'
    },
    {
      headline: 'Rubik',
      body: 'Source Sans Pro',
      description: 'Moderno e salutare',
      mood: 'fresh'
    },
    {
      headline: 'Karla',
      body: 'Inter',
      description: 'Pulito e professionale',
      mood: 'clinical'
    }
  ],

  // Creative, Agency, Design, Art
  creative: [
    {
      headline: 'Bebas Neue',
      body: 'Raleway',
      description: 'Bold e distintivo',
      mood: 'impactful'
    },
    {
      headline: 'Oswald',
      body: 'Lato',
      description: 'Forte e dinamico',
      mood: 'energetic'
    },
    {
      headline: 'Anton',
      body: 'Source Sans Pro',
      description: 'Drammatico e artistico',
      mood: 'bold'
    },
    {
      headline: 'Archivo Black',
      body: 'Karla',
      description: 'Impattante e creativo',
      mood: 'striking'
    }
  ],

  // E-commerce, Retail, Shopping
  ecommerce: [
    {
      headline: 'Inter',
      body: 'Inter',
      description: 'Versatile e neutro',
      mood: 'universal'
    },
    {
      headline: 'Poppins',
      body: 'Open Sans',
      description: 'Moderno e friendly',
      mood: 'accessible'
    },
    {
      headline: 'Outfit',
      body: 'Nunito Sans',
      description: 'Clean e contemporaneo',
      mood: 'modern'
    },
    {
      headline: 'Urbanist',
      body: 'Roboto',
      description: 'Urbano e chic',
      mood: 'trendy'
    }
  ],

  // Education, Learning, Courses
  education: [
    {
      headline: 'Lexend',
      body: 'Source Sans Pro',
      description: 'Leggibile e chiaro',
      mood: 'educational'
    },
    {
      headline: 'Manrope',
      body: 'Inter',
      description: 'Friendly e professionale',
      mood: 'academic'
    },
    {
      headline: 'Public Sans',
      body: 'Open Sans',
      description: 'Accessibile e neutro',
      mood: 'inclusive'
    },
    {
      headline: 'Red Hat Display',
      body: 'Red Hat Text',
      description: 'Moderno educativo',
      mood: 'contemporary'
    }
  ],

  // Travel, Tourism, Hospitality
  travel: [
    {
      headline: 'Abril Fatface',
      body: 'Lato',
      description: 'Avventuroso e attraente',
      mood: 'adventurous'
    },
    {
      headline: 'Righteous',
      body: 'Raleway',
      description: 'Energetico ed esplorativo',
      mood: 'exciting'
    },
    {
      headline: 'Amatic SC',
      body: 'Josefin Sans',
      description: 'Casual e rilassato',
      mood: 'laid-back'
    },
    {
      headline: 'Barlow Condensed',
      body: 'Barlow',
      description: 'Dinamico e moderno',
      mood: 'contemporary'
    }
  ],

  // Real Estate, Property
  realestate: [
    {
      headline: 'Playfair Display',
      body: 'Open Sans',
      description: 'Elegante e premium',
      mood: 'upscale'
    },
    {
      headline: 'Cinzel',
      body: 'Raleway',
      description: 'Lussuoso e solido',
      mood: 'luxury'
    },
    {
      headline: 'EB Garamond',
      body: 'Source Sans Pro',
      description: 'Classico e affidabile',
      mood: 'established'
    },
    {
      headline: 'Libre Baskerville',
      body: 'Lato',
      description: 'Tradizionale e sicuro',
      mood: 'trustworthy'
    }
  ],

  // Gaming, Entertainment
  gaming: [
    {
      headline: 'Russo One',
      body: 'Exo 2',
      description: 'Futuristico e energetico',
      mood: 'futuristic'
    },
    {
      headline: 'Orbitron',
      body: 'Rajdhani',
      description: 'Sci-fi e tech',
      mood: 'cyberpunk'
    },
    {
      headline: 'Teko',
      body: 'Titillium Web',
      description: 'Gaming moderno',
      mood: 'competitive'
    },
    {
      headline: 'Press Start 2P',
      body: 'Roboto',
      description: 'Retro gaming',
      mood: 'nostalgic'
    }
  ],

  // Default fallback
  default: [
    {
      headline: 'Inter',
      body: 'Inter',
      description: 'Versatile per ogni settore',
      mood: 'neutral'
    },
    {
      headline: 'Poppins',
      body: 'Open Sans',
      description: 'Moderno e pulito',
      mood: 'clean'
    },
    {
      headline: 'Montserrat',
      body: 'Lato',
      description: 'Bilanciato e professionale',
      mood: 'balanced'
    }
  ]
};

/**
 * Mapping di keyword a categorie
 * Permette matching flessibile per categorie simili
 */
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

/**
 * Trova la categoria migliore per il testo fornito
 */
export function detectCategory(text: string): string {
  const normalizedText = text.toLowerCase().trim();
  
  // Exact match first
  if (CATEGORY_FONTS[normalizedText]) {
    return normalizedText;
  }
  
  // Keyword matching
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalizedText.includes(keyword) || keyword.includes(normalizedText)) {
        return category;
      }
    }
  }
  
  return 'default';
}

/**
 * Seleziona una coppia di font per la categoria
 * Usa un indice basato sulla categoria per consistenza ma varietà
 */
export function getFontPairForCategory(category: string): FontPair {
  const detectedCategory = detectCategory(category);
  const fontOptions = CATEGORY_FONTS[detectedCategory] || CATEGORY_FONTS.default;
  
  // Use a simple hash of the category to get consistent but varied results
  const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % fontOptions.length;
  
  return fontOptions[index];
}

/**
 * Ottiene tutte le opzioni di font per una categoria
 */
export function getAllFontPairsForCategory(category: string): FontPair[] {
  const detectedCategory = detectCategory(category);
  return CATEGORY_FONTS[detectedCategory] || CATEGORY_FONTS.default;
}

/**
 * Ottiene un font pairing casuale per varietà
 */
export function getRandomFontPairForCategory(category: string): FontPair {
  const detectedCategory = detectCategory(category);
  const fontOptions = CATEGORY_FONTS[detectedCategory] || CATEGORY_FONTS.default;
  const randomIndex = Math.floor(Math.random() * fontOptions.length);
  
  return fontOptions[randomIndex];
}
