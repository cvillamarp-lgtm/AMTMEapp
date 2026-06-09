import { NextResponse } from 'next/server';
import { generateWithProvider } from '@/lib/ai-providers';
import {
  buildTitleOptimizationPrompt,
  type TitleOptimizationInput,
  type TitleOptimizationOutput,
} from '@/prompts/amtme-editorial';

function validateOptimizedTitle(original: string, optimized: string): string | null {
  if (!optimized?.trim()) return 'El título generado está vacío.';
  if (optimized.trim() === original.trim()) return 'El título generado es idéntico al original.';
  if (optimized.length > 100) return `El título tiene ${optimized.length} caracteres (máximo 100).`;
  if (/[\u{1F300}-\u{1FFFF}]/u.test(optimized)) return 'El título contiene emojis.';
  const upperCount = (optimized.match(/[A-ZÁÉÍÓÚ]/g) || []).length;
  if (upperCount > optimized.length * 0.6) return 'El título tiene exceso de mayúsculas.';
  return null;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as TitleOptimizationInput;

  if (!body.currentTitle?.trim()) {
    return NextResponse.json({ error: 'El título actual es obligatorio.' }, { status: 400 });
  }

  try {
    const prompt = buildTitleOptimizationPrompt(body);
    const raw = await generateWithProvider({
      provider: 'groq',
      prompt,
      systemPrompt:
        'Eres un estratega editorial de podcasts. Devuelve SOLO JSON válido, sin markdown ni texto adicional.',
    });

    const clean = raw.replace(/```json\n?|```/g, '').trim();
    const parsed = JSON.parse(clean) as TitleOptimizationOutput;

    const validationError = validateOptimizedTitle(body.currentTitle, parsed.optimizedTitle);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 422 });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al optimizar el título.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
