import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generatePatch } from '@/lib/ai-editor/generatePatch';
import { AiEditorModeSchema, AiChangePlanSchema } from '@/lib/ai-editor/types';

const GeneratePatchRequestSchema = z.object({
  plan: AiChangePlanSchema,
  prompt: z.string().min(1),
  mode: AiEditorModeSchema.default('assisted'),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = GeneratePatchRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: `Payload inválido: ${parsed.error.issues.map((i) => i.message).join(', ')}` },
      { status: 400 }
    );
  }

  const { plan, prompt, mode } = parsed.data;

  const diff = generatePatch({
    affectedFiles: plan.affectedFiles,
    intent: plan.intent,
    summary: plan.summary,
    prompt,
    mode,
  });

  return NextResponse.json({ diff });
}
