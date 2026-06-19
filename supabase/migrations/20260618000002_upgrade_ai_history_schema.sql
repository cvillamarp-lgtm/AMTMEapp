-- Upgrade ai_history table schema to include payload if missing
-- The table was created with legacy schema and needs new columns
-- Make sure columns are nullable or have defaults for compatibility

-- Add payload column if missing
alter table public.ai_history add column if not exists payload jsonb default '{}'::jsonb;

-- Ensure engine, mode, model, prompt_summary, provider have defaults (for legacy compatibility)
-- These may have been added by earlier migrations with NOT NULL constraints
alter table public.ai_history alter column engine set default '';
alter table public.ai_history alter column mode set default '';
alter table public.ai_history alter column model set default '';
alter table public.ai_history alter column prompt_summary set default '';
alter table public.ai_history alter column provider set default '';

-- Ensure created_at and updated_at exist
alter table public.ai_history add column if not exists created_at timestamptz default now();
alter table public.ai_history add column if not exists updated_at timestamptz default now();

-- Ensure workspace_key exists and has default
alter table public.ai_history add column if not exists workspace_key text default 'editor-ia';

-- Make sure user_id is properly set up
alter table public.ai_history drop constraint if exists ai_history_user_id_fkey;
alter table public.ai_history add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Drop and recreate indexes
drop index if exists ai_history_user_id_idx;
drop index if exists ai_history_user_workspace_idx;
drop index if exists ai_history_created_at_idx;

create index if not exists ai_history_user_id_idx on public.ai_history(user_id);
create index if not exists ai_history_user_workspace_idx on public.ai_history(user_id, workspace_key);
create index if not exists ai_history_created_at_idx on public.ai_history(created_at desc);

-- Recreate trigger
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

-- Ensure RLS is enabled
alter table public.ai_history enable row level security;

-- Drop old policies
drop policy if exists "ai_history_public_all" on public.ai_history;
drop policy if exists "ai_history_own_all" on public.ai_history;
drop policy if exists "ai_history_select_all" on public.ai_history;
drop policy if exists "ai_history_insert_all" on public.ai_history;
drop policy if exists "ai_history_update_all" on public.ai_history;
drop policy if exists "ai_history_delete_all" on public.ai_history;
drop policy if exists "ai_history_select_own" on public.ai_history;
drop policy if exists "ai_history_insert_own" on public.ai_history;
drop policy if exists "ai_history_update_own" on public.ai_history;
drop policy if exists "ai_history_delete_own" on public.ai_history;

-- Create strict RLS policies
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
