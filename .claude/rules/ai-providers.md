---
paths:
  - "src/lib/ai-providers.ts"
  - "src/app/api/**"
---

- Prioridad de providers: Groq > Gemini > Claude > Grok.
- Groq y Grok son OpenAI-compatible — mismo formato de request/response.
- Claude requiere headers distintos: `x-api-key` + `anthropic-version: 2023-06-01`.
- Gemini requiere `?key=API_KEY` en la URL — NO usa Bearer token.
- Gemini tiene estructura de respuesta diferente: `candidates[0].content.parts[].text`.
- Si falta API key: lanzar error con nombre exacto de la variable (`XAI_API_KEY`, etc.).
- Modelo Groq por defecto: `llama-3.1-8b-instant` (free tier friendly).
- No llamar providers desde el cliente — solo desde API routes o Server Components.
