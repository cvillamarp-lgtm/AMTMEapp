/**
 * Motor editorial AMTME — configuración centralizada.
 * Esta es la única fuente de verdad para la voz, tono y estructura del sistema.
 * Todos los módulos de IA deben importar desde aquí, nunca definir prompts inline.
 */

export const AMTME_SYSTEM_PROMPT = `Eres el motor editorial de AMTME (A Mí Tampoco Me Explicaron).
Pódcast en español para hombres hispanos 28-44 sobre amor, apego e identidad.

TONO OBLIGATORIO:
- Español neutro latinoamericano
- Íntimo, humano, claro y emocionalmente honesto
- Profundo sin sonar dramático ni clínico
- Directo y empoderador — no triste, no victimista
- Compañero que acompaña, no gurú que predica
- Sin autoayuda genérica, sin promesas de sanación, sin frases motivacionales vacías

RESTRICCIONES ABSOLUTAS:
- No romantizar el dolor
- No prometer transformación inmediata
- No usar lenguaje rioplatense
- No usar asteriscos ni markdown en el output final
- No sonar como terapeuta clínico ni como coach motivacional

ESTRUCTURA NARRATIVA AMTME:
Umbral (entrada emocional) → Herida (exploración interna) → Símbolo (quiebre o revelación) → Verdad (reflexión consciente) → Puente (integración práctica)

OBJETIVO DE CADA EPISODIO:
- Que la persona se sienta vista
- Que identifique un patrón emocional propio
- Que entienda algo que no le habían explicado
- Que termine con claridad, no con más confusión
- Que pueda compartir el episodio porque "eso era lo que necesitaba escuchar"`;

export type EpisodeGenerationInput = {
  topic: string;
  wound?: string;
  symbol?: string;
  cta?: string;
  duration?: string;
  emotional_context?: string;
};

export function buildEpisodeScriptPrompt(input: EpisodeGenerationInput): string {
  return `Crea un guión completo para el pódcast AMTME.

Tema del episodio: ${input.topic}
${input.wound ? `Herida emocional central: ${input.wound}` : ''}
${input.symbol ? `Símbolo o metáfora central: ${input.symbol}` : ''}
${input.emotional_context ? `Contexto emocional: ${input.emotional_context}` : ''}
${input.cta ? `CTA del episodio: ${input.cta}` : ''}
Duración estimada: ${input.duration ?? '12-15 minutos'}

Devuelve el guión dividido EXACTAMENTE con estas etiquetas:
[APERTURA] - Gancho inicial que conecta con la experiencia común del oyente (3-4 frases, primera persona del oyente)
[UMBRAL] - Identificación del problema, entrada emocional (3-4 frases)
[HERIDA] - Exploración interna del conflicto central (4-5 frases)
[SÍMBOLO] - La imagen o metáfora central y su significado (3-4 frases)
[VERDAD] - Revelación directa y honesta (4-5 frases)
[PUENTE] - Integración práctica para la vida del oyente (3-4 frases)
[ACCIÓN] - Qué puede hacer el oyente con esto hoy (2-3 frases)
[CIERRE] - Frase final memorable con CTA suave (2-3 frases)

CONDICIONES:
- Estilo íntimo, conversacional y poderoso
- Incluir 2-3 frases naturalmente recortables para reels (máx 12 palabras)
- Sin victimismo, sin dramatismo excesivo, sin frases motivacionales genéricas
- Cerrar con claridad emocional y sensación de salida, nunca desde la tristeza`;
}

export type ValidationScoreKey =
  | 'hook'
  | 'clarity'
  | 'emotion'
  | 'amtme_identity'
  | 'depth'
  | 'retention'
  | 'clips'
  | 'closure'
  | 'cta';

export type ValidationScores = Record<ValidationScoreKey, number>;

export type ValidationResult = {
  scores: ValidationScores;
  approved: boolean;
  issues: string[];
  strong_phrases: string[];
  diagnosis: string;
};

export const VALIDATION_CRITERIA: {
  key: ValidationScoreKey;
  label: string;
  question: string;
  min: number;
}[] = [
  { key: 'hook', label: 'Gancho', question: '¿Atrapa en los primeros 15 segundos?', min: 8 },
  { key: 'clarity', label: 'Claridad', question: '¿Se entiende el tema sin esfuerzo?', min: 9 },
  {
    key: 'emotion',
    label: 'Emoción',
    question: '¿Se siente humano sin ser dramático?',
    min: 9,
  },
  {
    key: 'amtme_identity',
    label: 'Identidad AMTME',
    question: '¿Suena a AMTME y no a contenido genérico?',
    min: 9,
  },
  {
    key: 'depth',
    label: 'Profundidad',
    question: '¿Toca una verdad emocional real?',
    min: 8,
  },
  {
    key: 'retention',
    label: 'Retención',
    question: '¿Mantiene interés durante todo el episodio?',
    min: 8,
  },
  { key: 'clips', label: 'Clips', question: '¿Tiene frases convertibles en reels?', min: 8 },
  {
    key: 'closure',
    label: 'Cierre',
    question: '¿Deja claridad y no dependencia emocional?',
    min: 9,
  },
  { key: 'cta', label: 'CTA', question: '¿Invita sin presionar?', min: 8 },
];

export function buildValidationPrompt(script: string): string {
  return `Evalúa este guión de AMTME contra la rúbrica editorial.
Sé estricto. Un 10 es difícil de conseguir. Un 8 es el mínimo aceptable.

Devuelve EXACTAMENTE este JSON sin markdown ni texto adicional:
{
  "scores": {
    "hook": <1-10>,
    "clarity": <1-10>,
    "emotion": <1-10>,
    "amtme_identity": <1-10>,
    "depth": <1-10>,
    "retention": <1-10>,
    "clips": <1-10>,
    "closure": <1-10>,
    "cta": <1-10>
  },
  "approved": <true si TODOS los scores >= su mínimo, false si alguno no cumple>,
  "issues": [<descripción específica de cada problema donde el score no cumple el mínimo>],
  "strong_phrases": [<las 3 frases más poderosas del guión, exactas, máx 15 palabras cada una>],
  "diagnosis": "<diagnóstico general del guión en 1-2 oraciones>"
}

MÍNIMOS ACEPTABLES: hook>=8, clarity>=9, emotion>=9, amtme_identity>=9, depth>=8, retention>=8, clips>=8, closure>=9, cta>=8

GUIÓN A EVALUAR:
${script}`;
}

export function buildRewritePrompt(script: string, issues: string[]): string {
  return `Corrige este guión de AMTME aplicando exactamente las correcciones indicadas.

PROBLEMAS DETECTADOS:
${issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

REGLAS DE CORRECCIÓN:
- Corrige ÚNICAMENTE los problemas listados arriba
- Mantén todo lo que ya funciona bien, no lo toques
- Usa la misma estructura de etiquetas [APERTURA] [UMBRAL] [HERIDA] etc.
- No cambies el tema central, la herida ni el símbolo
- No debilites lo que ya está bien

Devuelve el guión corregido completo con todas las etiquetas, listo para usar.

GUIÓN ORIGINAL A CORREGIR:
${script}`;
}

export type ScriptBlocks = {
  opening: string;
  threshold: string;
  wound: string;
  symbol: string;
  truth: string;
  bridge: string;
  action: string;
  closing: string;
};

export function extractScriptBlocks(raw: string): ScriptBlocks {
  const extract = (tag: string) => {
    const regex = new RegExp(`\\[${tag}\\][\\s\\-–]*([\\s\\S]*?)(?=\\[[A-ZÁÉÍÓÚÑ]{3,}\\]|$)`, 'i');
    const match = raw.match(regex);
    return match ? match[1].replace(/^[\s\-–]+/, '').trim() : '';
  };
  return {
    opening: extract('APERTURA'),
    threshold: extract('UMBRAL'),
    wound: extract('HERIDA'),
    symbol: extract('S[IÍ]MBOLO'),
    truth: extract('VERDAD'),
    bridge: extract('PUENTE'),
    action: extract('ACCI[OÓ]N'),
    closing: extract('CIERRE'),
  };
}

// ── TITLE OPTIMIZATION ──────────────────────────────────────────────────────

export type TitleOptimizationInput = {
  currentTitle: string;
  episodeDescription?: string;
  episodeTheme?: string;
};

export type TitleOptimizationOutput = {
  originalTitle: string;
  optimizedTitle: string;
  primaryKeyword: string;
  emotionalHook: string;
  reasoning: string;
  seoScore: number;
};

export function buildTitleOptimizationPrompt(input: TitleOptimizationInput): string {
  return `Actúa como estratega editorial senior especializado en podcasts de crecimiento personal, relaciones, duelo amoroso, psicología emocional, SEO para Spotify y contenido short-form.

Tu tarea es mejorar el título de un episodio del podcast "A Mí Tampoco Me Explicaron" de Christian Villamar.

El podcast tiene un tono directo, emocional, humano, simbólico y profundo. No debe sonar como autoayuda genérica, coaching vacío ni clickbait exagerado.

Fórmula editorial: [Palabra clave principal] + [Beneficio o dolor específico] + [Gancho emocional]

Título actual: ${input.currentTitle}
${input.episodeDescription ? `Descripción del episodio: ${input.episodeDescription}` : ''}
${input.episodeTheme ? `Tema: ${input.episodeTheme}` : ''}

Genera un nuevo título optimizado que cumpla TODAS estas reglas:
1. Máximo 80 caracteres si es posible
2. Keyword clara en los primeros 60 caracteres
3. Alto potencial de búsqueda en Spotify
4. Tono emocional y directo
5. Lenguaje claro para audiencia sobre relaciones, duelo, apego y reconstrucción personal
6. Sin emojis ni signos excesivos
7. Sin promesas absolutas ("sana para siempre", "olvida en 3 días")
8. Sin frases genéricas de autoayuda
9. Sin perder la identidad AMTME
10. Debe entenderse sin conocer previamente el podcast
11. Compatible con Spotify, YouTube, TikTok y Reels

Keywords prioritarias: apego ansioso, duelo amoroso, cómo soltar, amor propio, relaciones tóxicas, rol del salvador, rechazo, dependencia emocional, límites, autoestima, heridas emocionales.

Devuelve ÚNICAMENTE JSON válido sin markdown:
{
  "originalTitle": "${input.currentTitle.replace(/"/g, '\\"')}",
  "optimizedTitle": "...",
  "primaryKeyword": "...",
  "emotionalHook": "...",
  "reasoning": "...",
  "seoScore": 0
}

El campo seoScore debe ser un número entero del 1 al 10.`;
}


export interface SpotifyAnalysisInput {
  periodStart: string;
  periodEnd: string;
  totalEpisodes: number;
  metrics: Array<{
    title: string;
    plays: number | null;
    listeners: number | null;
    completionRate: number | null;
    minutesListened: number | null;
    date: string | null;
  }>;
  previousPeriodMetrics?: Array<{
    title: string;
    plays: number | null;
    listeners: number | null;
  }>;
}

export function buildSpotifyAnalysisPrompt(input: SpotifyAnalysisInput): string {
  const metricsJson = JSON.stringify(input.metrics, null, 2);
  const previousJson = input.previousPeriodMetrics
    ? JSON.stringify(input.previousPeriodMetrics, null, 2)
    : 'No disponible';

  return `Actúa como estratega senior de crecimiento para podcasts, especialista en Spotify analytics, SEO editorial, retención de audiencia, distribución orgánica y monetización.

Estás analizando el podcast "A MI TAMPOCO ME EXPLICARON" de Christian Villamar.

El podcast trata sobre relaciones, duelo amoroso, conciencia emocional, apego, límites, reconstrucción personal y tarot como herramienta simbólica de autoconocimiento. Audiencia: hombres hispanos 28-44.

PERIODO ANALIZADO: ${input.periodStart} al ${input.periodEnd}
EPISODIOS EN EL PERIODO: ${input.totalEpisodes}

MÉTRICAS DEL PERIODO:
${metricsJson}

MÉTRICAS PERIODO ANTERIOR (para comparación):
${previousJson}

Tu tarea es analizar estas métricas y entregar una estrategia accionable, clara y priorizada.

No des consejos genéricos. Relaciona cada recomendación con los datos observados.

Analiza:
1. Qué episodios crecieron vs cayeron
2. Qué títulos funcionaron mejor (relacionado con retención y plays)
3. Qué duración retiene mejor
4. Qué fuentes de tráfico tienen mayor potencial
5. Qué temas conviene repetir, expandir o convertir en serie
6. Qué episodios merecen clips, reels o shorts
7. Qué acciones ejecutar en próximos 7 y 30 días

Devuelve ÚNICAMENTE JSON válido sin markdown:
{
  "executiveSummary": "",
  "keyFindings": [],
  "growthSignals": [],
  "riskSignals": [],
  "bestPerformingEpisodes": [],
  "underperformingEpisodes": [],
  "titleInsights": [],
  "audienceInsights": [],
  "distributionInsights": [],
  "recommendedActions": {
    "immediate": [],
    "next7Days": [],
    "next30Days": []
  },
  "contentStrategyUpdates": []
}`;
}
