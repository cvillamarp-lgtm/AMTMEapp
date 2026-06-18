-- Ensure studio_state table exists with correct schema
-- This table should have been created by 20260615064210 but may not have been applied

create table if not exists public.studio_state (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, key)
);

-- Create trigger for updated_at if it doesn't exist
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

-- Create indexes
create index if not exists studio_state_user_id_idx on public.studio_state(user_id);
create index if not exists studio_state_user_id_key_idx on public.studio_state(user_id, key);

-- Enable RLS
alter table public.studio_state enable row level security;

-- Drop old policies if any
drop policy if exists "studio_state_select_own" on public.studio_state;
drop policy if exists "studio_state_insert_own" on public.studio_state;
drop policy if exists "studio_state_update_own" on public.studio_state;
drop policy if exists "studio_state_delete_own" on public.studio_state;
drop policy if exists "studio_state_public_all" on public.studio_state;

-- Create strict RLS policies
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
