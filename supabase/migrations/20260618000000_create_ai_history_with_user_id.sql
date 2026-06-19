-- Create ai_history table with user_id and RLS
-- Replaces legacy owner_id pattern with proper per-user isolation
-- Note: if table already exists, add missing columns for schema upgrade

create table if not exists public.ai_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_key text not null default 'editor-ia',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, workspace_key, created_at)
);

-- Upgrade existing table if needed
alter table public.ai_history add column if not exists workspace_key text default 'editor-ia';
alter table public.ai_history add column if not exists updated_at timestamptz default now();

-- Indexes for performance
create index if not exists ai_history_user_id_idx on public.ai_history(user_id);
create index if not exists ai_history_user_workspace_idx on public.ai_history(user_id, workspace_key);
create index if not exists ai_history_created_at_idx on public.ai_history(created_at desc);

-- Trigger para actualizar updated_at
create or replace function public.set_ai_history_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists ai_history_set_updated_at on public.ai_history;
create trigger ai_history_set_updated_at
before update on public.ai_history
for each row
execute function public.set_ai_history_updated_at();

-- RLS: strict per-user access
alter table public.ai_history enable row level security;

-- Remove any old policies
drop policy if exists "ai_history_select_all" on public.ai_history;
drop policy if exists "ai_history_insert_all" on public.ai_history;
drop policy if exists "ai_history_update_all" on public.ai_history;
drop policy if exists "ai_history_delete_all" on public.ai_history;

-- Create strict policies: only auth.uid() = user_id
create policy "ai_history_select_own"
on public.ai_history
for select
to authenticated
using (auth.uid() = user_id);

create policy "ai_history_insert_own"
on public.ai_history
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "ai_history_update_own"
on public.ai_history
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "ai_history_delete_own"
on public.ai_history
for delete
to authenticated
using (auth.uid() = user_id);
