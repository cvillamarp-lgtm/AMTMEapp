-- CMS admins table: designates who can edit landing content
CREATE TABLE IF NOT EXISTS cms_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  -- Audit
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_cms_admins_user_id ON cms_admins(user_id);
CREATE INDEX idx_cms_admins_active ON cms_admins(is_active);

-- Enable RLS (disable to prevent users from querying it)
ALTER TABLE cms_admins DISABLE ROW LEVEL SECURITY;
