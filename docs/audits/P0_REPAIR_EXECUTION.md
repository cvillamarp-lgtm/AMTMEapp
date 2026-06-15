# P0 Repair Execution — AMTMEapp

Fecha: 2026-06-15
Rama: `fix/p0-production-readiness`

## Resumen

Esta reparación cierra el riesgo crítico principal detectado en la auditoría
técnica (score 37/100): **mezcla de tres modelos de datos incompatibles**
entre Supabase (`owner_id text` + `payload jsonb`), el frontend (`database.ts`,
contrato FASE 8E basado en `user_id uuid` + `auth.uid()`), y un modo público
compartido (`owner_id = 'public'`) introducido en
`20260601000000_add_public_policies.sql`.

Estado previo: las tablas operativas (`episodes`, `content_pieces`, `checklists`,
etc.) **no tenían columna `user_id`**, mientras `src/lib/database.ts` ya
consultaba y escribía exclusivamente con `user_id = auth.uid()`. Resultado:
toda operación CRUD desde el frontend fallaría en producción contra el schema
real, y las policies públicas (`owner_id = 'public'`) quedaban como superficie
de riesgo sin uso real por el frontend pero habilitada en RLS.

El módulo de Notas tenía un UUID hardcodeado (`CHRISTIAN_UUID`), lectura con
filtro `user_id.is.null,user_id.eq.<uuid>` (modo compartido), e inserciones con
`user_id: null`.

## P0 corregidos

| ID | Problema | Estado | Archivos modificados | Evidencia |
| -- | -------- | ------ | --------------------- | --------- |
| P0-1 | Contrato de datos Supabase vs frontend incompatible (`owner_id text` vs `user_id uuid`) | RESUELTO | `supabase/migrations/20260615000000_fix_user_id_contract.sql` | Migración agrega `user_id uuid references auth.users(id)` + índices a las 13 tablas operativas y a `studio_state` |
| P0-2 | `studio_state` con modo público compartido / policies basadas en `owner_id` | RESUELTO (parcial: ruta API ya estaba corregida en working tree previo) | `src/app/api/studio-state/route.ts`, `src/lib/studio-persistence.ts` (sin cambios, ya usa `owner_id` interno hacia tabla — ver pendientes), migración | Ruta `GET/PUT /api/studio-state` exige sesión (401 sin `ownerId`); migración añade `user_id` + policies `auth.uid() = user_id` a `studio_state` |
| P0-3 | Notas con UUID hardcodeado, lectura pública, `user_id: null` | RESUELTO | `src/app/(studio)/notas/page.tsx`, `supabase/migrations/20260615000000_fix_user_id_contract.sql` | Eliminado `CHRISTIAN_UUID` y filtro `.or(...)`; ahora usa `auth.getSession()` + `.eq('user_id', userId)`; insert usa `user_id: userId` (nunca null); policies públicas de `notes` eliminadas, reemplazadas por `notes_*_own` (`auth.uid() = user_id`) |
| P0-4 | Eliminar UUID hardcodeado y `user_id: null` | RESUELTO | `src/app/(studio)/notas/page.tsx` | Igual que P0-3 |
| P0-5 | CRUD sin ownership (`updateOne`/`deleteOne` filtraban solo por `id`, riesgo IDOR) | RESUELTO | `src/lib/database.ts` | `updateOne` y `deleteOne` ahora exigen `activeUserId` y filtran `.eq('id', id).eq('user_id', activeUserId)`; `insertOne` lanza error explícito si no hay sesión (nunca inserta `user_id: null`) |
| P0-7 | Botones/acciones de Notas sin estado claro para usuario no autenticado | RESUELTO | `src/app/(studio)/notas/page.tsx` | Estado `authenticated`; UI muestra "Inicia sesion" y deshabilita "Nueva nota" cuando no hay sesión; errores de `NotAuthenticatedError` se muestran como toast útil |
| P0-10 | RLS permisiva / policies públicas (`*_public_all`, `owner_id = 'public'`) en 14 tablas + `notes` | RESUELTO | `supabase/migrations/20260615000000_fix_user_id_contract.sql` | Migración elimina explícitamente todas las policies `*_public_all` y `*_own_all` (legacy `owner_id`) y las reemplaza por `*_select_own` / `*_insert_own` / `*_update_own` / `*_delete_own` basadas en `user_id = auth.uid()` |

## Validaciones

| Validación | Resultado |
| ---------- | --------- |
| type-check (`npx tsc --noEmit`) | PASS |
| lint (`npm run lint`) | PASS |
| test (`npm run test`) | PASS — 243/243 tests (7 nuevos en `src/lib/database.test.ts`) |
| build (`npx next build`) | PASS — 37 rutas generadas correctamente |

## Cambios técnicos aplicados

### `supabase/migrations/20260615000000_fix_user_id_contract.sql` (nuevo)

- Agrega `user_id uuid references auth.users(id) on delete cascade` a las 13
  tablas operativas (`master_sections`, `episodes`, `scripts`, `visual_assets`,
  `content_pieces`, `metrics_monthly`, `metrics_episode`, `checklists`,
  `calendar_events`, `archive_items`, `monetization_leads`,
  `automation_rules`, `ai_history`, `app_config`).
- Crea índice `*_user_id_idx` en cada tabla.
- Elimina policies `*_public_all` (`owner_id = 'public'`) y `*_own_all`
  (legacy `owner_id = auth.uid()::text`).
- Crea policies `*_select_own` / `*_insert_own` / `*_update_own` /
  `*_delete_own` basadas en `user_id = auth.uid()`.
- `studio_state`: agrega `user_id uuid`, backfill best-effort desde `owner_id`
  cuando es un UUID válido, reemplaza policies por `auth.uid() = user_id`,
  agrega índice.
- `notes`: elimina las 8 policies públicas/legacy (`Public *`, `Auth * own
  notes`) y crea `notes_select_own` / `notes_insert_own` / `notes_update_own`
  / `notes_delete_own` (`auth.uid() = user_id`). Si no quedan filas legacy con
  `user_id IS NULL`, fuerza `user_id NOT NULL`.

Columnas legacy (`owner_id`, `workspace_key`) se conservan sin eliminar para no
perder datos existentes; quedan sin uso por el frontend.

### `src/app/(studio)/notas/page.tsx`

- Eliminado `CHRISTIAN_UUID` / `CHRISTIAN_UUID_FILTER` (UUID hardcodeado).
- Cambiado `getSupabaseBrowserClient` → `getSupabaseAuthBrowserClient` (cliente
  con sesión).
- `getNotes()` ahora retorna `{ notes, authenticated }`; sin sesión retorna
  `{ notes: [], authenticated: false }` (no expone notas públicas).
- `saveNote()` y `deleteNote()` exigen `userId` de sesión activa
  (`NotAuthenticatedError` si no hay sesión); insert usa `user_id: userId`
  (nunca `null`); update/delete filtran por `id` + `user_id`.
- Nuevo estado `authenticated` en el componente; UI muestra panel "Inicia
  sesion" cuando no hay sesión y deshabilita "Nueva nota".
- Manejo de errores: `reportError()` muestra el mensaje de
  `NotAuthenticatedError` o un fallback genérico vía `toast`.

### `src/lib/database.ts`

- Comentario de cabecera actualizado para reflejar el contrato real
  (`user_id uuid` + `payload jsonb`, RLS por `auth.uid()`).
- `insertOne`: lanza error explícito (`No autenticado: no se puede crear el
  registro.`) si no hay sesión, en vez de insertar con `user_id` implícito.
- `updateOne`: exige sesión; filtra `select` y `update` por
  `.eq('id', id).eq('user_id', activeUserId)` (antes solo `id`, riesgo IDOR).
- `deleteOne`: exige sesión; filtra `.eq('id', id).eq('user_id',
  activeUserId)` (antes solo `id`, riesgo IDOR).

### `src/lib/database.test.ts` (nuevo)

7 tests que protegen específicamente los bugs corregidos:

- `getAll` retorna `[]` sin sesión y no llama a Supabase.
- `getAll` filtra por `user_id = auth.uid()` con sesión.
- `createEpisode` lanza error explícito sin sesión, sin llamar a Supabase.
- `updateEpisode` filtra por `id` + `user_id` (anti-IDOR).
- `updateEpisode` lanza error explícito sin sesión.
- `deleteEpisode` filtra por `id` + `user_id` (anti-IDOR).
- `deleteEpisode` lanza error explícito sin sesión.

### `src/app/api/studio-state/route.ts`, `src/app/layout.tsx`, `tailwind.config.ts`

Cambios presentes en el working tree al iniciar esta sesión (de una ejecución
previa de esta misma reparación P0): `studio-state/route.ts` ya exige sesión
(`resolveOwnerId` retorna `null` sin sesión → 401), y `layout.tsx` /
`tailwind.config.ts` agregan fuentes (`Inter`, `Josefin Sans`, `Special
Elite`) y `robots: { index: false, follow: false }`. Se incluyen en el mismo
commit por ser parte del estado de la rama `fix/p0-production-readiness`.

## Riesgos eliminados

- Modo público compartido (`owner_id = 'public'`) en 14 tablas + `notes`.
- UUID hardcodeado (`c5b87e86-8520-42a1-b9b4-48f8315a147a`) como identidad
  implícita de usuario.
- Inserciones de notas con `user_id: null` (notas "privadas" que en realidad
  eran públicas por policy).
- IDOR en `updateOne`/`deleteOne`: cualquier usuario autenticado podía
  potencialmente actualizar/eliminar filas de otro usuario por `id` si RLS no
  cubría el caso (ahora doble defensa: filtro explícito + RLS).
- Desalineación de contrato Supabase/frontend que habría causado fallos
  silenciosos o errores opacos de Supabase en cada operación CRUD en
  producción (columna `user_id` inexistente).

## Riesgos pendientes

1. **Migración debe aplicarse en Supabase remoto (`qzzxmsobuckxtbuwxdtt`)**.
   El archivo `supabase/migrations/20260615000000_fix_user_id_contract.sql`
   está creado pero no se ejecutó contra la base remota desde este entorno
   (no se hizo deploy/push de DB, según restricciones de la tarea). Hasta que
   se aplique, las tablas operativas seguirán sin columna `user_id` en
   producción y el frontend (`database.ts`) seguirá fallando en runtime real.
   **Acción requerida**: ejecutar la migración vía `supabase db push` o SQL
   Editor antes de promover esta rama.

2. **Filas legacy con `owner_id = 'public'` o `user_id IS NULL`**. La
   migración no elimina ni reasigna datos existentes creados bajo el modo
   público compartido. Esas filas quedarán inaccesibles (ningún `user_id`
   coincide con `auth.uid()`) hasta que se decida una estrategia de migración
   de datos (asignar a un usuario real o archivar).

3. **`src/lib/studio-persistence.ts`** sigue usando `owner_id` como nombre de
   parámetro/columna hacia `studio_state` (coherente con la migración, que
   añade `user_id` pero mantiene `owner_id` como columna legacy). Revisar en
   fase P1 si conviene migrar `studio-persistence.ts` a `user_id` puro y
   eliminar `owner_id` de `studio_state` por completo.

4. **Auditoría completa de placeholders (Instagram, IA/editor, calendario,
   métricas, dashboard)** — fuera del alcance ejecutado en esta sesión por
   tiempo. Pendiente para P1 (ver siguiente fase).

5. **Unificación completa del flujo Episodio → Guion → Contenido → Checklist →
   Calendario → Métricas** y auditoría exhaustiva de botones/formularios — no
   ejecutada en esta sesión; requiere revisión página por página.

## Deploy

No se realizó deploy manual ni push de base de datos. Vercel puede generar un
preview automático al hacer push de la rama `fix/p0-production-readiness`
(según configuración estándar del proyecto), pero no se promovió a producción.

## Criterio de listo

- [x] type-check, lint, test y build pasan.
- [x] Contrato `user_id`/`payload` documentado y aplicado a nivel de migración
      + frontend (`database.ts`).
- [x] Notas sin UUID hardcodeado, sin modo público, ownership real.
- [x] `updateOne`/`deleteOne`/`insertOne` exigen ownership explícito.
- [ ] Migración aplicada contra Supabase remoto (pendiente, acción manual
      fuera de este entorno).
- [ ] Auditoría de placeholders y flujo central (P1).

## Siguiente fase (P1, sin ejecutar)

1. Aplicar `20260615000000_fix_user_id_contract.sql` contra Supabase remoto y
   verificar con datos reales (smoke test CRUD por tabla).
2. Decidir y ejecutar estrategia de migración de datos legacy
   (`owner_id = 'public'` / `user_id IS NULL`).
3. Auditar y corregir placeholders engañosos: Instagram, IA/editor, calendario,
   métricas, botones "Publicar"/"Conectar"/"Programar"/"Generar con
   IA"/"Mejorar con IA"/"Descargar"/"Duplicar".
4. Unificar dashboard a una sola fuente de verdad y validar accesos rápidos /
   acciones recomendadas (`use-next-best-actions.ts`).
5. Reconstruir y validar el flujo central Episodio → Guion → Contenido →
   Checklist → Calendario → Métricas extremo a extremo.
6. Auditoría completa de botones/formularios críticos (loading/error/success,
   prevención de doble envío, estados disabled).
7. Revisar `studio-persistence.ts` / `studio_state` para eliminar `owner_id`
   legacy y consolidar en `user_id`.
8. Ampliar cobertura de tests (objetivo 80%) para los módulos corregidos en
   P1.
