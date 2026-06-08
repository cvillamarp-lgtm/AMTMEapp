-- Migration: crear tabla ideas para AMTMEapp
-- Ejecutar en Supabase SQL Editor del proyecto qzzxmsobuckxtbuwxdtt

CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ideas_user_id_idx ON ideas(user_id);

ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read ideas" ON ideas FOR SELECT USING (user_id IS NULL);
CREATE POLICY "Public insert ideas" ON ideas FOR INSERT WITH CHECK (user_id IS NULL);
CREATE POLICY "Public update ideas" ON ideas FOR UPDATE USING (user_id IS NULL);
CREATE POLICY "Public delete ideas" ON ideas FOR DELETE USING (user_id IS NULL);

CREATE POLICY "Auth read own ideas" ON ideas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Auth insert own ideas" ON ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth update own ideas" ON ideas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Auth delete own ideas" ON ideas FOR DELETE USING (auth.uid() = user_id);
