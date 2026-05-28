import { z } from 'zod';

export const EpisodeInputSchema = z.object({
  idea_principal: z.string().min(4),
  conflicto_central: z.string().optional(),
  tono: z.string().optional(),
  episode_number: z.number().int().positive().optional(),
  intencion_del_episodio: z.string().optional(),
});

export const SemanticMapInputSchema = z.object({
  title: z.string().min(3),
  theme: z.string().min(3),
  core_thesis: z.string().min(3),
  hook: z.string().min(3),
  cta: z.string().min(2),
});

export type EpisodeInput = z.infer<typeof EpisodeInputSchema>;
export type SemanticMapInput = z.infer<typeof SemanticMapInputSchema>;

export function cleanText(input: string): string {
  return input.replace(/\s+/g, ' ').trim();
}

export function buildEpisodePrompt(input: EpisodeInput): string {
  const validated = EpisodeInputSchema.parse(input);
  const episodeLabel = validated.episode_number
    ? `EP.${String(validated.episode_number).padStart(2, '0')}`
    : 'EP.s/n';

  return [
    `Genera campos narrativos para ${episodeLabel} de AMTME Studio OS.`,
    `Idea principal: ${cleanText(validated.idea_principal)}.`,
    `Conflicto central: ${cleanText(validated.conflicto_central ?? 'No especificado')}.`,
    `Tono: ${cleanText(validated.tono ?? 'sobrio, directo, útil')}.`,
    `Intención: ${cleanText(validated.intencion_del_episodio ?? 'convertir claridad en acción concreta')}.`,
    'Responde SOLO en JSON con campos: title, working_title, theme, core_thesis, hook, cta, keywords.',
    'keywords debe ser un arreglo de 5 a 8 strings cortos.',
  ].join('\n');
}

export function buildSemanticMapPrompt(input: SemanticMapInput): string {
  const validated = SemanticMapInputSchema.parse(input);

  return [
    'Construye un mapa semántico operativo para pieza AMTME.',
    `Título: ${cleanText(validated.title)}.`,
    `Tema: ${cleanText(validated.theme)}.`,
    `Tesis: ${cleanText(validated.core_thesis)}.`,
    `Hook: ${cleanText(validated.hook)}.`,
    `CTA: ${cleanText(validated.cta)}.`,
    'Devuelve JSON con: summary, pillars (array), tensions (array), actions (array).',
  ].join('\n');
}
