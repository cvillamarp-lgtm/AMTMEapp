# CLAUDE.md — AMTMEapp

## Proyecto
Next.js 16 + TypeScript + Tailwind + Supabase. Deployed en Vercel.
Repo: `cvillamarp-lgtm/AMTMEapp` | Prod: `www.amitampocomeexplicaron.com`
Supabase project: `qzzxmsobuckxtbuwxdtt`

## Estilo de trabajo
- Outputs finales únicamente. Sin drafts, sin opciones, sin preguntas innecesarias.
- Español neutro en toda UI. Sin cursivas en el sistema visual.
- Infiere contexto y procede. Pregunta solo si bloquea ejecución.

## Landmines críticos

### Schema Supabase
- TODAS las tablas usan `payload jsonb`. Los campos de negocio van DENTRO de payload.
- Query pública: `.is('user_id', null)` — nunca `.eq('owner_id', 'public')`.
- `fromRow` debe hacer spread: `{ id, created_at, updated_at, user_id, ...row.payload }`.
- `toRow` = `{ user_id: null, payload: { ...campos } }`.
- No existen columnas directas para campos de negocio — todo en payload.

### Build
- Usar `npx next build` — NUNCA `npm run build` (cuelga por type-check).
- Para validar tipos: `npx tsc --noEmit` por separado.
- Hay dos `next.config` (`next.config.mjs` y `next.config.ts`) — no agregar un tercero.

### Git
- Si git se bloquea: `pkill -9 git && sleep 2 && rm -f .git/index.lock` antes de reintentar.
- Hay archivos `index 2..5` en `.git/` — son residuos, no tocar.
- Commit sin hooks: `git commit --no-verify`.

### Escritura de archivos
- Contenido con `!` o caracteres especiales shell: usar Python3 heredoc.
  ```bash
  python3 << 'PYEOF'
  content = """..."""
  with open("path", "w") as f: f.write(content)
  PYEOF
  ```
- zsh heredoc falla con `!` — no usar `cat > file << 'EOF'` para contenido con exclamaciones.

### Route groups
- `/src/app/(public)/` — landing pública, sin auth, sin StudioShell.
- `/src/app/(studio)/` — todas las páginas operativas, con StudioShell.
- Root layout NO envuelve la landing con StudioShell.
- No mover páginas entre grupos sin actualizar layouts.

### AI Providers
- Priority: Groq > Gemini > Claude > Grok.
- Groq es el proveedor gratuito principal: `GROQ_API_KEY`, modelo `llama-3.1-8b-instant`.
- Grok y Groq usan el mismo formato OpenAI-compatible.
- Claude usa headers distintos: `x-api-key` + `anthropic-version`.
- Gemini usa URL con `?key=` query param — no Bearer token.

### Variables de entorno pendientes en Vercel
- `ANTHROPIC_API_KEY` — pendiente
- `XAI_API_KEY` — pendiente  
- `GEMINI_API_KEY` — inválida, pendiente reemplazar
- `NEXT_PUBLIC_REQUIRE_AUTH=true` — pendiente activar en prod

### Otros
- No usar `window.spark` — es del stack antiguo (AMTMEultima).
- No usar Notion como base operativa.
- Colores: navy `#0c1f36`, amarillo `#e8ff40`, crema `#F5F2EA`, rojo `#E0211E`.
- El archivo `src/lib/studio-types.ts` define `AIProvider` — no redefinir inline.

## Skills relevantes
- `amtme-os` — sistema editorial completo AMTME
- `amtme-visual-pipeline` — pipeline visual por episodio
- `context-optimizer` — para mantener este archivo actualizado

## Context Maintenance
Si encuentras algo sorprendente o que causó error en este proyecto, marca como:
`CONTEXT_FLAG: [descripción del friction]`
Indica: ¿smell del codebase a corregir? ¿o regla de contexto faltante?
