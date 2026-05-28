import { NextResponse } from 'next/server';
import { z } from 'zod';
import { validatePatch } from '@/lib/ai-editor/validatePatch';
import { AiChangePlanSchema } from '@/lib/ai-editor/types';

const ValidateRequestSchema = z.object({
  plan: AiChangePlanSchema,
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = ValidateRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: `Payload inválido: ${parsed.error.issues.map((i) => i.message).join(', ')}` },
      { status: 400 }
    );
  }

  const { plan } = parsed.data;

  const result = await validatePatch(plan.diff, plan.riskLevel);

  return NextResponse.json({
    status: result.status,
    checks: result.checks,
    passed: result.passed,
    deferred: result.deferred,
    validationRun: result.validationRun,
  });
}
