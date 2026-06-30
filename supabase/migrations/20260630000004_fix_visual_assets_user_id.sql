-- FASE 8E: Actualizar visual_assets para usar user_id en lugar de owner_id
-- Esto alinea el schema con el patrón usado en todas las demás tablas

-- 1. Agregar columna user_id si no existe
alter table if exists public.visual_assets
add column if not exists user_id uuid;

-- 2. Copiar valores de owner_id a user_id (owner_id es text, convertir a uuid)
-- Si owner_id es un UUID válido en formato text, convertirlo; si no, dejar NULL
update public.visual_assets
set user_id = case
  when owner_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  then owner_id::uuid
  else null
end
where user_id is null and owner_id is not null;

-- 3. Hacer user_id NOT NULL
alter table if exists public.visual_assets
alter column user_id set not null;

-- 4. Agregar FOREIGN KEY a auth.users si no existe
alter table if exists public.visual_assets
add constraint if not exists visual_assets_user_id_fk
  foreign key (user_id) references auth.users(id) on delete cascade;

-- 5. Crear índice para performance en queries by user_id
create index if not exists visual_assets_user_id_idx on public.visual_assets(user_id);

-- 6. Actualizar RLS policies para usar user_id
drop policy if exists "usuarios_leen_visual_assets_publicos" on public.visual_assets;
drop policy if exists "usuarios_crean_visual_assets_propios" on public.visual_assets;
drop policy if exists "usuarios_actualizan_visual_assets_propios" on public.visual_assets;
drop policy if exists "usuarios_borran_visual_assets_propios" on public.visual_assets;

alter table public.visual_assets enable row level security;

create policy "usuarios_leen_visual_assets_propios"
on public.visual_assets for select
using (user_id = auth.uid());

create policy "usuarios_crean_visual_assets_propios"
on public.visual_assets for insert
with check (user_id = auth.uid());

create policy "usuarios_actualizan_visual_assets_propios"
on public.visual_assets for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "usuarios_borran_visual_assets_propios"
on public.visual_assets for delete
using (user_id = auth.uid());

-- 7. Nota: owner_id y workspace_key se dejan como columnas legacy por compatibilidad
--    pero ya no son usadas por la capa de aplicación
