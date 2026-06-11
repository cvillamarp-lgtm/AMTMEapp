import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generatePatch } from '@/lib/ai-editor/generatePatch';
import { AiEditorModeSchema, AiChangePlanSchema } from '@/lib/ai-editor/types';
import { rateLimiter, extractRateLimitKey } from '@/lib/middleware/rateLimit';

const GeneratePatchRequestSchema = z.object({
  plan: AiChangePlanSchema,
  prompt: z.string().min(1),
  mode: AiEditorModeSchema.default('assisted'),
});

export async function POST(request: Request) {
  // Rate limiting check
  const key = extractRateLimitKey(request.headers);
  if (!rateLimiter.isAllowed(key)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Maximum 10 requests per minute.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

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
