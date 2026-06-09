// Diccionario de aliases para columnas exportadas desde Spotify for Creators
// Spotify cambia nombres según idioma e iteración del dashboard

export const SPOTIFY_COLUMN_ALIASES: Record<string, string[]> = {
  episodeTitle: [
    'Episode', 'Episode title', 'Title', 'Nombre del episodio',
    'Título del episodio', 'Episodio', 'episode', 'episode_title',
  ],
  plays: [
    'Plays', 'Reproducciones', 'Streams', 'Starts', 'plays',
    'streams', 'starts', 'Total plays',
  ],
  listeners: [
    'Listeners', 'Oyentes', 'Unique listeners', 'Oyentes únicos',
    'listeners', 'unique_listeners',
  ],
  completionRate: [
    'Completion rate', 'Tasa de finalización', 'Average completion',
    'Retención', 'completion_rate', 'avg_completion', 'Completion',
  ],
  date: [
    'Date', 'Fecha', 'Day', 'Día', 'date', 'day', 'Period',
    'Periodo', 'Published', 'Publicado',
  ],
  periodStart: [
    'Period start', 'Start date', 'Inicio del periodo', 'From', 'Desde',
  ],
  periodEnd: [
    'Period end', 'End date', 'Fin del periodo', 'To', 'Hasta',
  ],
  country: ['Country', 'País', 'country', 'Pais'],
  city: ['City', 'Ciudad', 'city'],
  ageRange: ['Age range', 'Rango de edad', 'Age', 'Edad', 'age'],
  gender: ['Gender', 'Género', 'Genero', 'gender', 'Sex'],
  platform: ['Platform', 'Plataforma', 'platform', 'App'],
  trafficSource: [
    'Source', 'Traffic source', 'Discovery source', 'Fuente',
    'Fuente de descubrimiento', 'source', 'traffic_source',
  ],
  followers: [
    'Followers', 'Seguidores', 'followers', 'New followers',
    'Nuevos seguidores',
  ],
  minutesListened: [
    'Minutes listened', 'Minutos escuchados', 'minutes_listened',
    'Listen time', 'Tiempo de escucha',
  ],
  impressions: ['Impressions', 'Impresiones', 'impressions'],
  clicks: ['Clicks', 'Clics', 'clicks', 'Click-throughs'],
  duration: ['Duration', 'Duración', 'duration', 'Length'],
};

// Detecta qué campo normalizado corresponde a un nombre de columna crudo
export function detectColumn(rawName: string): string | null {
  const normalized = rawName.trim().toLowerCase();
  for (const [field, aliases] of Object.entries(SPOTIFY_COLUMN_ALIASES)) {
    if (aliases.some((a) => a.toLowerCase() === normalized)) return field;
  }
  return null;
}

// Mapea un objeto de fila cruda a campos normalizados
export function mapRowToNormalized(
  row: Record<string, string>,
  columnMap: Record<string, string>
): Record<string, string | null> {
  const result: Record<string, string | null> = {};
  for (const [rawCol, normalizedField] of Object.entries(columnMap)) {
    const value = row[rawCol] ?? null;
    if (normalizedField && value !== undefined) {
      result[normalizedField] = value === '' ? null : value;
    }
  }
  return result;
}

// Normaliza un número que puede venir con coma o punto decimal
export function parseNumber(value: string | null | undefined): number | null {
  if (value == null || value === '') return null;
  const cleaned = value.toString().replace(/[^0-9.,%-]/g, '').replace(',', '.');
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
  // Intenta parsear directamente
  const d = new Date(value);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }
  // dd/mm/yyyy
  const ddmm = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmm) {
    const [, dd, mm, yyyy] = ddmm;
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
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

// Detecta tipo de reporte basado en columnas presentes
export function detectReportType(columns: string[]): string {
  const lower = columns.map((c) => c.toLowerCase());
  if (lower.some((c) => c.includes('episode') || c.includes('episodio'))) {
    if (lower.some((c) => c.includes('country') || c.includes('país'))) return 'episode_geographic';
    if (lower.some((c) => c.includes('source') || c.includes('fuente'))) return 'episode_sources';
    if (lower.some((c) => c.includes('age') || c.includes('edad') || c.includes('gender'))) return 'episode_audience';
    return 'episode_performance';
  }
  if (lower.some((c) => c.includes('followers') || c.includes('seguidores'))) return 'podcast_followers';
  if (lower.some((c) => c.includes('country') || c.includes('país'))) return 'podcast_geographic';
  if (lower.some((c) => c.includes('age') || c.includes('platform'))) return 'podcast_audience';
  return 'unknown';
}

// Construye el mapa columna_cruda → campo_normalizado para un set de cabeceras
export function buildColumnMap(headers: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const header of headers) {
    const detected = detectColumn(header);
    if (detected) map[header] = detected;
  }
  return map;
}

// Calcula un hash simple del contenido del archivo (para deduplicación)
export async function hashFileContent(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content.slice(0, 10000)); // hash de primeros 10k chars
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}
