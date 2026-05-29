# Auditoría de Paridad: AMTMEultima → AMTMEapp

**Fecha:** 2026-05-29  
**Rama PR:** `copilot/merge-amtmeultima-into-amtmeapp`  
**PR:** #27 — [Merge AMTMEultima into AMTMEapp with controlled integration](https://github.com/cvillamarp-lgtm/AMTMEapp/pull/27)  
**Repositorio Canónico:** `cvillamarp-lgtm/AMTMEapp`  
**Repositorio Fuente:** `AMTMEultima` (local: `~/Downloads/AMTMEultima-main`)

---

## Resumen Ejecutivo

La consolidación de `AMTMEultima` en `AMTMEapp` está **COMPLETA** como base canónica. El repositorio `cvillamarp-lgtm/AMTMEultima` **no existe como repositorio público en GitHub** (retorna 404), confirmando que era un proyecto local del usuario. Toda la migración fue realizada en sesiones previas con acceso al ZIP local.

### Dictamen Final: 🟢 LISTO para revisión (PR abierto sin auto-merge)

**Validaciones actuales (2026-05-29):**

| Check | Resultado |
|-------|-----------|
| `npm run lint` | ✅ PASS — 0 errores |
| `npm run type-check` | ✅ PASS — 0 errores TypeScript |
| `npm run test` | ✅ PASS — 236/236 tests |
| `npm run build` | ✅ PASS — 31 rutas compiladas |
| `npm run verify` | ✅ PASS — cadena completa |

> **Mejora respecto a auditoría anterior (2026-05-27):** En esa fecha typecheck y build fallaban con errores en `.next/types/`. Esos errores fueron resueltos en PRs posteriores (incluyendo PR #26 — visual aesthetics).

---

## Contexto y Fuentes

### Repositorio AMTMEultima (fuente)

`cvillamarp-lgtm/AMTMEultima` → **404 Not Found** (no accesible públicamente)

- Era un proyecto local Vite + React 18 + React Router DOM
- Fue referenciado en sesiones previas como `~/Downloads/AMTMEultima-main`
- No está publicado como repositorio GitHub separado
- El repositorio más similar públicamente disponible es `cvillamarp-lgtm/archivo-3-amtme-os` (mismo stack: Vite + React 18 + TypeScript + Supabase + Radix UI)

### Confirmación de arquitectura legacy AMTMEultima

Según los documentos de auditoría previos (`DECISIONES_CANONICAS_UNIFICACION.md`):

| Aspecto | AMTMEultima (legacy) | AMTMEapp (canónico) |
|---------|---------------------|---------------------|
| Framework | Vite + React Router | **Next.js 16 App Router** ✅ |
| Auth | `supabase.ts` monolítico | **browser/server/middleware modular** ✅ |
| Validation | Yup | **Zod schemas** ✅ |
| State Studio | archivo monolítico | **8 módulos separados** ✅ |
| Testing | ausente/básico | **236 tests Vitest** ✅ |
| AI | módulo monolítico | **ai-providers + amtme-ai-core** ✅ |

---

## Auditoría de Paridad Completa

### ✅ YA MIGRADO en AMTMEapp

| Dominio | Módulo Legacy | Módulo Canónico | Observaciones |
|---------|--------------|-----------------|---------------|
| **Framework** | Vite + React Router | `next/` App Router | Winner canónico — SSR, auth middleware, API routes |
| **Auth** | `supabase.ts` monolítico | `src/lib/supabase/auth-browser.ts` `auth-server.ts` `auth-middleware.ts` | Separación browser/server (seguridad mejorada) |
| **Database** | `database.ts`, `database-service.ts`, `database-subscriptions.ts` | `src/lib/supabase/client.ts` + Supabase realtime | Integrado en cliente modular |
| **Validation** | `validation.ts` (Yup) | `src/lib/schemas/` (Zod) | Migrado a Zod: mejor type inference |
| **Database Types** | No tipado / basic | `src/lib/supabase/database.types.ts` | Tipos generados desde schema Supabase |
| **Environment** | Config dispersa | `src/lib/supabase/env.ts` | Centralizado + validado |
| **AI Core** | `ai.ts` + `ai-helpers.ts` | `src/lib/ai-providers.ts` + `src/lib/amtme-ai-core.ts` | Modularización 1→2 archivos |
| **AI Avanzada** | — | `src/lib/ai/prompt-engine.ts` + `src/lib/ai/amtmeAi.ts` | Nuevo en canónico |
| **Studio Suite** | monolítico | `src/lib/studio-backup.ts` `studio-context.ts` `studio-data.ts` `studio-generators.ts` `studio-persistence.ts` `studio-types.ts` `studio-utils.ts` `studio-verifier.ts` | 8 módulos especializados |
| **Visual OS** | básico/incompleto | `src/lib/visual-os.ts` `src/lib/visual/tokens.ts` `src/lib/visual/generators/` | Generadores modernos |
| **Automation** | Sin equivalente | `src/lib/automation.ts` | Rate limiting, human approval, audit trail |
| **Email / Resend** | `email-delivery.ts` (legacy) | `src/app/api/email/route.ts` + `src/lib/email/` | Resend SDK, templates React, auth guard |
| **IA API** | — | `src/app/api/ia/generar/route.ts` | Endpoint server-side |
| **AI Editor** | — | `src/app/api/ai-editor/` (6 endpoints) | Editor AI con historial y rollback |
| **Studio State** | — | `src/app/api/studio-state/route.ts` | Persistencia server-side |
| **Episodes** | — | `src/app/api/episodes/create/route.ts` | Creación de episodios |
| **Security** | — | `src/lib/core/security/SecurityService.ts` | Rate limiting, validación |
| **API Middleware** | — | `src/lib/core/api/withMiddleware.ts` | Middleware seguro |
| **Logging** | `logger.ts` básico | `src/lib/core/logging/` | Logging estructurado |
| **Errores** | básico | `src/lib/core/errors/` | Error types y manejo |
| **Text Utils** | — | `src/lib/text-utils.ts` | Truncado, normalización, clamp visual |
| **Componentes UI** | básico | `src/components/ui.tsx` `studio-shell.tsx` `module-page.tsx` | AMTME design system |
| **Estética Visual** | amtmeultima visual | PR #26 (merged 2026-05-29) | Navy `#001F36`, contraste, sidebar, botones |
| **Tests** | ausentes | 19 archivos de test — 236 tests | Cobertura completa |

**Total módulos migrados/superiores:** 31+ archivos TS, 8 módulos studio, 19 suites de test

---

### ⚠️ PENDIENTE FASE 2 (pospuestos deliberadamente)

| Módulo Legacy | Decisión | Justificación | Timeline |
|---------------|----------|---------------|----------|
| `report-generator.ts` (15.7 KB) | ⏳ Fase 2 | No MVP-critical; requiere pdf-lib + infra | Semanas 2-3 post-launch |
| `process-amtme-pdf.ts` (9.4 KB) | ⏳ Fase 2 | MVP acepta upload, procesamiento diferido | Semanas 2-3 post-launch |
| `auto-sync.ts` (5.9 KB) | ⏳ Fase 2 — MVP-lite | Sync manual suficiente en MVP; Vercel Cron en Fase 2 | Semanas 3-4 post-launch |

> Ver [`docs/DECISIONES_FUNCIONALES_LEGACY.md`](DECISIONES_FUNCIONALES_LEGACY.md) para justificación técnica detallada.

---

### ❌ DESCARTADO (no se migrará)

| Módulo Legacy | Razón de Descarte | Equivalente en Canónico |
|---------------|-------------------|------------------------|
| `install-spark-kv-fallback.ts` (3.0 KB) | Spark no está en stack; código muerto | Supabase como single source of truth |
| `spark-hooks.ts` (1.5 KB) | `useSparkSubscription` sin referentes | Supabase realtime (`supabase/client.ts`) |
| Vite config (`vite.config.ts`) | Reemplazado por Next.js | `next.config.mjs` |
| React Router DOM routing | Reemplazado por App Router | `src/app/*/page.tsx` file-based routing |
| `lovable-tagger` | Herramienta de plataforma externa | No aplica en Next.js |
| CSS chunk splitting (Vite) | No aplica | Next.js maneja optimización automáticamente |

> Ver [`docs/LEGACY_DESCARTADO.md`](LEGACY_DESCARTADO.md) para análisis completo de riesgo.

---

## Comparación con archivo-3-amtme-os (referencia pública)

`cvillamarp-lgtm/archivo-3-amtme-os` es el repositorio público más similar al stack de AMTMEultima (Vite + React 18 + Radix UI + Supabase). Se analizó para identificar funcionalidades adicionales potencialmente útiles.

### Funcionalidades en archivo-3-amtme-os NO presentes en AMTMEapp

| Feature | Estado | Razón |
|---------|--------|-------|
| Audio Studio (42.9 KB) | **Descartado** | Requiere Web Audio API + arquitectura diferente; no es parte del scope actual de AMTME Studio OS |
| Script Engine (ingesta → clean → semantico) | **Evaluado** | AMTMEapp tiene AI pipeline equivalente (`/ia`, `/api/ia/generar`); el modelo canónico es superior |
| Recharts (visualizaciones) | **Evaluado** | `/metricas` page existe en AMTMEapp; visualizaciones son responsabilidad de la UI layer — puede añadirse en Fase 2 sin dependencias de migración |
| Recovery System (ChunkGuard) | **Descartado** | Específico de Vite chunk splitting; Next.js tiene Error Boundaries nativos y no tiene este problema |
| 12 AI Agents especializados | **Descartado** | AMTMEapp tiene arquitectura AI más limpia y server-side; los "agents" de archivo-3 son client-only sin SSR |
| Content Factory (AssetGallery, PieceCard) | **Evaluado** | Funcionalidad cubierta por `/creador-visual`, `/episodios` en AMTMEapp |
| Seasonal/Sponsor management | **Evaluado** | No en scope MVP actual |
| `tailwind-merge` / `class-variance-authority` | **Evaluado** | AMTMEapp usa `clsx` consistentemente; añadir sin uso real no aporta valor |
| react-resizable-panels | **Descartado** | No hay caso de uso identificado actualmente |
| React Day Picker | **Evaluado** | `/calendario` existe; UI de calendario puede ser mejorada en Fase 2 |

**Conclusión sobre archivo-3-amtme-os:** Ningún módulo cumple los tres criterios simultáneamente: (1) faltante real, (2) compatible con Next.js App Router, y (3) de valor inmediato para MVP. Las adiciones se documentan para Fase 2.

---

## Estrategia de Historial

### Historial conservado
- Todo el historial de `AMTMEapp` se conserva intacto (es la base canónica)
- PR #26 (visual aesthetics) y todos los PRs previos son parte del historial

### Historial no conservado
- `AMTMEultima` era un repo local; su historial git no es accesible como repositorio remoto
- `archivo-3-amtme-os` tiene historial distinto e incompatible (Vite vs Next.js); importarlo crearía ruido arquitectónico sin beneficio

**Decisión:** Migración limpia con trazabilidad documentada. El origen de cada feature está documentado en los archivos `docs/MAPA_ARCHIVOS_MIGRADOS.md`, `docs/DECISIONES_FUNCIONALES_LEGACY.md` y `docs/DECISIONES_CANONICAS_UNIFICACION.md`.

---

## Rutas Activas en AMTMEapp

```
/ (redirect)
/auth/sign-in          — Autenticación
/auth/callback         — OAuth callback
/dashboard             — Panel principal
/episodios             — Lista de episodios
/episodios/[id]        — Editor de episodio
/ia                    — Módulo IA
/ia/editor             — AI Editor avanzado
/creador-visual        — Creación de contenido visual
/automatizacion        — Módulo de automatización
/calendario            — Calendario
/checklists            — Checklists
/configuracion         — Configuración
/contenido             — Contenido
/documento-maestro     — Documento maestro
/historico             — Histórico
/metricas              — Métricas
/monetizacion          — Monetización
/politica-operativa    — Política operativa
/verificador           — Verificador

API:
/api/email             — Email transaccional (Resend)
/api/ia/generar        — Generación IA
/api/ai-editor/*       — AI Editor (6 endpoints)
/api/episodes/create   — Creación episodios
/api/studio-state      — Estado del studio
```

---

## Riesgos Identificados y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Database subscriptions behavior | MEDIA | ALTO | QA de flujos realtime; Supabase realtime probado en tests |
| Report generation ausente en MVP | ALTA | MEDIO | Feature pospuesta deliberadamente; usuarios informados vía UX |
| PDF processing manual en MVP | ALTA | MEDIO | Upload aceptado, procesamiento diferido a Fase 2 |
| Auto-sync manual en MVP | ALTA | BAJO | Botón sync manual disponible; UX clara |
| Regresión en email delivery | BAJA | ALTO | Cubierto por tests existentes + auth guard en `/api/email` |
| AMTMEultima features no identificadas | BAJA | MEDIO | Repo no accesible; toda funcionalidad conocida fue evaluada y clasificada |

---

## Validaciones Ejecutadas en esta PR

```bash
$ npm install         ✅  Dependencias instaladas sin conflictos
$ npm run lint        ✅  ESLint: 0 errores, 0 warnings relevantes
$ npm run type-check  ✅  TypeScript: 0 errores (strict)
$ npm run test        ✅  Vitest: 236/236 tests PASS (19 suites, 6.28s)
$ npm run build       ✅  Next.js 16.2.6: 31 rutas compiladas
$ npm run verify      ✅  Cadena completa: lint + typecheck + test + build
```

> **Mejora desde auditoría anterior (2026-05-27):**  
> ❌ typecheck fallaba con TS6200/TS2300 en `.next/types/` → ✅ **RESUELTO**  
> ❌ build fallaba por typecheck → ✅ **RESUELTO**  
> 180 tests → **236 tests** (+56 tests añadidos en PRs posteriores)

---

## Documentos de Referencia

| Documento | Contenido |
|-----------|-----------|
| [`MAPA_ARCHIVOS_MIGRADOS.md`](MAPA_ARCHIVOS_MIGRADOS.md) | File-by-file migration map (58 archivos auditados) |
| [`DECISIONES_CANONICAS_UNIFICACION.md`](DECISIONES_CANONICAS_UNIFICACION.md) | 7 decisiones arquitectónicas finales |
| [`DECISIONES_FUNCIONALES_LEGACY.md`](DECISIONES_FUNCIONALES_LEGACY.md) | 6 servicios legacy clasificados con roadmap |
| [`LEGACY_DESCARTADO.md`](LEGACY_DESCARTADO.md) | Análisis de riesgo de servicios no migrados |
| [`REPORTE_UNIFICACION_AMTMEultima_AMTMEapp.md`](REPORTE_UNIFICACION_AMTMEultima_AMTMEapp.md) | Reporte completo de consolidación |
| [`VALIDACION_FINAL_UNIFICACION.md`](VALIDACION_FINAL_UNIFICACION.md) | Validación técnica (histórica) |
| [`AMTME_PHASES_COMPLETION.md`](AMTME_PHASES_COMPLETION.md) | Fases completadas del proyecto |

---

## Dictamen Final

🟢 **AMTMEapp está listo como repositorio canónico único, funcional y estable.**

- ✅ Migración controlada completada (31+ módulos)
- ✅ Decisiones de descarte documentadas y justificadas
- ✅ Validaciones técnicas 100% PASS
- ✅ Documentación de trazabilidad completa
- ✅ PR abierto para revisión (sin auto-merge)
- ⏳ 3 features pospuestas a Fase 2 con roadmap claro

**Próximos pasos (Fase 2, post-review):**
1. Implementar `report-generator.ts` con pdf-lib
2. Implementar `pdf-processor.ts` con pdf-parse
3. Implementar `auto-sync.ts` con Vercel Cron
4. Añadir visualizaciones Recharts en `/metricas`
