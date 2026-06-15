-- P0 FIX: Crear tabla studio_state con user_id y RLS estricta si no existe en remoto.
--
-- La tabla studio_state fué definida en 20260514002000 pero nunca se creó en remoto.
-- Este script crea la tabla con el contrato correcto: user_id uuid + payload jsonb.
-- RLS enforce auth.uid() = user_id (no hay modo público compartido).

create table if not exists public.studio_state (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, key)
);

-- Trigger para actualizar updated_at
create or replace function public.set_studio_state_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists studio_state_set_updated_at on public.studio_state;
create trigger studio_state_set_updated_at
before update on public.studio_state
for each row
execute function public.set_studio_state_updated_at();

-- Índices
create index if not exists studio_state_user_id_idx on public.studio_state(user_id);
create index if not exists studio_state_user_id_key_idx on public.studio_state(user_id, key);

-- RLS
alter table public.studio_state enable row level security;

-- Eliminar policies antiguas si existen
drop policy if exists "studio_state_select_own" on public.studio_state;
drop policy if exists "studio_state_insert_own" on public.studio_state;
drop policy if exists "studio_state_update_own" on public.studio_state;
drop policy if exists "studio_state_delete_own" on public.studio_state;
drop policy if exists "studio_state_public_all" on public.studio_state;

-- Crear policies estrictas: solo auth.uid() = user_id
create policy "studio_state_select_own"
on public.studio_state
for select
to authenticated
using (auth.uid() = user_id);

create policy "studio_state_insert_own"
on public.studio_state
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "studio_state_update_own"
on public.studio_state
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "studio_state_delete_own"
on public.studio_state
for delete
to authenticated
using (auth.uid() = user_id);
