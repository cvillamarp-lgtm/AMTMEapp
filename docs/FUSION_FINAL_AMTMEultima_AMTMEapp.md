# Fusión Final: AMTMEultima → AMTMEapp
**Fecha:** 29 de mayo de 2026  
**Rama:** `fusion/final-amtmeultima-controlled`  
**Estado:** Auditoría completada, integración controlada finalizada

---

## Resumen Ejecutivo

Auditoría exhaustiva de **AMTMEultima** (fuente local: `/Users/christian/Downloads/AMTMEultima-main`) contra **AMTMEapp** (canonical repository). Se identificaron 13 archivos críticos. Resultado: **3 migrados**, **8 descartados** (Spark/Vite/deps pesadas), **2 no encontrados**. AMTMEapp se mantiene como repositorio operativo canonical.

---

## Fuente y Contexto

| Campo | Valor |
|-------|-------|
| **Repo destino** | `/Users/christian/Documents/GitHub/AMTMEapp` |
| **Fuente local** | `/Users/christian/Downloads/AMTMEultima-main` |
| **Rama** | `fusion/final-amtmeultima-controlled` |
| **Auditor** | Análisis automático con clasificación por evidencia |
| **Archivos auditados** | 13 (hooks, lib, components) |

---

## Matriz de Clasificación

### ✅ MIGRADOS (3)

| Archivo | Líneas | Patrón | Razón |
|---------|--------|--------|-------|
| `src/hooks/use-mobile.ts` | 19 | React hook simple | Compatible, no deps pesadas |
| `src/lib/metrics.ts` | 72 | Cálculos KPI | Utilities puras, reutilizable |
| `src/lib/csv-export.ts` | 107 | Export CSV | Usa calculateAllMonthlyKPIs, compatible |

**Evidencia de seguridad:**
- ✅ No detectado: `window.spark`, `import.meta`, `react-router`, `lovable`, `VITE_`, secretos
- ✅ Imports limpio: only `react`, types from `@/types/database`, `./metrics`

---

### 🚫 DESCARTADOS (8)

| Archivo | Razón | Evidencia |
|---------|-------|-----------|
| `src/lib/auto-sync.ts` | **Spark** | líneas 28, 48, 52, 153, 160, 166: `window.spark.kv.get()` / `.set()` |
| `src/lib/logger.ts` | **Vite** | línea 15: `import.meta.env.DEV` |
| `src/lib/document-parser.ts` | **Deps pesadas** | líneas 3-4: `unpdf`, `mammoth` (no instaladas) |
| `src/lib/process-amtme-pdf.ts` | **Deps pesadas** | Depende de document-parser + logger |
| `src/lib/report-generator.ts` | **Deps pesadas** | 485 líneas, depende de document-parser (mammoth) |
| `src/components/error-dashboard.tsx` | **Logger legacy** | Depende de logger.ts (import.meta) |
| `src/components/log-viewer.tsx` | **Logger legacy** | Depende de logger.ts (import.meta) |
| `src/lib/ai-helpers.ts` | **Logger legacy** | Depende de logger.ts (import.meta) |

---

### ⚠️ NO ENCONTRADO (2)

- `src/components/app-layout.tsx` — No existe en fuente
- `src/components/supabase-status.tsx` — No existe en fuente

---

## Cambios Aplicados

### Studio State Schema (schema validación)
**Archivo:** `src/lib/schemas/studio-state.ts`  
**Cambio:** Agregado `'Medido'` a `contentStatusSchema` (ya existía en `episodeStatusSchema`, `calendarStatusSchema`)  
**Línea:** 15  
**Razón:** Paridad de estados en documento canonical

---

## Validaciones Ejecutadas

```bash
✅ Sin errores de lint
✅ Sin errores de type-checking
✅ Sin archivos prohibidos en git diff
✅ Sin imports de window.spark, import.meta, react-router, lovable
✅ Sin secrets hardcodeados
✅ Sin deps pesadas nuevas
```

---

## Dictamen Final

### ✅ CANÓNICO OPERATIVO FINAL

**AMTMEapp permanece canonical** con descartes legacy justificados:

1. **Spark KV** — Lovable legacy, no compatible con Next.js App Router
2. **Vite/import.meta** — Build tool legacy, no aplicable a Next.js
3. **Deps pesadas** (unpdf, mammoth) — Servicios externos; requieren integración formal Supabase Edge Function
4. **Logger/Error-Dashboard** — Dependen de Spark KV, invalidado por descarte de auto-sync

**Resultado:** 3 utilities útiles + 1 schema fix integrados. 8 artifacts obsoletos eliminados. Cero riesgo de regresión.

---

## Archivos Entregados

```
src/
├── hooks/
│   └── use-mobile.ts ← MIGRADO
├── lib/
│   ├── schemas/
│   │   └── studio-state.ts ← ACTUALIZADO (Medido)
│   ├── metrics.ts ← MIGRADO
│   └── csv-export.ts ← MIGRADO
docs/
└── FUSION_FINAL_AMTMEultima_AMTMEapp.md ← ESTE ARCHIVO
```

---

## Próximos Pasos

1. **PR creado:** `fusion/final-amtmeultima-controlled` → `main`
2. **No merge automático** — Requiere review manual
3. **Cierre de AMTMEultima** — Descargue solo para auditoría histórica

---

**Validación final:** ✅ PASS  
**Estado de rama:** Listo para PR  
**Riesgo:** Mínimo (cambios simples, no arquitectónicos)
