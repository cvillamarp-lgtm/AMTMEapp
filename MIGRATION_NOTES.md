# Migration Notes - Consolidation Branch

Fecha: 2026-05-25
Rama: consolidate/merge-all-repos

## Objetivo
Consolidar en AMTMEapp una base técnica para absorber activos de los repos legacy (visual generators + AI pipeline + UI deps) sin romper producción.

## Integrado en esta ejecución
- Nuevo módulo visual tipado en `src/lib/visual/`:
  - `tokens.ts`
  - `canvas-renderer.ts`
  - `generators/carousel.ts`
  - `generators/episode-card.ts`
  - `generators/quote.ts`
  - `generators/story.ts`
  - `generators/shared.ts`
- Nuevo módulo AI tipado en `src/lib/ai/`:
  - `prompt-engine.ts`
  - `amtmeAi.ts`
- Dependencias merged en `package.json`:
  - Radix UI base, `react-hook-form`, `@hookform/resolvers`, `@tanstack/react-query`, `clsx`, `date-fns`, `lodash-es`.
- Pruebas nuevas:
  - `src/lib/visual/visual-module.test.ts`
  - `src/lib/ai/amtmeAi.test.ts`

## Validación ejecutada
- `npm install` ✅
- `npm run type-check` ✅
- `npm run test` ✅ (187 tests)
- `npm run lint` ✅
- `npm run build` ✅

## Bloqueadores encontrados
- No fue posible traer `repo1` y `repo3` por URL no accesible/privada desde este entorno.
- Por esa razón, no se copiaron archivos literales de esos repos; se implementó una base equivalente y segura dentro de AMTMEapp.

## Siguiente fase recomendada
1. Conectar URLs o acceso correcto a repos/zip fuente.
2. Comparar generadores reales vs implementación actual y portar diferencias.
3. Inyectar componentes de `src/components/ui` y `src/components/pages` del repo 3 con refactor Router -> Next App Router.
4. Crear PR desde `consolidate/merge-all-repos` a `main`.
