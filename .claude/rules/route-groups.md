---
paths:
  - "src/app/**"
---

- Route group `(public)` = landing pública en `/`. Sin auth. Sin StudioShell. Sin sidebar.
- Route group `(studio)` = todas las páginas operativas. Con StudioShell y sidebar.
- Root layout (`src/app/layout.tsx`) NO debe envolver con StudioShell.
- StudioShell solo se instancia en `src/app/(studio)/layout.tsx`.
- Middleware en `middleware.ts` ya maneja protección — no duplicar lógica en layouts.
- Rutas públicas declaradas en middleware: `/` y `/api/public/*`.
- No mover páginas entre grupos sin revisar layout del grupo destino.
