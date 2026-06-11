'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  getMetricsMonthly,
  createMetricMonthly,
  getEpisodes,
  getMetricsEpisode,
  createMetricEpisode,
  getStrategySnapshots,
} from '@/lib/database';
import type {
  MetricMonthly,
  MetricEpisode,
  Episode,
  PodcastStrategySnapshot,
} from '@/types/database';

export type AIReport = {
  id: string;
  month: string;
  generated_at: string;
  diagnosis: string;
  growth_pattern: string;
  best_content: string;
  alert: string;
  recommendation_7d: string;
  next_episode_hypothesis: string;
};

export type DecisionNote = {
  weekly_learning: string;
  next_experiment: string;
  next_decision: string;
  updated_at: string;
};

export type MetricForm = {
  month: string;
  platform: string;
  reach: number;
  plays: number;
  downloads: number;
  engagement: number;
  profile_visits: number;
  link_clicks: number;
  dms: number;
  conversions: number;
  revenue: number;
  insight: string;
  action: string;
};

export type EpisodeMetricForm = {
  episode_id: string;
  plays_48h: number;
  plays_7d: number;
  retention: number;
  saves: number;
  shares: number;
  comments: number;
  dms: number;
  conversions: number;
  insight: string;
};

const DECISION_KEY = 'amtme-decision-notes';
const REPORTS_KEY = 'amtme-metric-reports';

export function useMetrics() {
  const [metrics, setMetrics] = useState<MetricMonthly[]>([]);
  const [metricsEpisode, setMetricsEpisode] = useState<MetricEpisode[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [reports, setReports] = useState<AIReport[]>([]);
  const [strategySnapshots, setStrategySnapshots] = useState<PodcastStrategySnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [epDialogOpen, setEpDialogOpen] = useState(false);
  const [decisionNotes, setDecisionNotes] = useState<DecisionNote>({
    weekly_learning: '',
    next_experiment: '',
    next_decision: '',
    updated_at: '',
  });
  const [savingNotes, setSavingNotes] = useState(false);

  const [form, setForm] = useState<MetricForm>({
    month: new Date().toISOString().slice(0, 7),
    platform: '',
    reach: 0,
    plays: 0,
    downloads: 0,
    engagement: 0,
    profile_visits: 0,
    link_clicks: 0,
    dms: 0,
    conversions: 0,
    revenue: 0,
    insight: '',
    action: '',
  });

  const [epForm, setEpForm] = useState<EpisodeMetricForm>({
    episode_id: '',
    plays_48h: 0,
    plays_7d: 0,
    retention: 0,
    saves: 0,
    shares: 0,
    comments: 0,
    dms: 0,
    conversions: 0,
    insight: '',
  });

  // Load all metrics
  const load = useCallback(async () => {
    try {
      const [d, ep, eps, snapshots] = await Promise.all([
        getMetricsMonthly(),
        getMetricsEpisode(),
        getEpisodes(),
        getStrategySnapshots(),
      ]);
      setMetrics(d);
      setMetricsEpisode(ep);
      setEpisodes(eps);
      setStrategySnapshots(snapshots);
      const saved = localStorage.getItem(REPORTS_KEY);
      if (saved) setReports(JSON.parse(saved));
      const notes = localStorage.getItem(DECISION_KEY);
      if (notes) setDecisionNotes(JSON.parse(notes));
    } catch {
      toast.error('Error al cargar metricas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Derived state
  const measuredEpisodeIds = new Set(metricsEpisode.map((m) => m.episode_id));
  const pendingToMeasure = episodes.filter(
    (e) => (e.status === 'publicado' || e.status === 'distribuido') && !measuredEpisodeIds.has(e.id)
  );

  const bestMonth =
    metrics.length > 0
      ? [...metrics].sort((a, b) => b.plays + b.dms * 10 - (a.plays + a.dms * 10))[0]
      : null;

  const bestEpisode =
    metricsEpisode.length > 0
      ? [...metricsEpisode].sort((a, b) => b.plays_7d + b.dms * 10 - (a.plays_7d + a.dms * 10))[0]
      : null;

  const bestEpisodeData = bestEpisode
    ? episodes.find((e) => e.id === bestEpisode.episode_id)
    : null;

  const latestReport = reports.length > 0 ? reports[0] : null;
  const latestStrategy =
    strategySnapshots.length > 0
      ? [...strategySnapshots].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0]
      : null;

  // Form reset
  const resetForm = () => {
    setForm({
      month: new Date().toISOString().slice(0, 7),
      platform: '',
      reach: 0,
      plays: 0,
      downloads: 0,
      engagement: 0,
      profile_visits: 0,
      link_clicks: 0,
      dms: 0,
      conversions: 0,
      revenue: 0,
      insight: '',
      action: '',
    });
  };

  const resetEpForm = (episodeId?: string) => {
    setEpForm({
      episode_id: episodeId || '',
      plays_48h: 0,
      plays_7d: 0,
      retention: 0,
      saves: 0,
      shares: 0,
      comments: 0,
      dms: 0,
      conversions: 0,
      insight: '',
    });
  };

  // KPI calculation
  const calcKPIs = (m: MetricMonthly) => {
    const engagement = m.engagement || 0;
    const reach = m.reach || 1;
    const engagementRate = ((engagement / reach) * 100).toFixed(1);
    const dms = m.dms || 0;
    const dmsPercentage = ((dms / reach) * 100).toFixed(2);
    return { engagementRate, dmsPercentage };
  };

  return {
    metrics,
    metricsEpisode,
    episodes,
    reports,
    strategySnapshots,
    loading,
    generating,
    setGenerating,
    dialogOpen,
    setDialogOpen,
    epDialogOpen,
    setEpDialogOpen,
    decisionNotes,
    setDecisionNotes,
    savingNotes,
    setSavingNotes,
    form,
    setForm,
    epForm,
    setEpForm,
    load,
    resetForm,
    resetEpForm,
    measuredEpisodeIds,
    pendingToMeasure,
    bestMonth,
    bestEpisode,
    bestEpisodeData,
    latestReport,
    latestStrategy,
    calcKPIs,
  };
}
