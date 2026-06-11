import { NextResponse } from 'next/server';
import { generateWithProvider } from '@/lib/ai-providers';
import {
  AMTME_SYSTEM_PROMPT,
  buildEpisodeScriptPrompt,
  buildValidationPrompt,
  buildRewritePrompt,
  extractScriptBlocks,
  VALIDATION_CRITERIA,
  type EpisodeGenerationInput,
  type ValidationResult,
  type ScriptBlocks,
} from '@/prompts/amtme-editorial';

export type EditorialOutput = {
  script: ScriptBlocks;
  rawScript: string;
  validation: ValidationResult;
  wasRewritten: boolean;
  approved: boolean;
};

function defaultValidation(): ValidationResult {
  return {
    scores: Object.fromEntries(
      VALIDATION_CRITERIA.map((c) => [c.key, 8])
    ) as ValidationResult['scores'],
    approved: true,
    issues: [],
    strong_phrases: [],
    diagnosis: 'Validación automática no disponible.',
  };
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as EpisodeGenerationInput;

  if (!body.topic?.trim()) {
    return NextResponse.json({ error: 'El tema del episodio es obligatorio.' }, { status: 400 });
  }

  try {
    // ── CAPA 1: GENERACIÓN ──────────────────────────────────────────────────
    const genPrompt = buildEpisodeScriptPrompt(body);
    const rawScript = await generateWithProvider({
      provider: 'groq',
      prompt: genPrompt,
      systemPrompt: AMTME_SYSTEM_PROMPT,
    });

    // ── CAPA 2: VALIDACIÓN ──────────────────────────────────────────────────
    let validation: ValidationResult = defaultValidation();
    try {
      const valRaw = await generateWithProvider({
        provider: 'groq',
        prompt: buildValidationPrompt(rawScript),
        systemPrompt:
          'Eres un evaluador editorial estricto de AMTME. Devuelve SOLO JSON válido, sin markdown ni texto adicional.',
      });
      const clean = valRaw.replace(/```json\n?|```/g, '').trim();
      const parsed = JSON.parse(clean) as ValidationResult;

      // Recompute approved against actual minimums (don't trust the LLM's boolean)
      const failingKeys = VALIDATION_CRITERIA.filter((c) => (parsed.scores[c.key] ?? 0) < c.min);
      validation = {
        ...parsed,
        approved: failingKeys.length === 0,
        issues:
          failingKeys.length > 0
            ? failingKeys.map(
                (c) =>
                  `${c.label} (${parsed.scores[c.key] ?? '?'}/10 — mínimo ${c.min}): ${c.question}`
              )
            : parsed.issues,
      };
    } catch {
      // Validation parse failed — continue with default, don't block the user
    }

    // ── CAPA 3: CORRECCIÓN AUTOMÁTICA ───────────────────────────────────────
    let finalScript = rawScript;
    let wasRewritten = false;

    if (!validation.approved && validation.issues.length > 0) {
      try {
        finalScript = await generateWithProvider({
          provider: 'groq',
          prompt: buildRewritePrompt(rawScript, validation.issues),
          systemPrompt: AMTME_SYSTEM_PROMPT,
        });
        wasRewritten = true;
      } catch {
        // Rewrite failed — return original with issues flagged
        finalScript = rawScript;
      }
    }

    const result: EditorialOutput = {
      script: extractScriptBlocks(finalScript),
      rawScript: finalScript,
      validation,
      wasRewritten,
      approved: validation.approved || wasRewritten,
    };

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error en el motor editorial.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
