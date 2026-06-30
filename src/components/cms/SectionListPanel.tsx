'use client';

import type { SiteSection } from '@/lib/cms/types';
import { LANDING_SECTION_KEYS } from '@/lib/cms/types';

interface SectionListPanelProps {
  sections: SiteSection[];
  selectedSection: string | null;
  onSelectSection: (sectionKey: string) => void;
}

export function SectionListPanel({
  sections,
  selectedSection,
  onSelectSection,
}: SectionListPanelProps) {
  // Get label for section key
  const getSectionLabel = (key: string): string => {
    const labels: Record<string, string> = {
      hero: 'Hero',
      featured_episode: 'Featured Episode',
      about: 'About',
      topics: 'Topics',
      recent_episodes: 'Recent Episodes',
      manifesto: 'Manifesto',
      about_christian: 'About Christian',
      newsletter: 'Newsletter',
      platforms: 'Platforms',
      footer: 'Footer',
    };
    return labels[key] || key;
  };

  return (
    <div className="p-4">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Sections</h2>

      <div className="space-y-1">
        {LANDING_SECTION_KEYS.map((sectionKey) => {
          const section = sections.find((s) => s.section_key === sectionKey);
          const isSelected = selectedSection === sectionKey;
          const isHidden = section && !section.is_visible;

          return (
            <button
              key={sectionKey}
              onClick={() => onSelectSection(sectionKey)}
              className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                isSelected ? 'bg-blue-100 text-blue-900' : 'hover:bg-gray-100 text-gray-700'
              } ${isHidden ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span>{getSectionLabel(sectionKey)}</span>
                {isHidden && <span className="text-xs text-gray-500">hidden</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
