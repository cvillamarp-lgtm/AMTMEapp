# Decisiones Canónicas: Unificación AMTMEultima → AMTMEapp

**Fecha:** 2026-05-27  
**Rama:** `chore/finalizar-unificacion-amtmeultima`  
**Repositorio Canónico:** `/Users/christian/Documents/GitHub/AMTMEapp`  
**Estado:** Consolidación PARCIAL (~75%) con bloqueantes críticos pendientes

---

## Resumen Ejecutivo

Durante la auditoría de unificación, se tomaron **decisiones arquitectónicas explícitas** sobre cuál es el winner canónico para cada módulo clave. Estas decisiones se basan en:

1. **Modularización**: Separación de concerns
2. **Type Safety**: Tipado TypeScript strict
3. **Mantenibilidad**: Código limpio y bien organizado
4. **Performance**: Optimizaciones aplicadas
5. **Escalabilidad**: Patrones preparados para crecer

---

## Decisiones Canónicas Finales

### 1. **Next.js App Router (NOT Vite) - CANÓNICO**

**Winner:** AMTMEapp (Next.js 16.2.6 App Router)  
**Loser:** AMTMEultima (Vite-based architecture)  
**Razón:**

- ✅ App Router nativo = mejor file-based routing
- ✅ Server components + Client components = separación clara
- ✅ Built-in optimization (ISR, streaming, middleware)
- ✅ SSR auth integrado (Supabase + middleware.ts)
- ✅ Mejor soporte para SEO y metadatos

**Implicación:** NO migrar a Vite. La arquitectura de Next.js App Router es permanente.

**Validación:**
```bash
next --version  # 16.2.6
npm run build   # Debe completar sin errores
```

---

### 2. **Supabase Modular (NOT Legacy Monolith) - CANÓNICO**

**Winner:** AMTMEapp (modular: auth-browser.ts, auth-server.ts, auth-middleware.ts, supabase/client.ts)  
**Loser:** AMTMEultima (supabase.ts monolítico + database.ts + database-service.ts + database-subscriptions.ts)  
**Razón:**

- ✅ Separación browser/server/middleware = mejor security
- ✅ Client centralizado = single source of truth
- ✅ Type-safe database operations (database-types.ts)
- ✅ Environment configuration aislada (env.ts)
- ✅ Tests aislados para cada componente

**Implicación:** Eliminar integración monolítica. Usar estructura modular para:
- Authentication → supabase/auth-*.ts
- Database → supabase/client.ts + schemas/*
- Realtime → supabase/client.ts

**Validación:**
```bash
ls -la src/supabase/  # Debe tener auth-*.ts, client.ts, database-types.ts, env.ts
grep -r "Supabase" src/ | wc -l  # Centralizado, no disperso
```

---

### 3. **Zod Validation (NOT Yup/Dispersed) - CANÓNICO**

**Winner:** AMTMEapp (Zod schemas en schemas/*)  
**Loser:** AMTMEultima (Yup en validation.ts + validadores dispersos)  
**Razón:**

- ✅ Type inference automático (TypeScript → Zod schema)
- ✅ Better error messages
- ✅ Better runtime validation
- ✅ Modular schemas por dominio (user.ts, auth.ts, database.ts, etc.)
- ✅ Reusable en client + server

**Implicación:** Todas las validaciones → schemas/. NO mantener múltiples frameworks de validación.

**Validación:**
```bash
grep -r "yup" src/  # Debe ser vacío
grep -r "Zod\|z\." src/schemas/  # Debe tener múltiples
```

---

### 4. **Studio Ecosystem Modular (NOT Legacy Divided) - CANÓNICO**

**Winner:** AMTMEapp (8 módulos: studio-backup.ts, studio-context.ts, studio-data.ts, studio-generators.ts, studio-persistence.ts, studio-types.ts, studio-utils.ts, studio-verifier.ts)  
**Loser:** AMTMEultima (Studio code disperso, no consolidado)  
**Razón:**

- ✅ Cada responsabilidad en su archivo
- ✅ Tests para cada módulo
- ✅ Reutilizable en múltiples contextos
- ✅ Mantenible: cambios aislados

**Implicación:** Studio functionality → 8 archivos modularizados + tests. NO mezclar responsabilidades.

**Validación:**
```bash
ls -la src/studio-*.ts  # Debe tener 8 archivos
ls -la src/*.test.ts | grep studio  # Debe tener 8 tests
```

---

### 5. **Visual OS Modern (NOT Legacy Visual Legacy) - CANÓNICO**

**Winner:** AMTMEapp (visual-os.ts con token canvas, canvas-renderer.js, modern patterns)  
**Loser:** AMTMEultima (Visual implementation antigua)  
**Razón:**

- ✅ Modern canvas rendering
- ✅ Token-based design
- ✅ Better performance
- ✅ Extensible para futuros componentes

**Implicación:** Visual OS es la implementación definitiva. Usar para:
- Canvas rendering
- Token management
- UI automation

**Validación:**
```bash
npm run test -- visual-os.test.ts  # Debe pasar
grep -r "visual-os" src/  # Debe ser la única implementación
```

---

### 6. **AI Ecosystem Modularized (NOT ai.ts monolith) - CANÓNICO**

**Winner:** AMTMEapp (ai-providers.ts, amtme-ai-core.ts, modular design)  
**Loser:** AMTMEultima (ai.ts + ai-helpers.ts monolítico)  
**Razón:**

- ✅ Providers separados (OpenAI, etc.)
- ✅ Core logic aislado
- ✅ Helpers integrados
- ✅ Testeable

**Validación:**
```bash
npm run test -- amtme-ai-core.test.ts  # Debe pasar
```

---

## Matriz de Decisión

| Aspecto | Winner (Canónico) | Loser (Legacy) | Status | Risk |
|--------|-----------------|---------------|---------|----|
| Framework Web | Next.js App Router | Vite | ✅ FINAL | BAJO |
| Auth Architecture | Modular (3 files) | Monolith | ✅ FINAL | BAJO |
| Database Layer | Supabase Modular | Legacy DB services | ✅ FINAL | MEDIO |
| Validation | Zod Schemas | Yup + Disperso | ✅ FINAL | BAJO |
| Studio Code | 8 Módulos | Disperso | ✅ FINAL | BAJO |
| Visual OS | Modern Implementation | Legacy | ✅ FINAL | BAJO |
| AI Logic | Modular Providers | Monolith | ✅ FINAL | BAJO |

---

## No Hay Vuelta Atrás

Estas decisiones son **PERMANENTES**:

- ❌ NO migrar de Next.js a Vite
- ❌ NO volver a monolito Supabase
- ❌ NO mezclar Zod con otros frameworks
- ❌ NO desmodularizar Studio
- ❌ NO usar Visual OS legacy
- ❌ NO monolitar AI providers

---

## Próximos Pasos

1. ✅ Validar estas decisiones con npm run typecheck, lint, test
2. ⏳ Resolver 6 servicios legacy bloqueantes (email, pdf, reports, auto-sync, spark)
3. ✅ Documentar legacy descartado con análisis de riesgo
4. ✅ Ejecutar validación final
5. ⏳ Merge a main CON dictamen PARCIAL (si bloqueantes persisten)

---

**Dictamen Canónico:** ✅ **DECISIONES FINALES TOMADAS**  
**Próxima Acción:** Resolver bloqueantes + crear LEGACY_DESCARTADO.md
