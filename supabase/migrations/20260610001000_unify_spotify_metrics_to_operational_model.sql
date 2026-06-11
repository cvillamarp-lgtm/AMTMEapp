-- Phase 1 Migration: Unify Spotify/Metrics Tables to Operational Model
-- Rename user_id → owner_id, add workspace_key='primary'
-- Update RLS policies to support public imports + user access

BEGIN;

-- 1. spotify_metric_imports: Rename user_id to owner_id, add workspace_key
ALTER TABLE IF EXISTS public.spotify_metric_imports
DROP CONSTRAINT IF EXISTS spotify_metric_imports_user_id_fkey;

ALTER TABLE IF EXISTS public.spotify_metric_imports
ADD COLUMN IF NOT EXISTS owner_id text,
ADD COLUMN IF NOT EXISTS workspace_key text NOT NULL DEFAULT 'primary';

UPDATE public.spotify_metric_imports
SET owner_id = user_id::text
WHERE owner_id IS NULL AND user_id IS NOT NULL;

-- Set owner_id to 'public' for any rows where user_id was NULL (already public imports)
UPDATE public.spotify_metric_imports
SET owner_id = 'public'
WHERE owner_id IS NULL;

ALTER TABLE IF EXISTS public.spotify_metric_imports
DROP COLUMN IF EXISTS user_id;

-- Update RLS policy for spotify_metric_imports
DROP POLICY IF EXISTS "spotify_imports_owner" ON public.spotify_metric_imports;

CREATE POLICY "spotify_imports_owner" ON public.spotify_metric_imports
  FOR ALL USING (
    owner_id = 'public'
    OR auth.uid()::text = owner_id
  );

-- 2. spotify_episode_metrics: Same pattern
ALTER TABLE IF EXISTS public.spotify_episode_metrics
DROP CONSTRAINT IF EXISTS spotify_episode_metrics_user_id_fkey;

ALTER TABLE IF EXISTS public.spotify_episode_metrics
ADD COLUMN IF NOT EXISTS owner_id text,
ADD COLUMN IF NOT EXISTS workspace_key text NOT NULL DEFAULT 'primary';

UPDATE public.spotify_episode_metrics
SET owner_id = user_id::text
WHERE owner_id IS NULL AND user_id IS NOT NULL;

UPDATE public.spotify_episode_metrics
SET owner_id = 'public'
WHERE owner_id IS NULL;

ALTER TABLE IF EXISTS public.spotify_episode_metrics
DROP COLUMN IF EXISTS user_id;

DROP POLICY IF EXISTS "spotify_metrics_owner" ON public.spotify_episode_metrics;

CREATE POLICY "spotify_metrics_owner" ON public.spotify_episode_metrics
  FOR ALL USING (
    owner_id = 'public'
    OR auth.uid()::text = owner_id
  );

-- 3. spotify_daily_metrics: Same pattern
ALTER TABLE IF EXISTS public.spotify_daily_metrics
DROP CONSTRAINT IF EXISTS spotify_daily_metrics_user_id_fkey;

ALTER TABLE IF EXISTS public.spotify_daily_metrics
ADD COLUMN IF NOT EXISTS owner_id text,
ADD COLUMN IF NOT EXISTS workspace_key text NOT NULL DEFAULT 'primary';

UPDATE public.spotify_daily_metrics
SET owner_id = user_id::text
WHERE owner_id IS NULL AND user_id IS NOT NULL;

UPDATE public.spotify_daily_metrics
SET owner_id = 'public'
WHERE owner_id IS NULL;

ALTER TABLE IF EXISTS public.spotify_daily_metrics
DROP COLUMN IF EXISTS user_id;

DROP POLICY IF EXISTS "spotify_daily_metrics_owner" ON public.spotify_daily_metrics;

CREATE POLICY "spotify_daily_metrics_owner" ON public.spotify_daily_metrics
  FOR ALL USING (
    owner_id = 'public'
    OR auth.uid()::text = owner_id
  );

-- 4. spotify_distribution_metrics: Same pattern
ALTER TABLE IF EXISTS public.spotify_distribution_metrics
DROP CONSTRAINT IF EXISTS spotify_distribution_metrics_user_id_fkey;

ALTER TABLE IF EXISTS public.spotify_distribution_metrics
ADD COLUMN IF NOT EXISTS owner_id text,
ADD COLUMN IF NOT EXISTS workspace_key text NOT NULL DEFAULT 'primary';

UPDATE public.spotify_distribution_metrics
SET owner_id = user_id::text
WHERE owner_id IS NULL AND user_id IS NOT NULL;

UPDATE public.spotify_distribution_metrics
SET owner_id = 'public'
WHERE owner_id IS NULL;

ALTER TABLE IF EXISTS public.spotify_distribution_metrics
DROP COLUMN IF EXISTS user_id;

DROP POLICY IF EXISTS "spotify_distribution_metrics_owner" ON public.spotify_distribution_metrics;

CREATE POLICY "spotify_distribution_metrics_owner" ON public.spotify_distribution_metrics
  FOR ALL USING (
    owner_id = 'public'
    OR auth.uid()::text = owner_id
  );

-- 5. amtme_manual_metrics: Same pattern
ALTER TABLE IF EXISTS public.amtme_manual_metrics
DROP CONSTRAINT IF EXISTS amtme_manual_metrics_user_id_fkey;

ALTER TABLE IF EXISTS public.amtme_manual_metrics
ADD COLUMN IF NOT EXISTS owner_id text,
ADD COLUMN IF NOT EXISTS workspace_key text NOT NULL DEFAULT 'primary';

UPDATE public.amtme_manual_metrics
SET owner_id = user_id::text
WHERE owner_id IS NULL AND user_id IS NOT NULL;

UPDATE public.amtme_manual_metrics
SET owner_id = 'public'
WHERE owner_id IS NULL;

ALTER TABLE IF EXISTS public.amtme_manual_metrics
DROP COLUMN IF EXISTS user_id;

DROP POLICY IF EXISTS "amtme_manual_metrics_owner" ON public.amtme_manual_metrics;

CREATE POLICY "amtme_manual_metrics_owner" ON public.amtme_manual_metrics
  FOR ALL USING (
    owner_id = 'public'
    OR auth.uid()::text = owner_id
  );

-- 6. podcast_strategy_snapshots: Same pattern
ALTER TABLE IF EXISTS public.podcast_strategy_snapshots
DROP CONSTRAINT IF EXISTS podcast_strategy_snapshots_user_id_fkey;

ALTER TABLE IF EXISTS public.podcast_strategy_snapshots
ADD COLUMN IF NOT EXISTS owner_id text,
ADD COLUMN IF NOT EXISTS workspace_key text NOT NULL DEFAULT 'primary';

UPDATE public.podcast_strategy_snapshots
SET owner_id = user_id::text
WHERE owner_id IS NULL AND user_id IS NOT NULL;

UPDATE public.podcast_strategy_snapshots
SET owner_id = 'public'
WHERE owner_id IS NULL;

ALTER TABLE IF EXISTS public.podcast_strategy_snapshots
DROP COLUMN IF EXISTS user_id;

DROP POLICY IF EXISTS "strategy_snapshots_owner" ON public.podcast_strategy_snapshots;

CREATE POLICY "strategy_snapshots_owner" ON public.podcast_strategy_snapshots
  FOR ALL USING (
    owner_id = 'public'
    OR auth.uid()::text = owner_id
  );

COMMIT;
