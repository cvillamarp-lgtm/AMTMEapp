'use client';

import { useState, useMemo } from 'react';
import { useStudio } from '@/components/studio-provider';
import type { SearchResult, SearchResultCategory } from '@/lib/search-types';

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(/[\s\-_/\\]+/)
    .filter((t) => t.length > 0);
}

export function useGlobalSearch() {
  const { state } = useStudio();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchResultCategory | 'all'>('all');

  const allResults = useMemo(() => {
    const results: SearchResult[] = [];

    // 1. Episodios
    state.episodes.forEach((ep) => {
      const keywords = [
        ...tokenize(ep.title),
        ...tokenize(ep.theme),
        ...tokenize(ep.pillar || ''),
        ...tokenize(ep.emotionalWound),
        `ep-${ep.episodeNumber}`,
        `episodio-${ep.episodeNumber}`,
      ];
      results.push({
        id: ep.id,
        title: `Ep ${ep.episodeNumber}: ${ep.title}`,
        subtitle: ep.status,
        category: 'episodios',
        href: '/episodios',
        source: 'studio-state',
        priority: ep.status === 'Publicado' ? 'high' : 'medium',
        keywords,
        status: ep.status,
      });
    });

    // 2. Contenido
    state.contentPieces.forEach((cp) => {
      const keywords = [
        ...tokenize(cp.theme),
        ...tokenize(cp.emotion),
        ...tokenize(cp.channel),
        ...tokenize(cp.format),
        ...tokenize(cp.hook),
      ];
      results.push({
        id: cp.id,
        title: `${cp.channel}: ${cp.theme}`,
        subtitle: cp.status,
        category: 'contenido',
        href: '/contenido',
        source: 'studio-state',
        priority: cp.status === 'Publicado' ? 'high' : 'medium',
        keywords,
        status: cp.status,
      });
    });

    // 3. Activos visuales
    state.visualAssets.forEach((va) => {
      const keywords = [...tokenize(va.title), ...tokenize(va.type), ...tokenize(va.palette)];
      results.push({
        id: va.id,
        title: va.title,
        subtitle: `${va.type} · ${va.format}`,
        category: 'activos-visuales',
        href: '/creador-visual',
        source: 'studio-state',
        priority: va.status === 'Listo' ? 'high' : 'medium',
        keywords,
        status: va.status,
      });
    });

    // 4. Checklists
    state.checklists.forEach((cl) => {
      const allItemsText = cl.items.map((i) => i.item).join(' ');
      const keywords = [...tokenize(cl.name), ...tokenize(cl.area), ...tokenize(allItemsText)];
      results.push({
        id: cl.id,
        title: cl.name,
        subtitle: cl.status,
        category: 'checklists',
        href: '/checklists',
        source: 'studio-state',
        priority: cl.status === 'Pendiente' ? 'high' : 'medium',
        keywords,
        status: cl.status,
      });
    });

    // 5. Calendario
    state.calendarEvents.forEach((ce) => {
      const keywords = [
        ...tokenize(ce.title),
        ...tokenize(ce.type),
        ...tokenize(ce.channel),
        ce.date,
      ];
      results.push({
        id: ce.id,
        title: ce.title,
        subtitle: `${ce.channel} · ${ce.date}`,
        category: 'calendario',
        href: '/calendario',
        source: 'studio-state',
        priority: ce.status === 'Listo' ? 'high' : 'medium',
        keywords,
        status: ce.status,
      });
    });

    // 6. Métricas mensuales
    state.metricsMonthly.forEach((mm) => {
      const keywords = [
        ...tokenize(mm.month),
        ...tokenize(mm.platform),
        ...tokenize(mm.insight),
      ];
      results.push({
        id: mm.id,
        title: `${mm.platform} · ${mm.month}`,
        subtitle: `Reach: ${mm.reach} · Plays: ${mm.plays}`,
        category: 'metricas',
        href: '/metricas',
        source: 'studio-state',
        priority: 'medium',
        keywords,
      });
    });

    // 7. Métricas por episodio
    state.metricsEpisode.forEach((me) => {
      const episode = state.episodes.find((ep) => ep.id === me.episodeId);
      if (episode) {
        const keywords = [
          ...tokenize(episode.title),
          `ep-${episode.episodeNumber}`,
          ...tokenize(me.insight || ''),
        ];
        results.push({
          id: me.id,
          title: `Métricas: Ep ${episode.episodeNumber}`,
          subtitle: `Plays 7d: ${me.plays7d} · Retention: ${me.retention}%`,
          category: 'metricas',
          href: '/metricas',
          source: 'studio-state',
          priority: me.plays7d > 3000 ? 'high' : 'medium',
          keywords,
        });
      }
    });

    // 8. Monetización
    state.monetizationLeads.forEach((ml) => {
      const keywords = [
        ...tokenize(ml.source),
        ...tokenize(ml.name),
        ...tokenize(ml.status),
      ];
      results.push({
        id: ml.id,
        title: ml.name,
        subtitle: `${ml.status} · $${ml.revenue}`,
        category: 'monetizacion',
        href: '/monetizacion',
        source: 'studio-state',
        priority: ml.status === 'Conversación iniciada' ? 'high' : 'medium',
        keywords,
        status: ml.status,
      });
    });

    // 9. Automatización
    state.automationRules.forEach((ar) => {
      const keywords = [
        ...tokenize(ar.name),
        ...tokenize(ar.objective),
        ...tokenize(ar.trigger),
      ];
      results.push({
        id: ar.id,
        title: ar.name,
        subtitle: ar.objective,
        category: 'automatizacion',
        href: '/automatizacion',
        source: 'studio-state',
        priority: 'medium',
        keywords,
        status: ar.status,
      });
    });

    // 10. Archivo
    state.archiveItems.forEach((ai) => {
      const keywords = [
        ...tokenize(ai.name),
        ...tokenize(ai.type),
        ...tokenize(ai.origin),
      ];
      results.push({
        id: ai.id,
        title: ai.name,
        subtitle: `${ai.type} · ${ai.origin}`,
        category: 'archivo',
        href: '/historico',
        source: 'studio-state',
        priority: 'low',
        keywords,
        status: ai.status,
      });
    });

    // 11. Documento maestro
    state.masterSections.forEach((ms) => {
      const keywords = [...tokenize(ms.title), ...tokenize(ms.content)];
      results.push({
        id: ms.id,
        title: ms.title,
        subtitle: ms.status,
        category: 'documento-maestro',
        href: '/documento-maestro',
        source: 'studio-state',
        priority: ms.status === 'Requiere decisión' ? 'high' : 'medium',
        keywords,
        status: ms.status,
      });
    });

    // 12. Historial IA
    state.aiHistory.slice(0, 5).forEach((ah) => {
      const keywords = [
        ...tokenize(ah.engine),
        ...tokenize(ah.promptSummary),
        ah.provider,
      ];
      results.push({
        id: ah.id,
        title: ah.engine,
        subtitle: ah.promptSummary,
        category: 'ia',
        href: '/ia',
        source: 'studio-state',
        priority: 'low',
        keywords,
      });
    });

    return results;
  }, [state]);

  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      // Sin query: mostrar prioritarios recientes, max 10
      return allResults
        .filter((r) => activeCategory === 'all' || r.category === activeCategory)
        .filter((r) => r.priority === 'high' || r.priority === 'medium')
        .slice(0, 10);
    }

    const queryTokens = tokenize(query);
    const scored = allResults
      .filter((r) => activeCategory === 'all' || r.category === activeCategory)
      .map((result) => {
        let score = 0;

        // Exact match en title
        if (normalizeText(result.title).includes(normalizeText(query))) {
          score += 1000;
        }

        // Prefix match en keywords
        queryTokens.forEach((token) => {
          if (result.keywords.some((k) => k.startsWith(token))) {
            score += 500;
          }
          // Contains match en keywords
          if (result.keywords.some((k) => k.includes(token))) {
            score += 100;
          }
        });

        // Priority boost
        if (result.priority === 'high') score += 50;
        if (result.priority === 'medium') score += 25;

        return { result, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .map((item) => item.result);

    return scored;
  }, [query, activeCategory, allResults]);

  const categories: SearchResultCategory[] = [
    'episodios',
    'contenido',
    'checklists',
    'metricas',
    'calendario',
    'activos-visuales',
    'monetizacion',
    'automatizacion',
    'archivo',
    'documento-maestro',
    'ia',
    'siguiente-accion',
  ];

  return {
    query,
    setQuery,
    results: filteredResults,
    allResults,
    activeCategory,
    setActiveCategory,
    categories,
    totalResults: filteredResults.length,
    clearSearch: () => setQuery(''),
  };
}
