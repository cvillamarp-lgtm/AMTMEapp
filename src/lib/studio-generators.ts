import type { Episode, ContentPiece, VisualAsset } from './studio-types';

export function buildNarrativeStructure(): string[] {
  return ['Umbral', 'Herida', 'Símbolo', 'Verdad', 'Puente', 'Acción'];
}

export function generateEpisodeScript(
  episode: Pick<Episode, 'title' | 'theme' | 'objective'>
): string {
  return [
    `Apertura: ${episode.title}.`,
    `Tema central: ${episode.theme}.`,
    `Objetivo operativo: ${episode.objective}.`,
    'Desarrollar el episodio con una voz sobria, directa y emocionalmente contenida.',
    'Cerrar con un CTA de baja fricción y una invitación clara a continuar la conversación.',
  ].join('\n');
}

export function generateSpotifyDescription(episode: Pick<Episode, 'title' | 'theme'>): string {
  return `Un episodio de AMTME sobre ${episode.theme}. ${episode.title} abre una conversación clara sobre lo que cuesta seguir sosteniendo lo que ya cambió.`;
}

export function generateAppleDescription(episode: Pick<Episode, 'title' | 'objective'>): string {
  return `${episode.title}. Un episodio para observar, nombrar y mover con más claridad lo que ya no necesita ser defendido.`;
}

export function generateHooks(title: string): string[] {
  return [
    `Hay un punto en que ${title.toLowerCase()} deja de ser una idea y se vuelve una decisión.`,
    'A veces la claridad no llega como alivio, sino como una incomodidad necesaria.',
  ];
}

export function generateContentPack(input: {
  theme: string;
  emotion: string;
  objective: string;
  episodeTitle: string;
}): ContentPiece {
  return {
    id: `content-${Date.now()}`,
    channel: 'Instagram',
    format: 'Reel',
    theme: input.theme,
    emotion: input.emotion,
    objective: input.objective,
    hook: `Hook: ${input.theme} que se entiende en una sola frase.`,
    mainText: `Contenido AMTME sobre ${input.theme} con claridad, pausa y utilidad operativa.`,
    caption: `Una pieza para reconocer ${input.emotion.toLowerCase()} sin exagerarlo ni romantizarlo.`,
    cta: 'Escríbeme “verdad”.',
    visualPrompt: `Diseño editorial sobrio vinculado al episodio ${input.episodeTitle}.`,
    status: 'Borrador',
    publishDate: new Date().toISOString().slice(0, 10),
    episodeId: '',
    metricGoal: 'DMs y guardados',
    createdAt: new Date().toISOString().slice(0, 10),
  };
}

export function generateVisualPrompt(
  asset: Pick<VisualAsset, 'type' | 'mainText' | 'secondaryText' | 'cta' | 'palette'>
): string {
  return [
    `Tipo de pieza: ${asset.type}.`,
    `Idea principal: ${asset.mainText}.`,
    `Texto secundario: ${asset.secondaryText}.`,
    `CTA: ${asset.cta}.`,
    `Paleta obligatoria: ${asset.palette}.`,
    'Estilo: editorial, premium, Apple-like, mucho aire, una sola idea visual, sin degradados innecesarios, sin estética de coaching.',
  ].join('\n');
}

export function generateVisualSpec(format: string): string {
  return `Formato ${format}. Fondo limpio, tipografía nítida, contraste alto, bordes suaves, jerarquía precisa y CTA único.`;
}
