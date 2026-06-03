/**
 * ai-studio.ts — Helper cliente para llamar al API route de IA desde el browser
 * Usa el endpoint /api/ia/generar que ya existe en el repo
 */

const SYSTEM_PROMPT = `Eres el asistente editorial de AMTME (A Mí Tampoco Me Explicaron), podcast en español para hombres hispanos 28-44 sobre amor, apego e identidad.
Voz: compañero, no guru. Tono sobrio, directo, sin autoayuda genérica.
Estructura narrativa: umbral → herida → símbolo → verdad → puente.
Responde siempre en español neutro latinoamericano. Sin asteriscos ni markdown en el output final.`;

export async function callAI(prompt: string, mode: string = 'Episodio'): Promise<string> {
  const res = await fetch('/api/ia/generar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      mode,
      provider: 'gemini',
      systemPrompt: SYSTEM_PROMPT,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || 'Error al generar con IA');
  }
  const data = await res.json() as { result?: string };
  return data.result || '';
}

export type PublicationPackage = {
  hooks: string[];
  captions: string[];
  frases: string[];
  reels: string[];
  carouselIdeas: string[];
  briefVisual: string;
  cta: string;
  checklist: string[];
  nextAction: string;
};

const PACKAGE_SYSTEM_PROMPT = `Eres el asistente editorial de AMTME (A Mí Tampoco Me Explicaron).
Voz: compañero honesto, no guru. Tono sobrio, directo, sin autoayuda genérica.
Español neutro latinoamericano. Sin asteriscos ni markdown.
El oyente objetivo: hombre hispano 28-44 años navegando amor, apego, identidad.`;

const PACKAGE_PROMPT = (text: string) => `A partir del siguiente contenido de AMTME, genera un paquete de publicación completo.

CONTENIDO:
${text}

Devuelve EXACTAMENTE este JSON sin markdown ni explicaciones adicionales:
{
  "hooks": ["hook1","hook2","hook3","hook4","hook5"],
  "captions": ["caption1","caption2","caption3"],
  "frases": ["frase1","frase2","frase3","frase4","frase5"],
  "reels": ["idea de reel 1","idea de reel 2","idea de reel 3"],
  "carouselIdeas": ["idea de carrusel 1","idea de carrusel 2","idea de carrusel 3"],
  "briefVisual": "descripcion visual detallada para diseñador o Midjourney",
  "cta": "una sola frase de accion suave, no imperativa",
  "checklist": ["item1","item2","item3","item4","item5"],
  "nextAction": "siguiente accion editorial concreta"
}

REGLAS:
- hooks: 5 frases de 8-12 palabras, segunda persona, tension emocional, sin autoayuda
- captions: 3 textos listos para Instagram, tono intimo, sin emojis
- frases: 5 citas recortables del episodio o derivadas, maximo 20 palabras cada una
- reels: 3 ideas de clip o reel con descripcion de 1 oracion
- carouselIdeas: 3 ideas de carrusel con titulo del carrusel y descripcion breve del hilo de slides
- briefVisual: 3-4 oraciones describiendo imagen, paleta Navy/Cian/Lima, composicion, atmosfera
- cta: una sola frase que invite sin obligar
- checklist: 5 items de publicacion listos para marcar
- nextAction: 1 sola accion concreta para hoy`;

export async function generatePublicationPackage(text: string): Promise<PublicationPackage> {
  const res = await fetch('/api/ia/generar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: PACKAGE_PROMPT(text),
      mode: 'Copy',
      provider: 'groq',
      systemPrompt: PACKAGE_SYSTEM_PROMPT,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || 'Error al generar paquete');
  }
  const data = await res.json() as { result?: string };
  const raw: string = data.result || '';
  try {
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean) as PublicationPackage;
  } catch {
    throw new Error('La IA no devolvio JSON valido. Intenta de nuevo.');
  }
}
