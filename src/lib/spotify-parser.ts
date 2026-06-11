'use client';

import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import {
  buildColumnMapForType,
  detectPeriodForRows,
  detectSpotifyReportType,
  hashFileContent,
  mapSpotifyRow,
  validateReportType,
  type NormalizedSpotifyRow,
  type SpotifyReportType,
  type ValidationStatus,
} from './spotify-normalizer';

export interface ParsedSpotifyFile {
  fileName: string;
  fileType: string;
  fileSize: number;
  fileHash: string;
  headers: string[];
  columnMap: Record<string, string>;
  reportType: SpotifyReportType;
  validationStatus: ValidationStatus;
  validationMessage: string;
  missingRecommended: string[];
  totalRows: number;
  previewRows: Record<string, string>[];
  periodStart: string | null;
  periodEnd: string | null;
  rows: NormalizedSpotifyRow[];
}

async function parseCSVContent(
  content: string
): Promise<{ headers: string[]; rows: Record<string, string>[] }> {
  return new Promise((resolve) => {
    Papa.parse<Record<string, string>>(content, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const headers = result.meta.fields || [];
        resolve({ headers, rows: result.data });
      },
    });
  });
}

function parseXLSXBuffer(buffer: ArrayBuffer): {
  headers: string[];
  rows: Record<string, string>[];
} {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
  if (raw.length === 0) return { headers: [], rows: [] };
  const headers = Object.keys(raw[0]);
  const rows = raw.map((r) =>
    Object.fromEntries(Object.entries(r).map(([k, v]) => [k, String(v ?? '')]))
  );
  return { headers, rows };
}

export async function parseSpotifyFile(file: File): Promise<ParsedSpotifyFile> {
  const warnings: string[] = [];
  const name = file.name.toLowerCase();

  let headers: string[] = [];
  let rows: Record<string, string>[] = [];

  if (name.endsWith('.csv')) {
    const text = await file.text();
    const parsed = await parseCSVContent(text);
    headers = parsed.headers;
    rows = parsed.rows;
  } else if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    const buffer = await file.arrayBuffer();
    const parsed = parseXLSXBuffer(buffer);
    headers = parsed.headers;
    rows = parsed.rows;
  } else if (name.endsWith('.json')) {
    const text = await file.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      warnings.push('Archivo JSON no válido');
      data = [];
    }
    if (Array.isArray(data) && data.length > 0) {
      headers = Object.keys(data[0] as object);
      rows = (data as Record<string, unknown>[]).map((r) =>
        Object.fromEntries(Object.entries(r).map(([k, v]) => [k, String(v ?? '')]))
      );
    } else {
      warnings.push('JSON vacío o formato no reconocido');
    }
  } else if (name.endsWith('.zip')) {
    const buffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(buffer);
    const csvFile = Object.values(zip.files).find((f) => f.name.endsWith('.csv'));
    if (csvFile) {
      const text = await csvFile.async('text');
      const parsed = await parseCSVContent(text);
      headers = parsed.headers;
      rows = parsed.rows;
    } else {
      warnings.push('No se encontró archivo CSV dentro del ZIP');
    }
  }

  const reportType = detectSpotifyReportType(headers);
  const columnMap = buildColumnMapForType(headers, reportType);
  const validation = validateReportType(reportType, columnMap);

  const normalizedRows = rows
    .map((row) => mapSpotifyRow(row, columnMap, reportType))
    .filter((r): r is NormalizedSpotifyRow => r !== null);

  const period = detectPeriodForRows(normalizedRows);

  // Hash para deduplicación
  const sampleText =
    headers.join(',') +
    rows
      .slice(0, 5)
      .map((r) => Object.values(r).join(','))
      .join('\n');
  const fileHash = await hashFileContent(sampleText);

  return {
    fileName: file.name,
    fileType: file.type || name.split('.').pop() || 'unknown',
    fileSize: file.size,
    fileHash,
    headers,
    columnMap,
    reportType,
    validationStatus: validation.status,
    validationMessage: validation.message,
    missingRecommended: validation.missingRecommended,
    totalRows: rows.length,
    previewRows: rows.slice(0, 10),
    periodStart: period.start,
    periodEnd: period.end,
    rows: normalizedRows,
  };
}
