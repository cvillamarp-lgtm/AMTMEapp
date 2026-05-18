import type { AIProvider } from '@/lib/studio-types';

type GenerateAIInput = {
  provider: AIProvider;
  prompt: string;
  systemPrompt: string;
  model?: string;
};

function getProviderEnv(provider: AIProvider) {
  if (provider === 'grok') {
    return {
      apiKey: process.env.XAI_API_KEY,
      apiUrl: 'https://api.x.ai/v1/chat/completions',
      model: process.env.XAI_MODEL ?? 'grok-2-latest',
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
          ? String(
              (payload.error as { message?: unknown }).message ??
                `La API respondió con estado ${response.status}`
            )
          : `La API respondió con estado ${response.status}`;

    throw new Error(message);
  }

  return payload;
}

export async function generateWithProvider({
  provider,
  prompt,
  systemPrompt,
  model,
}: GenerateAIInput) {
  const env = getProviderEnv(provider);

  if (!env.apiKey) {
    throw new Error(`Falta configurar ${provider === 'grok' ? 'XAI_API_KEY' : 'GEMINI_API_KEY'}.`);
  }

  if (provider === 'grok') {
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

    if (!content) {
      throw new Error('Grok no devolvió contenido utilizable.');
    }

    return content;
  }

  const response = await fetch(
    `${env.apiUrl}/${encodeURIComponent(model ?? env.model)}:generateContent?key=${env.apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
        },
      }),
    }
  );

  const payload = (await readJsonResponse(response)) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const content = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? '')
    .join('')
    .trim();

  if (!content) {
    throw new Error('Gemini no devolvió contenido utilizable.');
  }

  return content;
}

export function getProviderLabel(provider: AIProvider) {
  return provider === 'grok' ? 'Grok' : 'Gemini';
}
