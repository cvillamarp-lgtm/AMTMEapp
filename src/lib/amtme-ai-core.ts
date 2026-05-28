import type { StudioState, AIEngine, AIProvider } from '@/lib/studio-types';

type AiCoreContext = {
  engine: AIEngine;
  goal: string;
  prompt: string;
  provider: AIProvider;
  model: string;
  state: StudioState;
};

type EngineDefinition = {
  engine: AIEngine;
  module: string;
  phase: 'FASE IA 1' | 'FASE IA 2' | 'FASE IA 3';
  priority: 'muy alta' | 'alta' | 'media-alta' | 'media';
  defaultGoal: string;
  outputFields: string[];
  rules: string[];
};

const palette = {
  navy: '#0C1F36',
  lemonLime: '#FEE94B',
  white: '#FFFFFF',
  cream: '#F5F2EA',
  slate: '#90A4B8',
  red: '#E0211E',
  black: '#111111',
};

export const AI_ENGINE_CATALOG: EngineDefinition[] = [
  {
    engine: 'AI Episodios',
    module: 'Episodios',
    phase: 'FASE IA 1',
    priority: 'muy alta',
    defaultGoal: 'Crear ideas, guiones y activos narrativos para episodios AMTME.',
    outputFields: [
      'título',
      'tema',
      'herida emocional',
      'símbolo central',
      'estructura narrativa',
      'guion',
      'CTA',
      'descripciones',
      'hooks',
      'clips',
      'piezas derivadas',
      'checklist de publicación',
    ],
    rules: [
      'Usar siempre Umbral, Herida, Símbolo, Verdad, Puente y Acción.',
      'Detectar CTA ausente y herida débil.',
      'No inventar información no provista.',
    ],
  },
  {
    engine: 'AI Visual',
    module: 'Creador Visual',
    phase: 'FASE IA 1',
    priority: 'muy alta',
    defaultGoal: 'Diseñar piezas visuales editoriales compatibles con la paleta oficial.',
    outputFields: [
      'prompt visual',
      'especificación técnica',
      'formato',
      'paleta',
      'composición',
      'texto principal',
      'texto secundario',
      'CTA',
      'principios de diseño',
      'checklist QA',
    ],
    rules: [
      'Respetar paleta oficial.',
      'No saturar de amarillo.',
      'No parecer flyer genérico.',
      'Mantener legibilidad móvil.',
    ],
  },
  {
    engine: 'AI Contenido',
    module: 'Contenido',
    phase: 'FASE IA 1',
    priority: 'muy alta',
    defaultGoal: 'Convertir episodios e ideas en reels, carruseles, stories, captions y DM.',
    outputFields: [
      'hook',
      'texto principal',
      'caption',
      'CTA',
      'prompt visual',
      'checklist de publicación',
      'métrica objetivo',
      'concepto psicológico',
      'formato recomendado',
    ],
    rules: [
      'Usar conceptos psicológicos AMTME.',
      'Priorizar contenido guardable y compartible.',
      'Mantener una sola idea por pieza.',
    ],
  },
  {
    engine: 'AI Calidad',
    module: 'Calidad AMTME',
    phase: 'FASE IA 1',
    priority: 'muy alta',
    defaultGoal: 'Auditar si una pieza suena a AMTME y decidir si se publica.',
    outputFields: [
      'estado',
      'problema detectado',
      'impacto',
      'corrección sugerida',
      'versión final optimizada',
    ],
    rules: [
      'Responder con estado Aprobado, Requiere ajuste o No publicar.',
      'Detectar coaching genérico, espiritualidad cliché y exceso de ideas.',
      'Exigir CTA y herida cuando corresponda.',
    ],
  },
  {
    engine: 'AI Documento Maestro',
    module: 'Documento Maestro',
    phase: 'FASE IA 1',
    priority: 'alta',
    defaultGoal: 'Responder preguntas del sistema y ubicar la sección o política correcta.',
    outputFields: [
      'respuesta',
      'sección correcta',
      'política aplicable',
      'contradicción detectada',
      'siguiente acción',
    ],
    rules: [
      'Usar el documento maestro como fuente central.',
      'No inventar rutas ni reglas.',
      'Marcar pendiente si falta una referencia.',
    ],
  },
  {
    engine: 'AI Archivo',
    module: 'Histórico / Archivo',
    phase: 'FASE IA 2',
    priority: 'alta',
    defaultGoal:
      'Clasificar archivos, sugerir destino y detectar duplicados o residuos temporales.',
    outputFields: [
      'tipo de archivo',
      'ubicación recomendada',
      'estado',
      'acción recomendada',
      'nombre sugerido',
      'motivo',
      'prioridad',
    ],
    rules: [
      'No usar carpetas temporales para trabajo nuevo.',
      'Advertir si un archivo está fuera de lugar.',
      'Detectar duplicados antes de sugerir movimiento.',
    ],
  },
  {
    engine: 'AI Métricas',
    module: 'Métricas',
    phase: 'FASE IA 2',
    priority: 'alta',
    defaultGoal: 'Interpretar tendencias, comparar episodios y proponer próximos pasos.',
    outputFields: [
      'hallazgo',
      'interpretación',
      'riesgo',
      'oportunidad',
      'acción recomendada',
      'prioridad',
    ],
    rules: [
      'Explicar crecimiento o caída.',
      'Detectar patrones y potencial.',
      'No inferir métricas sin fuente.',
    ],
  },
  {
    engine: 'AI Reportes',
    module: 'Reportes',
    phase: 'FASE IA 2',
    priority: 'media-alta',
    defaultGoal: 'Generar reportes ejecutivos y exportables sobre el sistema.',
    outputFields: ['resumen ejecutivo', 'hallazgos', 'próximos pasos', 'checklist de acciones'],
    rules: [
      'Soportar Markdown y CSV estructurado.',
      'Mantener formato ejecutivo.',
      'Pedir contexto cuando falten datos.',
    ],
  },
  {
    engine: 'AI Monetización',
    module: 'Monetización',
    phase: 'FASE IA 2',
    priority: 'media-alta',
    defaultGoal: 'Responder DMs, calificar leads y proponer seguimiento humano.',
    outputFields: [
      'respuesta',
      'intención de compra',
      'siguiente acción',
      'CTA suave',
      'objeción',
      'cierre',
    ],
    rules: [
      'No sonar agresivo.',
      'No prometer resultados exagerados.',
      'Mantener tono humano y baja fricción.',
    ],
  },
  {
    engine: 'AI Automatización',
    module: 'Automatización',
    phase: 'FASE IA 3',
    priority: 'media',
    defaultGoal: 'Diseñar flujos, prompts maestros y documentación de automatizaciones.',
    outputFields: [
      'nombre del flujo',
      'objetivo',
      'trigger',
      'input',
      'proceso',
      'output',
      'riesgo',
      'mantenimiento',
      'prioridad',
    ],
    rules: [
      'Explicar inputs y outputs.',
      'Detectar riesgos de mantenimiento.',
      'No duplicar automatizaciones existentes.',
    ],
  },
  {
    engine: 'AI Calendario',
    module: 'Calendario',
    phase: 'FASE IA 3',
    priority: 'media',
    defaultGoal: 'Construir semanas de publicación y producción según energía y prioridad.',
    outputFields: ['eventos sugeridos', 'fechas', 'prioridad', 'dependencia', 'acción siguiente'],
    rules: [
      'Detectar atrasos y tareas vencidas.',
      'Ordenar por prioridad operativa.',
      'No alterar eventos manuales sin motivo.',
    ],
  },
  {
    engine: 'AI Checklists',
    module: 'Checklists',
    phase: 'FASE IA 3',
    priority: 'media',
    defaultGoal: 'Generar y adaptar checklists para producción, QA y revisión.',
    outputFields: [
      'nombre del checklist',
      'función',
      'frecuencia',
      'pasos',
      'criterio de listo',
      'errores a evitar',
    ],
    rules: [
      'Adaptar la lista al tipo de pieza.',
      'Detectar pasos faltantes.',
      'No sustituir el checklist manual.',
    ],
  },
];

function getSectionContent(state: StudioState, title: string) {
  return state.masterSections.find((section) => section.title === title)?.content ?? '';
}

export function getAiEngineDefinition(engine: AIEngine) {
  return AI_ENGINE_CATALOG.find((item) => item.engine === engine);
}

export function buildAiCorePrompt({ engine, goal, prompt, provider, model, state }: AiCoreContext) {
  const definition = getAiEngineDefinition(engine);
  const masterDocument = state.masterSections
    .map((section) => `${section.title}: ${section.content}`)
    .join('\n');
  const policy = getSectionContent(state, 'Política operativa');
  const summary = [
    `Motor: ${engine}`,
    `Módulo: ${definition?.module ?? 'General'}`,
    `Fase: ${definition?.phase ?? 'No definida'}`,
    `Prioridad: ${definition?.priority ?? 'media'}`,
    `Proveedor: ${provider}`,
    `Modelo: ${model}`,
    `Paleta oficial: Navy ${palette.navy}, Lemon Lime ${palette.lemonLime}, Crema ${palette.cream}, Blanco ${palette.white}, Azul grisáceo ${palette.slate}, Rojo ${palette.red}, Negro ${palette.black}.`,
    `Estructura narrativa activa: ${state.config.aiNarrativeStructure.join(' · ')}`,
    `Tono por defecto: ${state.config.aiTone}`,
    `Reglas de calidad: ${state.config.aiQualityRules.join(' | ')}`,
    `Documento maestro: ${masterDocument}`,
    `Política operativa: ${policy}`,
    `Instrucción central: priorizar operación sobre decoración.`,
    `Objetivo: ${goal}`,
    `Salida esperada: ${definition?.outputFields.join(' · ') ?? 'Respuesta útil'}`,
    `Reglas del motor: ${definition?.rules.join(' | ') ?? 'No inventar datos'}`,
    `Prompt del usuario: ${prompt}`,
  ];

  return summary.join('\n');
}

export function summarizeAiResult(result: string) {
  return result.replace(/\s+/g, ' ').trim().slice(0, 160) || 'Sin resultado';
}

export function createAiHistoryEntry(input: {
  engine: AIEngine;
  provider: AIProvider;
  model: string;
  prompt: string;
  result: string;
}) {
  return {
    id: `ai-${Date.now()}`,
    createdAt: new Date().toISOString(),
    engine: input.engine,
    provider: input.provider,
    model: input.model,
    promptSummary: input.prompt.replace(/\s+/g, ' ').trim().slice(0, 90) || 'Prompt vacío',
    resultSummary: summarizeAiResult(input.result),
  };
}
