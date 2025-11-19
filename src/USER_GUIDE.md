# 🎨 AI Design Color Vibe - Guida Completa

## 📖 Indice
1. [Introduzione](#introduzione)
2. [Avvio Rapido](#avvio-rapido)
3. [Interfaccia Utente](#interfaccia-utente)
4. [Funzionalità Principali](#funzionalità-principali)
5. [Controlli Avanzati](#controlli-avanzati)
6. [Tab Assets](#tab-assets)
7. [Sistema di Colori OKLCH](#sistema-di-colori-oklch)
8. [Accessibilità WCAG](#accessibilità-wcag)
9. [Export e Download](#export-e-download)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Introduzione

**AI Design Color Vibe** è un'applicazione web "inspiration-as-a-service" che permette a designer e sviluppatori di generare istantaneamente concept di design completi in pochi secondi.

### Cosa genera l'app?
- ✅ **Palette di colori armonica** (2 o 3 colori) con sistema OKLCH
- ✅ **Abbinamento automatico di Google Fonts** (headline + body)
- ✅ **Contenuti testuali** (headline, sottotitolo, CTA, descrizione)
- ✅ **Immagine hero** da Unsplash
- ✅ **Anteprima live** di landing page completa
- ✅ **Validazione WCAG 2.1 AA** automatica (contrasto ≥4.5:1)

### A chi è destinato?
- 🎨 **Designer** che cercano ispirazione rapida per progetti
- 💻 **Developer** che vogliono prototipi visivi pronti
- 🚀 **Startup founder** per mockup landing page
- 📱 **Product manager** per concept di UI

---

## ⚡ Avvio Rapido

### 1️⃣ Inserisci una Categoria
Scrivi il settore o tipo di business nella casella "Categoria" (es. "Tech Startup", "E-commerce Moda", "SaaS Finance").

### 2️⃣ Scegli lo Stile Palette
- **Vibrant** (colori vivaci e energetici)
- **Pastel** (colori tenui e delicati)
- **Dark** (colori profondi e intensi)

### 3️⃣ Genera!
Clicca su **"Genera Design"** e attendi 3-5 secondi.

### 4️⃣ Visualizza l'Anteprima
L'anteprima live della landing page appare a destra con:
- Hero section con immagine
- Headline e sottotitolo generati
- Pulsanti CTA stilizzati
- Palette colori applicata

---

## 🖥️ Interfaccia Utente

L'interfaccia è divisa in **due aree principali**:

```
┌─────────────────┬──────────────────────────┐
│                 │                          │
│   SIDEBAR       │   ANTEPRIMA LIVE         │
│   (sinistra)    │   (destra)               │
│                 │                          │
│  • Tab Genera   │   Landing Page Preview   │
│  • Tab Assets   │   con palette applicata  │
│                 │                          │
└─────────────────┴──────────────────────────┘
```

### Sidebar Sinistra
- **Header**: Logo "AI Design Color Vibe" + dark mode toggle
- **Tab "Genera"**: Controlli per creare nuovi design
- **Tab "Assets"**: Visualizza palette, font e contenuti generati

### Area Destra
- **Anteprima in tempo reale** della landing page
- **Responsive**: si adatta allo schermo
- **Interattiva**: mostra come appare il design finale

---

## 🎨 Funzionalità Principali

### 1. Generazione AI-Powered

#### Input Richiesto
- **Categoria**: Descrizione del settore (es. "E-commerce Biologico")
- **Palette Size**: 2 o 3 colori
- **Palette Style**: Vibrant / Pastel / Dark

#### Output Generato
L'AI analizza la categoria e genera:

**A. Palette Colori**
- **Primary**: Colore principale del brand
- **Secondary**: Colore di supporto (opzionale, solo se palette a 3 colori)
- **Accent**: Colore per call-to-action e highlights

Ogni colore viene:
- ✅ Generato con sistema **OKLCH** (più percettivamente uniforme di HSL/RGB)
- ✅ Validato per **WCAG AA** (contrasto ≥4.5:1 su sfondo bianco)
- ✅ Armonizzato secondo teoria del colore

**B. Font Pairings**
- **Headline Font**: Per titoli (es. Playfair Display, Montserrat)
- **Body Font**: Per testo corpo (es. Open Sans, Roboto)

Combinazioni curate per leggibilità e stile.

**C. Contenuti Testuali**
- **Headline**: Titolo principale (max 60 caratteri)
- **Subheadline**: Sottotitolo descrittivo (max 150 caratteri)
- **CTA Primary/Secondary**: Testi pulsanti (es. "Inizia Gratis", "Scopri di più")
- **Description**: Paragrafo descrittivo (200-300 caratteri)

**D. Immagine Hero**
- Ricerca automatica su **Unsplash** basata sulla categoria
- Cache intelligente (evita ri-download)
- Fallback automatico se nessuna immagine trovata

---

### 2. Schema di Colori Avanzato

Quando attivi **"Personalizza Hue"**, puoi scegliere tra 5 schemi armonici:

#### 🎨 Schemi Disponibili

**Complementary** (Complementare)
- Base hue vs. hue opposto (+180°)
- Es: Blu ↔ Arancione
- **Usa quando**: Vuoi massimo contrasto e dinamismo

**Triadic** (Triadico)
- Tre colori equidistanti (+120°, +240°)
- Es: Rosso → Giallo → Blu
- **Usa quando**: Serve equilibrio vivace

**Analogous** (Analogo)
- Colori vicini (-30°, +30°)
- Es: Blu → Azzurro → Teal
- **Usa quando**: Vuoi armonia e coerenza

**Split-Complementary** (Complementare Diviso)
- Base hue + 2 colori adiacenti al complementare (+150°, +210°)
- Es: Blu → Arancione-Rosso + Giallo-Arancione
- **Usa quando**: Vuoi contrasto ma meno aggressivo

**Monochromatic** (Monocromatico)
- Stesso hue, lightness/chroma variati
- Es: Blu scuro → Blu medio → Blu chiaro
- **Usa quando**: Serve coerenza totale

---

### 3. Controlli OKLCH Manuali

#### Cos'è OKLCH?
**OKLCH** = OKLab Lightness Chroma Hue

Un sistema di colori moderno che risolve i problemi di HSL:
- ✅ **Percettivamente uniforme**: L=0.5 appare sempre "metà luminoso"
- ✅ **Chroma consistente**: Colori con stesso Chroma hanno stessa "vivacità"
- ✅ **Gamut ampio**: Supporta colori P3/Rec2020

#### I Tre Slider

**Lightness (L)** - Luminosità
- Range: 0.0 → 1.0
- `0.0` = nero assoluto
- `0.5` = luminosità media
- `1.0` = bianco assoluto
- **Tip**: Per testi su sfondo bianco, usa L=0.25-0.40

**Chroma (C)** - Intensità/Saturazione
- Range: 0.0 → 0.4
- `0.0` = grigio (no colore)
- `0.1-0.15` = colori professionali/corporate
- `0.2-0.4` = colori vibranti/energetici
- **Tip**: Non superare 0.20 per palette eleganti

**Hue (H)** - Tonalità
- Range: 0° → 360°
- `0°` = Rosso
- `120°` = Verde
- `240°` = Blu
- `330°` = Magenta
- **Tip**: Usa la ruota colori come riferimento

#### Esempio Pratico
```
Tech Startup (Blu Professionale):
Lightness: 0.35 (scuro ma leggibile)
Chroma: 0.12 (intensità moderata)
Hue: 240° (blu puro)

→ Risultato: #1e3a8a (blu navy professionale)
```

---

## 📦 Tab Assets

Dopo la generazione, vai al tab **"Assets"** per vedere:

### 1. Palette Colori
Ogni colore mostra:
- **Swatch visivo** (quadrato colorato)
- **Codice HEX** (es. `#2563eb`)
- **Badge WCAG**: Indica se passa AA (✓) o AAA (✓✓✓)
- **Click to Copy**: Clicca per copiare il codice negli appunti

```
┌──────────────────────────────┐
│ [■ blu] Primario             │
│ #2563eb                      │
│ [✓ AA 7.2:1]                 │
└──────────────────────────────┘
```

### 2. Font Pairings
- **Headline**: Nome font per titoli + link Google Fonts
- **Body**: Nome font per testo + link Google Fonts

### 3. Contenuti Generati
- Headline
- Subheadline
- CTA Primary
- CTA Secondary
- Description

### 4. Immagine Hero
- **URL Unsplash** (click per aprire in nuova tab)
- **Photographer credit** (autore immagine)

---

## 🔧 Controlli Avanzati

### Palette Size (2 o 3 colori)

**2 Colori** (Primary + Accent)
- ✅ Più minimalista
- ✅ Facile da gestire
- 👍 Usa per: Brand semplici, landing page essenziali

**3 Colori** (Primary + Secondary + Accent)
- ✅ Più versatilità
- ✅ Permette gerarchie visive complesse
- 👍 Usa per: Dashboard, app complesse, ecommerce

---

### Personalizza Hue (Checkbox)

Quando **disattivato**:
- L'AI sceglie autonomamente colori appropriati alla categoria
- Più veloce e automatico

Quando **attivato**:
- Sblocca i 3 slider OKLCH
- Sblocca il menu "Schema Colori"
- Controllo totale sulla palette

**Workflow Consigliato:**
1. Prima genera senza personalizzazione (vedi cosa suggerisce l'AI)
2. Se non ti piace, attiva "Personalizza Hue"
3. Sperimenta con gli slider

---

### Rigenerazione Rapida

**Pulsante "Rigenera"** (icona ↻)
- Mantiene stessa categoria
- Genera **nuovi contenuti e palette**
- Utile per esplorare variazioni

---

## 📥 Export e Download

### Pulsante "Download Palette"

Genera un file **JSON** con tutti gli assets:

```json
{
  "metadata": {
    "category": "Tech Startup",
    "paletteSize": 3,
    "paletteStyle": "vibrant",
    "customHue": 240,
    "customLightness": 0.35,
    "customChroma": 0.12,
    "colorScheme": "complementary",
    "generatedAt": "2025-10-29T10:30:00.000Z"
  },
  "palette": {
    "primary": "#1e3a8a",
    "secondary": "#064e3b",
    "accent": "#dc2626"
  },
  "fonts": {
    "headline": "Montserrat",
    "body": "Open Sans"
  },
  "content": {
    "headline": "Innovazione che Trasforma",
    "subheadline": "La piattaforma tech...",
    "ctaPrimary": "Inizia Gratis",
    "ctaSecondary": "Scopri di più",
    "description": "..."
  },
  "heroImage": {
    "url": "https://images.unsplash.com/...",
    "photographer": "John Doe"
  }
}
```

### Naming Convention

**Formato Filename:**
```
palette-{categoria}-{style}-{schema}-{hash}.json

Esempi:
- palette-tech-startup-vib.json (base)
- palette-tech-startup-vib-comp-a3f9e2.json (con custom)
```

**Componenti:**
- `{categoria}`: Max 12 caratteri, kebab-case
- `{style}`: vib/pas/dar
- `{schema}`: comp/tria/anal/spli/mono (solo se custom)
- `{hash}`: 6 caratteri hash delle opzioni (evita duplicati)

---

## ✅ Accessibilità WCAG

### Standard WCAG 2.1 AA

L'app garantisce automaticamente:
- **Contrasto ≥4.5:1** per testo normale
- **Contrasto ≥3:1** per testo large/grafico

### Come Funziona?

1. **L'AI genera i colori** basandosi sulla categoria
2. **Il backend valida ogni colore** con `ensureWCAG_AA()`
3. **Se un colore non passa**, viene automaticamente scurito fino a ≥4.5:1
4. **Logging**: Vedi nel console quali colori sono stati aggiustati

### Badge WCAG

Nel tab Assets, ogni colore mostra:
- **✓ AA 4.5:1**: Passa WCAG AA (minimo legale)
- **✓✓✓ AAA 7.0:1**: Passa WCAG AAA (eccellenza)
- **Nessun badge**: Non passa AA (dovrebbe essere impossibile grazie alla validazione)

### Esempio Log Backend
```
⚠️ Some colors were adjusted for WCAG AA compliance:
  Primary: #4f46e5 → #3730a3 (contrast improved from 3.8:1 to 6.2:1)
  Accent: #ec4899 → #be185d (contrast improved from 4.1:1 to 8.5:1)
```

---

## 🎓 Best Practices

### 1. Scegliere la Categoria Giusta

**❌ Troppo vago:**
- "Business"
- "Website"
- "App"

**✅ Specifico e descrittivo:**
- "SaaS per Project Management"
- "E-commerce Abbigliamento Sostenibile"
- "App Mobile per Fitness"

### 2. Quando Usare Custom Hue

**Usa l'AI automatica quando:**
- ✅ Non hai preferenze di colore specifiche
- ✅ Vuoi esplorare combinazioni inaspettate
- ✅ Hai poco tempo

**Usa Custom Hue quando:**
- ✅ Hai già un brand color definito
- ✅ Vuoi sperimentare con teoria del colore
- ✅ Devi rispettare linee guida corporate

### 3. Palette Size: 2 vs 3

**2 Colori** per:
- Landing page semplici
- Portfolio personali
- One-page websites

**3 Colori** per:
- Dashboard complesse
- E-commerce (need categorization)
- App multi-sezione

### 4. Stile Palette

**Vibrant** (Vivace)
- 🎯 Tech, startup, sport, energia
- ⚠️ Evita per: Finance, healthcare, luxury

**Pastel** (Tenue)
- 🎯 Beauty, bambini, wellness, creatività
- ⚠️ Evita per: Gaming, nightlife, sport

**Dark** (Scuro)
- 🎯 Luxury, professionale, elegante, corporate
- ⚠️ Evita per: Educazione bambini, salute mentale

---

## 🐛 Troubleshooting

### ❌ "Errore durante la generazione"

**Causa**: Manca API key OpenAI o Gemini

**Soluzione:**
1. Clicca sull'icona ⚙️ (Settings) in alto a destra
2. Dialog "Configura API Keys"
3. Inserisci la tua **OpenAI API Key** (o Google AI API Key)
4. Salva e riprova

**Dove ottenere le API keys:**
- OpenAI: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Google AI: [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

---

### ❌ "Nessuna immagine hero trovata"

**Causa**: Manca Unsplash Access Key

**Soluzione:**
1. Vai su [unsplash.com/developers](https://unsplash.com/developers)
2. Crea un'app gratuita
3. Copia l'**Access Key**
4. Inseriscila nel dialog Settings
5. Rigenera il design

**Fallback**: Se manca la key, vedrai un placeholder grigio.

---

### ❌ "I colori generati sono troppo chiari"

**Causa**: Lo stile "Pastel" genera colori tenui

**Soluzione:**
- Cambia stile in "Vibrant" o "Dark"
- Oppure attiva "Personalizza Hue" e abbassa **Lightness** a 0.25-0.35

---

### ❌ "Il contrasto WCAG non passa"

**Causa**: Impossibile se usi l'app correttamente (validazione automatica)

**Soluzione:**
- Verifica di aver generato tramite il pulsante "Genera Design"
- Se hai modificato manualmente il CSS, ripristina i colori originali
- Usa solo i colori dal tab "Assets"

---

### ❌ "Font non si caricano"

**Causa**: Blocco di Google Fonts (firewall/adblocker)

**Soluzione:**
- Disabilita adblocker temporaneamente
- Verifica connessione a `fonts.googleapis.com`
- In alternativa, scarica i font e hostali localmente

---

## 🔬 Architettura Tecnica (per Developer)

### Stack Tecnologico

**Frontend:**
- React + TypeScript
- Tailwind CSS v4
- Shadcn/UI components
- Culori (libreria OKLCH)

**Backend:**
- Supabase Edge Functions (Deno runtime)
- Hono web framework
- OpenAI GPT-4 (primary AI)
- Google Gemini (fallback AI)
- Unsplash API (immagini)

**Database:**
- PostgreSQL (via Supabase)
- Tabella `kv_store_5378c2f5` (key-value caching)

### Flusso di Generazione

```
1. User input → Frontend
   ↓
2. POST /generate-concept → Backend Server
   ↓
3. Backend costruisce prompt AI
   ↓
4. OpenAI GPT-4 genera JSON
   ↓
5. Backend valida WCAG con ensureWCAG_AA()
   ↓
6. JSON validato → Frontend
   ↓
7. Frontend richiede hero image
   ↓
8. POST /fetch-hero-image → Backend
   ↓
9. Backend cerca su Unsplash (con cache)
   ↓
10. URL immagine → Frontend
   ↓
11. Render anteprima completa
```

### File Principali

**Frontend:**
- `/App.tsx` - Componente root
- `/components/ControlPanel.tsx` - Sidebar con controlli
- `/components/LandingPagePreview.tsx` - Anteprima live
- `/utils/colorTheory.ts` - Funzioni OKLCH e teoria colore
- `/utils/accessibility.ts` - Validazione WCAG

**Backend:**
- `/supabase/functions/server/index.tsx` - Server Hono
- `/supabase/functions/server/kv_store.tsx` - Utilities DB

---

## 📚 Documentazione Aggiuntiva

L'app include documentazione tecnica avanzata:

- **OKLCH_MIGRATION.md** - Migrazione da HSL a OKLCH
- **ACCESSIBILITY_COMPLIANCE.md** - Standard WCAG implementati
- **AI_PROMPT_SYSTEM.md** - Come funziona il prompt AI
- **COLOR_SCHEME_FEATURE.md** - Sistema schemi armonici
- **CUSTOM_HUE_FEATURE.md** - Controlli manuali OKLCH
- **HERO_IMAGES_FEATURE.md** - Sistema immagini Unsplash
- **TEORIA_COLORE.md** - Teoria colore e best practices

---

## 💡 Tips & Tricks

### 🚀 Workflow Veloce
1. Inserisci categoria
2. Clicca "Genera Design"
3. Se ti piace → Download
4. Se non ti piace → Clicca "Rigenera" 2-3 volte
5. Ancora non ti piace? → Attiva "Personalizza Hue"

### 🎨 Esplorare Variazioni
- Stessa categoria + stili diversi (Vibrant/Pastel/Dark)
- Stessa categoria + palette size diverso (2 vs 3)
- Stesso colore base + schemi diversi (Complementary vs Triadic)

### 🔍 Trovare il Primary Perfetto
1. Genera con AI automatica
2. Annota il Primary HEX generato
3. Converti su [oklch.com](https://oklch.com) per vedere L/C/H
4. Attiva "Personalizza Hue" e usa quei valori come base
5. Sperimenta variazioni ±10° Hue, ±0.05 Lightness

### 📋 Riutilizzare Palette
1. Genera design
2. Download palette JSON
3. Conserva in libreria personale
4. Importa colori in Figma/Sketch/Adobe XD
5. Usa `palette.primary`, `palette.accent` nel CSS

---

## 🎯 Casi d'Uso Reali

### 1. Startup Pitch Deck
**Obiettivo**: Slide presentazione investitori

**Workflow:**
1. Genera con categoria "Tech Startup Series A"
2. Stile "Dark" (professionale)
3. 3 colori (primary=brand, secondary=charts, accent=CTA)
4. Export palette → Importa in PowerPoint/Keynote

---

### 2. Client Presentation
**Obiettivo**: Mostrare 3 opzioni colore a cliente

**Workflow:**
1. Genera con "E-commerce Moda Sostenibile"
2. Download opzione 1 (Vibrant)
3. Rigenera → Download opzione 2 (Pastel)
4. Rigenera → Download opzione 3 (Dark)
5. Presenta 3 JSON al cliente

---

### 3. Prototipo Rapido
**Obiettivo**: Mockup landing page in 5 minuti

**Workflow:**
1. Genera design completo
2. Screenshot dell'anteprima
3. Usa colori + fonts + copy nel mockup Figma
4. Hero image da Unsplash link fornito

---

### 4. Design System Foundation
**Obiettivo**: Base colori per design system aziendale

**Workflow:**
1. Attiva "Personalizza Hue"
2. Usa Hue del brand esistente
3. Genera con schema "Complementary"
4. Export → Converti in CSS variables
5. Estendi con tints/shades (L ±0.1, ±0.2, ±0.3)

---

## 🌟 Conclusione

**AI Design Color Vibe** trasforma il processo di concept design da ore a secondi, garantendo:
- ✅ Palette armoniche scientificamente bilanciate
- ✅ Accessibilità WCAG AA automatica
- ✅ Font pairings professionali
- ✅ Contenuti copywriting generati da AI
- ✅ Anteprima live immediata

**Perfetto per:**
- Esplorare direzioni creative rapidamente
- Validare idee con clienti
- Creare prototipi funzionanti
- Educarsi sulla teoria del colore OKLCH

---

## 📞 Supporto

**Problemi tecnici?**
- Verifica le API keys (OpenAI + Unsplash)
- Controlla la console browser (F12)
- Leggi i log del backend server

**Domande sul design?**
- Consulta `TEORIA_COLORE.md`
- Sperimenta con gli schemi armonici
- Usa [oklch.com](https://oklch.com) per visualizzare colori

---

**Versione Guida**: 1.0  
**Ultimo Aggiornamento**: Ottobre 2025  
**App Version**: AI Design Color Vibe v2.0
