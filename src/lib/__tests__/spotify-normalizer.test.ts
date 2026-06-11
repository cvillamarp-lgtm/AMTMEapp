import { describe, it, expect } from 'vitest';
import {
  detectSpotifyReportType,
  buildColumnMapForType,
  validateReportType,
  mapSpotifyRow,
  normalizeHeader,
} from '../spotify-normalizer';

describe('normalizeHeader', () => {
  it('quita acentos, espacios extra y normaliza mayúsculas', () => {
    expect(normalizeHeader('  Título  del Episodio ')).toBe('titulo del episodio');
    expect(normalizeHeader('Reproducciones y descargas')).toBe('reproducciones y descargas');
  });
});

describe('detectSpotifyReportType', () => {
  it('detecta episode_rankings', () => {
    const headers = [
      'Título del episodio',
      'Reproducciones y descargas',
      'Fecha de publicación',
      'Clasificación',
      'URI del episodio',
    ];
    expect(detectSpotifyReportType(headers)).toBe('episode_rankings');
  });

  it('detecta streams_downloads_timeseries', () => {
    const headers = ['Fecha', 'Reproducciones y descargas'];
    expect(detectSpotifyReportType(headers)).toBe('streams_downloads_timeseries');
  });

  it('detecta spotify_overview_timeseries', () => {
    const headers = ['Fecha', 'Escuchas', 'Horas de reproducción', 'Seguidores'];
    expect(detectSpotifyReportType(headers)).toBe('spotify_overview_timeseries');
  });

  it('detecta apps_distribution', () => {
    const headers = ['Aplicación', 'Porcentaje'];
    expect(detectSpotifyReportType(headers)).toBe('apps_distribution');
  });

  it('detecta geo_distribution', () => {
    const headers = ['Ubicación', 'Porcentaje'];
    expect(detectSpotifyReportType(headers)).toBe('geo_distribution');
  });

  it('detecta amtme_manual_metrics', () => {
    const headers = [
      'mes',
      'plataforma',
      'reproducciones',
      'alcance',
      'dms',
      'conversiones',
      'ingresos',
    ];
    expect(detectSpotifyReportType(headers)).toBe('amtme_manual_metrics');
  });

  it('devuelve unknown para encabezados no reconocidos', () => {
    const headers = ['columna a', 'columna b'];
    expect(detectSpotifyReportType(headers)).toBe('unknown');
  });
});

describe('buildColumnMapForType + validateReportType', () => {
  it('episode_rankings: válido cuando incluye todas las columnas', () => {
    const headers = [
      'Título del episodio',
      'Reproducciones y descargas',
      'Fecha de publicación',
      'Clasificación',
      'URI del episodio',
    ];
    const type = detectSpotifyReportType(headers);
    const columnMap = buildColumnMapForType(headers, type);
    const validation = validateReportType(type, columnMap);
    expect(validation.status).toBe('valid');
    expect(validation.missingRecommended).toEqual([]);
  });

  it('episode_rankings: parcialmente válido si faltan columnas recomendadas', () => {
    const headers = ['Título del episodio', 'Reproducciones y descargas', 'URI del episodio'];
    const type = detectSpotifyReportType(headers);
    const columnMap = buildColumnMapForType(headers, type);
    const validation = validateReportType(type, columnMap);
    expect(type).toBe('episode_rankings');
    expect(validation.status).toBe('partial');
    expect(validation.missingRecommended).toEqual(
      expect.arrayContaining(['publishedAt', 'ranking'])
    );
  });

  it('streams_downloads_timeseries: válido', () => {
    const headers = ['Fecha', 'Reproducciones y descargas'];
    const type = detectSpotifyReportType(headers);
    const columnMap = buildColumnMapForType(headers, type);
    const validation = validateReportType(type, columnMap);
    expect(validation.status).toBe('valid');
  });

  it('unknown: no compatible', () => {
    const headers = ['columna a', 'columna b'];
    const type = detectSpotifyReportType(headers);
    const columnMap = buildColumnMapForType(headers, type);
    const validation = validateReportType(type, columnMap);
    expect(validation.status).toBe('invalid');
  });
});

describe('mapSpotifyRow', () => {
  it('mapea fila de episode_rankings', () => {
    const headers = [
      'Título del episodio',
      'Reproducciones y descargas',
      'Fecha de publicación',
      'Clasificación',
      'URI del episodio',
    ];
    const type = detectSpotifyReportType(headers);
    const columnMap = buildColumnMapForType(headers, type);
    const row = {
      'Título del episodio': 'Ep. 29 — Sanando heridas',
      'Reproducciones y descargas': '1234',
      'Fecha de publicación': '12/5/2026',
      Clasificación: '3',
      'URI del episodio': 'spotify:episode:abc123',
    };
    const mapped = mapSpotifyRow(row, columnMap, type);
    expect(mapped).toMatchObject({
      type: 'episode_rankings',
      episodeTitle: 'Ep. 29 — Sanando heridas',
      episodeUri: 'spotify:episode:abc123',
      publishedAt: '2026-05-12',
      playsDownloads: 1234,
      ranking: 3,
    });
  });

  it('mapea fila de streams_downloads_timeseries', () => {
    const headers = ['Fecha', 'Reproducciones y descargas'];
    const type = detectSpotifyReportType(headers);
    const columnMap = buildColumnMapForType(headers, type);
    const row = { Fecha: '12/5/2026', 'Reproducciones y descargas': '500' };
    const mapped = mapSpotifyRow(row, columnMap, type);
    expect(mapped).toMatchObject({
      type: 'streams_downloads_timeseries',
      date: '2026-05-12',
      playsDownloads: 500,
    });
  });

  it('mapea fila de apps_distribution', () => {
    const headers = ['Aplicación', 'Porcentaje'];
    const type = detectSpotifyReportType(headers);
    const columnMap = buildColumnMapForType(headers, type);
    const row = { Aplicación: 'Spotify', Porcentaje: '85%' };
    const mapped = mapSpotifyRow(row, columnMap, type);
    expect(mapped).toMatchObject({
      type: 'apps_distribution',
      dimensionType: 'app',
      dimensionName: 'Spotify',
      percentage: 85,
    });
  });

  it('mapea fila de amtme_manual_metrics', () => {
    const headers = [
      'mes',
      'plataforma',
      'reproducciones',
      'alcance',
      'dms',
      'conversiones',
      'ingresos',
    ];
    const type = detectSpotifyReportType(headers);
    const columnMap = buildColumnMapForType(headers, type);
    const row = {
      mes: '2026-05',
      plataforma: 'Instagram',
      reproducciones: '1000',
      alcance: '5000',
      dms: '20',
      conversiones: '3',
      ingresos: '150',
    };
    const mapped = mapSpotifyRow(row, columnMap, type);
    expect(mapped).toMatchObject({
      type: 'amtme_manual_metrics',
      month: '2026-05',
      platform: 'Instagram',
      plays: 1000,
      reach: 5000,
      dms: 20,
      conversions: 3,
      revenue: 150,
    });
  });
});
