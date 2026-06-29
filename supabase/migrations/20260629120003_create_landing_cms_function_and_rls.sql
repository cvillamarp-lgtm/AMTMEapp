-- Function to check if current user is CMS admin
CREATE OR REPLACE FUNCTION is_cms_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) > 0
    FROM cms_admins
    WHERE user_id = auth.uid()
      AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for landing_pages
-- Public can read published pages
CREATE POLICY landing_pages_public_read
  ON landing_pages
  FOR SELECT
  USING (is_published = TRUE);

-- CMS admins can read all
CREATE POLICY landing_pages_admin_read
  ON landing_pages
  FOR SELECT
  USING (is_cms_admin());

-- CMS admins can insert
CREATE POLICY landing_pages_admin_create
  ON landing_pages
  FOR INSERT
  WITH CHECK (is_cms_admin());

-- CMS admins can update
CREATE POLICY landing_pages_admin_update
  ON landing_pages
  FOR UPDATE
  USING (is_cms_admin())
  WITH CHECK (is_cms_admin());

-- CMS admins can delete
CREATE POLICY landing_pages_admin_delete
  ON landing_pages
  FOR DELETE
  USING (is_cms_admin());

-- RLS Policies for landing_sections
-- Public can read sections of published pages
CREATE POLICY landing_sections_public_read
  ON landing_sections
  FOR SELECT
  USING (
    is_visible = TRUE
    AND landing_page_id IN (
      SELECT id FROM landing_pages WHERE is_published = TRUE
    )
  );

-- CMS admins can read all sections
CREATE POLICY landing_sections_admin_read
  ON landing_sections
  FOR SELECT
  USING (is_cms_admin());

-- CMS admins can insert
CREATE POLICY landing_sections_admin_create
  ON landing_sections
  FOR INSERT
  WITH CHECK (is_cms_admin());

-- CMS admins can update
CREATE POLICY landing_sections_admin_update
  ON landing_sections
  FOR UPDATE
  USING (is_cms_admin())
  WITH CHECK (is_cms_admin());

-- CMS admins can delete
CREATE POLICY landing_sections_admin_delete
  ON landing_sections
  FOR DELETE
  USING (is_cms_admin());
