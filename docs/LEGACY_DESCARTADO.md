# Servicios Legacy Descartados: AMTMEultima → AMTMEapp

**Fecha:** 2026-05-27  
**Estado:** Análisis de 6 servicios legacy sin funcionalidad equivalente en AMTMEapp  
**Decisión:** PENDIENTE DECISIÓN FUNCIONAL (requiere decisión de negocio/arquitectura)

---

## Resumen Ejecutivo

Durante la unificación de repositorios, se identificaron **6 servicios legacy** en AMTMEultima que:
- NO tienen equivalente funcional en AMTMEapp
- NO fueron migrados en la consolidación actual
- REQUIEREN análisis de riesgo y decisión de funcionalidad antes de descarte final

Estos servicios se clasifican en **3 categorías de riesgo**:
1. **CRÍTICA** (email-delivery, report-generator, process-amtme-pdf) — impacto directo en usuarios
2. **ALTA** (auto-sync) — impacto en integridad de datos
3. **PROBABLE DESCARTE** (spark-kv-fallback, spark-hooks) — Spark dependency obsoleta

---

## Servicios Legacy Clasificados

### 1. **email-delivery.ts** — ✅ APROBADO MVP

**Funcionalidad:** Sistema de envío de emails transaccionales
- Envío de confirmaciones de registro
- Notificaciones de eventos de usuario
- Comunicaciones de soporte

**Decisión:** Implementar Resend antes de MVP launch

**Justificación:**
- ✅ Resend es email transaccional moderno con integración nativa Next.js
- ✅ Bajo overhead operacional (API client + templates React)
- ✅ Crítico para signup flow (confirmación obligatoria GDPR)
- ✅ Costo mínimo ($1-5 MRR para MVP)

**Bloqueante:** SÍ — MVP-critical

**Status:** ✅ EJECUTADO (ver [docs/DECISIONES_FUNCIONALES_LEGACY.md](DECISIONES_FUNCIONALES_LEGACY.md#1-email-deliveryts--aprobado-mvp))

---

### 2. **report-generator.ts** — CRÍTICA

**Funcionalidad:** Generación de reportes PDF/Excel
- Reportes de sesiones de usuario
- Exportación de datos de studio
- Reportes de analytics personalizado

**Riesgo:** 🔴 CRÍTICA
- **Impacto:** Usuarios no pueden exportar/ver reportes históricos
- **Usuarios Afectados:** Power users, enterprise customers
- **Datos Perdidos:** Históricos de sesiones no son accesibles
- **Negocios:** Feature prometida a clientes, blockedby para B2B

**Alternatives:**
- ✅ **pdf-lib** (Node.js) — Ligero, no requiere servidor externo
- ⚠️ **Puppeteer** — Más pesado, requiere browser headless
- ⚠️ **Lovable AI** — Generación asistida pero no determinística

**Bloqueante:** SÍ — Implementar pdf-lib antes de MVP

**Status:** ⏳ POSPUESTO FASE 2 (ver [docs/DECISIONES_FUNCIONALES_LEGACY.md](DECISIONES_FUNCIONALES_LEGACY.md#2-report-generatorts--pospuesto-fase-2))

---

### 3. **process-amtme-pdf.ts** — CRÍTICA

**Funcionalidad:** Procesamiento de PDFs cargados por usuario
- Parseo de contenido PDF
- Extracción de metadata
- Análisis de estructura

**Riesgo:** 🔴 CRÍTICA
- **Impacto:** Usuarios no pueden cargar/procesar documentos
- **Usuarios Afectados:** Usuarios que importan contenido externo
- **Datos Perdidos:** PDFs cargados no procesados
- **Negocios:** Feature central de onboarding, bloqueada sin esto

**Alternatives:**
- ✅ **pdf-parse** (Node.js) — Parsing básico, integrado con pdf-lib
- ⚠️ **pdfjs-dist** — Más robusto pero frontend-focused
- ⚠️ **Apache PDFBox** — Requiere Java, complejidad operacional

**Bloqueante:** SÍ — Implementar pdf-parse antes de MVP

**Status:** ⏳ POSPUESTO FASE 2 (ver [docs/DECISIONES_FUNCIONALES_LEGACY.md](DECISIONES_FUNCIONALES_LEGACY.md#3-process-amtme-pdftx--pospuesto-fase-2))

---

### 4. **auto-sync.ts** — ALTA

**Funcionalidad:** Sincronización automática de datos con sistemas externos
- Sync de calendarios (Google Calendar, Outlook)
- Sync de tareas (Todoist, Notion, Asana)
- Sync de storages (Google Drive, Dropbox)

**Riesgo:** 🟡 ALTA
- **Impacto:** Datos de usuario no sincronizados con fuentes externas
- **Usuarios Afectados:** Power users con integraciones multi-herramienta
- **Datos Perdidos:** Cambios externos no reflejados en AMTME
- **Negocios:** Feature diferenciadora, pero no MVP-critical

**Alternatives:**
- ✅ **Delayed MVP** — Lanzar sin auto-sync, agregar post-launch
- ⚠️ **Manual sync** — Usuario dispara sync on-demand (menos UX)
- ⚠️ **Webhook-based** — Provider notifica cambios (requiere infra)

**Bloqueante:** NO — Puede postergarse para fase 2

**Status:** ⏳ POSPUESTO FASE 2 (ver [docs/DECISIONES_FUNCIONALES_LEGACY.md](DECISIONES_FUNCIONALES_LEGACY.md#4-auto-synctx--pospuesto-fase-2))

---

### 5. **install-spark-kv-fallback.ts** — PROBABLE DESCARTE

**Funcionalidad:** Fallback para almacenamiento clave-valor si Spark KV no disponible
- Local cache en IndexedDB
- Degradación graceful si KV caída

**Riesgo:** 🟢 BAJA
- **Impacto:** Mínimo — es fallback, no funcionalidad principal
- **Usuarios Afectados:** Solo si Spark KV offline (raro)
- **Datos Perdidos:** Ninguno — fallback no modifica estado
- **Negocios:** Resilience feature, no core

**Context:** Spark no está en uso activo en AMTMEapp
- Spark dependency NO migrada
- KV fallback es defensive code para contingencia nunca activada

**Alternatives:**
- ✅ **DESCARTE SEGURO** — Eliminar, usar Supabase exclusivamente
- ⚠️ **Mantener** — Costo bajo pero código muerto

**Bloqueante:** NO — Seguro descartar

**Status:** ❌ ELIMINADO (ver [docs/DECISIONES_FUNCIONALES_LEGACY.md](DECISIONES_FUNCIONALES_LEGACY.md#5-install-spark-kv-fallbackts--descartado))

---

### 6. **spark-hooks.ts** — PROBABLE DESCARTE

**Funcionalidad:** React hooks para integración con Spark realtime
- useSparkSubscription
- useSparkData
- Sincronización de estado con Spark

**Riesgo:** 🟢 BAJA
- **Impacto:** Mínimo — Spark no en uso en AMTMEapp
- **Usuarios Afectados:** Ninguno — Spark no activo
- **Datos Perdidos:** Ninguno — código muerto
- **Negocios:** Sin impacto

**Context:** Supabase realtime es el equivalente en AMTMEapp
- spark-hooks es código legacy sin referentes
- No hay componentes usando useSparkSubscription en AMTMEapp

**Alternatives:**
- ✅ **DESCARTE SEGURO** — Eliminar, usar supabase/client realtime
- ⚠️ **Mantener** — Código muerto sin referentes

**Bloqueante:** NO — Seguro descartar

**Status:** ❌ ELIMINADO (ver [docs/DECISIONES_FUNCIONALES_LEGACY.md](DECISIONES_FUNCIONALES_LEGACY.md#6-spark-hooksts--descartado))

---

## Matriz de Decisión

| Servicio | Riesgo | Bloqueante | MVP | Alternativa | Status |
|----------|--------|-----------|-----|-------------|--------|
| email-delivery.ts | 🔴 CRÍTICA | ✅ SÍ | ✅ REQUERIDO | Resend | PENDIENTE |
| report-generator.ts | 🔴 CRÍTICA | ✅ SÍ | ✅ REQUERIDO | pdf-lib | PENDIENTE |
| process-amtme-pdf.ts | 🔴 CRÍTICA | ✅ SÍ | ✅ REQUERIDO | pdf-parse | PENDIENTE |
| auto-sync.ts | 🟡 ALTA | ❌ NO | ❌ POSTERGABLE | MVP-Lite | PENDIENTE |
| install-spark-kv-fallback.ts | 🟢 BAJA | ❌ NO | ❌ NO | DESCARTE | PROBABLE |
| spark-hooks.ts | 🟢 BAJA | ❌ NO | ❌ NO | DESCARTE | PROBABLE |

---

## Decisiones Pendientes

### Bloqueante Crítico #1: Email Delivery
**Decisión Requerida:** ¿Implementar Resend antes de MVP?
- **Option A:** Sí → Agregar Resend a package.json, implementar en `src/supabase/email-*.ts`
- **Option B:** No → Marcar como funcionalidad futura, MVP sin confirmaciones

**Recomendación:** Option A (Resend es ligero, costo bajo, crítico para UX)

---

### Bloqueante Crítico #2: Report Generator
**Decisión Requerida:** ¿Implementar pdf-lib antes de MVP?
- **Option A:** Sí → Agregar pdf-lib, implementar en `src/services/report-generator.ts`
- **Option B:** No → Marcar como funcionalidad futura, MVP sin reportes

**Recomendación:** Option A (pdf-lib es ligero, impacto alto en B2B)

---

### Bloqueante Crítico #3: PDF Processing
**Decisión Requerida:** ¿Implementar pdf-parse antes de MVP?
- **Option A:** Sí → Agregar pdf-parse, implementar en `src/services/pdf-processor.ts`
- **Option B:** No → Marcar como funcionalidad futura, MVP sin import de PDFs

**Recomendación:** Option A (crítico para onboarding)

---

### Alta Prioridad #1: Auto-Sync
**Decisión Requerida:** ¿Implementar auto-sync en MVP o postergarlo?
- **Option A:** Sí → Requiere infra de webhooks + schedulers (Vercel Cron)
- **Option B:** No → Posponer a fase 2, lanzar MVP sin integraciones externas

**Recomendación:** Option B (posponer, enfocarse en core features)

---

### Descarte Probable #1 & #2: Spark
**Decisión Requerida:** ¿Confirmar Spark como deprecated?
- **Option A:** Sí → Eliminar `spark-hooks.ts` e `install-spark-kv-fallback.ts`
- **Option B:** No → Mantener para posible re-activación futura

**Recomendación:** Option A (Supabase es replacement, Spark no activo)

---

## Próximos Pasos

1. ✅ Análisis completado — documento LEGACY_DESCARTADO.md generado
2. ⏳ **DECISIÓN PENDIENTE:** Confirmar opciones para 3 bloqueantes críticos (email, reports, PDF)
3. ⏳ **DECISIÓN PENDIENTE:** Confirmar opción para auto-sync (MVP-lite vs. completo)
4. ⏳ **DECISIÓN PENDIENTE:** Confirmar descarte de Spark (spark-hooks, spark-kv-fallback)
5. ✅ Una vez decisiones tomadas → Implementación de bloqueantes críticos
6. ✅ Una vez implementados → Merge a main con dictamen COMPLETO

---

**Estado:** 🔴 **BLOQUEADO POR DECISIONES DE NEGOCIO**  
**Responsable:** Arquitecto/Product Lead  
**Deadline:** Antes de MVP launch

