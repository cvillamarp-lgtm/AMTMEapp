import type { AIProvider } from '@/lib/studio-types';

type ProviderEnv = {
  apiKey: string | undefined;
  apiUrl: string;
  model: string;
};

type GenerateAIInput = {
  provider: AIProvider;
  prompt: string;
  systemPrompt: string;
  model?: string;
};

function getProviderEnv(provider: AIProvider): ProviderEnv {
  if (provider === 'groq') {
    return {
      apiKey: process.env.GROQ_API_KEY,
      apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
      model: process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile',
    };
  }
  if (provider === 'grok') {
    return {
      apiKey: process.env.XAI_API_KEY,
      apiUrl: 'https://api.x.ai/v1/chat/completions',
      model: process.env.XAI_MODEL ?? 'grok-2-latest',
    };
  }
  if (provider === 'claude') {
    return {
      apiKey: process.env.ANTHROPIC_API_KEY,
      apiUrl: 'https://api.anthropic.com/v1/messages',
      model: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-20250514',
    };
  }
  return {
    apiKey: process.env.GEMINI_API_KEY,
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    model: process.env.GEMINI_MODEL ?? 'gemini-1.5-pro',
  };
}

async function readJsonResponse(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    const message =
      typeof payload.error === 'string'
        ? payload.error
        : typeof payload.error === 'object' && payload.error !== null && 'message' in payload.error
          ? String((payload.error as { message?: unknown }).message ?? `La API respondio con estado ${response.status}`)
          : `La API respondio con estado ${response.status}`;
    throw new Error(message);
  }
  return payload;
}

export async function generateWithProvider({
  provider,
  prompt,
  systemPrompt,
  model,
}: GenerateAIInput): Promise<string> {
  const env = getProviderEnv(provider);

  if (!env.apiKey) {
    const keyName =
      provider === 'grok' ? 'XAI_API_KEY' :
      provider === 'groq' ? 'GROQ_API_KEY' :
      provider === 'claude' ? 'ANTHROPIC_API_KEY' : 'GEMINI_API_KEY';
    throw new Error(`Falta configurar ${keyName} en las variables de entorno.`);
  }

  // Groq y Grok — formato OpenAI compatible
  if (provider === 'grok' || provider === 'groq') {
    const response = await fetch(env.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model ?? env.model,
        temperature: 0.4,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
      }),
    });
    const payload = (await readJsonResponse(response)) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error(`${provider === 'groq' ? 'Groq' : 'Grok'} no devolvio contenido utilizable.`);
    return content;
  }

  // Claude
  if (provider === 'claude') {
    const response = await fetch(env.apiUrl, {
      method: 'POST',
      headers: {
        'x-api-key': env.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model ?? env.model,
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const payload = (await readJsonResponse(response)) as {
      content?: Array<{ type?: string; text?: string }>;
    };
    const content = payload.content?.find((b) => b.type === 'text')?.text?.trim();
    if (!content) throw new Error('Claude no devolvio contenido utilizable.');
    return content;
  }

  // Gemini
  const response = await fetch(
    `${env.apiUrl}/${encodeURIComponent(model ?? env.model)}:generateContent?key=${env.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4 },
      }),
    }
  );
  const payload = (await readJsonResponse(response)) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const content = payload.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('').trim();
  if (!content) throw new Error('Gemini no devolvio contenido utilizable.');
  return content;
}

export function getProviderLabel(provider: AIProvider) {
  if (provider === 'grok') return 'Grok';
  if (provider === 'groq') return 'Groq';
  if (provider === 'claude') return 'Claude';
  return 'Gemini';
}
