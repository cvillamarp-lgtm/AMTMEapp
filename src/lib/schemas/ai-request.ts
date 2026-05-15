import { z } from 'zod';

export const MAX_AI_PROMPT_LENGTH = 5000;

const trimString = (value: unknown) => (typeof value === 'string' ? value.trim() : value);

export const aiGenerateRequestSchema = z.object({
  provider: z.enum(['grok', 'gemini']).default('grok'),
  mode: z.enum(['Episodio', 'Copy', 'Visual', 'Métricas', 'Monetización']).optional(),
  prompt: z.preprocess(trimString, z.string().min(1, 'Se requiere un prompt.').max(MAX_AI_PROMPT_LENGTH, `El prompt excede el máximo de ${MAX_AI_PROMPT_LENGTH} caracteres.`)),
  systemPrompt: z.preprocess(trimString, z.string().max(4000, 'El systemPrompt excede 4000 caracteres.').optional()),
  model: z.preprocess(trimString, z.string().min(1, 'El modelo no puede estar vacío.').max(120, 'El modelo excede 120 caracteres.').optional()),
});
