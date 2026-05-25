import { NextResponse } from 'next/server';
import { z } from 'zod';
import { parseInstruction } from '@/lib/ai-editor/parseInstruction';
import { generatePatch } from '@/lib/ai-editor/generatePatch';
import { validatePatch } from '@/lib/ai-editor/validatePatch';
import { AiEditorModeSchema, AiEditorScopeSchema } from '@/lib/ai-editor/types';

const AnalyzeRequestSchema = z.object({
  prompt: z.string().min(1).max(2000),
  mode: AiEditorModeSchema.default('assisted'),
  scope: AiEditorScopeSchema.default('current_page'),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = AnalyzeRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: `Payload inválido: ${parsed.error.issues.map((i) => i.message).join(', ')}` },
      { status: 400 }
    );
  }

  const { prompt, mode, scope } = parsed.data;

  const parseResult = parseInstruction(prompt, mode, scope);

  if (parseResult.blocked) {
    return NextResponse.json(
      {
        blocked: true,
        reason: parseResult.blockedReason,
        plan: parseResult.plan,
      },
      { status: 422 }
    );
  }

  const diff = generatePatch({
    affectedFiles: parseResult.plan.affectedFiles,
    intent: parseResult.intent,
    summary: parseResult.summary,
    prompt,
    mode,
  });

  const validation = validatePatch(diff, parseResult.plan.riskLevel);

  const plan = {
    ...parseResult.plan,
    diff,
    validationStatus: validation.status,
    validationChecks: validation.checks,
    rollbackAvailable: false,
  };

  return NextResponse.json({ plan });
}
