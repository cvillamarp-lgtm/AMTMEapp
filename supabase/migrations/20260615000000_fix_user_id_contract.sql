-- P0 FIX: Unificar contrato de datos entre frontend (src/lib/database.ts) y Supabase.
--
-- Problema detectado:
--   - src/lib/database.ts (FASE 8E) lee/escribe usando `user_id` (uuid) y filtra
--     `.eq('user_id', auth.uid())`.
--   - Las migraciones existentes (20260514003000_create_operational_tables.sql)
--     crearon las 13 tablas operativas con `owner_id text`, sin columna `user_id`.
--   - 20260601000000_add_public_policies.sql agregó policies `owner_id = 'public'`,
--     creando un modo compartido público inconsistente con el contrato real del
--     frontend y con las reglas de seguridad del proyecto.
--
-- Esta migración:
--   1. Agrega `user_id uuid references auth.users(id)` a las 13 tablas operativas.
--   2. Elimina las policies públicas (`*_public_all`, `owner_id = 'public'`).
--   3. Elimina las policies basadas en `owner_id = auth.uid()::text`.
--   4. Crea policies estrictas `auth.uid() = user_id` para select/insert/update/delete.
--   5. Indexa `user_id` para las consultas de database.ts.
--
-- No se eliminan las columnas `owner_id` / `workspace_key` para evitar pérdida de
-- datos existentes; quedan como columnas heredadas sin uso por el frontend.

do $$
declare
  tables text[] := array[
    'master_sections','episodes','scripts','visual_assets','content_pieces',
    'metrics_monthly','metrics_episode','checklists','calendar_events',
    'archive_items','monetization_leads','automation_rules','ai_history','app_config'
  ];
  t text;
begin
  foreach t in array tables loop
    -- 1. Agregar columna user_id si no existe
    execute format(
      'alter table public.%I add column if not exists user_id uuid references auth.users(id) on delete cascade',
      t
    );

    -- Index para filtros por usuario
    execute format(
      'create index if not exists %I on public.%I(user_id)',
      t || '_user_id_idx', t
    );

    -- 2. Eliminar policies públicas compartidas (owner_id = 'public')
    execute format('drop policy if exists "%s_public_all" on public.%I', t, t);

    -- 3. Eliminar policies legacy basadas en owner_id = auth.uid()::text
    execute format('drop policy if exists "%s_own_all" on public.%I', t, t);

    -- 4. Crear policies estrictas basadas en user_id = auth.uid()
    execute format('drop policy if exists "%s_select_own" on public.%I', t, t);
    execute format('drop policy if exists "%s_insert_own" on public.%I', t, t);
    execute format('drop policy if exists "%s_update_own" on public.%I', t, t);
    execute format('drop policy if exists "%s_delete_own" on public.%I', t, t);

    execute format(
      'create policy "%s_select_own" on public.%I for select to authenticated using (user_id = auth.uid())',
      t, t
    );
    execute format(
      'create policy "%s_insert_own" on public.%I for insert to authenticated with check (user_id = auth.uid())',
      t, t
    );
    execute format(
      'create policy "%s_update_own" on public.%I for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())',
      t, t
    );
    execute format(
      'create policy "%s_delete_own" on public.%I for delete to authenticated using (user_id = auth.uid())',
      t, t
    );

    -- RLS debe seguir activo (ya estaba habilitado en la migración anterior)
    execute format('alter table public.%I enable row level security', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- studio_state: unificar a user_id (uuid) en lugar de owner_id (text)
-- ---------------------------------------------------------------------------

alter table public.studio_state add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Backfill best-effort: si owner_id ya contenía un uuid válido de auth.uid(), copiarlo.
update public.studio_state
set user_id = owner_id::uuid
where user_id is null
  and owner_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

drop policy if exists "studio_state_select_own" on public.studio_state;
drop policy if exists "studio_state_insert_own" on public.studio_state;
drop policy if exists "studio_state_update_own" on public.studio_state;
drop policy if exists "studio_state_delete_own" on public.studio_state;
drop policy if exists "studio_state_public_all" on public.studio_state;

create policy "studio_state_select_own"
on public.studio_state
for select
to authenticated
using (user_id = auth.uid());

create policy "studio_state_insert_own"
on public.studio_state
for insert
to authenticated
with check (user_id = auth.uid());

create policy "studio_state_update_own"
on public.studio_state
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "studio_state_delete_own"
on public.studio_state
for delete
to authenticated
using (user_id = auth.uid());

create index if not exists studio_state_user_id_idx on public.studio_state(user_id);

-- ---------------------------------------------------------------------------
-- notes: eliminar modo público compartido, exigir user_id = auth.uid()
-- ---------------------------------------------------------------------------

drop policy if exists "Public read notes" on notes;
drop policy if exists "Public insert notes" on notes;
drop policy if exists "Public update notes" on notes;
drop policy if exists "Public delete notes" on notes;

drop policy if exists "Auth read own notes" on notes;
drop policy if exists "Auth insert own notes" on notes;
drop policy if exists "Auth update own notes" on notes;
drop policy if exists "Auth delete own notes" on notes;

create policy "notes_select_own" on notes for select to authenticated using (auth.uid() = user_id);
create policy "notes_insert_own" on notes for insert to authenticated with check (auth.uid() = user_id);
create policy "notes_update_own" on notes for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notes_delete_own" on notes for delete to authenticated using (auth.uid() = user_id);

-- user_id ya no debe quedar nulo para notas nuevas: forzar NOT NULL solo si no hay
-- filas legacy con user_id null (no eliminamos datos existentes automáticamente).
do $$
begin
  if not exists (select 1 from public.notes where user_id is null) then
    alter table public.notes alter column user_id set not null;
  end if;
end;
$$;
