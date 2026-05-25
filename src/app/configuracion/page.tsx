'use client';

import { useState } from 'react';
import { Badge, Button, Card, Field, Input, Select, Textarea } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';
import { isAuthRequired } from '@/lib/supabase/env';
import type { AIProvider, IntegrationStatus } from '@/lib/studio-types';

function asLines(input: string) {
  return input
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function integrationTone(status: IntegrationStatus) {
  if (status === 'Conectada') return 'good' as const;
  if (status === 'Preparada') return 'warning' as const;
  return 'neutral' as const;
}

export default function ConfiguracionPage() {
  const { state, setState, persistence } = useStudio();
  const authRequired = isAuthRequired();
  const config = state.config;

  const [projectName, setProjectName] = useState(config.projectName);
  const [projectDescriptor, setProjectDescriptor] = useState(config.projectDescriptor ?? '');
  const [uiLanguage, setUiLanguage] = useState(config.uiLanguage ?? 'es-419');
  const [timeZone, setTimeZone] = useState(config.timeZone ?? 'America/Bogota');
  const [currency, setCurrency] = useState(config.currency ?? 'USD');
  const [operationalContext, setOperationalContext] = useState(config.operationalContext ?? '');
  const [channels, setChannels] = useState(config.activeChannels.join('\n'));
  const [formats, setFormats] = useState(config.activeFormats.join('\n'));
  const [defaultChannel, setDefaultChannel] = useState(config.defaultChannel ?? '');
  const [defaultFrequency, setDefaultFrequency] = useState(config.defaultFrequency ?? 'Semanal');
  const [publishingWindows, setPublishingWindows] = useState(
    (config.publishingWindows ?? []).join('\n')
  );
  const [ctas, setCtas] = useState(config.frequentCtas.join('\n'));
  const [narrative, setNarrative] = useState(
    (config.defaultNarrativeStructure ?? config.aiNarrativeStructure).join('\n')
  );
  const [editorialTone, setEditorialTone] = useState(config.editorialTone ?? config.aiTone);
  const [concepts, setConcepts] = useState(config.psychologicalConcepts.join('\n'));
  const [aiPrimaryProvider, setAiPrimaryProvider] = useState<AIProvider>(config.aiPrimaryProvider);
  const [aiFallbackProvider, setAiFallbackProvider] = useState<AIProvider>(
    config.aiFallbackProvider
  );
  const [grokModel, setGrokModel] = useState(config.aiPreferredModelByProvider.grok);
  const [geminiModel, setGeminiModel] = useState(config.aiPreferredModelByProvider.gemini);
  const [visibleGrokModels, setVisibleGrokModels] = useState(
    (config.aiVisibleModelsByProvider?.grok ?? [config.aiPreferredModelByProvider.grok]).join('\n')
  );
  const [visibleGeminiModels, setVisibleGeminiModels] = useState(
    (config.aiVisibleModelsByProvider?.gemini ?? [config.aiPreferredModelByProvider.gemini]).join(
      '\n'
    )
  );
  const [aiSystemPrompt, setAiSystemPrompt] = useState(config.aiSystemPrompt);
  const [aiQualityRules, setAiQualityRules] = useState(config.aiQualityRules.join('\n'));
  const [uiDensity, setUiDensity] = useState(config.uiDensity ?? 'estandar');
  const [compactCards, setCompactCards] = useState(config.compactCards ? 'sí' : 'no');
  const [showInterfaceHelp, setShowInterfaceHelp] = useState(
    config.showInterfaceHelp ? 'sí' : 'no'
  );

  const save = () => {
    setState((current) => ({
      ...current,
      config: {
        ...current.config,
        projectName,
        projectDescriptor,
        uiLanguage,
        timeZone,
        currency,
        operationalContext,
        activeChannels: asLines(channels),
        activeFormats: asLines(formats),
        defaultChannel,
        defaultFrequency,
        publishingWindows: asLines(publishingWindows),
        frequentCtas: asLines(ctas),
        defaultNarrativeStructure: asLines(narrative),
        editorialTone,
        psychologicalConcepts: asLines(concepts),
        aiPrimaryProvider,
        aiFallbackProvider,
        aiPreferredModelByProvider: {
          grok: grokModel,
          gemini: geminiModel,
        },
        aiVisibleModelsByProvider: {
          grok: asLines(visibleGrokModels),
          gemini: asLines(visibleGeminiModels),
        },
        aiSystemPrompt,
        aiQualityRules: asLines(aiQualityRules),
        uiDensity,
        compactCards: compactCards === 'sí',
        showInterfaceHelp: showInterfaceHelp === 'sí',
      },
    }));
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.95fr]">
      <div className="space-y-5">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">
                Configuración central
              </div>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-amtme-navy">
                Marca y proyecto
              </h2>
            </div>
            <Badge tone={config.paletteLocked ? 'good' : 'warning'}>
              {config.paletteLocked ? 'Paleta oficial bloqueada' : 'Paleta editable'}
            </Badge>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Nombre visible del proyecto">
              <Input value={projectName} onChange={(event) => setProjectName(event.target.value)} />
            </Field>
            <Field label="Descriptor corto">
              <Input
                value={projectDescriptor}
                onChange={(event) => setProjectDescriptor(event.target.value)}
              />
            </Field>
            <Field label="Idioma UI">
              <Select value={uiLanguage} onChange={(event) => setUiLanguage(event.target.value)}>
                <option value="es-419">Español neutral (LatAm)</option>
                <option value="es-ES">Español (España)</option>
              </Select>
            </Field>
            <Field label="Zona horaria">
              <Input value={timeZone} onChange={(event) => setTimeZone(event.target.value)} />
            </Field>
            <Field label="Moneda operativa">
              <Input value={currency} onChange={(event) => setCurrency(event.target.value)} />
            </Field>
            <Field label="Contexto operativo">
              <Input
                value={operationalContext}
                onChange={(event) => setOperationalContext(event.target.value)}
              />
            </Field>
          </div>
        </Card>

        <Card>
          <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">
            Operación editorial y publicación
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Canales activos">
              <Textarea
                rows={4}
                value={channels}
                onChange={(event) => setChannels(event.target.value)}
              />
            </Field>
            <Field label="Formatos activos">
              <Textarea
                rows={4}
                value={formats}
                onChange={(event) => setFormats(event.target.value)}
              />
            </Field>
            <Field label="Canal por defecto">
              <Input
                value={defaultChannel}
                onChange={(event) => setDefaultChannel(event.target.value)}
                placeholder="Instagram"
              />
            </Field>
            <Field label="Frecuencia por defecto">
              <Input
                value={defaultFrequency}
                onChange={(event) => setDefaultFrequency(event.target.value)}
                placeholder="Semanal"
              />
            </Field>
            <Field label="Franjas horarias (una por línea)" hint="Formato recomendado: HH:MM">
              <Textarea
                rows={4}
                value={publishingWindows}
                onChange={(event) => setPublishingWindows(event.target.value)}
              />
            </Field>
            <Field label="CTA frecuentes">
              <Textarea rows={4} value={ctas} onChange={(event) => setCtas(event.target.value)} />
            </Field>
            <Field label="Estructura narrativa base">
              <Textarea
                rows={4}
                value={narrative}
                onChange={(event) => setNarrative(event.target.value)}
              />
            </Field>
            <Field label="Tono editorial">
              <Textarea
                rows={4}
                value={editorialTone}
                onChange={(event) => setEditorialTone(event.target.value)}
              />
            </Field>
            <Field label="Reglas psicológicas">
              <Textarea
                rows={4}
                value={concepts}
                onChange={(event) => setConcepts(event.target.value)}
              />
            </Field>
          </div>
        </Card>

        <Card>
          <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">
            IA operativa
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Proveedor IA primario">
              <Select
                value={aiPrimaryProvider}
                onChange={(event) => setAiPrimaryProvider(event.target.value as AIProvider)}
              >
                <option value="grok">Grok</option>
                <option value="gemini">Gemini</option>
              </Select>
            </Field>
            <Field label="Proveedor IA fallback">
              <Select
                value={aiFallbackProvider}
                onChange={(event) => setAiFallbackProvider(event.target.value as AIProvider)}
              >
                <option value="grok">Grok</option>
                <option value="gemini">Gemini</option>
              </Select>
            </Field>
            <Field label="Modelo preferido Grok">
              <Input value={grokModel} onChange={(event) => setGrokModel(event.target.value)} />
            </Field>
            <Field label="Modelo preferido Gemini">
              <Input value={geminiModel} onChange={(event) => setGeminiModel(event.target.value)} />
            </Field>
            <Field label="Modelos visibles Grok">
              <Textarea
                rows={4}
                value={visibleGrokModels}
                onChange={(event) => setVisibleGrokModels(event.target.value)}
              />
            </Field>
            <Field label="Modelos visibles Gemini">
              <Textarea
                rows={4}
                value={visibleGeminiModels}
                onChange={(event) => setVisibleGeminiModels(event.target.value)}
              />
            </Field>
            <Field label="Prompt base">
              <Textarea
                rows={5}
                value={aiSystemPrompt}
                onChange={(event) => setAiSystemPrompt(event.target.value)}
              />
            </Field>
            <Field label="Reglas de calidad IA">
              <Textarea
                rows={5}
                value={aiQualityRules}
                onChange={(event) => setAiQualityRules(event.target.value)}
              />
            </Field>
          </div>
        </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">Interfaz</div>
          <div className="mt-4 grid gap-4">
            <Field label="Densidad de interfaz">
              <Select
                value={uiDensity}
                onChange={(event) => setUiDensity(event.target.value as 'compacta' | 'estandar')}
              >
                <option value="estandar">Estándar</option>
                <option value="compacta">Compacta</option>
              </Select>
            </Field>
            <Field label="Tarjetas compactas">
              <Select
                value={compactCards}
                onChange={(event) => setCompactCards(event.target.value)}
              >
                <option value="no">No</option>
                <option value="sí">Sí</option>
              </Select>
            </Field>
            <Field label="Mostrar ayudas contextuales">
              <Select
                value={showInterfaceHelp}
                onChange={(event) => setShowInterfaceHelp(event.target.value)}
              >
                <option value="sí">Sí</option>
                <option value="no">No</option>
              </Select>
            </Field>
          </div>
          <div className="mt-5">
            <Button onClick={save}>Guardar configuración operativa</Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">
              Persistencia y seguridad
            </div>
            <Badge tone={authRequired ? 'good' : 'warning'}>
              {authRequired ? 'Auth requerida' : 'Auth opcional'}
            </Badge>
          </div>
          <div className="mt-4 space-y-3 text-sm text-semantic-muted">
            <div className="rounded-2xl border border-semantic-border bg-semantic-surface-soft px-4 py-3">
              <div className="font-medium text-amtme-navy">Modo de persistencia activo</div>
              <div>
                {persistence.mode === 'remote' ? 'Supabase remoto' : 'Local (localStorage)'}
              </div>
            </div>
            <div className="rounded-2xl border border-semantic-border bg-semantic-surface-soft px-4 py-3">
              <div className="font-medium text-amtme-navy">Modo configurado</div>
              <div>{config.persistenceMode}</div>
            </div>
            <div className="rounded-2xl border border-semantic-border bg-semantic-surface-soft px-4 py-3">
              <div className="font-medium text-amtme-navy">Última sincronización</div>
              <div>{persistence.lastSyncedAt ?? 'Todavía sin sincronización remota.'}</div>
            </div>
            {persistence.error ? (
              <div className="rounded-2xl border border-amtme-red/20 bg-amtme-red/8 px-4 py-3 text-amtme-red">
                {persistence.error}
              </div>
            ) : null}
          </div>
        </Card>

        <Card>
          <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">
            Integraciones futuras (preparación)
          </div>
          <div className="mt-4 space-y-3 text-sm text-semantic-muted">
            {(config.futureIntegrations ?? []).map((integration) => (
              <div
                key={integration.id}
                className="rounded-2xl border border-semantic-border bg-semantic-surface-soft px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-amtme-navy">{integration.label}</div>
                  <Badge tone={integrationTone(integration.status)}>{integration.status}</Badge>
                </div>
                <p className="mt-2">{integration.detail}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em]">{integration.mode}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-semantic-border bg-semantic-surface-soft px-4 py-3 text-sm text-semantic-muted">
            <div className="font-medium text-amtme-navy">Flags de entorno (solo lectura)</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {config.environmentReadOnlyFlags.map((flag) => (
                <li key={flag}>{flag}</li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
