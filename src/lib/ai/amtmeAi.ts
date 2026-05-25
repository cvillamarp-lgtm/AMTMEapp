import { z } from 'zod';
import { generateWithProvider } from '@/lib/ai-providers';
import type { AIProvider } from '@/lib/studio-types';
import {
  buildEpisodePrompt,
  buildSemanticMapPrompt,
  cleanText,
  EpisodeInputSchema,
  SemanticMapInputSchema,
  type EpisodeInput,
  type SemanticMapInput,
} from './prompt-engine';

const EpisodeFieldsSchema = z.object({
  title: z.string().min(4),
  working_title: z.string().min(3),
  theme: z.string().min(3),
  core_thesis: z.string().min(8),
  hook: z.string().min(6),
  cta: z.string().min(3),
  keywords: z.array(z.string().min(2)).min(3).max(10),
});

const SemanticMapSchema = z.object({
  summary: z.string().min(8),
  pillars: z.array(z.string().min(2)).min(2),
  tensions: z.array(z.string().min(2)).min(1),
  actions: z.array(z.string().min(2)).min(2),
});

export type EpisodeFields = z.infer<typeof EpisodeFieldsSchema>;
export type SemanticMap = z.infer<typeof SemanticMapSchema>;

function safeJsonParse(raw: string): unknown {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error('La respuesta no contiene JSON parseable.');
    }
    return JSON.parse(match[0]);
  }
}

function generateLocalFields(input: EpisodeInput): EpisodeFields {
  const idea = cleanText(input.idea_principal);
  const number = input.episode_number ?? 0;
  const ep = number > 0 ? `EP.${String(number).padStart(2, '0')}` : 'EP';

  return EpisodeFieldsSchema.parse({
    title: `${ep} · ${idea.slice(0, 52)}`,
    working_title: idea.slice(0, 36),
    theme: idea,
    core_thesis: cleanText(
      input.intencion_del_episodio ??
        'Nombrar el conflicto sin dramatizarlo y cerrar con una acción concreta.'
    ),
    hook: `Cuando ${idea.toLowerCase()} deja de ser discurso, empieza la decisión.`,
    cta: 'Escríbeme "verdad" y lo aterrizamos en acción.',
    keywords: ['claridad', 'límite', 'acción', 'verdad', 'proceso'],
  });
}

function generateLocalSemanticMap(input: SemanticMapInput): SemanticMap {
  return SemanticMapSchema.parse({
    summary: `Mapa semántico de ${cleanText(input.title)} orientado a ejecución editorial AMTME.`,
    pillars: [cleanText(input.theme), cleanText(input.core_thesis), cleanText(input.hook)],
    tensions: ['claridad vs evasión', 'control vs autenticidad'],
    actions: [cleanText(input.cta), 'Guardar', 'Compartir con una persona específica'],
  });
}

export async function generateEpisodeFields(
  input: EpisodeInput,
  options?: {
    provider?: AIProvider;
    model?: string;
  }
): Promise<{ fields: EpisodeFields; metadata: Record<string, unknown> }> {
  const validated = EpisodeInputSchema.parse(input);
  const provider = options?.provider ?? 'gemini';

  try {
    const response = await generateWithProvider({
      provider,
      model: options?.model,
      systemPrompt:
        'Eres AMTME Studio OS. Responde en JSON estricto y evita texto fuera del objeto JSON.',
      prompt: buildEpisodePrompt(validated),
    });

    const fields = EpisodeFieldsSchema.parse(safeJsonParse(response));
    return {
      fields,
      metadata: {
        source: provider,
        model: options?.model ?? null,
        fallback: false,
        generated_at: new Date().toISOString(),
      },
    };
  } catch {
    return {
      fields: generateLocalFields(validated),
      metadata: {
        source: 'local-fallback',
        provider,
        fallback: true,
        generated_at: new Date().toISOString(),
      },
    };
  }
}

export async function generateSemanticMap(
  input: SemanticMapInput,
  options?: {
    provider?: AIProvider;
    model?: string;
  }
): Promise<{ map: SemanticMap; metadata: Record<string, unknown> }> {
  const validated = SemanticMapInputSchema.parse(input);
  const provider = options?.provider ?? 'gemini';

  try {
    const response = await generateWithProvider({
      provider,
      model: options?.model,
      systemPrompt:
        'Eres AMTME Studio OS. Devuelve un JSON operativo y directo, sin markdown ni explicación adicional.',
      prompt: buildSemanticMapPrompt(validated),
    });

    return {
      map: SemanticMapSchema.parse(safeJsonParse(response)),
      metadata: {
        source: provider,
        fallback: false,
        generated_at: new Date().toISOString(),
      },
    };
  } catch {
    return {
      map: generateLocalSemanticMap(validated),
      metadata: {
        source: 'local-fallback',
        provider,
        fallback: true,
        generated_at: new Date().toISOString(),
      },
    };
  }
}

export { cleanText };
