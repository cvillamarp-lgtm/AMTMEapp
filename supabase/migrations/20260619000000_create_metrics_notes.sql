-- Create metrics_notes table for per-user persistence of decision notes and AI reports
-- Replaces localStorage storage with Supabase while maintaining backward compatibility

create table if not exists public.metrics_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  item_key text not null,
  month_key text null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, kind, item_key)
);

-- Create indexes for query performance
create index if not exists metrics_notes_user_id_idx on public.metrics_notes(user_id);
create index if not exists metrics_notes_user_kind_idx on public.metrics_notes(user_id, kind);
create index if not exists metrics_notes_user_month_idx on public.metrics_notes(user_id, month_key);
create index if not exists metrics_notes_user_kind_item_idx on public.metrics_notes(user_id, kind, item_key);

-- Create trigger for updated_at
create or replace function public.set_metrics_notes_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists metrics_notes_set_updated_at on public.metrics_notes;
create trigger metrics_notes_set_updated_at
before update on public.metrics_notes
for each row
execute function public.set_metrics_notes_updated_at();

-- Enable RLS
alter table public.metrics_notes enable row level security;

-- Drop old policies if any
drop policy if exists "metrics_notes_select_own" on public.metrics_notes;
drop policy if exists "metrics_notes_insert_own" on public.metrics_notes;
drop policy if exists "metrics_notes_update_own" on public.metrics_notes;
drop policy if exists "metrics_notes_delete_own" on public.metrics_notes;

-- Create strict RLS policies: only authenticated users can access their own records
create policy "metrics_notes_select_own"
on public.metrics_notes
for select
to authenticated
using (auth.uid() = user_id);

create policy "metrics_notes_insert_own"
on public.metrics_notes
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "metrics_notes_update_own"
on public.metrics_notes
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "metrics_notes_delete_own"
on public.metrics_notes
for delete
to authenticated
using (auth.uid() = user_id);
