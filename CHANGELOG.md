# Changelog

## Fase 7 — QA final, documentación, deploy estable y cierre integral (PR #12)
- Auditoría de `main` y verificación técnica completa.
- Consolidación de documentación operativa final.
- Matriz de fases completadas con PRs #6 a #12.
- Guías de testing, deployment y operación.
- Cierre integral condicionado a CI verde, merge y validación post-merge.

## Fase 6 — Automatización controlada (PR #11)
- Implementación simulation-only con aprobación humana obligatoria.
- Política operativa de automatización y límites de uso.
- Rate limits: 10 tareas/hora, 50 tareas/día.
- Auditoría indefinida de decisiones.

## Fase 5 — Visual OS mínimo (PR #10)
- Librería visual AMTME con reglas de marca y validaciones.
- Documento de especificación visual.
- 12 funciones de validación con Zod.
- Suite de pruebas con 40+ casos.

## Fase 4 — Workspace operativo por episodio (PR #9)
- Flujo operativo por episodio y contexto de trabajo.
- Cobertura de pruebas de contexto.
- Página dinámica `/episodios/[episodeId]`.

## Fase 3 — Capa de datos Supabase (PR #8)
- Clientes browser/server y validación de entorno.
- Esquemas Zod de estado operativo con tests.
- Hardening de capa de datos.

## Fase 2 — Testing mínimo ampliado (PR #7)
- Estructura de testing estable con Vitest.
- Validación base de componentes y utilidades críticas.
- Setup de testing con jsdom y Testing Library.

## Fase 1 — Base técnica profesional (PR #6)
- Ajustes de calidad técnica, formato y scripts de verificación.
- Prettier, Husky, type-check, tsconfigs.
- Consolidación de base para evolución por fases.
