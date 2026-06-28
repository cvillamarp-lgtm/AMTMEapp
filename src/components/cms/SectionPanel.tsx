'use client';
import React from 'react';
import type { SiteSection } from '@/lib/cms/types';
interface Props { sections: SiteSection[]; selectedKey: string | null; onSelect: (key: string) => void; onToggleVisibility: (id: string, visible: boolean) => void; onMove: (id: string, dir: 'up' | 'down') => void; }
export function SectionPanel({ sections, selectedKey, onSelect, onToggleVisibility, onMove }: Props) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0' }}>
      {sections.map((section, idx) => {
        const isSel = section.section_key === selectedKey;
        return (
          <li key={section.id} style={{ display: 'flex', alignItems: 'center', padding: '6px 12px', gap: 6, background: isSel ? 'rgba(254,233,75,0.1)' : 'transparent', borderLeft: isSel ? '2px solid #FEE94B' : '2px solid transparent' }}>
            <button onClick={() => onSelect(section.section_key)} style={{ flex: 1, textAlign: 'left', background: 'transparent', border: 'none', color: isSel ? '#FEE94B' : section.is_visible ? 'white' : 'rgba(255,255,255,0.3)', fontSize: 12, cursor: 'pointer', padding: 0, fontWeight: isSel ? 600 : 400 }}>{section.label}</button>
            <button onClick={() => onToggleVisibility(section.id, !section.is_visible)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: section.is_visible ? '#FEE94B' : 'rgba(255,255,255,0.3)', fontSize: 10, padding: '2px 4px' }}>{section.is_visible ? 'V' : 'H'}</button>
            <button onClick={() => onMove(section.id, 'up')} disabled={idx === 0} style={{ background: 'transparent', border: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 10, padding: '2px 3px' }}>^</button>
            <button onClick={() => onMove(section.id, 'down')} disabled={idx === sections.length - 1} style={{ background: 'transparent', border: 'none', cursor: idx === sections.length - 1 ? 'not-allowed' : 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 10, padding: '2px 3px' }}>v</button>
          </li>
        );
      })}
    </ul>
  );
}
