import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { normalizeTitle } from '@/lib/spotify-normalizer';
import type { SpotifyEpisodeMetric, Episode } from '@/types/database';

// Server-side Supabase con service role para operaciones batch
function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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
    detected_report_type: string;
    period_start: string | null;
    period_end: string | null;
    total_rows: number;
  };
  metrics: Omit<SpotifyEpisodeMetric, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'import_id' | 'episode_id'>[];
  userId: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ImportPayload;
    const { importRecord, metrics, userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

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
      return NextResponse.json({
        duplicate: true,
        message: 'Este archivo ya fue importado antes.',
        existingImportId: existingImports[0].id,
      }, { status: 409 });
    }

    // 2. Crear registro de importación con estado 'uploaded'
    const { data: importRow, error: importError } = await sb
      .from('spotify_metric_imports')
      .insert([{
        user_id: userId,
        payload: { ...importRecord, status: 'uploaded' },
      }])
      .select()
      .single();

    if (importError || !importRow) {
      return NextResponse.json({ error: 'Error al crear registro de importación' }, { status: 500 });
    }

    const importId = importRow.id;

    // 3. Obtener episodios existentes del usuario para matching
    const { data: episodesData } = await sb
      .from('episodes')
      .select('id, payload')
      .eq('user_id', userId);

    type EpisodeRow = { id: string; payload: Partial<Episode> };
    const episodes: EpisodeRow[] = (episodesData || []) as EpisodeRow[];

    // 4. Procesar métricas: deduplicar y mapear episodios
    let processedRows = 0;
    let failedRows = 0;
    let newEpisodesCreated = 0;
    let episodesUpdated = 0;
    const episodeCache: Record<string, string> = {}; // normalizedTitle → episodeId

    // Construir cache de episodios existentes
    for (const ep of episodes) {
      const title = ep.payload?.title ?? '';
      const normalized = normalizeTitle(title);
      if (normalized) episodeCache[normalized] = ep.id;
    }

    // Verificar duplicados por import_id + normalized_title + metric_date
    const metricsToInsert: object[] = [];
    const seenKeys = new Set<string>();

    for (const metric of metrics) {
      const key = `${metric.normalized_episode_title}|${metric.metric_date}|${metric.period_start}`;

      // Saltar duplicados dentro del mismo archivo
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);

      // Verificar duplicados en BD para este usuario
      const { data: existing } = await sb
        .from('spotify_episode_metrics')
        .select('id')
        .eq('user_id', userId)
        .eq('payload->>normalized_episode_title', metric.normalized_episode_title)
        .eq('payload->>metric_date', metric.metric_date || '')
        .limit(1);

      if (existing && existing.length > 0) {
        failedRows++;
        continue;
      }

      // Buscar episodio existente por título normalizado
      let episodeId = episodeCache[metric.normalized_episode_title] ?? null;

      // Si no existe, crear episodio importado
      if (!episodeId && metric.spotify_episode_title) {
        const { data: newEp } = await sb
          .from('episodes')
          .insert([{
            user_id: userId,
            payload: {
              title: metric.spotify_episode_title,
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
          }])
          .select()
          .single();

        if (newEp) {
          episodeId = newEp.id;
          episodeCache[metric.normalized_episode_title] = episodeId;
          newEpisodesCreated++;
        }
      } else if (episodeId) {
        episodesUpdated++;
      }

      metricsToInsert.push({
        user_id: userId,
        payload: { ...metric, import_id: importId, episode_id: episodeId },
      });
      processedRows++;
    }

    // 5. Insertar métricas en batch
    if (metricsToInsert.length > 0) {
      const { error: metricsError } = await sb
        .from('spotify_episode_metrics')
        .insert(metricsToInsert);

      if (metricsError) {
        await sb
          .from('spotify_metric_imports')
          .update({ payload: { ...importRecord, status: 'failed', import_id: importId } })
          .eq('id', importId);
        return NextResponse.json({ error: 'Error al guardar métricas' }, { status: 500 });
      }
    }

    // 6. Actualizar estado de importación a 'processed'
    await sb
      .from('spotify_metric_imports')
      .update({
        payload: {
          ...importRecord,
          status: 'processed',
          processed_rows: processedRows,
          failed_rows: failedRows,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', importId);

    return NextResponse.json({
      success: true,
      importId,
      summary: {
        totalRows: metrics.length,
        processedRows,
        duplicatesSkipped: failedRows,
        newEpisodesCreated,
        episodesUpdated,
        periodStart: importRecord.period_start,
        periodEnd: importRecord.period_end,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
