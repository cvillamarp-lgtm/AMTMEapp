-- Settings table for centralized configuration management
-- IMPORTANT: This migration is prepared but NOT YET EXECUTED
-- Execution happens in PHASE 3 after module migration and testing complete

CREATE TABLE IF NOT EXISTS settings (
  id BIGSERIAL PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  value_type TEXT,
  edit_mode TEXT DEFAULT 'editable',
  affected_modules TEXT[] DEFAULT '{}'::TEXT[],
  allowed_roles TEXT[] DEFAULT '{owner}'::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),

  UNIQUE(workspace_id, category, key)
);

-- Audit log for settings changes
CREATE TABLE IF NOT EXISTS settings_audit_log (
  id BIGSERIAL PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  key TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  affected_modules TEXT[] DEFAULT '{}'::TEXT[],
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  change_source TEXT DEFAULT 'ui',
  change_reason TEXT,

  INDEX idx_settings_audit_workspace (workspace_id),
  INDEX idx_settings_audit_category (workspace_id, category),
  INDEX idx_settings_audit_changed_at (changed_at DESC)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_settings_workspace_category
  ON settings(workspace_id, category);

CREATE INDEX IF NOT EXISTS idx_settings_key
  ON settings(workspace_id, key);

-- RLS Policies (adjust according to your auth model)
-- Owner can see all settings
-- Admin can update own workspace settings
-- Editor can read workspace settings
-- Viewer can read workspace settings

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Owners can see all settings in their workspace
CREATE POLICY "workspace_owners_can_read_settings"
  ON settings FOR SELECT
  USING (
    workspace_id IN (
      SELECT id FROM workspaces
      WHERE owner_id = auth.uid()
    )
  );

-- Policy: Workspace admins can update settings
CREATE POLICY "workspace_admins_can_update_settings"
  ON settings FOR UPDATE
  USING (
    workspace_id IN (
      SELECT id FROM workspaces
      WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces
      WHERE owner_id = auth.uid()
    )
  );

-- Policy: Admins can insert settings
CREATE POLICY "workspace_admins_can_insert_settings"
  ON settings FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces
      WHERE owner_id = auth.uid()
    )
  );

-- Policy: Audit log is read-only for workspace users
CREATE POLICY "workspace_users_can_read_audit_log"
  ON settings_audit_log FOR SELECT
  USING (
    workspace_id IN (
      SELECT id FROM workspaces
      WHERE owner_id = auth.uid()
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER settings_updated_at_trigger
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_settings_updated_at();

-- Seed default settings for new workspaces (optional)
-- This can be populated via a trigger on workspace creation or manually
-- INSERT INTO settings (workspace_id, category, key, value, value_type, edit_mode, affected_modules)
-- VALUES
--   ('workspace-id', 'general', 'workspace_name', '"Default Workspace"'::jsonb, 'string', 'editable', '{shell}'),
--   ('workspace-id', 'general', 'timezone', '"UTC"'::jsonb, 'string', 'editable', '{all}');
