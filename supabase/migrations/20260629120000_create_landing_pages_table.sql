-- Landing pages table: stores editorial content for public landing page
CREATE TABLE IF NOT EXISTS landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identifiers
  slug TEXT NOT NULL UNIQUE DEFAULT 'home',
  version INTEGER NOT NULL DEFAULT 1,

  -- Metadata
  title TEXT NOT NULL,
  description TEXT,
  meta_keywords TEXT,
  og_image_url TEXT,

  -- Content status
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,

  -- Audit
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_landing_pages_slug ON landing_pages(slug);
CREATE INDEX idx_landing_pages_is_published ON landing_pages(is_published);
CREATE INDEX idx_landing_pages_updated_at ON landing_pages(updated_at DESC);

-- Enable RLS
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
