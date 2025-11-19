# Funzionalità Tonalità Personalizzata

## Panoramica

La funzionalità **Tonalità Personalizzata** permette agli utenti di avere il controllo completo sulla palette generata dall'AI, specificando un colore di partenza tramite uno slider interattivo che copre l'intero spettro cromatico (0-360°).

## Come Funziona

### 1. Interfaccia Utente

Nel **Control Panel** è presente una checkbox "Tonalità Personalizzata" con icona palette 🎨.

Quando attivata, viene visualizzato:
- **Slider dello spettro cromatico**: Permette di scegliere una tonalità da 0° a 360°
- **Anteprima colore live**: Mostra il colore selezionato in tempo reale
- **Nome del colore**: Indica il nome (es. "Rosso", "Verde", "Blu") e i gradi
- **Gradiente di sfondo**: Visualizzazione completa dello spettro HSL

### 2. Spettro Cromatico

Lo slider copre tutte le tonalità dello spettro:

| Gradi | Colore | Nome |
|-------|--------|------|
| 0° | 🔴 | Rosso |
| 30° | 🟠 | Arancione |
| 60° | 🟡 | Giallo |
| 120° | 🟢 | Verde |
| 180° | 🔵 | Ciano |
| 240° | 🔷 | Blu |
| 270° | 🟣 | Viola |
| 300° | 🟪 | Magenta |
| 330° | 🌸 | Rosa |

### 3. Generazione della Palette

Quando l'utente clicca su **Genera**, il sistema:

1. Invia la tonalità personalizzata (0-360°) al server
2. L'AI riceve istruzioni specifiche per creare una palette armonica basata su quel colore
3. Vengono suggerite 4 opzioni armoniche:
   - **Monocromatico**: Variazioni dello stesso hue
   - **Analogo**: Colori vicini sulla ruota cromatica (±30°)
   - **Complementare**: Colore opposto (180°)
   - **Triadico**: Tre colori equidistanti (120° di distanza)

## Architettura Tecnica

### Frontend (`/components/ControlPanel.tsx`)

```typescript
// Stati
const [useCustomHue, setUseCustomHue] = useState(false);
const [customHue, setCustomHue] = useState(220); // Default blu

// Funzione di conversione
import { hslToHex, getColorNameFromHue } from '../utils/colorTheory';

// Componenti UI
<Checkbox checked={useCustomHue} />
<Slider value={[customHue]} min={0} max={360} step={1} />
```

### Utility (`/utils/colorTheory.ts`)

#### `hslToHex(h, s, l)`
Converte valori HSL in formato esadecimale:
```typescript
hslToHex(220, 70, 50) // Returns "#3366cc" (blu)
```

#### `getColorNameFromHue(hue)`
Restituisce il nome del colore basato sulla tonalità:
```typescript
getColorNameFromHue(220) // Returns "Blu"
getColorNameFromHue(45)  // Returns "Arancione"
```

### Backend (`/supabase/functions/server/index.tsx`)

Il server riceve `customHue` nelle opzioni e genera istruzioni AI personalizzate:

```typescript
// Calcola armonie cromatiche
const complementaryHue = (customHue + 180) % 360;
const triadicHue1 = (customHue + 120) % 360;
const triadicHue2 = (customHue + 240) % 360;

// Aggiunge istruzioni nel prompt
customHueInstructions = `
🎨 TONALITÀ PERSONALIZZATA RICHIESTA:
L'utente ha selezionato ${customHue}° (colore base: ${baseColor}).
DEVI ASSOLUTAMENTE generare la palette usando questa tonalità.
...
`;
```

### Tipi (`/types/design.ts`)

```typescript
export interface GenerationOptions {
  paletteSize: PaletteSize;
  paletteStyle: PaletteStyle;
  customHue?: number; // 0-360, optional
}
```

## Comportamento AI

### Con Tonalità Personalizzata Attiva

L'AI riceve istruzioni esplicite per:
1. Usare il `customHue` come base per il colore primary
2. Generare secondary e accent in armonia con quella tonalità
3. Rispettare lo stile richiesto (vibrant/pastel/dark) modificando saturazione e luminosità

### Esempio Pratico

**Input Utente:**
- Categoria: "tech"
- Tonalità: 280° (viola)
- Stile: vibrant
- Numero colori: 3

**Output AI (esempio):**
```json
{
  "palette": {
    "primary": "#7c3aed",    // Viola 280° - luminosità 35%
    "secondary": "#0d9488",  // Teal (analogo) - luminosità 30%
    "accent": "#ea580c"      // Arancione (complementare) - luminosità 50%
  }
}
```

## Integrazione con le Altre Funzionalità

### 1. Download Palette
Il file JSON scaricato include il `customHue` nei metadata:

```json
{
  "metadata": {
    "category": "tech",
    "paletteSize": 3,
    "paletteStyle": "vibrant",
    "customHue": 280,
    "generatedAt": "2025-10-28T..."
  }
}
```

Nome file: `palette-tech-vibrant-hue280.json`

### 2. Badge Indicatore
Nel pannello Asset Generati appare un badge viola:
```
[3 colori] [vibrant] [Hue 280°]
```

### 3. Pulsante Rigenera
Quando si clicca "Rigenera", le opzioni correnti (incluso customHue) vengono riutilizzate.

## Casi d'Uso

### 1. Brand Identity Esistente
Un designer ha già un colore brand (#3b82f6 - blu 220°) e vuole generare palette complementari:
- Attiva tonalità personalizzata
- Imposta slider a 220°
- Genera palette armoniose basate su quel blu

### 2. Esplorazione Creativa
Un utente vuole esplorare palette basate su verde menta (160°):
- Imposta slider a 160°
- Prova stili diversi (vibrant, pastel, dark)
- Scarica le variazioni preferite

### 3. Conformità Accessibilità
Combinato con la validazione WCAG AA, permette di:
- Scegliere una tonalità accessibile
- Verificare contrasti in tempo reale
- Generare palette sempre conformi

## UI/UX Design

### Visual Feedback
- **Slider con gradiente**: Lo sfondo mostra l'intero spettro HSL
- **Anteprima live**: Il colore cambia in tempo reale durante lo slide
- **Nome del colore**: Feedback testuale chiaro (es. "Viola (280°)")
- **Animazione smooth**: Transizione fluida all'apertura del pannello

### Accessibilità
- Lo slider ha un thumb grande (20px) con bordo bianco visibile
- Contrasto elevato tra thumb e sfondo gradiente
- Supporto tastiera completo (frecce per regolare)
- Label descrittivi per screen reader

## CSS Personalizzato

```css
/* Custom color slider styles */
.color-hue-slider [data-slot="slider-track"] {
  background: transparent !important;
}

.color-hue-slider [data-slot="slider-thumb"] {
  border-width: 3px;
  border-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  width: 20px;
  height: 20px;
}
```

## Limitazioni e Note

### Limitazioni Attuali
1. L'AI interpreta le istruzioni ma non garantisce tonalità esatte al grado
2. Lo stile (vibrant/pastel/dark) può influenzare l'hue finale di ±10°
3. La tonalità è applicata principalmente al colore primary

### Best Practices
- Per risultati ottimali, scegliere tonalità "pure" (0°, 60°, 120°, 180°, 240°, 300°)
- Testare diverse variazioni di stile con la stessa tonalità
- Combinare con l'analisi della teoria del colore per validare l'armonia

### Sviluppi Futuri
- [ ] Controllo granulare di saturazione e luminosità
- [ ] Preset di tonalità popolari (Material Design, Tailwind, etc.)
- [ ] Storico delle tonalità recenti
- [ ] Lock di colori specifici durante la rigenerazione
- [ ] Visualizzazione 3D dello spazio HSL

## Testing

### Test Manuali Consigliati

1. **Test Base**
   - Attiva tonalità personalizzata
   - Imposta hue a 180° (ciano)
   - Genera con categoria "tech"
   - Verifica che primary sia ciano o vicino

2. **Test Stili**
   - Stesso hue (es. 240° blu) con tutti e 3 gli stili
   - Verifica variazioni di saturazione/luminosità
   - Conferma accessibilità AA

3. **Test Download**
   - Genera con custom hue 120°
   - Scarica JSON
   - Verifica presenza di customHue nei metadata

4. **Test Rigenera**
   - Genera con hue 300°
   - Clicca Rigenera
   - Conferma che hue rimanga 300°

## Domande Frequenti

**Q: Perché il colore generato non è esattamente quello che ho scelto?**  
A: L'AI adatta la tonalità per garantire accessibilità WCAG AA e armonia con lo stile selezionato. La tonalità base viene mantenuta, ma saturazione e luminosità possono variare.

**Q: Posso usare tonalità personalizzata con palette a 2 colori?**  
A: Sì, funziona con sia 2 che 3 colori. Con 2 colori, il secondary viene omesso.

**Q: Il custom hue funziona con tutti i provider AI (Google/OpenAI)?**  
A: Sì, le istruzioni vengono inviate a entrambi i provider.

**Q: Posso salvare tonalità preferite?**  
A: Attualmente no, ma puoi annotare i gradi delle tonalità che preferisci e riutilizzarle manualmente.

---

**Data creazione**: 28 Ottobre 2025  
**Versione**: 1.0  
**Autore**: AI Design Vibe Team
