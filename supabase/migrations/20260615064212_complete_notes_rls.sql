-- P0 FIX: Completar RLS de notes con policies estrictas.
--
-- Las policies públicas fueron eliminadas pero necesitamos crear las privadas.
-- Exigir user_id = auth.uid() en todas las operaciones.
-- No permitir notas con user_id = null (notas públicas compartidas).

-- Verificar que user_id existe
alter table public.notes add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Crear índice para filtros por usuario
create index if not exists notes_user_id_idx on public.notes(user_id);

-- Habilitar RLS
alter table public.notes enable row level security;

-- Eliminar policies antiguas
drop policy if exists "Public read notes" on public.notes;
drop policy if exists "Public insert notes" on public.notes;
drop policy if exists "Public update notes" on public.notes;
drop policy if exists "Public delete notes" on public.notes;
drop policy if exists "Auth read own notes" on public.notes;
drop policy if exists "Auth insert own notes" on public.notes;
drop policy if exists "Auth update own notes" on public.notes;
drop policy if exists "Auth delete own notes" on public.notes;
drop policy if exists "notes_select_own" on public.notes;
drop policy if exists "notes_insert_own" on public.notes;
drop policy if exists "notes_update_own" on public.notes;
drop policy if exists "notes_delete_own" on public.notes;

-- Crear policies estrictas: solo auth.uid() = user_id
create policy "notes_select_own"
on public.notes
for select
to authenticated
using (auth.uid() = user_id);

create policy "notes_insert_own"
on public.notes
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "notes_update_own"
on public.notes
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "notes_delete_own"
on public.notes
for delete
to authenticated
using (auth.uid() = user_id);

-- No permitir user_id null para nuevas notas
do $$
begin
  if not exists (select 1 from public.notes where user_id is null) then
    alter table public.notes alter column user_id set not null;
  end if;
end;
$$;
