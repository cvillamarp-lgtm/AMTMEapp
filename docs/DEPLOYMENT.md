# Deployment Vercel + Supabase

## 1) Variables de entorno

Define estas variables en Vercel y en tu entorno local:

```bash
XAI_API_KEY=
XAI_MODEL=grok-2-latest
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-pro

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STUDIO_STATE_KEY=primary

NEXT_PUBLIC_REQUIRE_AUTH=false
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

Notas:

- `SUPABASE_SERVICE_ROLE_KEY` solo en servidor (no exponer en cliente).
- `NEXT_PUBLIC_SITE_URL` debe ser el dominio final para callback de auth.

## 2) Supabase SQL

Ejecuta estas migraciones en orden:

1. `supabase/migrations/20260514_create_studio_state.sql`
2. `supabase/migrations/20260514_create_operational_tables.sql`

## 3) Auth en Supabase

Configura en Supabase Auth:

- Site URL: `NEXT_PUBLIC_SITE_URL`
- Redirect URLs:
  - `https://tu-dominio.com/auth/callback`
  - `http://localhost:3000/auth/callback` (local)

## 4) Modo de acceso

- `NEXT_PUBLIC_REQUIRE_AUTH=false`: la app funciona sin login obligatorio.
- `NEXT_PUBLIC_REQUIRE_AUTH=true`: middleware protege rutas y exige sesión.

## 5) Verificación final

```bash
npm install
npm run lint
npm run build
```

Con app levantada:

- Probar `/ia` con proveedor Grok y Gemini.
- Probar `/configuracion` y verificar tarjeta de persistencia.
- Si auth requerida está activa:
  - abrir `/auth/sign-in`
  - completar login por magic link
  - validar acceso a `/dashboard`.

## 6) Riesgos a vigilar

- Si faltan variables de Supabase, la app cae en modo local.
- Si activas auth y no configuras redirect URL, el callback falla.
- El estado remoto actual usa `studio_state` por owner; mantener `owner_id` alineado con `auth.uid()`.
