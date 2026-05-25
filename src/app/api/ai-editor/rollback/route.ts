import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createRollback } from '@/lib/ai-editor/createRollback';
import { AiChangePlanSchema } from '@/lib/ai-editor/types';

const RollbackRequestSchema = z.object({
  requestId: z.string().min(1),
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

  const { requestId, plan } = parsed.data;

  const result = createRollback(plan, requestId);

  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 422 });
  }

  return NextResponse.json({
    success: true,
    message: result.message,
    restoredFiles: result.restoredFiles,
  });
}
