import type { RiskLevel } from '@/lib/ai-editor/types';
import { Badge } from '@/components/ui';

const riskConfig: Record<
  RiskLevel,
  { label: string; tone: 'neutral' | 'good' | 'warning' | 'danger' | 'accent' }
> = {
  low: { label: 'Riesgo bajo', tone: 'good' },
  medium: { label: 'Riesgo medio', tone: 'warning' },
  high: { label: 'Riesgo alto', tone: 'danger' },
  critical: { label: 'Riesgo crítico', tone: 'danger' },
  blocked: { label: 'Bloqueado', tone: 'danger' },
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  const config = riskConfig[level];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}
