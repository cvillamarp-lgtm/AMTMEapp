-- Políticas para acceso público (owner_id = 'public') cuando auth no está requerida
-- Necesario para que la app funcione sin login

do $$
declare
  tables text[] := array[
    'episodes','content_pieces','metrics_monthly','metrics_episode',
    'monetization_leads','checklists','calendar_events','archive_items',
    'automation_rules','ai_history','app_config','master_sections','visual_assets','scripts'
  ];
  t text;
begin
  foreach t in array tables loop
    execute format('drop policy if exists "%s_public_all" on public.%I', t, t);
    execute format(
      'create policy "%s_public_all" on public.%I for all to anon, authenticated using (owner_id = ''public'') with check (owner_id = ''public'')',
      t, t
    );
  end loop;
end;
$$;

-- Agregar tabla scripts si no existe
create table if not exists public.scripts (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  workspace_key text not null default 'primary',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists scripts_owner_workspace_idx on public.scripts(owner_id, workspace_key);

drop trigger if exists scripts_set_updated_at on public.scripts;
create trigger scripts_set_updated_at before update on public.scripts for each row execute function public.set_row_updated_at();

alter table public.scripts enable row level security;

drop policy if exists "scripts_own_all" on public.scripts;
create policy "scripts_own_all" on public.scripts for all to authenticated using (owner_id = auth.uid()::text) with check (owner_id = auth.uid()::text);
drop policy if exists "scripts_public_all" on public.scripts;
create policy "scripts_public_all" on public.scripts for all to anon, authenticated using (owner_id = 'public') with check (owner_id = 'public');
