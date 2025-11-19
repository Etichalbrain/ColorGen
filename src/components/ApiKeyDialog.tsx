import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ExternalLink, Key, Save } from 'lucide-react';
import { UserApiConfig } from '../types/design';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from './ui/alert';

interface ApiKeyDialogProps {
  open: boolean;
  onClose: () => void;
  onConfigSaved: (config: UserApiConfig) => void;
  currentConfig: UserApiConfig | null;
}

export function ApiKeyDialog({ open, onClose, onConfigSaved, currentConfig }: ApiKeyDialogProps) {
  const [selectedApi, setSelectedApi] = useState<'google' | 'openai'>(currentConfig?.provider || 'openai');
  const [apiKey, setApiKey] = useState('');
  const [unsplashAccessKey, setUnsplashAccessKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (open && currentConfig) {
      setSelectedApi(currentConfig.provider);
      setApiKey(currentConfig.apiKey);
      setUnsplashAccessKey(currentConfig.unsplashAccessKey || '');
    }
  }, [open, currentConfig]);

  const handleConfigureGoogleAI = () => {
    window.open('https://aistudio.google.com/app/apikey', '_blank');
  };

  const handleConfigureOpenAI = () => {
    window.open('https://platform.openai.com/api-keys', '_blank');
  };

  const handleTestGoogleApi = async () => {
    if (!apiKey.trim()) {
      toast.error('Inserisci prima una API key');
      return;
    }

    setIsTesting(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Test API failed:', errorText);
        toast.error('API key non valida o errore di connessione', {
          description: 'Verifica che la tua API key sia corretta',
          duration: 5000,
        });
        setIsTesting(false);
        return;
      }

      const data = await response.json();
      const models = data.models || [];
      const modelNames = models.map((m: any) => m.name);
      
      console.log('Available Google AI models:', modelNames);
      
      toast.success('API key valida!', {
        description: `${models.length} modelli disponibili`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error testing API:', error);
      toast.error('Errore durante il test della API key');
    }
    setIsTesting(false);
  };

  const handleConfigureUnsplash = () => {
    window.open('https://unsplash.com/oauth/applications', '_blank');
  };

  const handleSaveConfig = () => {
    if (!apiKey.trim()) {
      toast.error('Inserisci una API key valida');
      return;
    }

    const config: UserApiConfig = {
      provider: selectedApi,
      apiKey: apiKey.trim(),
      unsplashAccessKey: unsplashAccessKey.trim() || undefined,
    };

    onConfigSaved(config);
    toast.success(`Configurazione salvata con successo!`);
    onClose();
  };

  const maskApiKey = (key: string) => {
    if (!key || key.length < 8) return key;
    return key.substring(0, 4) + '•'.repeat(Math.min(20, key.length - 8)) + key.substring(key.length - 4);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Configurazione API AI
          </DialogTitle>
          <DialogDescription>
            Scegli il servizio AI che vuoi utilizzare e incolla la tua API key.
          </DialogDescription>
        </DialogHeader>

        {currentConfig && (
          <Alert>
            <AlertDescription>
              <strong>Configurazione attuale:</strong> {currentConfig.provider === 'google' ? 'Google AI' : 'OpenAI'} 
              <br />
              <span className="text-xs font-mono">{maskApiKey(currentConfig.apiKey)}</span>
              {currentConfig.unsplashAccessKey && (
                <>
                  <br />
                  <strong className="text-green-700">Unsplash configurato</strong>
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={selectedApi} onValueChange={(v) => setSelectedApi(v as 'google' | 'openai')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="google">Google AI (Gemini)</TabsTrigger>
            <TabsTrigger value="openai">OpenAI (ChatGPT)</TabsTrigger>
          </TabsList>

          <TabsContent value="google" className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm mb-2">Google AI (Gemini)</h3>
              <p className="text-sm text-gray-600 mb-3">
                Google AI offre modelli potenti come Gemini Pro per generare contenuti creativi e strutturati.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Modello: Gemini Pro</li>
                <li>✓ Ottimo per contenuti strutturati (JSON)</li>
                <li>✓ Free tier disponibile</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm">Come ottenere la tua API key:</h4>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                <li>Clicca sul pulsante qui sotto per aprire Google AI Studio</li>
                <li>Accedi con il tuo account Google</li>
                <li>Clicca su "Get API Key" o "Create API Key"</li>
                <li>Copia la tua API key (inizia con "AIza...")</li>
                <li>Incollala nel campo qui sotto e clicca "Testa API Key"</li>
                <li>Se il test è OK, clicca "Salva Configurazione"</li>
              </ol>

              <Button 
                onClick={handleConfigureGoogleAI}
                variant="outline"
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Apri Google AI Studio
              </Button>

              <div className="space-y-2">
                <Label htmlFor="google-api-key">Incolla la tua Google AI API Key:</Label>
                <Input
                  id="google-api-key"
                  type="text"
                  placeholder="AIza..."
                  value={selectedApi === 'google' ? apiKey : ''}
                  onChange={(e) => {
                    setSelectedApi('google');
                    setApiKey(e.target.value);
                  }}
                  className="font-mono text-sm"
                />
                <Button
                  onClick={handleTestGoogleApi}
                  variant="secondary"
                  className="w-full"
                  disabled={!apiKey.trim() || isTesting}
                  type="button"
                >
                  {isTesting ? 'Test in corso...' : 'Testa API Key'}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="openai" className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm mb-2">OpenAI (ChatGPT)</h3>
              <p className="text-sm text-gray-600 mb-3">
                OpenAI fornisce l'accesso a ChatGPT e GPT-4, tra i modelli AI più avanzati per la generazione di contenuti.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Modello: GPT-4o-mini (veloce ed economico)</li>
                <li>✓ Ottima qualità di output</li>
                <li>✓ Molto affidabile per JSON strutturato</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm">Come ottenere la tua API key:</h4>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                <li>Clicca sul pulsante qui sotto per aprire OpenAI Platform</li>
                <li>Crea un account o accedi</li>
                <li>Vai su "API Keys"</li>
                <li>Clicca "Create new secret key"</li>
                <li>Copia la tua API key (inizia con "sk-...")</li>
                <li>Incollala nel campo qui sotto e clicca "Salva"</li>
              </ol>

              <Button 
                onClick={handleConfigureOpenAI}
                variant="outline"
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Apri OpenAI Platform
              </Button>

              <div className="space-y-2">
                <Label htmlFor="openai-api-key">Incolla la tua OpenAI API Key:</Label>
                <Input
                  id="openai-api-key"
                  type="text"
                  placeholder="sk-..."
                  value={selectedApi === 'openai' ? apiKey : ''}
                  onChange={(e) => {
                    setSelectedApi('openai');
                    setApiKey(e.target.value);
                  }}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Unsplash Section */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-sm mb-3 flex items-center gap-2">
            <span className="text-lg">📸</span>
            <strong>Unsplash API (Immagini Hero)</strong>
          </h3>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-3">
            <p className="text-sm text-gray-600 mb-2">
              Configura Unsplash per generare immagini hero dinamiche basate sulla categoria del tuo progetto.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Immagini professionali gratuite</li>
              <li>✓ 50 richieste all'ora (tier gratuito)</li>
              <li>✓ Caching automatico per categoria</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm">Come ottenere la tua Unsplash Access Key:</h4>
            <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
              <li>Clicca sul pulsante qui sotto per aprire Unsplash Developers</li>
              <li>Crea un account o accedi</li>
              <li>Vai su "Your apps" e clicca "New Application"</li>
              <li>Accetta i termini e crea l'applicazione (nome: "AI Design Vibe")</li>
              <li>Copia l'"Access Key" dalla pagina dell'applicazione</li>
              <li>Incollala nel campo qui sotto</li>
            </ol>

            <Button 
              onClick={handleConfigureUnsplash}
              variant="outline"
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Apri Unsplash Developers
            </Button>

            <div className="space-y-2">
              <Label htmlFor="unsplash-key">Unsplash Access Key (opzionale):</Label>
              <Input
                id="unsplash-key"
                type="text"
                placeholder="Lascia vuoto se non vuoi usare immagini"
                value={unsplashAccessKey}
                onChange={(e) => setUnsplashAccessKey(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Se non configurato, verrà mostrato un placeholder per le immagini hero.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <strong>Nota sulla sicurezza:</strong> Le tue API key verranno salvate localmente nel browser e inviate in modo sicuro al server per le chiamate API. Non verranno mai condivise con terze parti.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Annulla
          </Button>
          <Button onClick={handleSaveConfig} disabled={!apiKey.trim()}>
            <Save className="w-4 h-4 mr-2" />
            Salva Configurazione
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
