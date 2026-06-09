'use client';

import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import {
  buildColumnMap,
  detectReportType,
  hashFileContent,
  mapRowToNormalized,
  normalizeTitle,
  parseDate,
  parseNumber,
  parsePercent,
} from './spotify-normalizer';
import type { SpotifyEpisodeMetric } from '@/types/database';

export interface ParsedSpotifyFile {
  fileName: string;
  fileType: string;
  fileSize: number;
  fileHash: string;
  headers: string[];
  columnMap: Record<string, string>;
  detectedReportType: string;
  totalRows: number;
  previewRows: Record<string, string>[];
  periodStart: string | null;
  periodEnd: string | null;
  normalizedMetrics: Omit<SpotifyEpisodeMetric, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'import_id' | 'episode_id'>[];
  warnings: string[];
}

async function parseCSVContent(content: string): Promise<{ headers: string[]; rows: Record<string, string>[] }> {
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

function parseXLSXBuffer(buffer: ArrayBuffer): { headers: string[]; rows: Record<string, string>[] } {
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

function rowsToMetrics(
  rows: Record<string, string>[],
  columnMap: Record<string, string>
): Omit<SpotifyEpisodeMetric, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'import_id' | 'episode_id'>[] {
  return rows.map((row) => {
    const normalized = mapRowToNormalized(row, columnMap);
    const title = (normalized.episodeTitle || '').trim();
    return {
      spotify_episode_title: title,
      normalized_episode_title: normalizeTitle(title),
      metric_date: parseDate(normalized.date ?? normalized.periodStart),
      period_start: parseDate(normalized.periodStart ?? normalized.date),
      period_end: parseDate(normalized.periodEnd),
      plays: parseNumber(normalized.plays),
      streams: parseNumber(normalized.streams ?? normalized.plays),
      starts: parseNumber(normalized.starts),
      listeners: parseNumber(normalized.listeners),
      followers_gained: parseNumber(normalized.followers),
      completion_rate: parsePercent(normalized.completionRate),
      average_consumption: parsePercent(normalized.completionRate),
      minutes_listened: parseNumber(normalized.minutesListened),
      impressions: parseNumber(normalized.impressions),
      clicks: parseNumber(normalized.clicks),
      country: normalized.country || null,
      city: normalized.city || null,
      age_range: normalized.ageRange || null,
      gender: normalized.gender || null,
      platform: normalized.platform || null,
      traffic_source: normalized.trafficSource || null,
      raw_row: row as Record<string, unknown>,
    };
  });
}

function detectPeriod(
  rows: Record<string, string>[],
  columnMap: Record<string, string>
): { start: string | null; end: string | null } {
  const dates: string[] = [];
  for (const row of rows) {
    const normalized = mapRowToNormalized(row, columnMap);
    const d = parseDate(normalized.date ?? normalized.periodStart);
    if (d) dates.push(d);
  }
  if (dates.length === 0) return { start: null, end: null };
  dates.sort();
  return { start: dates[0], end: dates[dates.length - 1] };
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

  const columnMap = buildColumnMap(headers);
  const detectedReportType = detectReportType(headers);

  if (!columnMap.episodeTitle && !columnMap.date) {
    warnings.push('No se detectaron columnas de episodio ni fecha — el archivo puede no ser compatible');
  }

  const period = detectPeriod(rows, columnMap);
  const normalizedMetrics = rowsToMetrics(rows, columnMap);

  // Hash para deduplicación
  const sampleText = headers.join(',') + rows.slice(0, 5).map((r) => Object.values(r).join(',')).join('\n');
  const fileHash = await hashFileContent(sampleText);

  return {
    fileName: file.name,
    fileType: file.type || name.split('.').pop() || 'unknown',
    fileSize: file.size,
    fileHash,
    headers,
    columnMap,
    detectedReportType,
    totalRows: rows.length,
    previewRows: rows.slice(0, 10),
    periodStart: period.start,
    periodEnd: period.end,
    normalizedMetrics,
    warnings,
  };
}
