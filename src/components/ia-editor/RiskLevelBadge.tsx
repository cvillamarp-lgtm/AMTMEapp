'use client';

import { RiskLevel } from '@/lib/ia-editor/types';

interface RiskLevelBadgeProps {
  risk: RiskLevel;
}

const styles: Record<RiskLevel, string> = {
  bajo: 'bg-[#0C1F36] text-white',
  medio: 'bg-[#c17d00] text-white',
  alto: 'bg-[#E0211E] text-white',
};

const labels: Record<RiskLevel, string> = {
  bajo: 'Bajo riesgo',
  medio: 'Riesgo medio',
  alto: 'Alto riesgo',
};

export function RiskLevelBadge({ risk }: RiskLevelBadgeProps) {
  return (
    <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium tracking-wide ${styles[risk]}`}>
      {labels[risk]}
    </span>
  );
}
