/**
 * ai-studio.ts — Helper cliente para llamar al API route de IA desde el browser
 * Usa el endpoint /api/ia/generar que ya existe en el repo
 */

const SYSTEM_PROMPT = `Eres el asistente editorial de AMTME (A Mí Tampoco Me Explicaron), podcast en español para hombres hispanos 28-44 sobre amor, apego e identidad.
Voz: compañero, no guru. Tono sobrio, directo, sin autoayuda genérica.
Estructura narrativa: umbral → herida → símbolo → verdad → puente.
Responde siempre en español neutro latinoamericano. Sin asteriscos ni markdown en el output final.`

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
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as any).error || 'Error al generar con IA')
  }
  const data = await res.json()
  return data.result || ''
}
