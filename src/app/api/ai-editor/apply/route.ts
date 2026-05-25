import { NextResponse } from 'next/server';
import { z } from 'zod';
import { applyPatch } from '@/lib/ai-editor/applyPatch';
import { AiChangePlanSchema, AiEditorModeSchema } from '@/lib/ai-editor/types';

const ApplyRequestSchema = z.object({
  requestId: z.string().min(1),
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

  const { requestId, plan, mode } = parsed.data;

  const result = applyPatch(plan, mode, requestId);

  if (!result.success) {
    return NextResponse.json({ error: result.message, status: result.status }, { status: 422 });
  }

  return NextResponse.json({
    success: true,
    status: result.status,
    message: result.message,
    branchName: result.branchName,
  });
}
