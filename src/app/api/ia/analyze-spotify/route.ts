import { NextRequest, NextResponse } from 'next/server';
import { generateWithProvider } from '@/lib/ai-providers';
import { buildSpotifyAnalysisPrompt, type SpotifyAnalysisInput } from '@/prompts/amtme-editorial';
import type { PodcastStrategySnapshot } from '@/types/database';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as SpotifyAnalysisInput;

    if (!body.metrics || body.metrics.length === 0) {
      return NextResponse.json({ error: 'Sin métricas para analizar' }, { status: 400 });
    }

    const prompt = buildSpotifyAnalysisPrompt(body);
    const raw = await generateWithProvider({
      provider: 'groq',
      prompt,
      systemPrompt: 'Eres un estratega de podcasts. Devuelve únicamente JSON válido sin markdown.',
    });

    let analysis: PodcastStrategySnapshot['recommended_actions'] & {
      executiveSummary?: string;
      keyFindings?: string[];
      growthSignals?: string[];
      riskSignals?: string[];
      bestPerformingEpisodes?: string[];
      underperformingEpisodes?: string[];
      titleInsights?: string[];
      audienceInsights?: string[];
      distributionInsights?: string[];
      contentStrategyUpdates?: string[];
    };

    try {
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: 'IA devolvió formato inválido', raw }, { status: 422 });
    }

    const snapshot = {
      import_id: null,
      period_start: body.periodStart,
      period_end: body.periodEnd,
      summary: analysis.executiveSummary ?? '',
      key_findings: analysis.keyFindings ?? [],
      growth_signals: analysis.growthSignals ?? [],
      risk_signals: analysis.riskSignals ?? [],
      best_performing_episodes: analysis.bestPerformingEpisodes ?? [],
      underperforming_episodes: analysis.underperformingEpisodes ?? [],
      title_insights: analysis.titleInsights ?? [],
      audience_insights: analysis.audienceInsights ?? [],
      distribution_insights: analysis.distributionInsights ?? [],
      recommended_actions: {
        immediate: analysis.immediate ?? [],
        next7Days: analysis.next7Days ?? [],
        next30Days: analysis.next30Days ?? [],
      },
      content_strategy_updates: analysis.contentStrategyUpdates ?? [],
      generated_by: 'ai' as const,
    };

    return NextResponse.json({ success: true, snapshot });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
