'use client';
import React, { useState, useCallback, useTransition } from 'react';
import type { SitePage, SiteSection, EditorSaveState } from '@/lib/cms/types';
import { SectionPanel } from './SectionPanel';
import { FieldPanel } from './FieldPanel';
import { EditorPreview } from './EditorPreview';

interface Props { initialPage: SitePage | null; initialSections: SiteSection[]; }

export function LandingEditorClient({ initialPage, initialSections }: Props) {
    const [page, setPage] = useState<SitePage | null>(initialPage);
    const [sections, setSections] = useState<SiteSection[]>(initialSections);
    const [selectedKey, setSelectedKey] = useState<string | null>(initialSections[0]?.section_key ?? null);
    const [saveState, setSaveState] = useState<EditorSaveState>('idle');
    const [saveError, setSaveError] = useState<string | null>(null);
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [, startTransition] = useTransition();
    const selectedSection = sections.find((s) => s.section_key === selectedKey) ?? null;

  const handleFieldChange = useCallback((sectionKey: string, field: string, value: unknown) => {
        setSections((prev) => prev.map((s) => s.section_key === sectionKey ? { ...s, content: { ...s.content, [field]: value } } : s));
        setIsDirty(true);
        setSaveState('unsaved');
  }, []);

  const handleSave = useCallback(async () => {
        if (!isDirty) return;
        setSaveState('saving'); setSaveError(null);
        try {
                const res = await fetch('/api/cms/save-sections', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sections }) });
                const json = await res.json();
                if (!res.ok) throw new Error(json.error ?? 'Save failed');
                setLastSavedAt(new Date()); setIsDirty(false); setSaveState('saved');
        } catch (err) { setSaveState('error'); setSaveError(err instanceof Error ? err.message : 'Unknown error'); }
  }, [isDirty, sections]);

  const handlePublish = useCallback(async () => {
        if (!page) return;
        setSaveState('saving');
        try {
                const res = await fetch('/api/cms/publish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pageId: page.id, publish: !page.is_published }) });
                const json = await res.json();
                if (!res.ok) throw new Error(json.error ?? 'Publish failed');
                setPage((prev) => prev ? { ...prev, is_published: !prev.is_published } : prev);
                setSaveState('saved');
        } catch (err) { setSaveState('error'); setSaveError(err instanceof Error ? err.message : 'Unknown error'); }
  }, [page]);

  const handleToggleVisibility = useCallback(async (sectionId: string, isVisible: boolean) => {
        setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, is_visible: isVisible } : s)));
        await fetch('/api/cms/toggle-visibility', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sectionId, isVisible }) });
  }, []);

  const handleMoveSection = useCallback(async (sectionId: string, direction: 'up' | 'down') => {
        let reordered: SiteSection[] = [];
        setSections((prev) => {
                const idx = prev.findIndex((s) => s.id === sectionId);
                if (idx === -1) return prev;
                const newIdx = direction === 'up' ? idx - 1 : idx + 1;
                if (newIdx < 0 || newIdx >= prev.length) return prev;
                const next = [...prev];
                [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
                reordered = next.map((s, i) => ({ ...s, sort_order: i }));
                return reordered;
        });
        startTransition(async () => {
                if (reordered.length > 0) {
                          await fetch('/api/cms/reorder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ updates: reordered.map((s) => ({ id: s.id, sort_order: s.sort_order })) }) });
                }
        });
  }, [startTransition]);

  const handleRestore = useCallback(() => {
        setSections(initialSections); setIsDirty(false); setSaveState('idle'); setSaveError(null);
  }, [initialSections]);

  const saveLabel = saveState === 'unsaved' ? 'Sin guardar' : saveState === 'saving' ? 'Guardando...' : saveState === 'saved' ? `Guardado ${lastSavedAt ? lastSavedAt.toLocaleTimeString() : ''}` : saveState === 'error' ? `Error: ${saveError}` : '';

  return (
        <div style={{ display: 'flex', height: '100vh', background: '#0C1F36', color: 'white', overflow: 'hidden' }}>
                <aside style={{ width: 256, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#FEE94B', textTransform: 'uppercase' }}>Editor Landing</div>div>
                            {saveLabel && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{saveLabel}</div>div>}
                          </div>div>
                          <div style={{ flex: 1, overflowY: 'auto' }}>
                                      <SectionPanel sections={sections} selectedKey={selectedKey} onSelect={setSelectedKey} onToggleVisibility={handleToggleVisibility} onMove={handleMoveSection} />
                          </div>div>
                          <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                      <button onClick={handleSave} disabled={!isDirty || saveState === 'saving'} style={{ padding: '8px 12px', borderRadius: 6, fontWeight: 600, fontSize: 13, background: isDirty ? '#FEE94B' : 'rgba(254,233,75,0.4)', color: '#0C1F36', border: 'none', cursor: isDirty ? 'pointer' : 'not-allowed' }}>Guardar cambios</button>button>
                            {isDirty && <button onClick={handleRestore} style={{ padding: '8px 12px', borderRadius: 6, fontSize: 13, background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>Restaurar sin guardar</button>button>}
                                      <button onClick={handlePublish} disabled={saveState === 'saving'} style={{ padding: '8px 12px', borderRadius: 6, fontWeight: 600, fontSize: 13, background: page?.is_published ? '#E0211E' : '#22c55e', color: 'white', border: 'none', cursor: 'pointer' }}>{page?.is_published ? 'Despublicar' : 'Publicar'}</button>button>
                          </div>div>
                </aside>aside>
                <main style={{ flex: 1, overflowY: 'auto', background: '#F5F2EA' }}>
                          <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#0C1F36', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Vista previa - landing</span>span>
                                      <a href="/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#FEE94B', marginLeft: 'auto', textDecoration: 'none' }}>Abrir en nueva pestana</a>a>
                          </div>div>
                          <EditorPreview sections={sections} selectedKey={selectedKey} />
                </main>main>
                <aside style={{ width: 320, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.1)', overflowY: 'auto' }}>
                  {selectedSection ? (
                    <FieldPanel section={selectedSection} onChange={(field, value) => handleFieldChange(selectedSection.section_key, field, value)} />
                  ) : (
                    <div style={{ padding: 24, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Selecciona una seccion para editarla</div>div>
                  )}
                </aside>aside>
        </div>div>
      );
}
