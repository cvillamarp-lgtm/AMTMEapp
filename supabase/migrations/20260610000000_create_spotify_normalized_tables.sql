-- spotify_daily_metrics: series diarias (streams/downloads, overview de Spotify)
CREATE TABLE IF NOT EXISTS public.spotify_daily_metrics (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  payload     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.spotify_daily_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "spotify_daily_metrics_owner" ON public.spotify_daily_metrics
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_spotify_daily_metrics_payload
  ON public.spotify_daily_metrics USING gin (payload jsonb_path_ops);

CREATE INDEX IF NOT EXISTS idx_spotify_daily_metrics_date
  ON public.spotify_daily_metrics ((payload->>'date'));

CREATE INDEX IF NOT EXISTS idx_spotify_daily_metrics_imported_at
  ON public.spotify_daily_metrics ((payload->>'imported_at'));

-- spotify_distribution_metrics: distribución por app o ubicación geográfica
CREATE TABLE IF NOT EXISTS public.spotify_distribution_metrics (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  payload     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.spotify_distribution_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "spotify_distribution_metrics_owner" ON public.spotify_distribution_metrics
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_spotify_distribution_metrics_payload
  ON public.spotify_distribution_metrics USING gin (payload jsonb_path_ops);

CREATE INDEX IF NOT EXISTS idx_spotify_distribution_metrics_dimension_type
  ON public.spotify_distribution_metrics ((payload->>'dimension_type'));

CREATE INDEX IF NOT EXISTS idx_spotify_distribution_metrics_imported_at
  ON public.spotify_distribution_metrics ((payload->>'imported_at'));

-- amtme_manual_metrics: métricas consolidadas manuales por mes y plataforma
CREATE TABLE IF NOT EXISTS public.amtme_manual_metrics (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  payload     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.amtme_manual_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "amtme_manual_metrics_owner" ON public.amtme_manual_metrics
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_amtme_manual_metrics_payload
  ON public.amtme_manual_metrics USING gin (payload jsonb_path_ops);

CREATE INDEX IF NOT EXISTS idx_amtme_manual_metrics_month
  ON public.amtme_manual_metrics ((payload->>'month'));

-- spotify_episode_metrics: índice adicional por episode_uri (reportes de ranking)
CREATE INDEX IF NOT EXISTS idx_spotify_episode_metrics_episode_uri
  ON public.spotify_episode_metrics ((payload->>'episode_uri'));
