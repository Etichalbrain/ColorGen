# Hero Images Feature - Documentazione Tecnica

## Panoramica

Il sistema di **Hero Images** integra l'API di Unsplash per generare immagini hero dinamiche e tematicamente correlate alla categoria del progetto. Il sistema implementa un **caching intelligente** per ottimizzare le prestazioni e ridurre i costi API.

## Caratteristiche Principali

### 1. Caricamento Dinamico
- Le immagini vengono caricate dall'API di Unsplash
- Query di ricerca basata sulla categoria inserita dall'utente
- Parametri ottimizzati: `orientation=landscape` e `content_filter=high`

### 2. Caching Intelligente per Categoria
**Fondamentale per l'ottimizzazione:**

- ✅ **Nuova categoria** → Chiamata API Unsplash + Salva in cache
- ✅ **Rigenera palette (stessa categoria)** → Usa immagine dalla cache (NO chiamata API)
- ✅ **Cambia categoria** → Nuova chiamata API + Aggiorna cache

**Esempio di flusso:**
```
1. User: categoria="Tech" → Genera
   → AI genera palette + Unsplash cerca "tech"
   → Mostra Palette 1 + Immagine 1 (tech)

2. User: Rigenera (categoria="Tech")
   → AI genera nuova palette
   → Riusa Immagine 1 dalla cache (NO chiamata Unsplash)
   → Mostra Palette 2 + Immagine 1 (tech)

3. User: categoria="Beauty" → Genera
   → AI genera palette + Unsplash cerca "beauty"
   → Mostra Palette 3 + Immagine 2 (beauty)
```

### 3. Gestione API Key Unsplash
- Interfaccia di configurazione nella sezione "Impostazioni"
- Campi richiesti: **Unsplash Access Key**
- Salvataggio sicuro in localStorage
- Link diretto a Unsplash Developers per ottenere le credenziali

### 4. Gestione Errori e Fallback
L'applicazione gestisce elegantemente i seguenti scenari:

#### Errore: Limite API raggiunto (403)
**Messaggio:** "Crediti immagini terminati per ora"

#### Errore: API Key non valida (401)
**Messaggio:** "Unsplash API key non valida"

#### Errore: Nessuna immagine trovata (404)
**Messaggio:** "Nessuna immagine trovata per questa categoria"

#### Unsplash non configurato
**Comportamento:** Mostra placeholder con suggerimento di configurare Unsplash

## Implementazione Tecnica

### Architettura

```
Frontend (App.tsx)
    ↓
    ├─→ ControlPanel: Configurazione API Key
    ├─→ ApiKeyDialog: Gestione credenziali Unsplash
    └─→ handleGenerate()
            ↓
            ├─→ Genera concept (server)
            └─→ Se categoria cambiata:
                    ├─→ Controlla cache locale
                    ├─→ Se non in cache: chiama server
                    └─→ Server → Unsplash API → Ritorna imageUrl
                            ↓
                            └─→ Salva in cache locale
```

### Stati dell'Applicazione

```typescript
// App.tsx
const [heroImage, setHeroImage] = useState<string | null>(null);
const [currentCategory, setCurrentCategory] = useState<string>('');
const [heroImageCache, setHeroImageCache] = useState<Record<string, string>>({});
const [imageError, setImageError] = useState<string | null>(null);
const [isLoadingImage, setIsLoadingImage] = useState(false);
```

### Endpoint Server

**POST** `/make-server-5378c2f5/fetch-hero-image`

**Request Body:**
```json
{
  "category": "tech",
  "unsplashAccessKey": "YOUR_ACCESS_KEY"
}
```

**Response (Success):**
```json
{
  "imageUrl": "https://images.unsplash.com/photo-...",
  "photographer": "John Doe",
  "photographerUrl": "https://unsplash.com/@johndoe"
}
```

**Response (Error - Rate Limit):**
```json
{
  "error": "Limite API Unsplash raggiunto. Attendi un'ora..."
}
```

### Parametri Unsplash API

```typescript
const unsplashUrl = `https://api.unsplash.com/search/photos?` +
  `query=${encodeURIComponent(imageQuery)}` +
  `&client_id=${unsplashAccessKey}` +
  `&per_page=1` +
  `&orientation=landscape` +  // Hero images funzionano meglio in landscape
  `&content_filter=high`;     // Esclude contenuti non sicuri
```

## UserApiConfig Type

```typescript
export interface UserApiConfig {
  provider: 'google' | 'openai';
  apiKey: string;
  unsplashAccessKey?: string; // NEW: Chiave Unsplash opzionale
}
```

## Componenti Modificati

### 1. `/App.tsx`
- Aggiunto stato `currentCategory` per tracking
- Aggiunto stato `heroImageCache` per caching locale
- Aggiunto stato `imageError` per gestione errori
- Modificata logica `handleGenerate()` per caching intelligente

### 2. `/components/ApiKeyDialog.tsx`
- Aggiunta sezione "Unsplash API (Immagini Hero)"
- Nuovo campo input per `unsplashAccessKey`
- Link a Unsplash Developers
- Istruzioni passo-passo per ottenere l'Access Key

### 3. `/components/LandingPagePreview.tsx`
- Aggiunto prop `imageError` per visualizzare errori
- Gestione di 4 stati: loading, error, success, placeholder

### 4. `/supabase/functions/server/index.tsx`
- Nuovo endpoint `fetch-hero-image`
- Gestione completa errori Unsplash (403, 401, 404)
- Log dettagliati per debugging

### 5. `/types/design.ts`
- Esteso `UserApiConfig` con campo opzionale `unsplashAccessKey`

## Limiti API Unsplash

### Free Tier
- **50 richieste all'ora**
- **5.000 richieste al mese**

Con il sistema di caching, l'utente consuma crediti **solo quando cambia categoria**, riducendo drasticamente l'uso dell'API.

## Best Practices

1. **Query ottimizzate:** Aggiungere termini come "product", "modern", "aesthetic" alla categoria
2. **Orientation landscape:** Migliore adattamento per hero sections
3. **Content filter high:** Garantisce immagini professionali e sicure
4. **Caching aggressivo:** Riduce chiamate API del 70-90% in un uso tipico
5. **Error handling robusto:** UX continua anche senza immagini

## Sicurezza

- Le API key sono salvate **solo in localStorage del browser**
- Le chiavi sono inviate al server **solo per autenticazione API**
- Il server **non memorizza** le chiavi Unsplash
- Comunicazione HTTPS con Unsplash

## Testing

### Test Case 1: Prima generazione
1. Inserisci categoria "tech"
2. Premi "Genera"
3. ✓ Verifica chiamata a Unsplash API
4. ✓ Verifica immagine visualizzata
5. ✓ Verifica immagine in cache

### Test Case 2: Rigenera stessa categoria
1. Premi "Rigenera"
2. ✓ Verifica nuova palette generata
3. ✓ Verifica immagine NON ricaricata
4. ✓ Verifica console: "Using cached image"

### Test Case 3: Cambio categoria
1. Cambia categoria in "beauty"
2. Premi "Genera"
3. ✓ Verifica nuova chiamata Unsplash
4. ✓ Verifica nuova immagine visualizzata
5. ✓ Verifica entrambe le immagini in cache

### Test Case 4: Errore limite API
1. Esaurire i 50 crediti/ora
2. Tentare nuova generazione
3. ✓ Verifica messaggio "Crediti immagini terminati"
4. ✓ Verifica UX continua a funzionare

## Performance Metrics

**Senza caching:**
- 1 chiamata API per ogni generazione
- ~100 chiamate/sessione utente tipica

**Con caching:**
- 1 chiamata API per categoria unica
- ~10-15 chiamate/sessione utente tipica
- **Risparmio: 85-90%**

## Future Enhancements

1. **Persistent cache:** Salvare cache in localStorage per sessioni multiple
2. **Multiple images:** Offrire 3-5 opzioni di immagini per categoria
3. **AI Image Generation:** Integrare DALL-E/Midjourney per immagini personalizzate
4. **Image optimization:** Compressione automatica per performance
5. **Attribution display:** Mostrare crediti fotografo nell'interfaccia
