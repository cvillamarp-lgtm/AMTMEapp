/**
 * AMTME IA Editor — LLM Client Wrapper (Fase 0.2)
 *
 * This is the single place that calls the existing generateWithProvider
 * and GUARANTEES that every response contains visible, human-readable
 * reasoning from the model.
 *
 * All editor flows (intent analysis, plan generation, preview, confirmation)
 * must go through this wrapper.
 */

import { z } from 'zod';
import { generateWithProvider } from '@/lib/ai-providers';
import type { AIProvider } from '@/lib/studio-types';

const ReasoningResponseSchema = z.object({
  reasoning: z.string().min(20, 'El modelo debe explicar su razonamiento de forma clara'),
  result: z.string().min(5),
  confidence: z.number().min(0).max(1).optional(),
});

export type ReasoningResponse = z.infer<typeof ReasoningResponseSchema>;

export interface GenerateWithReasoningInput {
  provider: AIProvider;
  instruction: string;           // Natural language from the user (Spanish)
  context?: string;              // Optional extra context (current module, selected files, etc.)
  model?: string;
  temperature?: number;
}

/**
 * Calls the model with a strict prompt that forces structured output
 * containing "reasoning" (the part we show to the user) + "result".
 */
export async function generateWithReasoning(
  input: GenerateWithReasoningInput,
  // Injectable for testing — in production we use the real generateWithProvider
  generateFn: (args: any) => Promise<string> = generateWithProvider
): Promise<ReasoningResponse> {
  const { provider, instruction, context, model } = input;

  const systemPrompt = `Eres un asistente editorial experto de AMTME (A Mí Tampoco Me Explicaron).

El usuario te dará una instrucción en lenguaje natural en español.

Tu trabajo es:
1. Entender la intención real.
2. Pensar paso a paso con claridad y honestidad (esto es lo más importante).
3. Devolver SOLO un objeto JSON válido con esta forma exacta:

{
  "reasoning": "Explicación clara, humana y específica de por qué propones lo que propones. Menciona riesgos, beneficios y qué módulos se ven afectados. Usa tono sobrio y profesional.",
  "result": "Resumen corto y accionable de la respuesta o plan propuesto.",
  "confidence": 0.0-1.0
}

Nunca inventes archivos ni paths técnicos a menos que el usuario los mencione.
Si la instrucción es ambigua, dilo en el reasoning.
Mantén todo en español.`;

  let userPrompt = `Instrucción del usuario:\n"${instruction.trim()}"\n`;

  if (context) {
    userPrompt += `\nContexto adicional:\n${context.trim()}\n`;
  }

  userPrompt += `\nResponde únicamente con el JSON solicitado.`;

  try {
    const raw = await generateFn({
      provider,
      prompt: userPrompt,
      systemPrompt,
      model,
    });

    try {
      const parsed = extractAndParseJSON(raw);
      return ReasoningResponseSchema.parse(parsed);
    } catch {
      // Model didn't give clean JSON → use the raw text as reasoning (graceful fallback)
      return createFallbackResponse(raw, instruction);
    }
  } catch (error) {
    throw error;
  }
}

function extractAndParseJSON(raw: string): unknown {
  // Try to find a JSON object even if the model wrapped it in markdown
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('El modelo no devolvió JSON válido');
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error('No se pudo parsear la respuesta del modelo como JSON');
  }
}

function createFallbackResponse(raw: string, instruction: string): ReasoningResponse {
  const reasoning = raw.trim().length > 30
    ? raw.trim()
    : `El modelo procesó la instrucción "${instruction}" pero no devolvió un razonamiento estructurado. Se muestra la respuesta cruda como razonamiento de respaldo.`;

  return {
    reasoning: reasoning.slice(0, 1200), // keep it reasonable length
    result: raw.trim().slice(0, 400),
    confidence: 0.6,
  };
}
