-- Migration: Create CMS Admin Function
-- Date: 2026-06-30
-- Description: Function to check if current user is CMS admin

create or replace function public.is_cms_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.cms_admin_users
    where user_id = auth.uid()
    and role = 'admin'
  );
$$;

grant execute on function public.is_cms_admin() to authenticated, anon;
