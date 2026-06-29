-- Landing sections: editable sections for each landing page
CREATE TABLE IF NOT EXISTS landing_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  landing_page_id UUID NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,

  -- Section definition
  section_key TEXT NOT NULL,
  section_order INTEGER NOT NULL DEFAULT 0,

  -- Visibility
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,

  -- Editable content (flexible JSON structure per section)
  content JSONB NOT NULL DEFAULT '{}',

  -- Audit
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Constraints
  CONSTRAINT unique_section_per_page UNIQUE(landing_page_id, section_key)
);

-- Indexes
CREATE INDEX idx_landing_sections_page_id ON landing_sections(landing_page_id);
CREATE INDEX idx_landing_sections_order ON landing_sections(landing_page_id, section_order);
CREATE INDEX idx_landing_sections_visible ON landing_sections(landing_page_id, is_visible);

-- Enable RLS
ALTER TABLE landing_sections ENABLE ROW LEVEL SECURITY;
