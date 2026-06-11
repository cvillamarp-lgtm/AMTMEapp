'use client';

import { useMemo } from 'react';
import type { NextBestAction, NextBestActionSeverity } from '@/lib/studio-types';
import { useStudio } from '@/components/studio-provider';

function generateId(prefix: string, index: number): string {
  return `${prefix}-${Date.now()}-${index}`;
}

function sortBySeverity(actions: NextBestAction[]): NextBestAction[] {
  const severityOrder: Record<NextBestActionSeverity, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };
  return [...actions].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}

export function useNextBestActions(): NextBestAction[] {
  const { state } = useStudio();

  return useMemo(() => {
    const actions: NextBestAction[] = [];

    if (!state.config.nextBestActionsEnabled) {
      return [];
    }

    // Rule 1: Episodio sin guion
    for (let i = 0; i < state.episodes.length; i++) {
      const ep = state.episodes[i];
      if (
        (ep.status === 'En investigación' || ep.status === 'Idea') &&
        (!ep.script || ep.script.trim() === '')
      ) {
        actions.push({
          id: generateId('nba-no-script', i),
          title: `Episodio ${ep.episodeNumber}: crear guion`,
          detail: `"${ep.title}" necesita estructura narrativa y guion.`,
          severity: 'high',
          category: 'contenido',
          sourceType: 'episode',
          sourceId: ep.id,
          href: `/episodios/${ep.id}`,
          reason: 'Episodio requiere avance de guion',
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
      }
    }

    // Rule 2: Episodio publicado sin clips
    for (let i = 0; i < state.episodes.length; i++) {
      const ep = state.episodes[i];
      if (ep.status === 'Publicado') {
        const derivedContent = state.contentPieces.filter((cp) => cp.episodeId === ep.id);
        if (derivedContent.length === 0) {
          actions.push({
            id: generateId('nba-no-clips', i),
            title: `Episodio ${ep.episodeNumber}: extraer clips`,
            detail: `"${ep.title}" fue publicado pero no tiene reels/contenido derivado.`,
            severity: 'high',
            category: 'distribucion',
            sourceType: 'episode',
            sourceId: ep.id,
            href: `/contenido?action=new&episodeId=${ep.id}`,
            reason: 'Episodio sin derivados',
            status: 'pending',
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    // Rule 3: Contenido listo sin fecha
    for (let i = 0; i < state.contentPieces.length; i++) {
      const cp = state.contentPieces[i];
      if (cp.status === 'Listo' && !cp.publishDate) {
        actions.push({
          id: generateId('nba-no-date', i),
          title: `Contenido: agendar en calendario`,
          detail: `Pieza de ${cp.channel} lista pero sin fecha de publicación.`,
          severity: 'high',
          category: 'distribucion',
          sourceType: 'content',
          sourceId: cp.id,
          href: `/calendario?action=create&contentId=${cp.id}`,
          reason: 'Contenido listo sin agendar',
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
      }
    }

    // Rule 4: Checklist incompleto
    for (let i = 0; i < state.checklists.length; i++) {
      const checklist = state.checklists[i];
      if (checklist.status === 'En proceso') {
        const incompleteItems = checklist.items.filter((item) => !item.completed);
        if (incompleteItems.length > 0) {
          actions.push({
            id: generateId('nba-checklist', i),
            title: `${checklist.name}: cerrar pendientes`,
            detail: `Hay ${incompleteItems.length} tarea(s) incompleta(s) en "${checklist.name}".`,
            severity: 'medium',
            category: 'produccion',
            sourceType: 'checklist',
            sourceId: checklist.id,
            href: `/checklists?id=${checklist.id}`,
            reason: 'Tareas operativas pendientes',
            status: 'pending',
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    // Rule 5: Métrica fuerte sin derivación
    for (let i = 0; i < state.metricsEpisode.length; i++) {
      const metric = state.metricsEpisode[i];
      if (metric.plays7d > 3000) {
        const episode = state.episodes.find((ep) => ep.id === metric.episodeId);
        if (episode) {
          const recentContent = state.contentPieces.filter(
            (cp) =>
              cp.episodeId === episode.id &&
              cp.createdAt &&
              new Date(cp.createdAt) > new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
          );
          if (recentContent.length === 0) {
            actions.push({
              id: generateId('nba-strong-metric', i),
              title: `Episodio ${episode.episodeNumber}: derivar contenido`,
              detail: `Tiene ${metric.plays7d} reproducciones en 7 días. Aprovecha el momentum.`,
              severity: 'medium',
              category: 'metricas',
              sourceType: 'episode',
              sourceId: episode.id,
              href: `/contenido?action=new&episodeId=${episode.id}`,
              reason: 'Episodio con alto desempeño',
              status: 'pending',
              createdAt: new Date().toISOString(),
            });
          }
        }
      }
    }

    // Rule 6: Nota editorial potencial
    // Este hook no puede acceder directamente a notas (viven en Supabase)
    // Se dejaría para integración futura si notas se cargan en StudioState

    // Rule 7: Fallback - Sistema sin prioridad clara
    if (actions.length === 0) {
      actions.push({
        id: generateId('nba-fallback', 0),
        title: 'Siguiente mejor acción',
        detail: 'No hay acciones críticas en este momento. El sistema funciona correctamente.',
        severity: 'low',
        category: 'sistema',
        sourceType: 'system',
        href: '/dashboard',
        reason: 'Estado operativo normal',
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    }

    // Sort by severity and limit
    const sorted = sortBySeverity(actions);
    const limit = state.config.nextBestActionsLimit || 3;
    return sorted.slice(0, limit);
  }, [state]);
}
