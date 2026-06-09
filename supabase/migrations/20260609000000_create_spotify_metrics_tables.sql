-- spotify_metric_imports: registro de cada archivo subido
CREATE TABLE IF NOT EXISTS public.spotify_metric_imports (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  payload     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.spotify_metric_imports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "spotify_imports_owner" ON public.spotify_metric_imports
  FOR ALL USING (auth.uid() = user_id);

-- spotify_episode_metrics: métricas por episodio por importación
CREATE TABLE IF NOT EXISTS public.spotify_episode_metrics (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  payload     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.spotify_episode_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "spotify_metrics_owner" ON public.spotify_episode_metrics
  FOR ALL USING (auth.uid() = user_id);

-- índice para búsqueda por episodio
CREATE INDEX IF NOT EXISTS idx_spotify_metrics_episode_id
  ON public.spotify_episode_metrics USING gin (payload jsonb_path_ops);

-- podcast_strategy_snapshots: análisis estratégico generado por IA
CREATE TABLE IF NOT EXISTS public.podcast_strategy_snapshots (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  payload     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.podcast_strategy_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "strategy_snapshots_owner" ON public.podcast_strategy_snapshots
  FOR ALL USING (auth.uid() = user_id);
