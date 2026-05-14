create table if not exists public.studio_state (
  owner_id text not null default 'public',
  key text primary key,
  payload jsonb not null,
  schema_version integer not null default 1,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

do $$
begin
  if exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'studio_state'
      and constraint_name = 'studio_state_pkey'
  ) then
    alter table public.studio_state drop constraint studio_state_pkey;
  end if;
exception
  when undefined_table then null;
end $$;

alter table public.studio_state
  add constraint studio_state_pkey primary key (owner_id, key);

create or replace function public.set_studio_state_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists studio_state_set_updated_at on public.studio_state;

create trigger studio_state_set_updated_at
before update on public.studio_state
for each row
execute function public.set_studio_state_updated_at();

alter table public.studio_state enable row level security;

drop policy if exists "studio_state_select_own" on public.studio_state;
drop policy if exists "studio_state_insert_own" on public.studio_state;
drop policy if exists "studio_state_update_own" on public.studio_state;
drop policy if exists "studio_state_delete_own" on public.studio_state;

create policy "studio_state_select_own"
on public.studio_state
for select
to authenticated
using (owner_id = auth.uid()::text);

create policy "studio_state_insert_own"
on public.studio_state
for insert
to authenticated
with check (owner_id = auth.uid()::text);

create policy "studio_state_update_own"
on public.studio_state
for update
to authenticated
using (owner_id = auth.uid()::text)
with check (owner_id = auth.uid()::text);

create policy "studio_state_delete_own"
on public.studio_state
for delete
to authenticated
using (owner_id = auth.uid()::text);