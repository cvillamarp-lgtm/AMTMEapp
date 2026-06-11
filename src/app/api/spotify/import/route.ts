import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { normalizeTitle } from '@/lib/spotify-normalizer';
import type { NormalizedSpotifyRow, SpotifyReportType } from '@/lib/spotify-normalizer';
import type { Episode } from '@/types/database';

// Server-side Supabase con service role para operaciones batch
function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

type ImportPayload = {
  importRecord: {
    file_name: string;
    file_type: string;
    file_size: number;
    file_hash: string;
    uploaded_at: string;
    detected_report_type: SpotifyReportType;
    period_start: string | null;
    period_end: string | null;
    total_rows: number;
  };
  rows: NormalizedSpotifyRow[];
  userId: string;
};

// Resolve operational owner based on auth context
function resolveOperationalOwner(userId: string | null | undefined): string {
  // If userId provided (auth-required mode), use it
  if (userId) return userId;
  // If no userId (auth-disabled mode), use public owner
  return 'public';
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ImportPayload;
    const { importRecord, rows, userId } = body;

    // Resolve owner: explicit userId or 'public' if auth-disabled
    const owner = resolveOperationalOwner(userId);

    const sb = getServerClient();
    if (!sb) {
      return NextResponse.json({ error: 'Supabase no configurado' }, { status: 500 });
    }

    // 1. Verificar duplicado por file_hash
    const { data: existingImports } = await sb
      .from('spotify_metric_imports')
      .select('id')
      .eq('user_id', userId)
      .eq('payload->>file_hash', importRecord.file_hash);

    if (existingImports && existingImports.length > 0) {
      return NextResponse.json(
        {
          duplicate: true,
          message: 'Este archivo ya fue importado antes.',
          existingImportId: existingImports[0].id,
        },
        { status: 409 }
      );
    }

    // 2. Crear registro de importación con estado 'uploaded'
    const { data: importRow, error: importError } = await sb
      .from('spotify_metric_imports')
      .insert([
        {
          owner_id: 'public',
          workspace_key: 'primary',
          payload: { ...importRecord, status: 'uploaded' },
        },
      ])
      .select()
      .single();

    if (importError || !importRow) {
      return NextResponse.json(
        { error: 'Error al crear registro de importación' },
        { status: 500 }
      );
    }

    const importId = importRow.id;
    const importedAt = new Date().toISOString();
    const sourceFileName = importRecord.file_name;

    let processedRows = 0;
    let failedRows = 0;
    let newEpisodesCreated = 0;
    let episodesUpdated = 0;

    try {
      switch (importRecord.detected_report_type) {
        case 'episode_rankings': {
          const result = await importEpisodeRankings(
            sb,
            owner,
            importId,
            sourceFileName,
            importedAt,
            rows
          );
          processedRows = result.processedRows;
          failedRows = result.failedRows;
          newEpisodesCreated = result.newEpisodesCreated;
          episodesUpdated = result.episodesUpdated;
          break;
        }
        case 'streams_downloads_timeseries':
        case 'spotify_overview_timeseries': {
          const result = await importDailyMetrics(
            sb,
            owner,
            importId,
            sourceFileName,
            importedAt,
            rows
          );
          processedRows = result.processedRows;
          failedRows = result.failedRows;
          break;
        }
        case 'apps_distribution':
        case 'geo_distribution': {
          const result = await importDistributionMetrics(
            sb,
            owner,
            importId,
            sourceFileName,
            importedAt,
            rows
          );
          processedRows = result.processedRows;
          failedRows = result.failedRows;
          break;
        }
        case 'amtme_manual_metrics': {
          const result = await importManualMetrics(
            sb,
            owner,
            importId,
            sourceFileName,
            importedAt,
            rows
          );
          processedRows = result.processedRows;
          failedRows = result.failedRows;
          break;
        }
        default: {
          await sb
            .from('spotify_metric_imports')
            .update({ payload: { ...importRecord, status: 'failed' }, updated_at: importedAt })
            .eq('id', importId);
          return NextResponse.json({ error: 'Tipo de reporte no compatible' }, { status: 400 });
        }
      }
    } catch {
      await sb
        .from('spotify_metric_imports')
        .update({ payload: { ...importRecord, status: 'failed' }, updated_at: importedAt })
        .eq('id', importId);
      return NextResponse.json({ error: 'Error al guardar métricas' }, { status: 500 });
    }

    // Actualizar estado de importación a 'processed'
    await sb
      .from('spotify_metric_imports')
      .update({
        payload: {
          ...importRecord,
          status: 'processed',
          processed_rows: processedRows,
          failed_rows: failedRows,
        },
        updated_at: importedAt,
      })
      .eq('id', importId);

    return NextResponse.json({
      success: true,
      importId,
      summary: {
        totalRows: rows.length,
        processedRows,
        duplicatesSkipped: failedRows,
        newEpisodesCreated,
        episodesUpdated,
        periodStart: importRecord.period_start,
        periodEnd: importRecord.period_end,
        reportType: importRecord.detected_report_type,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClientAny = any;

async function importEpisodeRankings(
  sb: SupabaseClientAny,
  owner: string,
  importId: string,
  sourceFileName: string,
  importedAt: string,
  rows: NormalizedSpotifyRow[]
): Promise<{
  processedRows: number;
  failedRows: number;
  newEpisodesCreated: number;
  episodesUpdated: number;
}> {
  let processedRows = 0;
  let failedRows = 0;
  let newEpisodesCreated = 0;
  let episodesUpdated = 0;

  // Obtener episodios existentes del usuario para matching
  const { data: episodesData } = await sb
    .from('episodes')
    .select('id, payload')
    .eq('owner_id', owner);

  type EpisodeRow = { id: string; payload: Partial<Episode> };
  const episodes: EpisodeRow[] = (episodesData || []) as EpisodeRow[];

  const episodeCache: Record<string, string> = {};
  for (const ep of episodes) {
    const title = ep.payload?.title ?? '';
    const normalized = normalizeTitle(title);
    if (normalized) episodeCache[normalized] = ep.id;
  }

  const seenKeys = new Set<string>();
  const metricsToInsert: object[] = [];

  for (const row of rows) {
    if (row.type !== 'episode_rankings') continue;
    if (!row.episodeTitle) {
      failedRows++;
      continue;
    }

    const key = `${row.normalizedEpisodeTitle}|${row.publishedAt}`;
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);

    // Verificar duplicados en BD
    const { data: existing } = await sb
      .from('spotify_episode_metrics')
      .select('id')
      .eq('owner_id', 'public')
      .eq('payload->>normalized_episode_title', row.normalizedEpisodeTitle)
      .eq('payload->>metric_date', row.publishedAt || '')
      .limit(1);

    if (existing && existing.length > 0) {
      failedRows++;
      continue;
    }

    // Buscar/crear episodio
    let episodeId = episodeCache[row.normalizedEpisodeTitle] ?? null;
    if (!episodeId) {
      const { data: newEp } = await sb
        .from('episodes')
        .insert([
          {
            owner_id: owner,
            workspace_key: 'primary',
            payload: {
              title: row.episodeTitle,
              episode_number: '',
              theme: 'Importado desde Spotify',
              emotional_wound: '',
              central_symbol: '',
              status: 'medido',
              script: null,
              hooks: null,
              next_action: null,
              original_title: null,
              ai_optimized_title: null,
              title_optimization_status: null,
              title_optimized_at: null,
              title_optimization_source: null,
              narrative_structure: null,
            },
          },
        ])
        .select()
        .single();

      if (newEp) {
        episodeId = newEp.id;
        episodeCache[row.normalizedEpisodeTitle] = episodeId;
        newEpisodesCreated++;
      }
    } else {
      episodesUpdated++;
    }

    metricsToInsert.push({
      owner_id: 'public',
      workspace_key: 'primary',
      payload: {
        import_id: importId,
        episode_id: episodeId,
        spotify_episode_title: row.episodeTitle,
        normalized_episode_title: row.normalizedEpisodeTitle,
        metric_date: row.publishedAt,
        period_start: row.publishedAt,
        period_end: row.publishedAt,
        plays: row.playsDownloads,
        streams: row.playsDownloads,
        starts: null,
        listeners: null,
        followers_gained: null,
        completion_rate: null,
        average_consumption: null,
        minutes_listened: null,
        impressions: null,
        clicks: null,
        country: null,
        city: null,
        age_range: null,
        gender: null,
        platform: 'spotify',
        traffic_source: null,
        raw_row: null,
        episode_title: row.episodeTitle,
        episode_uri: row.episodeUri,
        published_at: row.publishedAt,
        plays_downloads: row.playsDownloads,
        ranking: row.ranking,
        source_file_name: sourceFileName,
        imported_at: importedAt,
      },
    });
    processedRows++;
  }

  if (metricsToInsert.length > 0) {
    const { error } = await sb.from('spotify_episode_metrics').insert(metricsToInsert);
    if (error) throw error;
  }

  return { processedRows, failedRows, newEpisodesCreated, episodesUpdated };
}

async function importDailyMetrics(
  sb: SupabaseClientAny,
  owner: string,
  importId: string,
  sourceFileName: string,
  importedAt: string,
  rows: NormalizedSpotifyRow[]
): Promise<{ processedRows: number; failedRows: number }> {
  let processedRows = 0;
  let failedRows = 0;

  for (const row of rows) {
    if (row.type !== 'streams_downloads_timeseries' && row.type !== 'spotify_overview_timeseries')
      continue;
    if (!row.date) {
      failedRows++;
      continue;
    }

    const { data: existing } = await sb
      .from('spotify_daily_metrics')
      .select('id, payload')
      .eq('owner_id', owner)
      .eq('payload->>date', row.date)
      .limit(1);

    const newPayload = {
      import_id: importId,
      date: row.date,
      plays_downloads: row.playsDownloads,
      listens: row.listens,
      listening_hours: row.listeningHours,
      followers: row.followers,
      source_file_name: sourceFileName,
      imported_at: importedAt,
    };

    if (existing && existing.length > 0) {
      const current = existing[0].payload || {};
      const merged = {
        ...current,
        ...Object.fromEntries(
          Object.entries(newPayload).filter(([, v]) => v !== null && v !== undefined)
        ),
      };
      const { error } = await sb
        .from('spotify_daily_metrics')
        .update({ payload: merged, updated_at: importedAt })
        .eq('id', existing[0].id);
      if (error) throw error;
    } else {
      const { error } = await sb
        .from('spotify_daily_metrics')
        .insert([{ owner_id: owner, workspace_key: 'primary', payload: newPayload }]);
      if (error) throw error;
    }
    processedRows++;
  }

  return { processedRows, failedRows };
}

async function importDistributionMetrics(
  sb: SupabaseClientAny,
  owner: string,
  importId: string,
  sourceFileName: string,
  importedAt: string,
  rows: NormalizedSpotifyRow[]
): Promise<{ processedRows: number; failedRows: number }> {
  let processedRows = 0;
  let failedRows = 0;

  for (const row of rows) {
    if (row.type !== 'apps_distribution' && row.type !== 'geo_distribution') continue;
    if (!row.dimensionName) {
      failedRows++;
      continue;
    }

    const { data: existing } = await sb
      .from('spotify_distribution_metrics')
      .select('id')
      .eq('owner_id', owner)
      .eq('payload->>dimension_type', row.dimensionType)
      .eq('payload->>dimension_name', row.dimensionName)
      .limit(1);

    const newPayload = {
      import_id: importId,
      dimension_type: row.dimensionType,
      dimension_name: row.dimensionName,
      percentage: row.percentage,
      source_file_name: sourceFileName,
      imported_at: importedAt,
    };

    if (existing && existing.length > 0) {
      const { error } = await sb
        .from('spotify_distribution_metrics')
        .update({ payload: newPayload, updated_at: importedAt })
        .eq('id', existing[0].id);
      if (error) throw error;
    } else {
      const { error } = await sb
        .from('spotify_distribution_metrics')
        .insert([{ owner_id: owner, workspace_key: 'primary', payload: newPayload }]);
      if (error) throw error;
    }
    processedRows++;
  }

  return { processedRows, failedRows };
}

async function importManualMetrics(
  sb: SupabaseClientAny,
  owner: string,
  importId: string,
  sourceFileName: string,
  importedAt: string,
  rows: NormalizedSpotifyRow[]
): Promise<{ processedRows: number; failedRows: number }> {
  let processedRows = 0;
  let failedRows = 0;

  for (const row of rows) {
    if (row.type !== 'amtme_manual_metrics') continue;
    if (!row.month || !row.platform) {
      failedRows++;
      continue;
    }

    const { data: existing } = await sb
      .from('amtme_manual_metrics')
      .select('id')
      .eq('owner_id', owner)
      .eq('payload->>month', row.month)
      .eq('payload->>platform', row.platform)
      .limit(1);

    const newPayload = {
      import_id: importId,
      month: row.month,
      platform: row.platform,
      plays: row.plays,
      reach: row.reach,
      dms: row.dms,
      conversions: row.conversions,
      revenue: row.revenue,
      source_file_name: sourceFileName,
      imported_at: importedAt,
    };

    if (existing && existing.length > 0) {
      const { error } = await sb
        .from('amtme_manual_metrics')
        .update({ payload: newPayload, updated_at: importedAt })
        .eq('id', existing[0].id);
      if (error) throw error;
    } else {
      const { error } = await sb
        .from('amtme_manual_metrics')
        .insert([{ owner_id: owner, workspace_key: 'primary', payload: newPayload }]);
      if (error) throw error;
    }
    processedRows++;
  }

  return { processedRows, failedRows };
}
