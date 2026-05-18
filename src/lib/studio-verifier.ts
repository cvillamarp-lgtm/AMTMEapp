import type { StudioState } from '@/lib/studio-types';

export type VerificationSeverity = 'alta' | 'media' | 'baja';

export interface VerificationIssue {
  id: string;
  area: string;
  severity: VerificationSeverity;
  title: string;
  detail: string;
  action: string;
}

export interface VerificationSummary {
  score: number;
  totalChecks: number;
  passedChecks: number;
  issues: VerificationIssue[];
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function hasOfficialPaletteReference(value: string) {
  const normalized = normalizeText(value);
  return (
    normalized.includes('#001f36') ||
    normalized.includes('navy') ||
    normalized.includes('navi') ||
    normalized.includes('azul petróleo') ||
    normalized.includes('azul petroleo')
  );
}

export function runStudioVerification(state: StudioState): VerificationSummary {
  const issues: VerificationIssue[] = [];
  let totalChecks = 0;
  let passedChecks = 0;

  const trackCheck = (passed: boolean) => {
    totalChecks += 1;
    if (passed) passedChecks += 1;
  };

  const addIssue = (issue: VerificationIssue) => {
    issues.push(issue);
  };

  const uniqueEpisodeTitles = new Set<string>();
  for (const episode of state.episodes) {
    const normalizedTitle = normalizeText(episode.title);
    const publishedLike = ['Publicado', 'Distribuido', 'Medido'];

    trackCheck(Boolean(episode.title.trim()));
    if (!episode.title.trim()) {
      addIssue({
        id: `episode-title-${episode.id}`,
        area: '04_EPISODIOS',
        severity: 'alta',
        title: 'Episodio sin título',
        detail: `El episodio ${episode.episodeNumber || episode.id} no tiene título.`,
        action: 'Define un título único antes de continuar el flujo.',
      });
    }

    trackCheck(Boolean(episode.cta.trim()) || !publishedLike.includes(episode.status));
    if (publishedLike.includes(episode.status) && !episode.cta.trim()) {
      addIssue({
        id: `episode-cta-${episode.id}`,
        area: '04_EPISODIOS',
        severity: 'alta',
        title: 'Episodio publicado sin CTA',
        detail: `El episodio "${episode.title}" está en estado ${episode.status} sin CTA definido.`,
        action: 'Agrega un CTA principal y vuelve a validar el episodio.',
      });
    }

    trackCheck(
      Boolean(episode.spotifyDescription.trim()) || !publishedLike.includes(episode.status)
    );
    if (publishedLike.includes(episode.status) && !episode.spotifyDescription.trim()) {
      addIssue({
        id: `episode-spotify-${episode.id}`,
        area: '04_EPISODIOS',
        severity: 'media',
        title: 'Descripción Spotify faltante',
        detail: `El episodio "${episode.title}" no tiene descripción para Spotify.`,
        action: 'Completa la descripción para Spotify desde el módulo de episodios.',
      });
    }

    trackCheck(Boolean(episode.appleDescription.trim()) || !publishedLike.includes(episode.status));
    if (publishedLike.includes(episode.status) && !episode.appleDescription.trim()) {
      addIssue({
        id: `episode-apple-${episode.id}`,
        area: '04_EPISODIOS',
        severity: 'media',
        title: 'Descripción Apple Podcasts faltante',
        detail: `El episodio "${episode.title}" no tiene descripción para Apple Podcasts.`,
        action: 'Completa la descripción de Apple Podcasts antes del siguiente corte.',
      });
    }

    trackCheck(!normalizedTitle || !uniqueEpisodeTitles.has(normalizedTitle));
    if (normalizedTitle && uniqueEpisodeTitles.has(normalizedTitle)) {
      addIssue({
        id: `episode-duplicate-${episode.id}`,
        area: '04_EPISODIOS',
        severity: 'media',
        title: 'Posible título duplicado',
        detail: `Hay más de un episodio con el título "${episode.title}".`,
        action: 'Renombra o fusiona episodios para evitar duplicidad operativa.',
      });
    }
    if (normalizedTitle) uniqueEpisodeTitles.add(normalizedTitle);
  }

  for (const piece of state.contentPieces) {
    trackCheck(Boolean(piece.cta.trim()) || piece.status !== 'Publicado');
    if (piece.status === 'Publicado' && !piece.cta.trim()) {
      addIssue({
        id: `content-cta-${piece.id}`,
        area: '03_CONTENIDO',
        severity: 'media',
        title: 'Contenido publicado sin CTA',
        detail: `La pieza ${piece.channel} / ${piece.format} se publicó sin CTA.`,
        action: 'Define un CTA único por pieza publicada.',
      });
    }

    trackCheck(Boolean(piece.metricGoal.trim()));
    if (!piece.metricGoal.trim()) {
      addIssue({
        id: `content-goal-${piece.id}`,
        area: '03_CONTENIDO',
        severity: 'media',
        title: 'Pieza sin meta de medición',
        detail: `La pieza ${piece.channel} / ${piece.format} no define una meta operativa.`,
        action: 'Asigna una meta (DMs, guardados, clics, etc.).',
      });
    }
  }

  for (const asset of state.visualAssets) {
    trackCheck(hasOfficialPaletteReference(asset.palette));
    if (!hasOfficialPaletteReference(asset.palette)) {
      addIssue({
        id: `visual-palette-${asset.id}`,
        area: '02_MARCA',
        severity: 'alta',
        title: 'Activo visual sin paleta oficial',
        detail: `La pieza visual "${asset.title || asset.id}" no referencia paleta oficial AMTME.`,
        action: 'Ajusta la paleta a Navy/Amarillo/Blanco/Crema/Azul petróleo.',
      });
    }
  }

  for (const event of state.calendarEvents) {
    trackCheck(Boolean(event.title.trim()));
    if (!event.title.trim()) {
      addIssue({
        id: `calendar-title-${event.id}`,
        area: '10_CALENDARIO',
        severity: 'media',
        title: 'Evento sin título',
        detail: 'Hay eventos de calendario sin título definido.',
        action: 'Define un título claro para cada evento.',
      });
    }

    trackCheck(Boolean(event.date.trim()));
    if (!event.date.trim()) {
      addIssue({
        id: `calendar-date-${event.id}`,
        area: '10_CALENDARIO',
        severity: 'alta',
        title: 'Evento sin fecha',
        detail: `El evento "${event.title || event.id}" no tiene fecha.`,
        action: 'Asigna una fecha para mantener la secuencia operativa.',
      });
    }
  }

  for (const checklist of state.checklists) {
    trackCheck(checklist.items.length > 0);
    if (!checklist.items.length) {
      addIssue({
        id: `checklist-empty-${checklist.id}`,
        area: '05_PRODUCCIÓN',
        severity: 'media',
        title: 'Checklist vacío',
        detail: `El checklist "${checklist.name}" no tiene pasos.`,
        action: 'Agrega ítems mínimos para habilitar ejecución y QA.',
      });
    }
  }

  trackCheck(
    state.masterSections.some(
      (section) =>
        normalizeText(section.title).includes('política') ||
        normalizeText(section.title).includes('politica')
    )
  );
  if (
    !state.masterSections.some(
      (section) =>
        normalizeText(section.title).includes('política') ||
        normalizeText(section.title).includes('politica')
    )
  ) {
    addIssue({
      id: 'master-policy',
      area: '00_DOCUMENTO_MAESTRO',
      severity: 'alta',
      title: 'Falta política operativa en fuente central',
      detail:
        'No se detectó una sección de política operativa dentro del documento maestro cargado.',
      action: 'Registra la política en una sección vigente del documento maestro.',
    });
  }

  const baseScore = totalChecks ? Math.round((passedChecks / totalChecks) * 100) : 0;
  const scorePenalty = issues.reduce((acc, issue) => {
    if (issue.severity === 'alta') return acc + 8;
    if (issue.severity === 'media') return acc + 4;
    return acc + 2;
  }, 0);

  return {
    score: Math.max(0, Math.min(100, baseScore - scorePenalty)),
    totalChecks,
    passedChecks,
    issues,
  };
}

export function buildVerificationReport(summary: VerificationSummary) {
  const date = new Date().toISOString();
  const lines = [
    '# REPORTE_VERIFICADOR_AMTME_STUDIO_OS',
    '',
    `- Fecha: ${date}`,
    `- Score del sistema: ${summary.score}/100`,
    `- Checks aprobados: ${summary.passedChecks}/${summary.totalChecks}`,
    `- Incidencias: ${summary.issues.length}`,
    '',
    '## Incidencias detectadas',
  ];

  if (!summary.issues.length) {
    lines.push('', '- Sin incidencias críticas. El sistema está operativo.');
    return lines.join('\n');
  }

  for (const issue of summary.issues) {
    lines.push(
      '',
      `### ${issue.title}`,
      `- Área: ${issue.area}`,
      `- Severidad: ${issue.severity}`,
      `- Detalle: ${issue.detail}`,
      `- Acción: ${issue.action}`
    );
  }

  return lines.join('\n');
}
