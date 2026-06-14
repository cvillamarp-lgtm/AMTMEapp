// spotify-parser.ts — Parser de exportaciones de Spotify for Creators
// Soporta: CSV (rankings, performance, audience, streams), JSON
// ZIP y XLSX muestran error descriptivo (no soportados en browser sin dependencias extra)

export type SpotifyReportType =
  | 'episode-rankings'
  | 'podcast-performance'
  | 'audience'
  | 'streams-by-date'
  | 'individual-episode'
  | 'json-export'
  | 'unknown';

export interface SpotifyParsedRow {
  [key: string]: string | number | null;
}

export interface SpotifyParseResult {
  valid: boolean;
  reportType: SpotifyReportType;
  reportLabel: string;
  format: string;
  rowCount: number;
  periodStart: string | null;
  periodEnd: string | null;
  columns: string[];
  rows: SpotifyParsedRow[];
  error?: string;
}

// ─── Detección de tipo por nombre de archivo ───────────────────────────────

function detectReportTypeFromFilename(filename: string): SpotifyReportType {
  const name = filename.toLowerCase();
  if (
    name.includes('episoderankings') ||
    name.includes('episode_rankings') ||
    name.includes('rankingsdeepisodios')
  ) {
    return 'episode-rankings';
  }
  if (
    name.includes('podcastperformance') ||
    name.includes('podcast_performance') ||
    name.includes('rendimiento')
  ) {
    return 'podcast-performance';
  }
  if (name.includes('audience') || name.includes('audiencia') || name.includes('demografica')) {
    return 'audience';
  }
  if (name.includes('streams') && (name.includes('date') || name.includes('fecha'))) {
    return 'streams-by-date';
  }
  if (name.includes('.json')) {
    return 'json-export';
  }
  return 'unknown';
}

function reportTypeLabel(type: SpotifyReportType): string {
  switch (type) {
    case 'episode-rankings':
      return 'Ranking de episodios';
    case 'podcast-performance':
      return 'Rendimiento del podcast';
    case 'audience':
      return 'Audiencia y demografía';
    case 'streams-by-date':
      return 'Streams por fecha';
    case 'individual-episode':
      return 'Episodio individual';
    case 'json-export':
      return 'Exportación JSON';
    default:
      return 'Reporte general';
  }
}

// ─── Utilidades CSV ────────────────────────────────────────────────────────

function stripBOM(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function detectSeparator(firstLine: string): string {
  const counts = {
    ',': (firstLine.match(/,/g) || []).length,
    ';': (firstLine.match(/;/g) || []).length,
    '\t': (firstLine.match(/\t/g) || []).length,
  };
  if (counts[';'] > counts[','] && counts[';'] > counts['\t']) return ';';
  if (counts['\t'] > counts[',']) return '\t';
  return ',';
}

function parseCSVLine(line: string, sep: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === sep && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSVText(text: string): { headers: string[]; rows: SpotifyParsedRow[] } {
  const clean = stripBOM(text);
  const lines = clean.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  // Skip metadata/comment lines (lines starting with #, or that look like Spotify header metadata)
  let dataStart = 0;
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    if (
      lines[i].startsWith('#') ||
      lines[i].startsWith('Spotify') ||
      lines[i].startsWith('spotify')
    ) {
      dataStart = i + 1;
    }
  }

  const headerLine = lines[dataStart];
  if (!headerLine) return { headers: [], rows: [] };

  const sep = detectSeparator(headerLine);
  const headers = parseCSVLine(headerLine, sep).map((h) => h.replace(/^"+|"+$/g, '').trim());

  const rows: SpotifyParsedRow[] = [];
  for (let i = dataStart + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCSVLine(line, sep);
    const row: SpotifyParsedRow = {};
    headers.forEach((h, idx) => {
      const val = (values[idx] ?? '').replace(/^"+|"+$/g, '').trim();
      const num = parseFloat(
        val.replace(/[.,\s]/g, (m) => (m === ',' && val.includes('.') ? '' : m === '.' ? '.' : ''))
      );
      row[h] = val === '' ? null : isNaN(num) ? val : num;
    });
    rows.push(row);
  }

  return { headers, rows };
}

// ─── Detección de período desde filas ─────────────────────────────────────

function extractDateRange(
  rows: SpotifyParsedRow[],
  columns: string[]
): { start: string | null; end: string | null } {
  const dateColumns = columns.filter((c) =>
    /fecha|date|semana|week|mes|month|periodo|period/i.test(c)
  );
  if (dateColumns.length === 0) return { start: null, end: null };

  const col = dateColumns[0];
  const dates: Date[] = [];
  for (const row of rows) {
    const val = String(row[col] ?? '');
    // Common Spotify date formats: YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime())) {
      dates.push(parsed);
    }
  }
  if (dates.length === 0) return { start: null, end: null };
  dates.sort((a, b) => a.getTime() - b.getTime());
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { start: fmt(dates[0]), end: fmt(dates[dates.length - 1]) };
}

// ─── Parser principal ──────────────────────────────────────────────────────

export async function parseSpotifyFile(file: File): Promise<SpotifyParseResult> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const reportType = detectReportTypeFromFilename(file.name);

  // ZIP: no soportado en browser sin JSZip
  if (ext === 'zip') {
    return {
      valid: false,
      reportType: 'unknown',
      reportLabel: 'ZIP no soportado',
      format: 'ZIP',
      rowCount: 0,
      periodStart: null,
      periodEnd: null,
      columns: [],
      rows: [],
      error: 'Archivos ZIP no soportados. Descomprime y sube el CSV directamente.',
    };
  }

  // XLSX: no soportado sin librería adicional
  if (ext === 'xlsx' || ext === 'xls') {
    return {
      valid: false,
      reportType: 'unknown',
      reportLabel: 'Excel no soportado',
      format: 'XLSX',
      rowCount: 0,
      periodStart: null,
      periodEnd: null,
      columns: [],
      rows: [],
      error: 'Archivos Excel no soportados. Exporta como CSV desde Spotify for Creators.',
    };
  }

  // JSON
  if (ext === 'json') {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const arr = Array.isArray(parsed)
        ? parsed
        : (parsed.data ?? parsed.episodes ?? parsed.items ?? [parsed]);
      return {
        valid: true,
        reportType: 'json-export',
        reportLabel: 'Exportación JSON',
        format: 'JSON',
        rowCount: arr.length,
        periodStart: null,
        periodEnd: null,
        columns: arr.length > 0 ? Object.keys(arr[0]) : [],
        rows: arr as SpotifyParsedRow[],
      };
    } catch {
      return {
        valid: false,
        reportType: 'unknown',
        reportLabel: 'JSON inválido',
        format: 'JSON',
        rowCount: 0,
        periodStart: null,
        periodEnd: null,
        columns: [],
        rows: [],
        error: 'El archivo JSON no tiene un formato válido.',
      };
    }
  }

  // CSV (default)
  try {
    const text = await file.text();
    if (!text.trim()) {
      return {
        valid: false,
        reportType: 'unknown',
        reportLabel: 'Archivo vacío',
        format: 'CSV',
        rowCount: 0,
        periodStart: null,
        periodEnd: null,
        columns: [],
        rows: [],
        error: 'El archivo está vacío.',
      };
    }

    const { headers, rows } = parseCSVText(text);

    if (headers.length === 0) {
      return {
        valid: false,
        reportType: 'unknown',
        reportLabel: 'Sin encabezados',
        format: 'CSV',
        rowCount: 0,
        periodStart: null,
        periodEnd: null,
        columns: [],
        rows: [],
        error: 'No se detectaron encabezados válidos en el archivo CSV.',
      };
    }

    if (rows.length === 0) {
      return {
        valid: false,
        reportType: 'unknown',
        reportLabel: 'Sin datos',
        format: 'TEXT/CSV',
        rowCount: 0,
        periodStart: null,
        periodEnd: null,
        columns: headers,
        rows: [],
        error: 'El archivo solo tiene encabezados pero ninguna fila de datos.',
      };
    }

    const { start, end } = extractDateRange(rows, headers);
    const finalType = reportType !== 'unknown' ? reportType : detectReportTypeFromColumns(headers);

    return {
      valid: true,
      reportType: finalType,
      reportLabel: reportTypeLabel(finalType),
      format: 'TEXT/CSV',
      rowCount: rows.length,
      periodStart: start,
      periodEnd: end,
      columns: headers,
      rows,
    };
  } catch (e) {
    return {
      valid: false,
      reportType: 'unknown',
      reportLabel: 'Error de lectura',
      format: 'CSV',
      rowCount: 0,
      periodStart: null,
      periodEnd: null,
      columns: [],
      rows: [],
      error: e instanceof Error ? e.message : 'No se pudo procesar el archivo.',
    };
  }
}

// ─── Detección de tipo por columnas ───────────────────────────────────────

function detectReportTypeFromColumns(columns: string[]): SpotifyReportType {
  const cols = columns.map((c) => c.toLowerCase());
  const hasPosition = cols.some(
    (c) => c.includes('posicion') || c.includes('position') || c.includes('rank')
  );
  const hasDate = cols.some(
    (c) => c.includes('fecha') || c.includes('date') || c.includes('semana')
  );
  const hasCountry = cols.some(
    (c) => c.includes('pais') || c.includes('country') || c.includes('region')
  );
  const hasEpisode = cols.some((c) => c.includes('episodio') || c.includes('episode'));
  const hasStreams = cols.some(
    (c) => c.includes('streams') || c.includes('reproducciones') || c.includes('plays')
  );

  if (hasPosition && hasEpisode) return 'episode-rankings';
  if (hasDate && hasStreams && !hasEpisode) return 'streams-by-date';
  if (hasCountry) return 'audience';
  if (hasEpisode && hasStreams) return 'individual-episode';
  if (hasStreams) return 'podcast-performance';
  return 'unknown';
}
