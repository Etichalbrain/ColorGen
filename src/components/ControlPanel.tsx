import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sparkles, Download, RefreshCw, Settings, CheckCircle, Check, AlertCircle, Palette as PaletteIcon, Sliders, Copy } from 'lucide-react';
import { DesignConcept, UserApiConfig, PaletteSize, PaletteStyle, GenerationOptions, ColorScheme } from '../types/design';
import { ApiKeyDialog } from './ApiKeyDialog';
import { Badge } from './ui/badge';
import { meetsWCAG_AA, getContrastRatio } from '../utils/accessibility';
import { analyzeColorHarmony, validatePaletteQuality, hslToHex, getColorNameFromHue } from '../utils/colorTheory';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ControlPanelProps {
  onGenerate: (category: string, options: GenerationOptions) => void;
  isLoading: boolean;
  concept: DesignConcept | null;
  onConfigSaved: (config: UserApiConfig) => void;
  currentConfig: UserApiConfig | null;
}

export function ControlPanel({ onGenerate, isLoading, concept, onConfigSaved, currentConfig }: ControlPanelProps) {
  const [category, setCategory] = useState('');
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [paletteSize, setPaletteSize] = useState<PaletteSize>('3');
  const [paletteStyle, setPaletteStyle] = useState<PaletteStyle>('vibrant');
  const [useCustomHue, setUseCustomHue] = useState(false);
  const [customHue, setCustomHue] = useState(220); // Default to blue (0-360)
  const [customLightness, setCustomLightness] = useState(50); // Default to 50% (0-100)
  const [customSaturation, setCustomSaturation] = useState(70); // Default to 70% (0-100)
  const [colorScheme, setColorScheme] = useState<ColorScheme>('complementary');
  const [copiedColor, setCopiedColor] = useState<string | null>(null); // IMPROVEMENT #1

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category.trim()) {
      onGenerate(category.trim(), { 
        paletteSize, 
        paletteStyle,
        customHue: useCustomHue ? customHue : undefined,
        customLightness: useCustomHue ? customLightness : undefined,
        customSaturation: useCustomHue ? customSaturation : undefined,
        colorScheme: useCustomHue ? colorScheme : undefined
      });
    }
  };

  // IMPROVEMENT #1: Click-to-copy color function
  const copyColorToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // IMPROVEMENT #2: WCAG badge component
  const WcagBadge = ({ color }: { color: string }) => {
    const contrastVsWhite = getContrastRatio(color, '#ffffff');
    const passesAA = contrastVsWhite >= 4.5;
    const passesAAA = contrastVsWhite >= 7;
    
    return (
      <div className="mt-1">
        {passesAAA ? (
          <span className="text-xs px-2 py-0.5 rounded bg-green-900/30 text-green-400 border border-green-700 inline-block">
            ✓ AAA Eccellente ({contrastVsWhite.toFixed(1)}:1)
          </span>
        ) : passesAA ? (
          <span className="text-xs px-2 py-0.5 rounded bg-blue-900/30 text-blue-400 border border-blue-700 inline-block">
            ✓ AA Accessibile ({contrastVsWhite.toFixed(1)}:1)
          </span>
        ) : (
          <span className="text-xs px-2 py-0.5 rounded bg-amber-900/30 text-amber-400 border border-amber-700 inline-block">
            ⚠️ Contrasto limitato ({contrastVsWhite.toFixed(1)}:1)
          </span>
        )}
      </div>
    );
  };

  const downloadPalette = () => {
    if (!concept) return;
    
    const paletteData = {
      metadata: {
        category,
        paletteSize: concept.palette.secondary ? 3 : 2,
        paletteStyle,
        ...(useCustomHue && { customHue, customLightness, customSaturation, colorScheme }),
        generatedAt: new Date().toISOString(),
      },
      palette: {
        primary: concept.palette.primary,
        ...(concept.palette.secondary && { secondary: concept.palette.secondary }),
        accent: concept.palette.accent,
      },
      fonts: {
        headline: concept.fonts.headline,
        body: concept.fonts.body,
      },
    };
    
    const blob = new Blob([JSON.stringify(paletteData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // CRITICAL FIX #5: Shorter filename with hash
    const generateHash = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(36).slice(0, 6);
    };
    
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-').slice(0, 12);
    const style = paletteStyle.slice(0, 3); // vib/pas/dar
    const scheme = colorScheme?.slice(0, 4) || 'auto'; // comp/tria/anal/mono
    const optionsHash = generateHash(JSON.stringify({ paletteStyle, colorScheme, customHue, customLightness, customSaturation }));
    
    const fileName = useCustomHue 
      ? `palette-${categorySlug}-${style}-${scheme}-${optionsHash}.json`
      : `palette-${categorySlug}-${style}.json`;
    
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="dark h-screen bg-sidebar border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary-sidebar" />
              <h1 className="text-2xl text-[rgb(187,134,252)] font-bold">AI Design Color Vibe</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowApiDialog(true)}
              title="Configurazione API" className="text-[rgb(116,116,116)]"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-sm text-[rgb(255,255,255)]">
            Genera concept di design istantanei
          </p>
          {currentConfig && (
            <div className="flex items-center gap-2 mt-3">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <Badge variant="default" className="bg-green-600">
                {currentConfig.provider === 'google' ? 'Google AI' : 'OpenAI'} Configurato
              </Badge>
            </div>
          )}
          {!currentConfig && (
            <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-3 mt-3">
              <p className="text-xs text-amber-200">
                ⚠️ Clicca sull'icona <Settings className="w-3 h-3 inline" /> per configurare la tua API key
              </p>
            </div>
          )}
        </div>

      {/* Tabs Section */}
      <Tabs defaultValue="generate" className="flex-1 flex flex-col">
        <div className="border-b border-border">
          <TabsList className="w-full justify-start rounded-none h-14 bg-transparent p-0">
            <TabsTrigger 
              value="generate" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-sidebar data-[state=active]:bg-primary-sidebar/20 h-full"
            >
              <Sliders className="w-4 h-4 mr-2" />
              Genera
            </TabsTrigger>
            <TabsTrigger 
              value="assets" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-sidebar data-[state=active]:bg-primary-sidebar/20 h-full"
              disabled={!concept}
            >
              <PaletteIcon className="w-4 h-4 mr-2" />
              Assets
              {concept && (
                <Badge variant="default" className="ml-2 bg-primary-sidebar text-xs px-1.5 py-0">
                  <Check className="w-3 h-3" />
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content: Generate */}
        <TabsContent value="generate" className="flex-1 overflow-y-auto m-0">
          <div className="p-6 bg-sidebar max-h-[calc(100vh-250px)] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="category" className="block text-sm mb-2 text-foreground">
              Categoria
            </label>
            <Input
              id="category"
              type="text"
              placeholder="es. tech, beauty, food delivery..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoading}
              className="w-full text-[rgb(255,255,255)] focus-visible:ring-[#bb86fc] focus-visible:border-[#bb86fc]"
            />
          </div>

          {/* Palette Size */}
          <div>
            <Label className="text-sm mb-3 block text-foreground">Numero di Colori</Label>
            <div className="flex gap-3">
              {(['2', '3'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setPaletteSize(size)}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all text-sm ${
                    paletteSize === size
                      ? 'border-[#bb86fc] bg-[#bb86fc]/20 text-[#bb86fc]'
                      : 'border-border bg-sidebar text-muted-foreground hover:border-muted'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <div className="flex gap-0.5">
                      {[...Array(parseInt(size))].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-3 h-3 rounded-full ${
                            paletteSize === size ? 'bg-[#bb86fc]' : 'bg-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-1 text-center">{size} colori</div>
                </button>
              ))}
            </div>
          </div>

          {/* Palette Style */}
          <div>
            <Label className="text-sm mb-3 block text-foreground">Stile Palette</Label>
            <div className="space-y-2">
              {[
                { 
                  value: 'vibrant' as const, 
                  label: 'Vibrante', 
                  desc: 'Colori saturi e vivaci',
                  gradient: 'from-purple-600 to-pink-600',
                  colors: ['#8b5cf6', '#d946ef', '#ec4899']
                },
                { 
                  value: 'pastel' as const, 
                  label: 'Pastello', 
                  desc: 'Colori delicati e soft',
                  gradient: 'from-purple-300 to-pink-300',
                  colors: ['#d8b4fe', '#f0abfc', '#fbcfe8']
                },
                { 
                  value: 'dark' as const, 
                  label: 'Dark', 
                  desc: 'Colori scuri e profondi',
                  gradient: 'from-gray-800 to-slate-900',
                  colors: ['#1f2937', '#374151', '#4b5563']
                }
              ].map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => setPaletteStyle(style.value)}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left ${
                    paletteStyle === style.value
                      ? 'border-[#bb86fc] bg-[#bb86fc]/20'
                      : 'border-border bg-sidebar hover:border-muted'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {style.colors.map((color, i) => (
                        <div 
                          key={i}
                          className="w-5 h-5 rounded-full border-2 border-background shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm ${paletteStyle === style.value ? 'text-[#bb86fc]' : 'text-foreground'}`}>
                        {style.label}
                      </div>
                      <div className="text-xs text-muted-foreground">{style.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Hue */}
          <div className="border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setUseCustomHue(!useCustomHue)}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left ${
                useCustomHue
                  ? 'border-[#bb86fc] bg-[#bb86fc]/20'
                  : 'border-border bg-sidebar hover:border-muted'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <PaletteIcon className={`w-5 h-5 ${useCustomHue ? 'text-[#bb86fc]' : 'text-muted-foreground'}`} />
                <div className="flex-1">
                  <div className={`text-sm ${useCustomHue ? 'text-[#bb86fc]' : 'text-foreground'}`}>
                    Colore HSL Personalizzato
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Controllo completo HSL: Hue, Saturation, Lightness
                  </div>
                </div>
                {useCustomHue && (
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-background shadow-md"
                    style={{ backgroundColor: hslToHex(customHue, customSaturation, customLightness) }}
                  />
                )}
              </div>
            </button>
            
            {useCustomHue && (
              <div className="space-y-3 mt-3 p-4 bg-sidebar-accent rounded-lg border border-[#bb86fc]/50 animate-in slide-in-from-top-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-10 h-10 rounded-lg border-2 border-background shadow-md"
                      style={{ 
                        backgroundColor: hslToHex(customHue, customSaturation, customLightness)
                      }}
                    />
                    <div>
                      <div className="text-sm text-foreground">{getColorNameFromHue(customHue)}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        HSL({customHue}°, {customSaturation}%, {customLightness}%)
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Lightness Control - L */}
                <div className="pt-2 border-t border-border/50">
                  <Label className="text-xs mb-2 block text-foreground">Lightness (Luminosità) - L</Label>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-xs text-muted-foreground">Scuro</div>
                    <div className="flex-1 relative py-2">
                      {/* Lightness gradient background */}
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-4 rounded-full border-2 border-background shadow-md"
                        style={{
                          background: `linear-gradient(to right, 
                            ${hslToHex(customHue, customSaturation, 0)} 0%, 
                            ${hslToHex(customHue, customSaturation, 50)} 50%, 
                            ${hslToHex(customHue, customSaturation, 100)} 100%)`
                        }}
                      />
                      <Slider
                        value={[customLightness]}
                        onValueChange={(value) => setCustomLightness(value[0])}
                        min={0}
                        max={100}
                        step={1}
                        disabled={isLoading}
                        className="w-full relative z-10"
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">Chiaro</div>
                  </div>
                  <div className="text-xs text-muted-foreground text-center">{customLightness}%</div>
                </div>
                
                {/* Saturation Control - S */}
                <div className="pt-2 border-t border-border/50">
                  <Label className="text-xs mb-2 block text-foreground">Saturation (Saturazione) - S</Label>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-xs text-muted-foreground">Grigio</div>
                    <div className="flex-1 relative py-2">
                      {/* Saturation gradient background - from gray to full saturation */}
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-4 rounded-full border-2 border-background shadow-md"
                        style={{
                          background: `linear-gradient(to right, 
                            ${hslToHex(customHue, 0, customLightness)} 0%, 
                            ${hslToHex(customHue, 100, customLightness)} 100%)`
                        }}
                      />
                      <Slider
                        value={[customSaturation]}
                        onValueChange={(value) => setCustomSaturation(value[0])}
                        min={0}
                        max={100}
                        step={1}
                        disabled={isLoading}
                        className="w-full relative z-10"
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">Vibrante</div>
                  </div>
                  <div className="text-xs text-muted-foreground text-center">{customSaturation}%</div>
                </div>
                
                {/* Hue Control - H */}
                <div className="pt-2 border-t border-border/50">
                  <Label className="text-xs mb-2 block text-foreground">Hue (Tonalità) - H</Label>
                  <div className="relative py-2">
                    {/* Color spectrum gradient background */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-5 rounded-full border-2 border-background shadow-lg"
                      style={{
                        background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                      }}
                    />
                    <Slider
                      value={[customHue]}
                      onValueChange={(value) => setCustomHue(value[0])}
                      min={0}
                      max={360}
                      step={1}
                      disabled={isLoading}
                      className="w-full relative z-10 color-hue-slider"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-center">{customHue}°</div>
                </div>
                
                {/* Color Scheme Selection */}
                <div className="pt-2 border-t border-border/50">
                  <Label className="text-xs mb-2 block text-foreground">Schema di Colore</Label>
                  <div className="space-y-2">
                    {[
                      { 
                        value: 'monochromatic' as const, 
                        label: 'Monocromatico', 
                        desc: 'Variazioni di un colore',
                        icon: '🎨'
                      },
                      { 
                        value: 'complementary' as const, 
                        label: 'Complementare', 
                        desc: 'Contrasto massimo',
                        icon: '⚡'
                      },
                      { 
                        value: 'triadic' as const, 
                        label: 'Triadico', 
                        desc: 'Energia bilanciata',
                        icon: '🔺'
                      },
                      { 
                        value: 'analogous' as const, 
                        label: 'Analogo', 
                        desc: 'Armonia naturale',
                        icon: '🌊'
                      }
                    ].map((scheme) => (
                      <button
                        key={scheme.value}
                        type="button"
                        onClick={() => setColorScheme(scheme.value)}
                        disabled={isLoading}
                        className={`w-full px-3 py-2 rounded-md border transition-all text-left text-xs ${
                          colorScheme === scheme.value
                            ? 'border-[#bb86fc] bg-[#bb86fc]/20 text-[#bb86fc]'
                            : 'border-border bg-sidebar text-muted-foreground hover:border-muted'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{scheme.icon}</span>
                          <div className="flex-1">
                            <div className={`${colorScheme === scheme.value ? 'text-[#bb86fc]' : 'text-foreground'}`}>
                              {scheme.label}
                            </div>
                            <div className="text-muted-foreground">{scheme.desc}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground italic pt-1">
                  Schema {colorScheme === 'monochromatic' ? 'monocromatico' : colorScheme === 'complementary' ? 'complementare' : colorScheme === 'triadic' ? 'triadico' : colorScheme === 'split-complementary' ? 'split-complementare' : 'analogo'} basato su HSL({customHue}°, {customSaturation}%, {customLightness}%)
                </p>
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[rgb(187,134,252)]" 
            disabled={isLoading || !category.trim()}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generazione...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Genera
              </>
            )}
          </Button>
        </form>
          </div>
        </TabsContent>

        {/* Tab Content: Assets */}
        <TabsContent value="assets" className="flex-1 overflow-y-auto m-0">
          {concept ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg">Asset Generati</h2>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {concept.palette.secondary ? '3' : '2'} colori
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {paletteStyle}
                  </Badge>
                  {useCustomHue && (
                    <>
                      <Badge variant="default" className="text-xs bg-primary-sidebar">
                        {colorScheme === 'complementary' ? 'Complementare' : colorScheme === 'triadic' ? 'Triadico' : 'Analogo'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Hue {customHue}°
                      </Badge>
                    </>
                  )}
                </div>
              </div>
          
          {/* Color Harmony Analysis */}
          {(() => {
            const harmony = analyzeColorHarmony(
              concept.palette.primary, 
              concept.palette.secondary || concept.palette.primary, 
              concept.palette.accent
            );
            const quality = validatePaletteQuality(concept.palette);
            
            return (
              <div className="mb-4 p-4 bg-gradient-to-br from-primary-sidebar/20 to-blue-500/20 rounded-lg border border-primary-sidebar/50">
                <div className="flex items-center gap-2 mb-2">
                  <PaletteIcon className="w-4 h-4 text-primary-sidebar" />
                  <span className="text-sm text-foreground">Analisi Teoria del Colore</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="default" 
                      className={`${
                        harmony.quality === 'excellent' ? 'bg-green-600' :
                        harmony.quality === 'good' ? 'bg-blue-600' :
                        harmony.quality === 'fair' ? 'bg-amber-600' : 'bg-gray-600'
                      }`}
                    >
                      {harmony.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {quality.score >= 80 ? '🌟' : quality.score >= 60 ? '✓' : '⚠️'}
                      {' '}Score: {quality.score}/100
                    </span>
                  </div>
                  <p className="text-xs text-foreground">{harmony.description}</p>
                  {quality.recommendations.length > 0 && quality.score < 80 && (
                    <div className="mt-2 p-2 bg-amber-500/20 rounded border border-amber-500/50">
                      <p className="text-xs text-amber-200 mb-1">💡 Suggerimenti:</p>
                      <ul className="text-xs text-amber-300 space-y-1">
                        {quality.recommendations.slice(0, 2).map((rec, i) => (
                          <li key={i}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
          
          {/* Color Palette - IMPROVEMENT #1 & #2 */}
          <div className="mb-6">
            <h3 className="text-sm mb-3 text-foreground">Palette Colori</h3>
            <div className="space-y-2">
              <button
                onClick={() => copyColorToClipboard(concept.palette.primary)}
                className="group relative flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary-sidebar transition-all cursor-pointer w-full text-left"
              >
                <div 
                  className="w-12 h-12 rounded-md flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: concept.palette.primary }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground">Primario</div>
                  <div className="font-mono text-sm text-foreground">{concept.palette.primary}</div>
                  <WcagBadge color={concept.palette.primary} />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedColor === concept.palette.primary ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>
              {concept.palette.secondary && (
                <button
                  onClick={() => copyColorToClipboard(concept.palette.secondary!)}
                  className="group relative flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary-sidebar transition-all cursor-pointer w-full text-left"
                >
                  <div 
                    className="w-12 h-12 rounded-md flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: concept.palette.secondary }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground">Secondario</div>
                    <div className="font-mono text-sm text-foreground">{concept.palette.secondary}</div>
                    <WcagBadge color={concept.palette.secondary} />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedColor === concept.palette.secondary ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
              )}
              <button
                onClick={() => copyColorToClipboard(concept.palette.accent)}
                className="group relative flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary-sidebar transition-all cursor-pointer w-full text-left"
              >
                <div 
                  className="w-12 h-12 rounded-md flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: concept.palette.accent }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground">Accento</div>
                  <div className="font-mono text-sm text-foreground">{concept.palette.accent}</div>
                  <WcagBadge color={concept.palette.accent} />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedColor === concept.palette.accent ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Typography */}
          <div className="mb-6">
            <h3 className="text-sm mb-3 text-foreground">Tipografia</h3>
            <div className="space-y-2">
              <div className="p-3 bg-card rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-1">Headline Font</div>
                <div className="text-sm text-foreground">{concept.fonts.headline}</div>
              </div>
              <div className="p-3 bg-card rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-1">Body Font</div>
                <div className="text-sm text-foreground">{concept.fonts.body}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={downloadPalette}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Palette
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => category && onGenerate(category, { 
                paletteSize, 
                paletteStyle,
                customHue: useCustomHue ? customHue : undefined,
                colorScheme: useCustomHue ? colorScheme : undefined
              })}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Rigenera
            </Button>
          </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full py-12">
              <div className="text-center text-muted-foreground">
                <PaletteIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  Nessun asset generato
                </p>
                <p className="text-xs mt-1">
                  Genera un design per vedere gli asset
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      </div>
      
      <ApiKeyDialog 
        open={showApiDialog} 
        onClose={() => setShowApiDialog(false)}
        onConfigSaved={onConfigSaved}
        currentConfig={currentConfig}
      />
    </>
  );
}