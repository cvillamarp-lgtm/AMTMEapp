// Normalizador y detector de reportes exportados desde Spotify for Creators
// Spotify exporta varios tipos de reporte (ranking de episodios, series de tiempo,
// distribución por app/geografía, etc.) — cada uno con su propia firma de columnas.
// Este módulo detecta el tipo de reporte por firma de columnas y construye el
// mapeo columna cruda -> campo normalizado específico de ese tipo.

export type SpotifyReportType =
  | 'episode_rankings'
  | 'streams_downloads_timeseries'
  | 'spotify_overview_timeseries'
  | 'apps_distribution'
  | 'geo_distribution'
  | 'amtme_manual_metrics'
  | 'unknown';

export type ValidationStatus = 'valid' | 'partial' | 'invalid';

export interface ReportValidation {
  status: ValidationStatus;
  message: string;
  missingRequired: string[];
  missingRecommended: string[];
}

// Normaliza un encabezado de columna para comparación: trim, minúsculas,
// sin acentos, espacios duplicados colapsados.
export function normalizeHeader(header: string): string {
  return header
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ');
}

// Aliases (ya normalizados) por tipo de reporte y campo normalizado destino.
export const REPORT_TYPE_ALIASES: Record<
  Exclude<SpotifyReportType, 'unknown'>,
  Record<string, string[]>
> = {
  episode_rankings: {
    episodeTitle: [
      'titulo del episodio',
      'episode title',
      'title',
      'episode',
      'episodio',
      'nombre del episodio',
    ],
    playsDownloads: [
      'reproducciones y descargas',
      'plays and downloads',
      'plays & downloads',
      'streams and downloads',
    ],
    publishedAt: ['fecha de publicacion', 'publish date', 'release date', 'published'],
    ranking: ['clasificacion', 'ranking', 'rank'],
    episodeUri: ['uri del episodio', 'episode uri', 'uri'],
  },
  streams_downloads_timeseries: {
    date: ['fecha', 'date'],
    playsDownloads: [
      'reproducciones y descargas',
      'plays and downloads',
      'plays & downloads',
      'streams and downloads',
    ],
  },
  spotify_overview_timeseries: {
    date: ['fecha', 'date'],
    listens: ['escuchas', 'listens'],
    listeningHours: [
      'horas de reproduccion',
      'listening hours',
      'hours of playback',
      'playback hours',
    ],
    followers: ['seguidores', 'followers'],
  },
  apps_distribution: {
    appName: ['aplicacion', 'app', 'application', 'apps'],
    percentage: ['porcentaje', 'percentage', '%'],
  },
  geo_distribution: {
    location: ['ubicacion', 'location', 'pais', 'country'],
    percentage: ['porcentaje', 'percentage', '%'],
  },
  amtme_manual_metrics: {
    month: ['mes', 'month'],
    platform: ['plataforma', 'platform'],
    plays: ['reproducciones', 'plays'],
    reach: ['alcance', 'reach'],
    dms: ['dms', 'dm', 'mensajes directos'],
    conversions: ['conversiones', 'conversions'],
    revenue: ['ingresos', 'revenue'],
  },
};

// Etiquetas legibles para el tipo de reporte
export const REPORT_TYPE_LABELS: Record<SpotifyReportType, string> = {
  episode_rankings: 'Ranking de episodios',
  streams_downloads_timeseries: 'Reproducciones y descargas por fecha',
  spotify_overview_timeseries: 'Métricas generales de Spotify',
  apps_distribution: 'Distribución por aplicación',
  geo_distribution: 'Distribución geográfica',
  amtme_manual_metrics: 'Métricas manuales AMTME',
  unknown: 'No reconocido',
};

// Mensajes descriptivos mostrados en la UI de previsualización
const REPORT_TYPE_DESCRIPTIONS: Record<Exclude<SpotifyReportType, 'unknown'>, string> = {
  episode_rankings:
    'Reporte detectado: Ranking de episodios. Se importarán títulos, reproducciones, fecha de publicación, ranking y URI del episodio.',
  streams_downloads_timeseries:
    'Reporte detectado: Reproducciones y descargas por fecha. Se importará la serie diaria de rendimiento.',
  spotify_overview_timeseries:
    'Reporte detectado: Métricas generales de Spotify. Se importarán escuchas, horas de reproducción y seguidores.',
  apps_distribution:
    'Reporte detectado: Distribución por aplicación. Se importará el porcentaje por app.',
  geo_distribution:
    'Reporte detectado: Distribución geográfica. Se importará el porcentaje por ubicación.',
  amtme_manual_metrics:
    'Reporte detectado: Métricas manuales AMTME. Se importarán métricas consolidadas por mes y plataforma.',
};

interface ValidationConfig {
  required: string[];
  requiredAnyOf?: string[];
  recommended?: string[];
}

const VALIDATION_CONFIG: Record<Exclude<SpotifyReportType, 'unknown'>, ValidationConfig> = {
  episode_rankings: {
    required: ['episodeTitle', 'playsDownloads'],
    recommended: ['publishedAt', 'ranking', 'episodeUri'],
  },
  streams_downloads_timeseries: {
    required: ['date', 'playsDownloads'],
  },
  spotify_overview_timeseries: {
    required: ['date'],
    requiredAnyOf: ['listens', 'listeningHours', 'followers'],
  },
  apps_distribution: {
    required: ['appName', 'percentage'],
  },
  geo_distribution: {
    required: ['location', 'percentage'],
  },
  amtme_manual_metrics: {
    required: ['month', 'platform'],
    requiredAnyOf: ['plays', 'reach', 'dms', 'conversions', 'revenue'],
  },
};

function hasAnyAlias(normHeaders: Set<string>, aliases: string[]): boolean {
  return aliases.some((a) => normHeaders.has(a));
}

// Detecta el tipo de reporte de Spotify a partir de la firma de columnas (encabezados crudos).
export function detectSpotifyReportType(headers: string[]): SpotifyReportType {
  const norm = new Set(headers.map(normalizeHeader));

  // A) episode_rankings: titulo del episodio + reproducciones y descargas + uri del episodio
  const a = REPORT_TYPE_ALIASES.episode_rankings;
  if (
    hasAnyAlias(norm, a.episodeTitle) &&
    hasAnyAlias(norm, a.playsDownloads) &&
    hasAnyAlias(norm, a.episodeUri)
  ) {
    return 'episode_rankings';
  }

  // C) spotify_overview_timeseries: fecha + escuchas + horas de reproduccion + seguidores
  // (se evalúa antes que B porque su firma es más específica)
  const c = REPORT_TYPE_ALIASES.spotify_overview_timeseries;
  if (
    hasAnyAlias(norm, c.date) &&
    hasAnyAlias(norm, c.listens) &&
    hasAnyAlias(norm, c.listeningHours) &&
    hasAnyAlias(norm, c.followers)
  ) {
    return 'spotify_overview_timeseries';
  }

  // B) streams_downloads_timeseries: fecha + reproducciones y descargas
  const b = REPORT_TYPE_ALIASES.streams_downloads_timeseries;
  if (hasAnyAlias(norm, b.date) && hasAnyAlias(norm, b.playsDownloads)) {
    return 'streams_downloads_timeseries';
  }

  // D) apps_distribution: aplicacion + porcentaje
  const d = REPORT_TYPE_ALIASES.apps_distribution;
  if (hasAnyAlias(norm, d.appName) && hasAnyAlias(norm, d.percentage)) {
    return 'apps_distribution';
  }

  // E) geo_distribution: ubicacion + porcentaje
  const e = REPORT_TYPE_ALIASES.geo_distribution;
  if (hasAnyAlias(norm, e.location) && hasAnyAlias(norm, e.percentage)) {
    return 'geo_distribution';
  }

  // F) amtme_manual_metrics: mes + plataforma + reproducciones + alcance + dms + conversiones + ingresos
  const f = REPORT_TYPE_ALIASES.amtme_manual_metrics;
  if (
    hasAnyAlias(norm, f.month) &&
    hasAnyAlias(norm, f.platform) &&
    hasAnyAlias(norm, f.plays) &&
    hasAnyAlias(norm, f.reach) &&
    hasAnyAlias(norm, f.dms) &&
    hasAnyAlias(norm, f.conversions) &&
    hasAnyAlias(norm, f.revenue)
  ) {
    return 'amtme_manual_metrics';
  }

  return 'unknown';
}

// Construye el mapa columna_cruda -> campo_normalizado específico del tipo de reporte detectado.
export function buildColumnMapForType(
  headers: string[],
  type: SpotifyReportType
): Record<string, string> {
  if (type === 'unknown') return {};
  const aliasMap = REPORT_TYPE_ALIASES[type];
  const map: Record<string, string> = {};
  for (const header of headers) {
    const norm = normalizeHeader(header);
    for (const [field, aliases] of Object.entries(aliasMap)) {
      if (aliases.includes(norm)) {
        map[header] = field;
        break;
      }
    }
  }
  return map;
}

// Valida las columnas detectadas según el tipo de reporte.
export function validateReportType(
  type: SpotifyReportType,
  columnMap: Record<string, string>
): ReportValidation {
  if (type === 'unknown') {
    return {
      status: 'invalid',
      message:
        'No se reconoció ninguna firma de columnas conocida — el archivo no es compatible con el importador de Spotify.',
      missingRequired: [],
      missingRecommended: [],
    };
  }

  const fields = new Set(Object.values(columnMap));
  const config = VALIDATION_CONFIG[type];
  const missingRequired = config.required.filter((f) => !fields.has(f));
  const anyOfMissing = config.requiredAnyOf
    ? !config.requiredAnyOf.some((f) => fields.has(f))
    : false;
  const missingRecommended = (config.recommended ?? []).filter((f) => !fields.has(f));

  if (missingRequired.length > 0 || anyOfMissing) {
    return {
      status: 'invalid',
      message: `${REPORT_TYPE_DESCRIPTIONS[type]} Sin embargo, faltan columnas obligatorias y el archivo no puede importarse.`,
      missingRequired: anyOfMissing
        ? [...missingRequired, ...(config.requiredAnyOf ?? [])]
        : missingRequired,
      missingRecommended,
    };
  }

  if (missingRecommended.length > 0) {
    return {
      status: 'partial',
      message: REPORT_TYPE_DESCRIPTIONS[type],
      missingRequired: [],
      missingRecommended,
    };
  }

  return {
    status: 'valid',
    message: REPORT_TYPE_DESCRIPTIONS[type],
    missingRequired: [],
    missingRecommended: [],
  };
}

// ---- Filas normalizadas por tipo de reporte ----

export interface NormalizedEpisodeRanking {
  type: 'episode_rankings';
  episodeTitle: string;
  normalizedEpisodeTitle: string;
  episodeUri: string | null;
  publishedAt: string | null;
  playsDownloads: number | null;
  ranking: number | null;
}

export interface NormalizedDailyMetric {
  type: 'streams_downloads_timeseries' | 'spotify_overview_timeseries';
  date: string | null;
  playsDownloads: number | null;
  listens: number | null;
  listeningHours: number | null;
  followers: number | null;
}

export interface NormalizedDistributionMetric {
  type: 'apps_distribution' | 'geo_distribution';
  dimensionType: 'app' | 'location';
  dimensionName: string;
  percentage: number | null;
}

export interface NormalizedManualMetric {
  type: 'amtme_manual_metrics';
  month: string;
  platform: string;
  plays: number | null;
  reach: number | null;
  dms: number | null;
  conversions: number | null;
  revenue: number | null;
}

export type NormalizedSpotifyRow =
  | NormalizedEpisodeRanking
  | NormalizedDailyMetric
  | NormalizedDistributionMetric
  | NormalizedManualMetric;

function getMapped(
  row: Record<string, string>,
  columnMap: Record<string, string>,
  field: string
): string | null {
  const header = Object.keys(columnMap).find((h) => columnMap[h] === field);
  if (!header) return null;
  const v = row[header];
  return v === undefined || v === '' ? null : v;
}

// Mapea una fila cruda a su forma normalizada según el tipo de reporte.
export function mapSpotifyRow(
  row: Record<string, string>,
  columnMap: Record<string, string>,
  type: SpotifyReportType
): NormalizedSpotifyRow | null {
  switch (type) {
    case 'episode_rankings': {
      const title = (getMapped(row, columnMap, 'episodeTitle') ?? '').trim();
      return {
        type,
        episodeTitle: title,
        normalizedEpisodeTitle: normalizeTitle(title),
        episodeUri: getMapped(row, columnMap, 'episodeUri'),
        publishedAt: parseDate(getMapped(row, columnMap, 'publishedAt')),
        playsDownloads: parseNumber(getMapped(row, columnMap, 'playsDownloads')),
        ranking: parseNumber(getMapped(row, columnMap, 'ranking')),
      };
    }
    case 'streams_downloads_timeseries':
    case 'spotify_overview_timeseries':
      return {
        type,
        date: parseDate(getMapped(row, columnMap, 'date')),
        playsDownloads: parseNumber(getMapped(row, columnMap, 'playsDownloads')),
        listens: parseNumber(getMapped(row, columnMap, 'listens')),
        listeningHours: parseNumber(getMapped(row, columnMap, 'listeningHours')),
        followers: parseNumber(getMapped(row, columnMap, 'followers')),
      };
    case 'apps_distribution':
      return {
        type,
        dimensionType: 'app',
        dimensionName: (getMapped(row, columnMap, 'appName') ?? '').trim(),
        percentage: parsePercent(getMapped(row, columnMap, 'percentage')),
      };
    case 'geo_distribution':
      return {
        type,
        dimensionType: 'location',
        dimensionName: (getMapped(row, columnMap, 'location') ?? '').trim(),
        percentage: parsePercent(getMapped(row, columnMap, 'percentage')),
      };
    case 'amtme_manual_metrics':
      return {
        type,
        month: (getMapped(row, columnMap, 'month') ?? '').trim(),
        platform: (getMapped(row, columnMap, 'platform') ?? '').trim(),
        plays: parseNumber(getMapped(row, columnMap, 'plays')),
        reach: parseNumber(getMapped(row, columnMap, 'reach')),
        dms: parseNumber(getMapped(row, columnMap, 'dms')),
        conversions: parseNumber(getMapped(row, columnMap, 'conversions')),
        revenue: parseNumber(getMapped(row, columnMap, 'revenue')),
      };
    default:
      return null;
  }
}

// Detecta el periodo (fecha mínima/máxima) cubierto por las filas normalizadas.
export function detectPeriodForRows(rows: NormalizedSpotifyRow[]): {
  start: string | null;
  end: string | null;
} {
  const dates: string[] = [];
  for (const row of rows) {
    if (row.type === 'episode_rankings' && row.publishedAt) dates.push(row.publishedAt);
    if (
      (row.type === 'streams_downloads_timeseries' || row.type === 'spotify_overview_timeseries') &&
      row.date
    ) {
      dates.push(row.date);
    }
  }
  if (dates.length === 0) return { start: null, end: null };
  dates.sort();
  return { start: dates[0], end: dates[dates.length - 1] };
}

// Normaliza un número que puede venir con coma o punto decimal
export function parseNumber(value: string | null | undefined): number | null {
  if (value == null || value === '') return null;
  const cleaned = value
    .toString()
    .replace(/[^0-9.,%-]/g, '')
    .replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

// Normaliza porcentaje (e.g. "85%" → 85 o "0.85" → 85)
export function parsePercent(value: string | null | undefined): number | null {
  if (value == null || value === '') return null;
  const str = value.toString().trim();
  if (str.endsWith('%')) return parseNumber(str.slice(0, -1));
  const n = parseNumber(str);
  if (n == null) return null;
  return n <= 1 ? Math.round(n * 100) : n;
}

// Normaliza fecha a ISO string (yyyy-mm-dd)
export function parseDate(value: string | null | undefined): string | null {
  if (value == null || value === '') return null;
  // dd/mm/yyyy (priorizado: formato común en exports en español)
  const ddmm = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmm) {
    const [, dd, mm, yyyy] = ddmm;
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  }
  // Intenta parsear directamente (yyyy-mm-dd, ISO, etc.)
  const d = new Date(value);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }
  return null;
}

// Normaliza título de episodio: quita prefijos "Ep. 29 —", lowercase, sin acentos
export function normalizeTitle(title: string): string {
  return title
    .replace(/^[Ee]p\.?\s*\d+\s*[—\-:]\s*/u, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Calcula un hash simple del contenido del archivo (para deduplicación)
export async function hashFileContent(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content.slice(0, 10000)); // hash de primeros 10k chars
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16);
}
