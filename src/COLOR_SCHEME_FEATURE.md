# Funzionalità Schema di Colore

## Panoramica

La funzionalità **Schema di Colore** permette agli utenti di scegliere tra diversi tipi di armonia cromatica quando utilizzano la tonalità personalizzata. Questo offre un controllo preciso sulla generazione delle palette seguendo i principi della teoria del colore.

## Schemi Disponibili

### 1. Complementare
**Contrasto Massimo**

- Utilizza colori opposti sulla ruota cromatica (distanza di 180°)
- Crea contrasto dinamico e vibrante
- Ideale per: Brand che vogliono attirare attenzione, design energetici
- Esempio: Blu (220°) + Arancione (40°)

**Formula:**
- Primary: Tonalità base (es. 220°)
- Accent: Tonalità base + 180° (es. 40°)
- Secondary (se 3 colori): Complementare - 15° (es. 25°)

### 2. Triadico
**Energia Bilanciata**

- Utilizza tre colori equidistanti sulla ruota cromatica (distanza di 120°)
- Offre varietà mantenendo equilibrio
- Ideale per: Design moderni, startup tech, brand creativi
- Esempio: Blu (220°) + Rosso (340°) + Verde (100°)

**Formula:**
- Primary: Tonalità base (es. 220°)
- Secondary (se 3 colori): Tonalità base + 120° (es. 340°)
- Accent: Tonalità base + 240° (es. 100°)

### 3. Analogo
**Armonia Naturale**

- Utilizza colori adiacenti sulla ruota cromatica (±30°)
- Crea armonia elegante e sofisticata
- Ideale per: Beauty, wellness, design eleganti e rilassanti
- Esempio: Blu (220°) + Blu-Viola (250°) + Blu-Ciano (190°)

**Formula:**
- Primary: Tonalità base (es. 220°)
- Secondary (se 3 colori): Tonalità base - 30° (es. 190°)
- Accent: Tonalità base + 30° (es. 250°)

## Come Funziona

### Lato Frontend (ControlPanel.tsx)

1. L'utente abilita "Tonalità Personalizzata"
2. Appare uno slider per scegliere la tonalità (0-360°)
3. Viene mostrato un selettore radio per lo schema di colore
4. La palette viene generata combinando:
   - Tonalità personalizzata (customHue)
   - Schema di colore selezionato (colorScheme)
   - Stile palette (vibrant/pastel/dark)
   - Numero di colori (2 o 3)

### Lato Backend (index.tsx)

Il server calcola i colori esatti utilizzando le funzioni:
- `generateComplementaryPalette()`
- `generateTriadicPalette()`
- `generateAnalogousPalette()`

Ogni funzione:
1. Calcola le tonalità secondo la formula dello schema
2. Applica saturazione e luminosità basate sullo stile (vibrant/pastel/dark)
3. Genera i codici HEX dei colori
4. Li passa all'AI come istruzioni obbligatorie

### Utility (colorTheory.ts)

Le funzioni di generazione palette seguono queste linee guida per stile:

**Vibrant:**
- Saturazione: 70-85%
- Luminosità: 30-52%
- Colori pieni di energia

**Pastel:**
- Saturazione: 28-40%
- Luminosità: 75-88%
- Colori delicati e soft

**Dark:**
- Saturazione: 50-72%
- Luminosità: 22-40%
- Colori scuri e profondi

## Accessibilità WCAG 2.1 AA

Tutte le palette generate rispettano i criteri di accessibilità:
- Primary: Luminosità < 35% o > 90%
- Secondary: Luminosità < 45% o > 88%
- Accent: Luminosità 35-65% con saturazione > 50%

Questo garantisce un contrasto adeguato per testo bianco o nero.

## Esempi di Utilizzo

### Esempio 1: Tech Startup con Blu Complementare
```
Tonalità Base: 220° (Blu)
Schema: Complementare
Stile: Vibrant
Colori: 3

Risultato:
- Primary: #1e4ba8 (Blu scuro - 220°)
- Secondary: #a8561e (Arancione scuro - 25°)
- Accent: #f59e0b (Oro vibrante - 40°)
```

### Esempio 2: Beauty Brand con Rosa Analogo
```
Tonalità Base: 330° (Rosa)
Schema: Analogo
Stile: Pastel
Colori: 3

Risultato:
- Primary: #f0abfc (Rosa pastello - 330°)
- Secondary: #e9d5ff (Lavanda pastello - 300°)
- Accent: #fce7f3 (Rosa chiaro - 360°)
```

### Esempio 3: Creative Agency con Viola Triadico
```
Tonalità Base: 270° (Viola)
Schema: Triadico
Stile: Vibrant
Colori: 3

Risultato:
- Primary: #7c3aed (Viola intenso - 270°)
- Secondary: #dc2626 (Rosso vibrante - 390°/30°)
- Accent: #10b981 (Verde vivace - 150°)
```

## File Modificati

1. **types/design.ts**
   - Aggiunto tipo `ColorScheme`
   - Aggiunto campo `colorScheme?` a `GenerationOptions`

2. **utils/colorTheory.ts**
   - Aggiunto `generateComplementaryPalette()`
   - Aggiunto `generateTriadicPalette()`
   - Aggiunto `generateAnalogousPalette()`

3. **components/ControlPanel.tsx**
   - Aggiunto state `colorScheme`
   - Aggiunto selettore radio per lo schema
   - Aggiornato badge per mostrare lo schema selezionato
   - Passa `colorScheme` nelle opzioni di generazione

4. **supabase/functions/server/index.tsx**
   - Legge `colorScheme` dalle opzioni
   - Calcola colori precisi per ogni schema
   - Genera istruzioni specifiche per l'AI
   - Passa i colori HEX esatti all'AI

## Vantaggi

✅ **Controllo Preciso**: L'utente sceglie esattamente che tipo di armonia cromatica vuole

✅ **Teoria del Colore**: Segue principi professionali di design

✅ **Flessibilità**: Si combina con stili (vibrant/pastel/dark) e numero di colori

✅ **Accessibilità**: Garantisce sempre palette WCAG AA compliant

✅ **Educativo**: Aiuta gli utenti a capire gli schemi cromatici

✅ **Prevedibilità**: Genera sempre palette armoniche e bilanciate

## Test Consigliati

1. Provare ogni schema con la stessa tonalità base per vedere le differenze
2. Confrontare lo stesso schema con stili diversi (vibrant vs pastel vs dark)
3. Testare con 2 colori vs 3 colori
4. Verificare l'accessibilità dei colori generati
5. Rigenerare più volte per vedere la consistenza

## Note Tecniche

- Il server calcola i colori HEX precisi e li passa all'AI come istruzioni obbligatorie
- L'AI non ha libertà di scegliere colori diversi quando lo schema è specificato
- Le funzioni di generazione usano formule matematiche per calcolare le tonalità
- La saturazione e luminosità sono adattate allo stile scelto
- I colori generati sono sempre validati per accessibilità WCAG AA
