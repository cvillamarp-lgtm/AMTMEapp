import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createRollback } from '@/lib/ai-editor/createRollback';
import { AiChangePlanSchema, AiEditorModeSchema, AiEditorScopeSchema } from '@/lib/ai-editor/types';
import { buildHistoryEntry } from '@/lib/ai-editor/changeLog';
import { saveHistoryEntry } from '@/lib/ai-editor/historyPersistence';

const RollbackRequestSchema = z.object({
  requestId: z.string().min(1),
  prompt: z.string().min(1).optional(),
  mode: AiEditorModeSchema.default('assisted'),
  scope: AiEditorScopeSchema.default('current_page'),
  branchName: z.string().optional(),
  commitSha: z.string().optional(),
  rollbackMetadata: z
    .object({
      strategy: z.string().optional(),
      patchFilePath: z.string().optional(),
    })
    .optional(),
  plan: AiChangePlanSchema,
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = RollbackRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: `Payload inválido: ${parsed.error.issues.map((i) => i.message).join(', ')}` },
      { status: 400 }
    );
  }

  const { requestId, plan, branchName, commitSha, rollbackMetadata, prompt, mode, scope } =
    parsed.data;

  const result = await createRollback(plan, requestId, { branchName, commitSha, rollbackMetadata });

  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 422 });
  }

  const rollbackEntry = buildHistoryEntry(
    requestId,
    prompt ?? `Rollback ${requestId}`,
    mode,
    scope,
    'rolled_back',
    plan.riskLevel,
    result.restoredFiles.length > 0 ? result.restoredFiles : plan.affectedFiles,
    {
      ...plan,
      branchName,
      commitSha,
      rollbackAvailable: false,
    },
    branchName,
    {
      commitSha: result.rollbackCommitSha ?? commitSha,
      branchType: branchName ? 'real' : 'proposed',
      executionSource: result.rollbackType === 'revert' ? 'rollback_github' : 'rollback_discard',
      rollbackType: result.rollbackType,
      rollbackMetadata: {
        strategy: rollbackMetadata?.strategy ?? 'discard',
        patchFilePath: rollbackMetadata?.patchFilePath,
        rollbackCommitSha: result.rollbackCommitSha,
      },
    }
  );

  const persistence = await saveHistoryEntry(rollbackEntry);

  return NextResponse.json({
    success: true,
    message: result.message,
    restoredFiles: result.restoredFiles,
    rollbackType: result.rollbackType,
    rollbackCommitSha: result.rollbackCommitSha,
    persistenceType: persistence.persistenceType,
    persistenceSource: persistence.source,
    persistenceReason: persistence.reason,
    entry: {
      ...rollbackEntry,
      persistenceType: persistence.persistenceType,
    },
  });
}
