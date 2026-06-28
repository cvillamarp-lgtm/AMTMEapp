-- ============================================================
-- Migration: 20260628000000_create_cms_tables.sql
-- CMS tables for AMTME landing page editor
-- ============================================================

-- ─────────────────────────────────────────
-- 1. Admin roles table (extends auth.users)
-- ─────────────────────────────────────────
create table if not exists public.admin_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.admin_roles is 'Maps auth.users to CMS admin roles. Only listed users can write CMS content.';

-- ─────────────────────────────────────────
-- 2. site_pages
-- ─────────────────────────────────────────
create table if not exists public.site_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  is_published boolean not null default false,
  seo_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.site_pages is 'Top-level pages. slug=landing for the homepage.';

-- ─────────────────────────────────────────
-- 3. site_sections
-- ─────────────────────────────────────────
create table if not exists public.site_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.site_pages(id) on delete cascade,
  section_key text not null,
  label text not null,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(page_id, section_key)
);

comment on table public.site_sections is 'Ordered sections within a page. content JSONB holds all section fields.';

-- ─────────────────────────────────────────
-- 4. site_blocks
-- ─────────────────────────────────────────
create table if not exists public.site_blocks (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.site_sections(id) on delete cascade,
  block_type text not null,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.site_blocks is 'Repeatable blocks inside sections (episodes, quotes, links, etc.).';

-- ─────────────────────────────────────────
-- 5. site_assets
-- ─────────────────────────────────────────
create table if not exists public.site_assets (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  url text not null,
  alt text,
  mime_type text,
  size_bytes integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.site_assets is 'Uploaded media assets referenced by CMS content.';

-- ─────────────────────────────────────────
-- 6. site_settings
-- ─────────────────────────────────────────
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.site_settings is 'Global site settings (social links, brand config, etc.).';

-- ─────────────────────────────────────────
-- 7. site_content_history
-- ─────────────────────────────────────────
create table if not exists public.site_content_history (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('page', 'section', 'block', 'setting')),
  entity_id uuid not null,
  changed_by uuid references auth.users(id) on delete set null,
  snapshot jsonb not null,
  change_note text,
  created_at timestamptz not null default now()
);

comment on table public.site_content_history is 'Immutable audit log of all CMS content changes.';

-- ─────────────────────────────────────────
-- 8. updated_at triggers
-- ─────────────────────────────────────────
create or replace function public.cms_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_admin_roles_updated_at
  before update on public.admin_roles
  for each row execute function public.cms_set_updated_at();

create trigger trg_site_pages_updated_at
  before update on public.site_pages
  for each row execute function public.cms_set_updated_at();

create trigger trg_site_sections_updated_at
  before update on public.site_sections
  for each row execute function public.cms_set_updated_at();

create trigger trg_site_blocks_updated_at
  before update on public.site_blocks
  for each row execute function public.cms_set_updated_at();

create trigger trg_site_assets_updated_at
  before update on public.site_assets
  for each row execute function public.cms_set_updated_at();

create trigger trg_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.cms_set_updated_at();

-- ─────────────────────────────────────────
-- 9. Helper function: is_cms_admin()
-- Checks if the current auth.uid() has an admin_roles entry.
-- Used in RLS policies — never hardcodes emails.
-- ─────────────────────────────────────────
create or replace function public.is_cms_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_roles
    where user_id = auth.uid()
      and role in ('admin', 'editor')
  );
$$;

comment on function public.is_cms_admin() is 'Returns true if the current authenticated user has a CMS admin/editor role.';

-- ─────────────────────────────────────────
-- 10. Enable RLS on all CMS tables
-- ─────────────────────────────────────────
alter table public.admin_roles enable row level security;
alter table public.site_pages enable row level security;
alter table public.site_sections enable row level security;
alter table public.site_blocks enable row level security;
alter table public.site_assets enable row level security;
alter table public.site_settings enable row level security;
alter table public.site_content_history enable row level security;

-- ─────────────────────────────────────────
-- 11. RLS policies
-- ─────────────────────────────────────────

-- admin_roles: only admins can read their own row; no public access
create policy "admin_roles_select_own"
  on public.admin_roles for select
  using (user_id = auth.uid());

create policy "admin_roles_admin_all"
  on public.admin_roles for all
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

-- site_pages: public can read published pages; admin can do anything
create policy "site_pages_public_read"
  on public.site_pages for select
  using (is_published = true);

create policy "site_pages_admin_all"
  on public.site_pages for all
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

-- site_sections: public can read visible sections of published pages
create policy "site_sections_public_read"
  on public.site_sections for select
  using (
    is_visible = true
    and exists (
      select 1 from public.site_pages
      where id = site_sections.page_id and is_published = true
    )
  );

create policy "site_sections_admin_all"
  on public.site_sections for all
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

-- site_blocks: public can read visible blocks of visible sections of published pages
create policy "site_blocks_public_read"
  on public.site_blocks for select
  using (
    is_visible = true
    and exists (
      select 1 from public.site_sections ss
      join public.site_pages sp on sp.id = ss.page_id
      where ss.id = site_blocks.section_id
        and ss.is_visible = true
        and sp.is_published = true
    )
  );

create policy "site_blocks_admin_all"
  on public.site_blocks for all
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

-- site_assets: public can read; admin can write
create policy "site_assets_public_read"
  on public.site_assets for select
  using (true);

create policy "site_assets_admin_write"
  on public.site_assets for all
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

-- site_settings: public can read; admin can write
create policy "site_settings_public_read"
  on public.site_settings for select
  using (true);

create policy "site_settings_admin_write"
  on public.site_settings for all
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

-- site_content_history: only admins can read history; inserts via admin only
create policy "site_content_history_admin_read"
  on public.site_content_history for select
  using (public.is_cms_admin());

create policy "site_content_history_admin_insert"
  on public.site_content_history for insert
  with check (public.is_cms_admin());

-- ─────────────────────────────────────────
-- 12. Indexes for performance
-- ─────────────────────────────────────────
create index if not exists idx_site_pages_slug on public.site_pages(slug);
create index if not exists idx_site_sections_page_id on public.site_sections(page_id);
create index if not exists idx_site_sections_sort on public.site_sections(page_id, sort_order);
create index if not exists idx_site_blocks_section_id on public.site_blocks(section_id);
create index if not exists idx_site_blocks_sort on public.site_blocks(section_id, sort_order);
create index if not exists idx_site_content_history_entity on public.site_content_history(entity_type, entity_id);
create index if not exists idx_admin_roles_user_id on public.admin_roles(user_id);
