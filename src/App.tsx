import React, { useState, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { LandingPagePreview } from './components/LandingPagePreview';
import { DesignConcept, UserApiConfig, GenerationOptions } from './types/design';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';

const USER_CONFIG_KEY = 'ai-design-vibe-config';

export default function App() {
  const [concept, setConcept] = useState<DesignConcept | null>(null);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [heroImageCache, setHeroImageCache] = useState<Record<string, string>>({});
  const [imageError, setImageError] = useState<string | null>(null);
  const [isLoadingConcept, setIsLoadingConcept] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [userConfig, setUserConfig] = useState<UserApiConfig | null>(null);

  // Load user configuration from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem(USER_CONFIG_KEY);
    if (savedConfig) {
      try {
        setUserConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Error loading user config:', error);
      }
    }
  }, []);

  const handleConfigSaved = (config: UserApiConfig) => {
    setUserConfig(config);
    localStorage.setItem(USER_CONFIG_KEY, JSON.stringify(config));
  };

  const handleGenerate = async (category: string, options: GenerationOptions) => {
    // Check if user has configured their API key
    if (!userConfig || !userConfig.apiKey) {
      toast.error('Configura prima la tua API key! Clicca sull\'icona delle impostazioni.', {
        duration: 5000,
      });
      return;
    }

    const categoryNormalized = category.trim().toLowerCase();
    const categoryChanged = categoryNormalized !== currentCategory;

    setIsLoadingConcept(true);
    setConcept(null);
    setImageError(null);

    // Only load image if category changed
    if (categoryChanged) {
      setCurrentCategory(categoryNormalized);
      setIsLoadingImage(true);
      
      // Check if we have cached image for this category
      if (heroImageCache[categoryNormalized]) {
        console.log('Using cached image for category:', categoryNormalized);
        setHeroImage(heroImageCache[categoryNormalized]);
        setIsLoadingImage(false);
      } else {
        setHeroImage(null);
      }
    }

    try {
      // Phase 1: Generate design concept
      console.log('Generating concept for category:', category);
      console.log('Using provider:', userConfig.provider);
      console.log('Generation options:', options);
      console.log('Calling endpoint:', `https://${projectId}.supabase.co/functions/v1/make-server-5378c2f5/generate-concept`);
      
      const conceptResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5378c2f5/generate-concept`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ 
            category,
            provider: userConfig.provider,
            apiKey: userConfig.apiKey,
            options,
          }),
        }
      );
      
      console.log('Concept response status:', conceptResponse.status);

      if (!conceptResponse.ok) {
        const errorData = await conceptResponse.json();
        console.error('Error generating concept:', errorData);
        console.error('Response status:', conceptResponse.status);
        
        // Show detailed error message
        const errorMessage = errorData.error || 'Errore durante la generazione del concept';
        
        // Check for specific error types
        if (errorMessage.includes('scaduta') || errorMessage.includes('expired')) {
          toast.error(errorMessage, {
            duration: 10000,
            description: 'Crea una nuova API key gratuita su https://aistudio.google.com/apikey',
          });
        } else if (errorMessage.includes('API key')) {
          toast.error(errorMessage, {
            duration: 7000,
            description: 'Clicca sull\'icona delle impostazioni per configurare la tua API key',
          });
        } else {
          toast.error(errorMessage, {
            duration: 7000,
          });
        }
        
        console.log('Full error message:', errorMessage);
        
        setIsLoadingConcept(false);
        setIsLoadingImage(false);
        return;
      }

      const conceptData = await conceptResponse.json();
      console.log('New concept generated:', {
        primary: conceptData.palette?.primary,
        secondary: conceptData.palette?.secondary,
        accent: conceptData.palette?.accent,
        productName: conceptData.content?.productName
      });
      
      setConcept(conceptData);
      setIsLoadingConcept(false);

      const isRegeneration = !categoryChanged && currentCategory;
      toast.success(isRegeneration ? 'Nuova palette generata!' : 'Concept generato con successo!');

      // Phase 2: Generate hero image - ONLY if category changed and not cached
      if (categoryChanged && !heroImageCache[categoryNormalized]) {
        // Check if user has configured Unsplash
        if (userConfig.unsplashAccessKey) {
          try {
            console.log('Fetching hero image for new category:', categoryNormalized);
            const imageResponse = await fetch(
              `https://${projectId}.supabase.co/functions/v1/make-server-5378c2f5/fetch-hero-image`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${publicAnonKey}`,
                },
                body: JSON.stringify({ 
                  category: categoryNormalized,
                  unsplashAccessKey: userConfig.unsplashAccessKey,
                }),
              }
            );

            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              if (imageData.imageUrl) {
                setHeroImage(imageData.imageUrl);
                // Cache the image for this category
                setHeroImageCache(prev => ({
                  ...prev,
                  [categoryNormalized]: imageData.imageUrl
                }));
                console.log('Hero image fetched and cached successfully');
              } else {
                console.warn('No image URL in response');
                setImageError('Nessuna immagine trovata per questa categoria');
              }
            } else {
              const errorData = await imageResponse.json();
              console.error('Error fetching hero image:', errorData);
              
              // Check for specific error types
              if (errorData.error?.includes('limite') || errorData.error?.includes('limit')) {
                setImageError('Crediti immagini terminati per ora');
              } else if (errorData.error?.includes('API key')) {
                setImageError('Unsplash API key non valida');
              } else {
                setImageError('Impossibile caricare l\'immagine');
              }
            }
          } catch (imageError) {
            console.error('Error fetching hero image:', imageError);
            setImageError('Errore di connessione');
          }
        } else {
          console.log('Unsplash not configured, skipping image fetch');
        }
        
        setIsLoadingImage(false);
      }

    } catch (error) {
      console.error('Error in handleGenerate:', error);
      toast.error('Errore durante la generazione');
      setIsLoadingConcept(false);
      setIsLoadingImage(false);
    }
  };

  const isLoading = isLoadingConcept || isLoadingImage;

  return (
    <>
      <div className="dark h-screen flex bg-sidebar">
        {/* Left Sidebar - Control Panel */}
        <div className="w-96 flex-shrink-0">
          <ControlPanel
            onGenerate={handleGenerate}
            isLoading={isLoading}
            concept={concept}
            onConfigSaved={handleConfigSaved}
            currentConfig={userConfig}
          />
        </div>

        {/* Right Area - Landing Page Preview */}
        <div className="flex-1">
          <div className="h-full">
            <LandingPagePreview
              concept={concept}
              heroImage={heroImage}
              isLoadingImage={isLoadingImage}
              imageError={imageError}
            />
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}