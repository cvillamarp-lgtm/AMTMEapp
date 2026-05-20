# AMTME Studio OS

Sistema operativo editorial, documental y operativo para AMTME.

## Inicio rápido

```bash
npm install
npm run dev
```

## Verificacion tecnica

```bash
npm run verify
```

## Enfoque

- Dashboard operativo
- Documento maestro consultable
- Episodios CRUD
- Creador visual por prompt
- Generación de contenido
- Métricas
- Checklists
- Política operativa

## Variables de entorno de IA

```bash
XAI_API_KEY=
XAI_MODEL=grok-2-latest
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-pro
```

## Persistencia recomendada

La base recomendada para esta app es `Vercel + Supabase`.

La app sigue funcionando en modo local aunque Supabase no este configurado.
Cuando configuras Supabase, el estado operativo se sincroniza desde el servidor.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STUDIO_STATE_KEY=primary
NEXT_PUBLIC_REQUIRE_AUTH=false
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Modo de persistencia

- Sin Supabase: usa `localStorage`.
- Con Supabase: mantiene `localStorage` como respaldo local y sincroniza un estado remoto.

## Migracion minima de Supabase

Aplica la migracion en `supabase/migrations/20260514002000_create_studio_state.sql` para crear la tabla inicial `studio_state`.

## Migracion modular recomendada

Para dejar el proyecto listo para evolucionar por módulos, aplica tambien:

- `supabase/migrations/20260514003000_create_operational_tables.sql`

Este archivo crea tablas por módulo con payload JSONB + RLS por usuario autenticado.

## Autenticacion

La autenticacion de Supabase es opcional y se controla con:

- `NEXT_PUBLIC_REQUIRE_AUTH=false` modo sin login obligatorio.
- `NEXT_PUBLIC_REQUIRE_AUTH=true` modo protegido por middleware y login por enlace mágico.

## Deploy

Consulta la guia completa en `docs/DEPLOYMENT.md`.

## Estado operativo y documentación final

- Estado de fases y criterio de cierre: `docs/AMTME_PHASES_COMPLETION.md`
- Guía operativa: `docs/AMTME_OPERATING_GUIDE.md`
- Guía de testing: `docs/AMTME_TESTING.md`
- Guía de deploy de cierre: `docs/AMTME_DEPLOYMENT.md`
