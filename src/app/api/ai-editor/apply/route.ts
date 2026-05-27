import { NextResponse } from 'next/server';
import { z } from 'zod';
import { applyPatch } from '@/lib/ai-editor/applyPatch';
import { AiChangePlanSchema, AiEditorModeSchema, AiEditorScopeSchema } from '@/lib/ai-editor/types';
import { buildHistoryEntry } from '@/lib/ai-editor/changeLog';
import { saveHistoryEntry } from '@/lib/ai-editor/historyPersistence';

const ApplyRequestSchema = z.object({
  requestId: z.string().min(1),
  prompt: z.string().min(1).optional(),
  scope: AiEditorScopeSchema.default('current_page'),
  plan: AiChangePlanSchema,
  mode: AiEditorModeSchema.default('assisted'),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = ApplyRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: `Payload inválido: ${parsed.error.issues.map((i) => i.message).join(', ')}` },
      { status: 400 }
    );
  }

  const { requestId, scope, plan, mode } = parsed.data;
  const prompt = parsed.data.prompt ?? plan.summary;

  const result = await applyPatch(plan, mode, requestId, prompt);

  if (!result.success) {
    return NextResponse.json({ error: result.message, status: result.status }, { status: 422 });
  }

  const entry = buildHistoryEntry(
    requestId,
    prompt,
    mode,
    scope,
    result.status,
    plan.riskLevel,
    plan.affectedFiles,
    {
      ...plan,
      branchName: result.branchName,
      branchType: result.branchType,
      commitSha: result.commitSha,
      executionSource: result.executionSource === 'github_api' ? 'github_api' : 'simulation',
      validationRun: plan.validationRun,
    },
    result.branchName,
    {
      branchType: result.branchType,
      commitSha: result.commitSha,
      executionSource: result.executionSource === 'github_api' ? 'github_api' : 'simulation',
      validationRun: plan.validationRun,
      rollbackType: result.commitSha ? 'revert' : 'discard',
      rollbackMetadata: result.rollbackMetadata,
    }
  );

  const persistence = await saveHistoryEntry(entry);

  return NextResponse.json({
    success: true,
    status: result.status,
    message: result.message,
    branchName: result.branchName,
    branchType: result.branchType,
    commitSha: result.commitSha,
    executionSource: result.executionSource,
    rollbackMetadata: result.rollbackMetadata,
    evidenceUrl: result.evidenceUrl,
    persistenceType: persistence.persistenceType,
    persistenceSource: persistence.source,
    persistenceReason: persistence.reason,
    entry: {
      ...entry,
      persistenceType: persistence.persistenceType,
    },
  });
}
