'use client';

import { useState } from 'react';
import { Badge, Button, Card, Field, Input, Select, Textarea } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';
import { isAuthRequired } from '@/lib/supabase/env';
import { getSupabaseAuthBrowserClient } from '@/lib/supabase/auth-browser';
import { getAppearanceTheme, resetAppearanceToDefault, THEME_PRESETS } from '@/lib/appearance';
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
  const [claudeModel, setClaudeModel] = useState(
    config.aiPreferredModelByProvider.claude ?? 'claude-sonnet-4-20250514'
  );
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
  const [appearanceTheme] = useState(getAppearanceTheme());
  const [signingOut, setSigningOut] = useState(false);

  const signOut = async () => {
    setSigningOut(true);
    try {
      const client = getSupabaseAuthBrowserClient();
      await client?.auth.signOut();
    } finally {
      window.location.href = '/auth/sign-in';
    }
  };

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
          claude: claudeModel,
          groq: 'llama-3.1-70b-versatile',
        },
        aiVisibleModelsByProvider: {
          grok: asLines(visibleGrokModels),
          gemini: asLines(visibleGeminiModels),
          claude: ['claude-sonnet-4-20250514', 'claude-haiku-4-5-20251001'],
          groq: ['llama-3.1-70b-versatile', 'mixtral-8x7b-32768'],
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
                <option value="claude">Claude</option>
              </Select>
            </Field>
            <Field label="Proveedor IA fallback">
              <Select
                value={aiFallbackProvider}
                onChange={(event) => setAiFallbackProvider(event.target.value as AIProvider)}
              >
                <option value="grok">Grok</option>
                <option value="gemini">Gemini</option>
                <option value="claude">Claude</option>
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
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">
                Cuenta y sesión
              </div>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-amtme-navy">
                Seguridad activa
              </h2>
            </div>
            <Badge tone="good">Sesión protegida</Badge>
          </div>
          <div className="mt-4 space-y-3 text-sm text-semantic-muted">
            <div className="rounded-2xl border border-semantic-border bg-semantic-surface-soft px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-amtme-navy">Auth obligatoria</span>
                <Badge tone={authRequired ? 'good' : 'warning'}>
                  {authRequired ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
            </div>
            <div className="rounded-2xl border border-semantic-border bg-semantic-surface-soft px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-amtme-navy">RLS estricta</span>
                <Badge tone="good">15 / 15 tablas</Badge>
              </div>
            </div>
            <div className="rounded-2xl border border-semantic-border bg-semantic-surface-soft px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-amtme-navy">Cierre por inactividad</span>
                <Badge tone="good">5 minutos</Badge>
              </div>
            </div>
            <p className="px-1 text-xs text-semantic-muted">
              Tus datos solo se muestran con sesión activa.
            </p>
          </div>
          {authRequired && (
            <div className="mt-5">
              <Button variant="danger" onClick={() => void signOut()} disabled={signingOut}>
                {signingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
              </Button>
            </div>
          )}
        </Card>

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
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">
                Apariencia
              </div>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-amtme-navy">
                Paleta visual
              </h2>
            </div>
            <Badge tone="good">{THEME_PRESETS[appearanceTheme].name}</Badge>
          </div>
          <div className="mt-5">
            <div className="mb-5">
              <p className="mb-3 text-sm text-semantic-muted">
                Paleta AMTME oficial activa. La identidad visual de tu estudio mantiene:
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-semantic-border p-3">
                  <div className="mb-2 flex h-12 w-full rounded-md bg-amtme-navy" />
                  <p className="text-xs font-medium text-amtme-navy">Navy</p>
                  <p className="text-xs text-semantic-muted">#0c1f36</p>
                </div>
                <div className="rounded-lg border border-semantic-border p-3">
                  <div className="mb-2 flex h-12 w-full rounded-md bg-amtme-lemon" />
                  <p className="text-xs font-medium text-amtme-navy">Lemon</p>
                  <p className="text-xs text-semantic-muted">#e8ff40</p>
                </div>
                <div className="rounded-lg border border-semantic-border p-3">
                  <div className="mb-2 flex h-12 w-full rounded-md bg-amtme-cream" />
                  <p className="text-xs font-medium text-amtme-navy">Cream</p>
                  <p className="text-xs text-semantic-muted">#f5f1e8</p>
                </div>
                <div className="rounded-lg border border-semantic-border p-3">
                  <div className="mb-2 flex h-12 w-full rounded-md bg-amtme-slate" />
                  <p className="text-xs font-medium text-amtme-navy">Slate</p>
                  <p className="text-xs text-semantic-muted">#6b7b8c</p>
                </div>
                <div className="rounded-lg border border-semantic-border p-3">
                  <div className="mb-2 flex h-12 w-full rounded-md bg-amtme-red" />
                  <p className="text-xs font-medium text-amtme-navy">Red</p>
                  <p className="text-xs text-semantic-muted">#e0211e</p>
                </div>
                <div className="rounded-lg border border-semantic-border p-3">
                  <div className="mb-2 flex h-12 w-full rounded-md border-2 border-semantic-border bg-amtme-white" />
                  <p className="text-xs font-medium text-amtme-navy">White</p>
                  <p className="text-xs text-semantic-muted">#ffffff</p>
                </div>
              </div>
            </div>
            <Button variant="secondary" onClick={() => resetAppearanceToDefault()}>
              Restaurar paleta AMTME
            </Button>
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
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">
                Interfaz
              </div>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-amtme-navy">
                Navegación
              </h2>
            </div>
          </div>
          <div className="mt-5 space-y-4 text-sm">
            <div>
              <p className="font-medium text-amtme-navy">Módulos activos en desktop</p>
              <p className="mt-1 text-semantic-muted">
                {config.navPreferences?.order?.length ?? 17} módulos disponibles
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setState((current) => ({
                    ...current,
                    config: {
                      ...current.config,
                      navPreferences: {
                        order: [
                          '/dashboard',
                          '/documento-maestro',
                          '/episodios',
                          '/revision-episodios',
                          '/guiones',
                          '/contenido',
                          '/creador-visual',
                          '/calendario',
                          '/metricas',
                          '/monetizacion',
                          '/checklists',
                          '/notas',
                          '/automatizacion',
                          '/historico',
                          '/ia',
                          '/instagram',
                          '/configuracion',
                        ],
                        hidden: [],
                        mobileItems: ['/dashboard', '/episodios', '/contenido', '/metricas', '/ia'],
                        lastModified: new Date().toISOString(),
                      },
                    },
                  }));
                }}
                className="mt-3"
              >
                Restaurar orden original
              </Button>
            </div>
            <div>
              <p className="font-medium text-amtme-navy">Módulos en mobile</p>
              <p className="mt-1 text-sm text-semantic-muted">
                {config.navPreferences?.mobileItems?.length ?? 5} módulos (máximo 5)
              </p>
            </div>
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
