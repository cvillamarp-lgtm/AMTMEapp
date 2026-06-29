-- Migration: Create Landing CMS Tables
-- Date: 2026-06-30
-- Description: Core tables for landing page CMS with published/draft states

-- Table: site_pages
create table if not exists public.site_pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  payload jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_site_pages_user_id on public.site_pages(user_id);
create index if not exists idx_site_pages_slug on public.site_pages(slug);

alter table public.site_pages enable row level security;

-- Table: site_sections
create table if not exists public.site_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.site_pages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  section_key text not null,
  is_visible boolean default true,
  sort_order integer default 0,
  payload jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(page_id, section_key)
);

create index if not exists idx_site_sections_page_id on public.site_sections(page_id);
create index if not exists idx_site_sections_user_id on public.site_sections(user_id);
create index if not exists idx_site_sections_sort_order on public.site_sections(page_id, sort_order);

alter table public.site_sections enable row level security;

-- Table: site_content_history
create table if not exists public.site_content_history (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references public.site_pages(id) on delete cascade,
  section_id uuid references public.site_sections(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  change_type text not null default 'updated',
  old_payload jsonb,
  new_payload jsonb,
  snapshot jsonb,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create index if not exists idx_site_content_history_page_id on public.site_content_history(page_id);
create index if not exists idx_site_content_history_section_id on public.site_content_history(section_id);
create index if not exists idx_site_content_history_user_id on public.site_content_history(user_id);
create index if not exists idx_site_content_history_created_at on public.site_content_history(created_at);

alter table public.site_content_history enable row level security;

-- Table: cms_admin_users
create table if not exists public.cms_admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin',
  created_at timestamptz default now()
);

create index if not exists idx_cms_admin_users_role on public.cms_admin_users(role);

alter table public.cms_admin_users enable row level security;
