-- Migration: Create Landing CMS RLS Policies
-- Date: 2026-06-30
-- Description: Row-level security policies for CMS tables

-- ====== site_pages RLS ======

-- Public read: only published pages
drop policy if exists "site_pages_public_read" on public.site_pages;
create policy "site_pages_public_read"
  on public.site_pages
  for select
  to anon, authenticated
  using (
    payload->>'is_published' = 'true'
  );

-- Admin read: all pages
drop policy if exists "site_pages_admin_read" on public.site_pages;
create policy "site_pages_admin_read"
  on public.site_pages
  for select
  to authenticated
  using (
    public.is_cms_admin()
  );

-- Admin insert
drop policy if exists "site_pages_admin_insert" on public.site_pages;
create policy "site_pages_admin_insert"
  on public.site_pages
  for insert
  to authenticated
  with check (
    public.is_cms_admin()
  );

-- Admin update
drop policy if exists "site_pages_admin_update" on public.site_pages;
create policy "site_pages_admin_update"
  on public.site_pages
  for update
  to authenticated
  using (
    public.is_cms_admin()
  )
  with check (
    public.is_cms_admin()
  );

-- Admin delete
drop policy if exists "site_pages_admin_delete" on public.site_pages;
create policy "site_pages_admin_delete"
  on public.site_pages
  for delete
  to authenticated
  using (
    public.is_cms_admin()
  );

-- ====== site_sections RLS ======

-- Public read: visible sections from published pages
drop policy if exists "site_sections_public_read" on public.site_sections;
create policy "site_sections_public_read"
  on public.site_sections
  for select
  to anon, authenticated
  using (
    is_visible = true
    and exists (
      select 1 from public.site_pages
      where id = page_id
      and payload->>'is_published' = 'true'
    )
  );

-- Admin read: all sections
drop policy if exists "site_sections_admin_read" on public.site_sections;
create policy "site_sections_admin_read"
  on public.site_sections
  for select
  to authenticated
  using (
    public.is_cms_admin()
  );

-- Admin insert
drop policy if exists "site_sections_admin_insert" on public.site_sections;
create policy "site_sections_admin_insert"
  on public.site_sections
  for insert
  to authenticated
  with check (
    public.is_cms_admin()
  );

-- Admin update
drop policy if exists "site_sections_admin_update" on public.site_sections;
create policy "site_sections_admin_update"
  on public.site_sections
  for update
  to authenticated
  using (
    public.is_cms_admin()
  )
  with check (
    public.is_cms_admin()
  );

-- Admin delete
drop policy if exists "site_sections_admin_delete" on public.site_sections;
create policy "site_sections_admin_delete"
  on public.site_sections
  for delete
  to authenticated
  using (
    public.is_cms_admin()
  );

-- ====== site_content_history RLS ======

-- Admin read only
drop policy if exists "site_content_history_admin_read" on public.site_content_history;
create policy "site_content_history_admin_read"
  on public.site_content_history
  for select
  to authenticated
  using (
    public.is_cms_admin()
  );

-- Admin insert only
drop policy if exists "site_content_history_admin_insert" on public.site_content_history;
create policy "site_content_history_admin_insert"
  on public.site_content_history
  for insert
  to authenticated
  with check (
    public.is_cms_admin()
  );

-- Admin delete only
drop policy if exists "site_content_history_admin_delete" on public.site_content_history;
create policy "site_content_history_admin_delete"
  on public.site_content_history
  for delete
  to authenticated
  using (
    public.is_cms_admin()
  );

-- ====== cms_admin_users RLS ======

-- No public read
drop policy if exists "cms_admin_users_no_public" on public.cms_admin_users;
create policy "cms_admin_users_no_public"
  on public.cms_admin_users
  for select
  to anon
  using (false);

-- Admin read
drop policy if exists "cms_admin_users_admin_read" on public.cms_admin_users;
create policy "cms_admin_users_admin_read"
  on public.cms_admin_users
  for select
  to authenticated
  using (
    public.is_cms_admin()
  );

-- Admin insert
drop policy if exists "cms_admin_users_admin_insert" on public.cms_admin_users;
create policy "cms_admin_users_admin_insert"
  on public.cms_admin_users
  for insert
  to authenticated
  with check (
    public.is_cms_admin()
  );

-- Admin update
drop policy if exists "cms_admin_users_admin_update" on public.cms_admin_users;
create policy "cms_admin_users_admin_update"
  on public.cms_admin_users
  for update
  to authenticated
  using (
    public.is_cms_admin()
  )
  with check (
    public.is_cms_admin()
  );

-- Admin delete
drop policy if exists "cms_admin_users_admin_delete" on public.cms_admin_users;
create policy "cms_admin_users_admin_delete"
  on public.cms_admin_users
  for delete
  to authenticated
  using (
    public.is_cms_admin()
  );
