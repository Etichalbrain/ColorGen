import React, { useEffect } from 'react';
import { DesignConcept } from '../types/design';
import { Loader2, Star, Zap, Shield } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getAccessibleTextColor, getSafeTextColorOnLight, getSafeSecondaryTextColorOnLight } from '../utils/accessibility';
import { LandingPageSkeleton } from './LandingPageSkeleton';

interface LandingPagePreviewProps {
  concept: DesignConcept | null;
  heroImage: string | null;
  isLoadingImage: boolean;
  imageError?: string | null;
}

export function LandingPagePreview({ concept, heroImage, isLoadingImage, imageError }: LandingPagePreviewProps) {
  
  // Load Google Fonts dynamically
  useEffect(() => {
    if (concept) {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${concept.fonts.headline.replace(' ', '+')}:wght@700&family=${concept.fonts.body.replace(' ', '+')}:wght@400&display=swap`;
      link.rel = 'stylesheet';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);

      return () => {
        // Check if the link still exists before removing
        if (link.parentNode) {
          document.head.removeChild(link);
        }
      };
    }
  }, [concept]);

  if (!concept) {
    return <LandingPageSkeleton />;
  }

  const { palette, fonts, content } = concept;

  // Calculate accessible text colors for each palette color
  const primaryTextColor = getAccessibleTextColor(palette.primary);
  const secondaryTextColor = palette.secondary ? getAccessibleTextColor(palette.secondary) : primaryTextColor;
  const accentTextColor = getAccessibleTextColor(palette.accent);

  // Safe colors for text on light backgrounds (guaranteed AA compliance)
  const safeTextOnLight = getSafeTextColorOnLight();
  const safeSecondaryTextOnLight = getSafeSecondaryTextColorOnLight();

  // Default icons for features
  const featureIcons = [Zap, Star, Shield];

  return (
    <div className="h-screen overflow-hidden bg-sidebar">
      {/* Navbar */}
      <nav 
        className="sticky top-0 z-50 border-b"
        style={{ 
          backgroundColor: palette.primary,
          borderBottomColor: palette.secondary || palette.accent
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div 
            className="text-xl"
            style={{ 
              fontFamily: fonts.headline,
              color: primaryTextColor
            }}
          >
            {content.productName}
          </div>
          <div className="flex gap-6">
            {['Features', 'Testimonianze', 'Contatti'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm hover:opacity-80 transition-opacity"
                style={{ 
                  fontFamily: fonts.body,
                  color: primaryTextColor
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative overflow-hidden"
        style={{ backgroundColor: palette.primary }}
      >
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <h1 
              className="text-5xl mb-6"
              style={{ 
                fontFamily: fonts.headline,
                color: primaryTextColor
              }}
            >
              {content.productName}
            </h1>
            <p 
              className="text-xl mb-8"
              style={{ 
                fontFamily: fonts.body,
                color: primaryTextColor,
                opacity: primaryTextColor === '#ffffff' ? 0.9 : 0.8
              }}
            >
              {content.heroDescription}
            </p>
            <button
              className="px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              style={{ 
                backgroundColor: palette.accent,
                fontFamily: fonts.body,
                color: accentTextColor
              }}
            >
              {content.ctaPrimary}
            </button>
          </div>
          
          {/* Hero Image */}
          <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
            {isLoadingImage ? (
              <div className="w-full h-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
            ) : imageError ? (
              <div className="w-full h-full bg-white/10 backdrop-blur-sm flex items-center justify-center p-8">
                <div className="text-white text-center">
                  <div className="text-4xl mb-3">⚠️</div>
                  <p className="text-sm">{imageError}</p>
                </div>
              </div>
            ) : heroImage ? (
              <ImageWithFallback
                src={heroImage}
                alt={content.productName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-sm">Immagine Hero</p>
                  <p className="text-xs mt-2 opacity-75">Configura Unsplash nelle impostazioni</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 
            className="text-4xl text-center mb-12"
            style={{ 
              fontFamily: fonts.headline,
              color: safeTextOnLight
            }}
          >
            Perché scegliere noi
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {content.features.map((feature, index) => {
              const Icon = featureIcons[index];
              return (
                <div 
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: palette.accent }}
                  >
                    <Icon className="w-6 h-6" style={{ color: accentTextColor }} />
                  </div>
                  <h3 
                    className="text-xl mb-3"
                    style={{ 
                      fontFamily: fonts.headline,
                      color: safeTextOnLight
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    style={{ 
                      fontFamily: fonts.body,
                      color: safeSecondaryTextOnLight
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        className="py-20"
        style={{ backgroundColor: palette.secondary || palette.primary }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 
            className="text-4xl text-center mb-12"
            style={{ 
              fontFamily: fonts.headline,
              color: secondaryTextColor
            }}
          >
            Dicono di noi
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {content.testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-xl"
              >
                <p 
                  className="text-lg mb-4 italic"
                  style={{ 
                    fontFamily: fonts.body,
                    color: secondaryTextColor
                  }}
                >
                  "{testimonial.quote}"
                </p>
                <p 
                  style={{ 
                    fontFamily: fonts.body,
                    color: secondaryTextColor,
                    opacity: secondaryTextColor === '#ffffff' ? 0.9 : 0.8
                  }}
                >
                  — {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 
            className="text-4xl mb-6"
            style={{ 
              fontFamily: fonts.headline,
              color: safeTextOnLight
            }}
          >
            {content.finalCta.title}
          </h2>
          <button
            className="px-10 py-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-lg"
            style={{ 
              backgroundColor: palette.accent,
              fontFamily: fonts.body,
              color: accentTextColor
            }}
          >
            {content.finalCta.button}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-12"
        style={{ backgroundColor: palette.primary }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div 
              className="text-xl"
              style={{ 
                fontFamily: fonts.headline,
                color: primaryTextColor
              }}
            >
              {content.productName}
            </div>
            <div className="flex gap-6">
              {['Facebook', 'Twitter', 'Instagram'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-sm hover:opacity-80 transition-opacity"
                  style={{ 
                    fontFamily: fonts.body,
                    color: primaryTextColor
                  }}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
          <div 
            className="text-center text-sm"
            style={{ 
              fontFamily: fonts.body,
              color: primaryTextColor,
              opacity: primaryTextColor === '#ffffff' ? 0.75 : 0.65
            }}
          >
            © 2025 {content.productName}. Tutti i diritti riservati.
          </div>
        </div>
      </footer>
    </div>
  );
}