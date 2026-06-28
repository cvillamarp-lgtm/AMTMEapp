'use client';
import React from 'react';
import type { SiteSection } from '@/lib/cms/types';
interface Props { section: SiteSection; onChange: (field: string, value: unknown) => void; }
function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  const s = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: 'white', padding: '8px 10px', fontSize: 12, fontFamily: 'inherit', boxSizing: 'border-box' as const };
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#FEE94B', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>
      {multiline ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} style={{ ...s, resize: 'vertical' }} /> : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={s} />}
    </div>
  );
}
export function FieldPanel({ section, onChange }: Props) {
  const content = section.content as Record<string, unknown>;
  const stringFields = Object.entries(content).filter(([, v]) => typeof v === 'string') as [string, string][];
  const labels: Record<string, string> = { eyebrow: 'Eyebrow', title: 'Titulo', subtitle: 'Subtitulo', headline: 'Titular', body: 'Cuerpo', body1: 'Cuerpo 1', body2: 'Cuerpo 2', cta_primary_label: 'CTA principal texto', cta_primary_url: 'CTA principal URL', cta_secondary_label: 'CTA secundaria texto', cta_secondary_url: 'CTA secundaria URL', cta_label: 'CTA texto', cta_url: 'CTA URL', episode_tag: 'Tag', episode_topics: 'Temas', episode_title: 'Titulo episodio', episode_description: 'Descripcion', label: 'Etiqueta', quote_line1: 'Cita 1', quote_line2: 'Cita 2', quote_line3: 'Cita 3', social_handle: 'Handle', social_url: 'URL social', image_url: 'URL imagen', image_alt: 'Alt imagen', disclaimer: 'Aviso', brand_name: 'Marca', tagline: 'Tagline', copyright: 'Copyright', spotify_embed_note: 'Nota Spotify', beehiiv_url: 'URL Beehiiv' };
  const ml = ['body', 'body1', 'body2', 'subtitle', 'episode_description', 'quote_line1', 'quote_line2', 'quote_line3'];
  return (
    <div style={{ padding: 20 }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12, marginBottom: 20 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Seccion</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'white', marginTop: 4 }}>{section.label}</div>
      </div>
      {stringFields.map(([key, val]) => <Field key={key} label={labels[key] ?? key} value={val} onChange={(v) => onChange(key, v)} multiline={ml.includes(key)} />)}
      {stringFields.length === 0 && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Sin campos editables.</p>}
    </div>
  );
}
