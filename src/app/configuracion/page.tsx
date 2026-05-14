'use client';

import { useState } from 'react';
import { Badge, Button, Card, Field, Input, Textarea } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';
import { isAuthRequired } from '@/lib/supabase/env';

export default function ConfiguracionPage() {
  const { state, setState, persistence } = useStudio();
  const authRequired = isAuthRequired();
  const [projectName, setProjectName] = useState(state.config.projectName);
  const [channels, setChannels] = useState(state.config.activeChannels.join('\n'));
  const [formats, setFormats] = useState(state.config.activeFormats.join('\n'));
  const [ctas, setCtas] = useState(state.config.frequentCtas.join('\n'));
  const [concepts, setConcepts] = useState(state.config.psychologicalConcepts.join('\n'));

  const save = () => {
    setState((current) => ({
      ...current,
      config: {
        ...current.config,
        projectName,
        activeChannels: channels.split('\n').filter(Boolean),
        activeFormats: formats.split('\n').filter(Boolean),
        frequentCtas: ctas.split('\n').filter(Boolean),
        psychologicalConcepts: concepts.split('\n').filter(Boolean),
      },
    }));
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">Configuración</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#001F36]">Bloques de operación</h2>
          </div>
          <Badge tone={state.config.paletteLocked ? 'good' : 'warning'}>{state.config.paletteLocked ? 'Paleta bloqueada' : 'Paleta editable'}</Badge>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Nombre del proyecto"><Input value={projectName} onChange={(event) => setProjectName(event.target.value)} /></Field>
          <Field label="Bloqueo de paleta"><Input value={state.config.paletteLocked ? 'sí' : 'no'} readOnly /></Field>
          <Field label="Canales activos"><Input value={state.config.activeChannels.length.toString()} readOnly /></Field>
          <Field label="Formatos activos"><Input value={state.config.activeFormats.length.toString()} readOnly /></Field>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Canales activos"><Textarea rows={4} value={channels} onChange={(event) => setChannels(event.target.value)} /></Field>
          <Field label="Formatos activos"><Textarea rows={4} value={formats} onChange={(event) => setFormats(event.target.value)} /></Field>
          <Field label="CTAs frecuentes"><Textarea rows={4} value={ctas} onChange={(event) => setCtas(event.target.value)} /></Field>
          <Field label="Conceptos psicológicos"><Textarea rows={4} value={concepts} onChange={(event) => setConcepts(event.target.value)} /></Field>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="IA primaria"><Input value={state.config.aiPrimaryProvider} readOnly /></Field>
          <Field label="IA fallback"><Input value={state.config.aiFallbackProvider} readOnly /></Field>
          <Field label="Modelo Grok"><Input value={state.config.aiPreferredModelByProvider.grok} readOnly /></Field>
          <Field label="Modelo Gemini"><Input value={state.config.aiPreferredModelByProvider.gemini} readOnly /></Field>
        </div>
        <div className="mt-5">
          <Button onClick={save}>Guardar configuración</Button>
        </div>
      </Card>

      <Card>
        <div className="text-xs uppercase tracking-[0.22em] text-black/40">Preparación futura</div>
        <div className="mt-4 space-y-3 text-sm text-black/60">
          {state.config.futureApis.map((item) => (
            <div key={item} className="rounded-2xl border border-black/8 bg-[#F5F5F7] px-4 py-3">{item}</div>
          ))}
        </div>
        <div className="mt-5 rounded-3xl border border-black/8 bg-[#001F36] p-4 text-white">
          <div className="text-xs uppercase tracking-[0.22em] text-white/45">Regla de diseño</div>
          <p className="mt-3 text-sm leading-6 text-white/78">
            La interfaz debe sentirse limpia, precisa y premium. AMTME ocupa el centro, el ruido visual no tiene permiso.
          </p>
        </div>

        <div className="mt-4 rounded-3xl border border-black/8 bg-white p-4">
          <div className="text-xs uppercase tracking-[0.22em] text-black/40">IA lista para usar</div>
          <p className="mt-3 text-sm leading-6 text-black/58">
            La app ya puede enviar prompts a Grok o Gemini desde el servidor usando variables de entorno. Solo faltan XAI_API_KEY y GEMINI_API_KEY.
          </p>
        </div>

        <div className="mt-4 rounded-3xl border border-black/8 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">Acceso</div>
            <Badge tone={authRequired ? 'good' : 'warning'}>
              {authRequired ? 'Auth requerida' : 'Auth opcional'}
            </Badge>
          </div>
          <p className="mt-3 text-sm leading-6 text-black/58">
            {authRequired
              ? 'La app exige sesion valida de Supabase para operar y para acceder a la persistencia remota.'
              : 'Puedes activar proteccion completa poniendo NEXT_PUBLIC_REQUIRE_AUTH=true en variables de entorno.'}
          </p>
        </div>

        <div className="mt-4 rounded-3xl border border-black/8 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">Persistencia</div>
            <Badge tone={persistence.mode === 'remote' ? 'good' : 'warning'}>
              {persistence.mode === 'remote' ? 'Supabase activo' : 'Modo local'}
            </Badge>
          </div>
          <div className="mt-3 space-y-3 text-sm leading-6 text-black/58">
            <p>
              {persistence.mode === 'remote'
                ? 'El estado del estudio se esta sincronizando con Supabase y mantiene respaldo local.'
                : 'La app esta operando con localStorage. Configura Supabase para activar persistencia remota.'}
            </p>
            <div className="rounded-2xl bg-[#F5F5F7] px-4 py-3">
              <div className="font-medium text-[#001F36]">Ultima sincronizacion</div>
              <div>{persistence.lastSyncedAt ?? 'Todavia no hay sincronizacion remota.'}</div>
            </div>
            {persistence.error ? (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-[#B85C38]">
                {persistence.error}
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );
}
