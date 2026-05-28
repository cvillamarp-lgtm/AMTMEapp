import type {
  StudioState,
  Checklist,
  CalendarEvent,
  ArchiveItem,
  AutomationRule,
  AIHistoryEntry,
  Episode,
  ContentPiece,
  MasterSection,
  MetricEpisode,
  MetricMonthly,
  MonetizationLead,
  VisualAsset,
} from './studio-types';

export const initialMasterSections: MasterSection[] = [
  {
    id: 'resumen',
    title: 'Resumen ejecutivo',
    content:
      'AMTME es un sistema editorial, emocional y operativo para gestionar contenido, episodios, métricas y monetización desde una sola fuente central.',
    status: 'Vigente',
    lastReviewedAt: '2026-05-14',
  },
  {
    id: 'direccion',
    title: 'Dirección estratégica',
    content:
      'Mantener la consistencia antes que la expansión; convertir el sistema AMTME en una plataforma centralizada, clara y operativa.',
    status: 'Vigente',
    lastReviewedAt: '2026-05-14',
  },
  {
    id: 'politica',
    title: 'Política operativa',
    content:
      'La arquitectura oficial es la única ruta activa. Las carpetas temporales están cerradas para trabajo nuevo.',
    status: 'Vigente',
    lastReviewedAt: '2026-05-14',
  },
  {
    id: 'pendientes',
    title: 'Decisiones pendientes',
    content:
      'Confirmar siguiente ciclo de automatización, priorización de canales y reglas de archivado de versiones antiguas.',
    status: 'Requiere decisión',
    lastReviewedAt: '2026-05-14',
  },
];

export const initialEpisodes: Episode[] = [
  {
    id: 'ep-34',
    episodeNumber: '34',
    title: 'Cuando ya no puedes seguir fingiendo',
    theme: 'agotamiento emocional y verdad personal',
    pillar: 'Herida y elección',
    emotionalWound: 'Cansancio de sostener una versión falsa de uno mismo',
    centralSymbol: 'Umbral abierto',
    objective: 'Hacer reconocible el punto donde la negación deja de ser útil',
    status: 'Publicado',
    narrativeStructure: ['Umbral', 'Herida', 'Símbolo', 'Verdad', 'Puente', 'Acción'],
    script: 'Guion base del episodio 34. Hablar con sobriedad, pausa y claridad emocional.',
    spotifyDescription: 'Un episodio sobre el cansancio de sostener lo que ya no tiene sentido.',
    appleDescription: 'Cuando dejar de fingir se convierte en una forma de orden.',
    cta: 'Escríbeme "umbral" si quieres revisar tu propio patrón.',
    hooks: [
      'Hay un momento en que fingir se vuelve más caro que decir la verdad.',
      'No te cansas de vivir: te cansas de sostener una versión que ya no existe.',
    ],
    publishDate: '2026-05-16',
    notes: 'Revisar corte final de clips y descripción secundaria.',
    nextAction: 'Marcar como distribuido y extraer dos clips.',
  },
  {
    id: 'ep-35',
    episodeNumber: '35',
    title: 'Lo que te hace volver a donde te rompieron',
    theme: 'repetición de patrones',
    pillar: 'Patrón emocional',
    emotionalWound: 'Atracción por lo conocido aunque duela',
    centralSymbol: 'Bucle',
    objective: 'Nombrar la repetición sin romanticismo',
    status: 'En investigación',
    narrativeStructure: ['Umbral', 'Herida', 'Símbolo', 'Verdad', 'Puente', 'Acción'],
    script: '',
    spotifyDescription: '',
    appleDescription: '',
    cta: '',
    hooks: [
      'Hay vínculos que no te buscan: te repiten.',
      'A veces vuelves no por amor, sino por memoria.',
    ],
    publishDate: '2026-05-23',
    notes: 'Pendiente de guion y CTA.',
    nextAction: 'Generar estructura narrativa y guion.',
  },
  {
    id: 'ep-36',
    episodeNumber: '36',
    title: 'El precio de explicar demasiado',
    theme: 'sobreexplicación y control',
    pillar: 'Identidad',
    emotionalWound: 'Necesidad de justificar cada decisión',
    centralSymbol: 'Puerta entreabierta',
    objective: 'Convertir el exceso de explicación en un punto de observación',
    status: 'Idea',
    narrativeStructure: ['Umbral', 'Herida', 'Símbolo', 'Verdad', 'Puente', 'Acción'],
    script: '',
    spotifyDescription: '',
    appleDescription: '',
    cta: '',
    hooks: [
      'Cuando explicas demasiado, a veces no aclaras: te escondes.',
      'No todo merece defensa; algunas cosas solo necesitan decisión.',
    ],
    publishDate: '2026-05-30',
    notes: 'Idea prioritaria para el siguiente ciclo.',
    nextAction: 'Definir enfoque emocional y visual.',
  },
];

export const initialVisualAssets: VisualAsset[] = [
  {
    id: 'vis-1',
    type: 'Carrusel portada',
    format: '1080x1350',
    title: 'Cuando ya no puedes seguir fingiendo',
    mainText: 'Fingir se volvió más caro que la verdad',
    secondaryText: 'AMTME / episodio 34',
    cta: 'Desliza',
    prompt:
      'Diseño editorial sobrio con fondo blanco roto, texto navy profundo, acento amarillo mínimo y jerarquía limpia. Inspiración Apple: aire amplio, bordes suaves, composición precisa.',
    technicalSpec: '1080x1350, lectura móvil, un CTA, alto contraste, sin degradados innecesarios.',
    templateVariables: '{titulo}, {subtitulo}, {cta}, {episodio}',
    palette: 'Navy profundo, blanco, crema cálido, amarillo mínimo',
    status: 'Listo',
    episodeId: 'ep-34',
    createdAt: '2026-05-14',
  },
];

export const initialContentPieces: ContentPiece[] = [
  {
    id: 'content-1',
    channel: 'Instagram',
    format: 'Reel',
    theme: 'Cansancio emocional',
    emotion: 'Claridad contenida',
    objective: 'Abrir conversación',
    hook: 'No te cansas de vivir, te cansas de sostener una versión que ya no existe.',
    mainText: 'Pieza breve sobre el costo de fingir y la calma que llega cuando nombras lo real.',
    caption: 'A veces lo difícil no es cambiar, sino dejar de defender lo que ya terminó.',
    cta: 'Escríbeme “verdad”.',
    visualPrompt: 'Reel cover editorial minimalista con navy, blanco y amarillo mínimo.',
    status: 'Publicado',
    publishDate: '2026-05-14',
    episodeId: 'ep-34',
    metricGoal: 'Comentarios y DMs',
    createdAt: '2026-05-14',
  },
];

export const initialMetricsMonthly: MetricMonthly[] = [
  {
    id: 'metric-month-1',
    month: '2026-05',
    platform: 'Spotify',
    reach: 12800,
    plays: 9400,
    downloads: 2100,
    engagement: 8.4,
    profileVisits: 420,
    linkClicks: 182,
    dms: 74,
    conversions: 18,
    revenue: 1782,
    insight: 'El episodio con CTA claro convirtió mejor.',
    action: 'Repetir CTA de baja fricción en próximos episodios.',
  },
];

export const initialMetricsEpisode: MetricEpisode[] = [
  {
    id: 'metric-ep-34',
    episodeId: 'ep-34',
    plays48h: 1240,
    plays7d: 3180,
    retention: 61,
    saves: 143,
    shares: 52,
    comments: 29,
    dms: 18,
    conversions: 6,
    insight: 'Muy buena retención en el minuto dos.',
  },
];

export const initialChecklists: Checklist[] = [
  {
    id: 'check-episode',
    name: 'Producción de episodio',
    area: '05_PRODUCCIÓN',
    frequency: 'Semanal',
    status: 'En proceso',
    readyCriteria: 'Guion, CTA, descripción y clips listos',
    errorsToAvoid: 'Publicar sin CTA, sin descripción o sin portada',
    items: [
      { id: 'c1', item: 'Guion validado', completed: true },
      { id: 'c2', item: 'Descripción Spotify lista', completed: true },
      { id: 'c3', item: 'Descripción Apple lista', completed: false },
      { id: 'c4', item: 'Clips derivados preparados', completed: false },
    ],
  },
  {
    id: 'check-policy',
    name: 'Revisión mensual',
    area: '00_DOCUMENTO_MAESTRO',
    frequency: 'Mensual',
    status: 'Pendiente',
    readyCriteria: 'Secciones revisadas y decisiones registradas',
    errorsToAvoid: 'Mantener decisiones sin fecha o sin dueño',
    items: [
      { id: 'c5', item: 'Revisar carpetas temporales', completed: false },
      { id: 'c6', item: 'Revisar duplicados', completed: false },
      { id: 'c7', item: 'Revisar histórico', completed: false },
    ],
  },
];

export const initialCalendarEvents: CalendarEvent[] = [
  {
    id: 'cal-1',
    title: 'Publicar episodio 34',
    type: 'Publicación',
    date: '2026-05-16',
    time: '11:00',
    frequency: 'Semanal',
    channel: 'Spotify',
    relatedEpisodeId: 'ep-34',
    relatedContentId: 'content-1',
    status: 'Listo',
    notes: 'Alinear clips y CTA antes de publicar.',
  },
];

export const initialArchiveItems: ArchiveItem[] = [
  {
    id: 'arch-1',
    name: 'Paleta anterior 2025',
    type: 'Paleta anterior',
    origin: 'Histórico AMTME',
    reason: 'Sustituida por la paleta oficial vigente',
    archivedAt: '2026-05-14',
    recoverable: 'Sí',
    status: 'Archivado',
    notes: 'Solo referencia histórica.',
  },
];

export const initialMonetizationLeads: MonetizationLead[] = [
  {
    id: 'lead-1',
    source: 'Instagram DM',
    name: 'Lead guardado',
    status: 'Interesado',
    offerId: 'tarot-99',
    revenue: 99,
    nextAction: 'Enviar disponibilidad de sesión.',
    createdAt: '2026-05-14',
  },
];

export const initialAutomationRules: AutomationRule[] = [
  {
    id: 'auto-1',
    name: 'Verificador automático',
    objective: 'Evitar trabajo en carpetas temporales y duplicidad documental',
    trigger: 'Ejecución mensual',
    input: 'Estructura AMTME y archivos nuevos',
    output: 'Reporte de orden y alertas',
    tool: 'Bash script',
    status: 'Listo',
    responsible: 'Sistema',
    risk: 'Bajo',
    nextReview: '2026-06-01',
  },
];

export const initialAIHistory: AIHistoryEntry[] = [
  {
    id: 'ai-1',
    createdAt: '2026-05-14T09:00:00.000Z',
    engine: 'AI Episodios',
    provider: 'grok',
    model: 'grok-2-latest',
    promptSummary: 'Convertir una idea en estructura AMTME',
    resultSummary: 'Generó título, herida, símbolo, guion y CTA.',
  },
];

export const initialStudioState: StudioState = {
  masterSections: initialMasterSections,
  episodes: initialEpisodes,
  visualAssets: initialVisualAssets,
  contentPieces: initialContentPieces,
  metricsMonthly: initialMetricsMonthly,
  metricsEpisode: initialMetricsEpisode,
  checklists: initialChecklists,
  calendarEvents: initialCalendarEvents,
  archiveItems: initialArchiveItems,
  monetizationLeads: initialMonetizationLeads,
  automationRules: initialAutomationRules,
  aiHistory: initialAIHistory,
  config: {
    projectName: 'AMTME Studio OS',
    projectDescriptor: 'Sistema operativo editorial interno',
    uiLanguage: 'es-419',
    timeZone: 'America/Bogota',
    currency: 'USD',
    operationalContext: 'Operación editorial y documental interna',
    paletteLocked: true,
    activeChannels: ['Instagram', 'Spotify', 'Apple Podcasts', 'TikTok', 'YouTube Shorts'],
    activeFormats: ['Reel', 'Carrusel', 'Story', 'Podcast', 'DM'],
    defaultChannel: 'Instagram',
    defaultFrequency: 'Semanal',
    publishingWindows: ['08:30', '11:00', '19:30'],
    frequentCtas: ['Escríbeme “verdad”', 'Guarda esto', 'Desliza', 'Respóndeme por DM'],
    defaultNarrativeStructure: ['Umbral', 'Herida', 'Símbolo', 'Verdad', 'Puente', 'Acción'],
    editorialTone: 'Directo, sobrio, íntimo y operativo',
    psychologicalConcepts: [
      'Identificación emocional',
      'Open loop',
      'Microcompromiso',
      'Conversión por reconocimiento',
    ],
    futureApis: ['Supabase', 'IA', 'Google Drive', 'Google Calendar', 'Google Sheets'],
    futureIntegrations: [
      {
        id: 'supabase',
        label: 'Supabase',
        status: 'Preparada',
        mode: 'solo lectura',
        detail: 'Listo para habilitar auth y persistencia remota por entorno.',
      },
      {
        id: 'drive',
        label: 'Google Drive',
        status: 'No configurada',
        mode: 'pendiente',
        detail: 'Sin credenciales. Reservado para respaldo documental.',
      },
      {
        id: 'calendar',
        label: 'Google Calendar',
        status: 'No configurada',
        mode: 'pendiente',
        detail: 'Sin sincronización activa. Estructura de calendario ya preparada.',
      },
      {
        id: 'sheets',
        label: 'Google Sheets',
        status: 'No configurada',
        mode: 'pendiente',
        detail: 'Pendiente de mapeo de reportes y métricas.',
      },
      {
        id: 'webhooks',
        label: 'Webhooks internos',
        status: 'Preparada',
        mode: 'solo lectura',
        detail: 'Solo diagnósticos. No hay envíos automáticos en esta fase.',
      },
    ],
    aiPrimaryProvider: 'grok',
    aiFallbackProvider: 'gemini',
    aiEnabled: true,
    aiPreferredModelByProvider: {
      grok: 'grok-2-latest',
      gemini: 'gemini-1.5-pro',
    },
    aiVisibleModelsByProvider: {
      grok: ['grok-2-latest', 'grok-beta'],
      gemini: ['gemini-1.5-pro', 'gemini-1.5-flash'],
    },
    aiSystemPrompt:
      'Eres el asistente operativo de AMTME Studio OS. Respondes en español neutral, con tono editorial, preciso y orientado a ejecución.',
    aiTone: 'editorial, claro, sobrio, operativo',
    aiImageModel: 'pendiente de definir',
    aiNarrativeStructure: ['Umbral', 'Herida', 'Símbolo', 'Verdad', 'Puente', 'Acción'],
    aiQualityRules: [
      'No coaching genérico',
      'No espiritualidad cliché',
      'No más de un CTA principal',
      'Legibilidad móvil primero',
      'Una sola idea por pieza',
    ],
    aiBaseQualityChecklist: [
      'Un solo foco por pieza',
      'CTA principal explícito',
      'Lenguaje sin clichés',
      'Contraste visual validado',
    ],
    aiConnectionStatus: 'Conectado con Grok y Gemini via servidor',
    persistenceMode: 'hibrido',
    environmentReadOnlyFlags: [
      'NEXT_PUBLIC_REQUIRE_AUTH',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
    ],
    uiDensity: 'estandar',
    compactCards: false,
    showInterfaceHelp: true,
  },
};
