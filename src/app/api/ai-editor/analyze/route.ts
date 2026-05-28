import { NextResponse } from 'next/server';
import { z } from 'zod';
import { parseInstruction } from '@/lib/ai-editor/parseInstruction';
import { generatePatch } from '@/lib/ai-editor/generatePatch';
import { validatePatch } from '@/lib/ai-editor/validatePatch';
import { AiEditorModeSchema, AiEditorScopeSchema } from '@/lib/ai-editor/types';
import { buildHistoryEntry } from '@/lib/ai-editor/changeLog';
import { saveHistoryEntry } from '@/lib/ai-editor/historyPersistence';

const AnalyzeRequestSchema = z.object({
  requestId: z.string().min(1).optional(),
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
  const requestId = parsed.data.requestId ?? `req-${crypto.randomUUID()}`;

  const parseResult = parseInstruction(prompt, mode, scope);

  if (parseResult.blocked) {
    const blockedEntry = buildHistoryEntry(
      requestId,
      prompt,
      mode,
      scope,
      'blocked',
      parseResult.plan.riskLevel,
      parseResult.plan.affectedFiles
    );
    const persistence = await saveHistoryEntry(blockedEntry);

    return NextResponse.json(
      {
        requestId,
        blocked: true,
        reason: parseResult.blockedReason,
        plan: parseResult.plan,
        entry: {
          ...blockedEntry,
          persistenceType: persistence.persistenceType,
        },
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

  const validation = await validatePatch(diff, parseResult.plan.riskLevel);

  const plan = {
    ...parseResult.plan,
    diff,
    validationStatus: validation.status,
    validationChecks: validation.checks,
    validationRun: validation.validationRun,
    rollbackAvailable: false,
    executionSource: 'simulation' as const,
  };

  const analyzedEntry = buildHistoryEntry(
    requestId,
    prompt,
    mode,
    scope,
    'analyzed',
    plan.riskLevel,
    plan.affectedFiles,
    plan,
    undefined,
    {
      validationRun: validation.validationRun,
      executionSource: 'simulation',
    }
  );
  const persistence = await saveHistoryEntry(analyzedEntry);

  return NextResponse.json({
    requestId,
    plan,
    entry: {
      ...analyzedEntry,
      persistenceType: persistence.persistenceType,
    },
    persistenceType: persistence.persistenceType,
    persistenceSource: persistence.source,
    persistenceReason: persistence.reason,
  });
}
