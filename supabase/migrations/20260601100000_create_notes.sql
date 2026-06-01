-- Migration: crear tabla notes para AMTMEapp
-- Ejecutar en Supabase SQL Editor del proyecto qzzxmsobuckxtbuwxdtt

CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para búsqueda por user_id null (acceso público)
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON notes(user_id);

-- RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Política pública (igual que el resto de tablas)
CREATE POLICY "Public read notes" ON notes FOR SELECT USING (user_id IS NULL);
CREATE POLICY "Public insert notes" ON notes FOR INSERT WITH CHECK (user_id IS NULL);
CREATE POLICY "Public update notes" ON notes FOR UPDATE USING (user_id IS NULL);
CREATE POLICY "Public delete notes" ON notes FOR DELETE USING (user_id IS NULL);

-- Autenticados
CREATE POLICY "Auth read own notes" ON notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Auth insert own notes" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth update own notes" ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Auth delete own notes" ON notes FOR DELETE USING (auth.uid() = user_id);
