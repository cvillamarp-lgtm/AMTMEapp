import { NextResponse } from 'next/server';
import { generateWithProvider } from '@/lib/ai-providers';
import { aiGenerateRequestSchema, formatZodError } from '@/lib/schemas';
import type { AIWorkMode } from '@/lib/studio-types';

const modeGuides: Record<AIWorkMode, string> = {
  Episodio: 'Devuelve un guion breve con estructura, hooks y CTA.',
  Copy: 'Devuelve copy listo para publicar con tono sobrio y claro.',
  Visual: 'Devuelve dirección visual y prompt de imagen en formato compacto.',
  Métricas: 'Devuelve insight operativo y la siguiente acción concreta.',
  Monetización: 'Devuelve un plan de seguimiento y el siguiente paso comercial.',
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as unknown;
  const parsedBody = aiGenerateRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ error: `Payload inválido: ${formatZodError(parsedBody.error)}` }, { status: 400 });
  }

  const { provider, prompt, systemPrompt: customSystemPrompt, mode, model } = parsedBody.data;
  const systemPrompt = [
    customSystemPrompt || 'Eres el asistente operativo de AMTME Studio OS.',
    mode ? modeGuides[mode] : 'Devuelve una respuesta concreta y utilizable.',
  ].join(' ');

  try {
    const result = await generateWithProvider({
      provider,
      prompt,
      systemPrompt,
      model,
    });

    return NextResponse.json({ provider, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo completar la solicitud de IA.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
