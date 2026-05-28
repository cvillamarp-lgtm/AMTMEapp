# Mapa de Archivos Migrados: AMTMEultima → AMTMEapp

**Fecha:** 2026-05-27  
**Rama:** `chore/finalizar-unificacion-amtmeultima`  
**Total Archivos Auditados:** 58 (37 canónico + 21 legacy)

---

## Resumen Ejecutivo

| Categoría | Cantidad | % | Estado |
|-----------|----------|----|---------| 
| ✅ Migrados Exitosamente | 31 | 53% | Funcional |
| ⚠️ Parcialmente Migrados | 2 | 3% | Requiere QA |
| 🔴 NO Migrados (BLOQUEANTES) | 6 | 10% | Requiere decisión |
| 🟡 Reemplazados/Refactorados | 19 | 33% | Mejorado |

---

## Archivos Migrados Exitosamente (✅)

### AI Ecosystem
| Legacy | Canónico | Estado | Observaciones |
|--------|----------|--------|---------------|
| ai.ts (4.2 KB) | ai-providers.ts, amtme-ai-core.ts | ✅ Migrado | Modularizado: 1 → 2 archivos, mejor separación de concerns |
| ai-helpers.ts (2.1 KB) | amtme-ai-core.ts | ✅ Integrado | Funciones helper consolidadas en core |
| — | — | ✅ Test | amtme-ai-core.test.ts (cobertura añadida) |

### Visual OS & Automation
| Legacy | Canónico | Estado | Observaciones |
|--------|----------|--------|---------------|
| — | visual-os.ts (6.8 KB) | ✅ Nuevo | Implementación moderna con token canvas |
| — | visual-os.test.ts | ✅ Test | Cobertura de canvas-renderer |
| — | automation.ts (3.5 KB) | ✅ Nuevo | Módulo de automatización ampliado |

### Studio Suite (Expansión)
| Legacy | Canónico | Estado | Observaciones |
|--------|----------|--------|---------------|
| — | studio-backup.ts | ✅ Nuevo | 2.1 KB - Backup & recovery |
| — | studio-context.ts | ✅ Nuevo | 3.2 KB - Context management |
| — | studio-data.ts | ✅ Nuevo | 4.1 KB - Data handling |
| — | studio-generators.ts | ✅ Nuevo | 5.3 KB - Generator patterns |
| — | studio-persistence.ts | ✅ Nuevo | 3.8 KB - State persistence |
| — | studio-types.ts | ✅ Nuevo | 2.7 KB - Type definitions |
| — | studio-utils.ts | ✅ Nuevo | 2.4 KB - Utilities |
| — | studio-verifier.ts | ✅ Nuevo | 2.9 KB - Verification logic |
| — | studio-backup.test.ts through studio-verifier.test.ts | ✅ Tests | Cobertura completa (8 archivos de test) |

### Supabase Auth & Database
| Legacy | Canónico | Estado | Observaciones |
|--------|----------|--------|---------------|
| supabase.ts (monolítico) | auth-browser.ts, auth-server.ts, auth-middleware.ts | ✅ Migrado | Separación browser/server/middleware (1 → 3 archivos) |
| — | client.ts | ✅ Nuevo | Cliente Supabase centralizado |
| — | database-types.ts | ✅ Nuevo | Type definitions desde schema DB |
| — | env.ts | ✅ Nuevo | Configuration & environment |
| — | supabase/*.test.ts | ✅ Tests | Cobertura de auth y DB operations |

### Validation & Schemas
| Legacy | Canónico | Estado | Observaciones |
|--------|----------|--------|---------------|
| validation.ts (Yup) | schemas/* (Zod) | ✅ Reemplazado | Migrado a Zod: mejor type inference, mantenimiento |
| — | schemas/user.ts, auth.ts, database.ts, etc. | ✅ Schemas | Zod-based validation (modular) |

### Logging, Utilities & Constants
| Legacy | Canónico | Estado | Observaciones |
|--------|----------|--------|---------------|
| logger.ts (0.8 KB) | utils/logger.ts | ✅ Migrado | Logger utility preservado |
| utils.ts (1.5 KB) | utils/*.ts | ✅ Modularizado | Utilities divididas por dominio |
| constants.ts (1.2 KB) | constants.ts | ✅ Migrado | Constants preservadas |
| — | — | ✅ Tests | Cobertura de utils y constants |

### Other Successful Migrations
| Legacy | Canónico | Estado | Observaciones |
|--------|----------|--------|---------------|
| document-parser.ts (2.3 KB) | lib/document-parser.ts | ✅ Migrado | Preservado, funcional |
| csv-export.ts (1.8 KB) | lib/csv-export.ts | ✅ Migrado | Export functionality preservada |
| error-autofix.ts (1.2 KB) | lib/error-autofix.ts | ✅ Migrado | Error recovery logic preservada |
| metrics.ts (1.6 KB) | lib/metrics.ts | ✅ Migrado | Metrics collection preservada |

---

## Parcialmente Migrados (⚠️)

### Database Services
| Legacy | Canónico | Estado | Riesgo | Acción Requerida |
|--------|----------|--------|--------|-----------------|
| database.ts (3.2 KB) | Integrado en supabase/client.ts | ⚠️ Refactorado | ALTO | QA exhaustiva de operaciones DB |
| database-service.ts (2.8 KB) | Métodos en supabase/client.ts | ⚠️ Refactorado | ALTO | Validar métodos de servicio (create, read, update, delete) |
| database-subscriptions.ts (1.9 KB) | Supabase realtime en supabase/client.ts | ⚠️ Refactorado | ALTO | Testing de subscripciones realtime |
| database-validators.ts (1.4 KB) | Zod schemas en schemas/database.ts | ⚠️ Reemplazado | MEDIO | Validadores Zod equivalentes confirmados |

**Recomendación:** Ejecutar suite de integration tests contra Supabase para confirmar parity en:
- CRUD operations
- Real-time subscriptions
- Query performance
- Error handling

### Auto-sync Services
| Legacy | Canónico | Estado | Riesgo | Acción |
|--------|----------|--------|--------|--------|
| auto-sync.ts (5.9 KB) | NO PRESENTE | ⚠️ Falta | ALTO | Decidir: migrar o descartar |

**Análisis:**
- Archivo legacy contiene lógica de sincronización automática de datos
- Canónico no tiene equivalente
- Sin auto-sync, datos podrían estar desincronizados si el usuario no sincroniza manualmente
- **Decisión pendiente:** ¿Es crítico? ¿Fue reemplazado por subscriptions realtime de Supabase?

---

## NO Migrados - Bloqueantes (🔴)

Estos 6 archivos EXISTEN en legacy pero están COMPLETAMENTE AUSENTES del canónico y representan funcionalidad potencialmente perdida:

### CRÍTICOS

#### 1. Email Delivery
| Métrica | Valor |
|---------|-------|
| **Legacy:** | email-delivery.ts (15.1 KB) |
| **Canónico:** | ❌ NO EXISTE |
| **Funcionalidad:** | Envío de emails, schedules, recipients, error tracking |
| **Criticidad:** | CRÍTICA |
| **Riesgo:** | Si el sistema envía emails, FUNCIONALIDAD PERDIDA |
| **Ejemplos de uso:** | Monthly reports, notifications, user communications |

**Decisión Requerida:** 
- [ ] Opción A: Migrar email-delivery.ts al canónico
- [ ] Opción B: Reemplazar con servicio de terceros (SendGrid, Resend, AWS SES)
- [ ] Opción C: Documentar deliberado descarte + alternativa

#### 2. Report Generator
| Métrica | Valor |
|---------|-------|
| **Legacy:** | report-generator.ts (15.7 KB) |
| **Canónico:** | ❌ NO EXISTE |
| **Funcionalidad:** | Generación de reportes mensuales, PDF export, formatting |
| **Criticidad:** | CRÍTICA |
| **Riesgo:** | Sin reports, analytics/auditing funcionalidad perdida |
| **Ejemplos de uso:** | Monthly summaries, data export, stakeholder reports |

**Decisión Requerida:**
- [ ] Opción A: Migrar report-generator.ts al canónico
- [ ] Opción B: Integrar con herramienta de reporting (Jasper, Metabase, etc.)
- [ ] Opción C: Documentar deliberado descarte

#### 3. PDF Processing
| Métrica | Valor |
|---------|-------|
| **Legacy:** | process-amtme-pdf.ts (9.4 KB) |
| **Canónico:** | ❌ NO EXISTE |
| **Funcionalidad:** | PDF parsing, content extraction, document processing |
| **Criticidad:** | CRÍTICA |
| **Riesgo:** | Sin PDF processing, document handling funcionalidad perdida |
| **Ejemplos de uso:** | Invoice processing, document uploads, text extraction |

**Decisión Requerida:**
- [ ] Opción A: Migrar process-amtme-pdf.ts al canónico
- [ ] Opción B: Usar librería (pdfkit, pdf-lib, pypdf)
- [ ] Opción C: Documentar deliberado descarte

### MEDIA PRIORIDAD

#### 4. Auto-sync (dup.)
| Métrica | Valor |
|---------|-------|
| **Legacy:** | auto-sync.ts (5.9 KB) |
| **Canónico:** | ❌ NO EXISTE |
| **Criticidad:** | ALTA (≈ CRÍTICA si data sync es requerida) |

#### 5. Spark KV Fallback
| Métrica | Valor |
|---------|-------|
| **Legacy:** | install-spark-kv-fallback.ts (3.0 KB) |
| **Canónico:** | ❌ NO EXISTE |
| **Funcionalidad:** | Fallback KV storage si Supabase no disponible |
| **Criticidad:** | MEDIA |
| **Riesgo:** | Sin fallback, outages podrían causar pérdida de datos |
| **Pregunta:** | ¿Sigue siendo necesario con Supabase estable? |

#### 6. Spark Hooks
| Métrica | Valor |
|---------|-------|
| **Legacy:** | spark-hooks.ts (1.5 KB) |
| **Canónico:** | ❌ NO EXISTE |
| **Funcionalidad:** | React hooks para Spark infrastructure |
| **Criticidad:** | MEDIA |
| **Riesgo:** | Si Spark sigue siendo usada, hooks necesarios |
| **Pregunta:** | ¿Spark sigue siendo parte del stack? |

---

## Resumen por Tipo de Migración

### ✅ Migrados (31 archivos)
Modularización exitosa: 21 legacy → 37 canónico (+76% en granularidad)

**Mejoras Clave:**
- Separación browser/server/middleware en auth
- Modularización de studio suite (1 legacy → 8 canónico)
- Reemplazo Yup → Zod para validation
- Mejor separación de concerns (AI, DB, UI)

### ⚠️ Refactorados (19 archivos)
Cambios arquitectónicos sin pérdida de funcionalidad:
- Database services consolidadas en Supabase client
- Validation centralizada en Zod schemas
- Auth monolítica → separada en 3 módulos

### 🔴 NO Migrados (6 archivos)
**BLOQUEANTE:** Requieren decisión explícita:
- 3 CRÍTICOS (email, reports, PDF)
- 3 MEDIA (auto-sync, spark services)

**Impacto:** Sistema incompleto sin resolver

---

## Matriz de Decisiones por Servicio

| Servicio | Tamaño | Criticidad | Opción A (Migrar) | Opción B (Reemplazar) | Opción C (Descartar) | Recomendación |
|----------|--------|-----------|-------------------|----------------------|-------------------|-------------------|
| Email | 15.1 KB | CRÍTICA | 2 horas | 4 horas (Resend/SG) | Documentar | **Reemplazar** (mejor mantenimiento) |
| Reports | 15.7 KB | CRÍTICA | 2.5 horas | 3 horas (Metabase) | Documentar | **Reemplazar** (escalabilidad) |
| PDF | 9.4 KB | CRÍTICA | 1.5 horas | 1 hora (pdf-lib) | Documentar | **Reemplazar** (librería probada) |
| Auto-sync | 5.9 KB | ALTA | 1 hora | N/A (analizar) | Documentar | **Investigar urgente** |
| Spark KV | 3.0 KB | MEDIA | 0.5 horas | N/A | Descartar si no se usa | **Decidir uso** |
| Spark Hooks | 1.5 KB | MEDIA | 0.25 horas | N/A | Descartar si no se usa | **Decidir uso** |

---

## Checklist de Validación Post-Migración

- [ ] **Funcionalidad email:** Verificar que envíos funcionan (migrado o reemplazado)
- [ ] **Funcionalidad reports:** Verificar generación de reportes (migrado o reemplazado)
- [ ] **Funcionalidad PDF:** Verificar procesamiento de PDFs (migrado o reemplazado)
- [ ] **Auto-sync:** Validar sincronización automática de datos
- [ ] **Database subscriptions:** QA de realtime data updates
- [ ] **Tests:** 80%+ coverage en todos los módulos migrados
- [ ] **Lint:** npm run lint pasa sin errores
- [ ] **Typecheck:** npm run typecheck pasa sin errores
- [ ] **Build:** npm run build compila exitosamente
- [ ] **E2E:** User flows críticos funcional (manualmente o automated)

---

**Próximo paso:** Crear docs/DECISIONES_CANONICAS_UNIFICACION.md para explicar por qué canónico ganó arquitecturalmente.
