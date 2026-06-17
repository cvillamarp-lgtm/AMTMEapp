'use client';

import { useEffect, useState } from 'react';
import { PageHeader, LoadingSkeleton, EmptyState } from '@/components/ui';
import { Badge, Button, Card, Field, Input, Select, Textarea } from '@/components/ui';
import {
  getAutomationRules,
  createAutomationRule,
  updateAutomationRule,
  deleteAutomationRule,
} from '@/lib/database';
import type { AutomationRule, AutomationStatus } from '@/types/database';

const STATUS_OPTIONS: AutomationStatus[] = [
  'idea',
  'pendiente',
  'en-proceso',
  'listo',
  'activo',
  'pausado',
  'archivado',
];

const STATUS_TONE: Record<AutomationStatus, 'good' | 'accent' | 'warning' | 'neutral'> = {
  activo: 'good',
  listo: 'accent',
  'en-proceso': 'warning',
  pendiente: 'neutral',
  pausado: 'neutral',
  idea: 'neutral',
  archivado: 'neutral',
};

const EMPTY: Omit<AutomationRule, 'id' | 'created_at' | 'updated_at' | 'user_id'> = {
  name: '',
  objective: '',
  trigger: '',
  input: '',
  output: '',
  tool: '',
  status: 'idea',
  responsible: '',
  risk: '',
  next_review: null,
};

export default function AutomatizacionPage() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AutomationRule | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAutomationRules()
      .then(setRules)
      .finally(() => setLoading(false));
  }, []);

  function openNew() {
    setEditing(null);
    setForm({ ...EMPTY });
    setOpen(true);
  }

  function openEdit(rule: AutomationRule) {
    setEditing(rule);
    setForm({
      name: rule.name,
      objective: rule.objective,
      trigger: rule.trigger,
      input: rule.input,
      output: rule.output,
      tool: rule.tool,
      status: rule.status,
      responsible: rule.responsible ?? '',
      risk: rule.risk ?? '',
      next_review: rule.next_review,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateAutomationRule(editing.id, form);
        setRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      } else {
        const created = await createAutomationRule(form);
        setRules((prev) => [created, ...prev]);
      }
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    await deleteAutomationRule(id);
    setRules((prev) => prev.filter((r) => r.id !== id));
  }

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const activas = rules.filter((r) => r.status === 'activo').length;
  const listas = rules.filter((r) => r.status === 'listo').length;

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">Automatización</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-amtme-navy">
              Reglas y disparadores
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="good">{activas} activas</Badge>
            <Badge tone="accent">{listas} listas</Badge>
            <Badge tone="neutral">{rules.length} total</Badge>
            <Button onClick={openNew}>+ Nueva regla</Button>
          </div>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-black/40">Cargando reglas...</p>
        ) : rules.length === 0 ? (
          <div className="mt-8 text-center text-sm text-black/40">
            <p>No hay reglas de automatización.</p>
            <button onClick={openNew} className="mt-2 text-amtme-navy underline underline-offset-2">
              Crear primera regla
            </button>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {rules.map((rule) => (
              <div key={rule.id} className="rounded-3xl border border-black/8 bg-amtme-cream p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-amtme-navy">{rule.name}</h3>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Badge tone={STATUS_TONE[rule.status]}>{rule.status}</Badge>
                    <button
                      onClick={() => openEdit(rule)}
                      className="text-xs text-black/40 hover:text-black/70"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => remove(rule.id)}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-6 text-black/58">{rule.objective}</p>
                <div className="mt-4 grid gap-1.5 text-xs text-black/55 sm:grid-cols-2">
                  {rule.trigger && (
                    <span>
                      <span className="font-medium text-black/70">Trigger:</span> {rule.trigger}
                    </span>
                  )}
                  {rule.tool && (
                    <span>
                      <span className="font-medium text-black/70">Tool:</span> {rule.tool}
                    </span>
                  )}
                  {rule.responsible && (
                    <span>
                      <span className="font-medium text-black/70">Responsable:</span>{' '}
                      {rule.responsible}
                    </span>
                  )}
                  {rule.risk && (
                    <span>
                      <span className="font-medium text-black/70">Riesgo:</span> {rule.risk}
                    </span>
                  )}
                  {rule.input && (
                    <span>
                      <span className="font-medium text-black/70">Entrada:</span> {rule.input}
                    </span>
                  )}
                  {rule.output && (
                    <span>
                      <span className="font-medium text-black/70">Salida:</span> {rule.output}
                    </span>
                  )}
                </div>
                {rule.next_review && (
                  <p className="mt-3 text-xs text-black/40">Próxima revisión: {rule.next_review}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-amtme-navy">
              {editing ? 'Editar regla' : 'Nueva regla de automatización'}
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Nombre *">
                <Input
                  value={form.name}
                  onChange={(e) => set('name')(e.target.value)}
                  placeholder="Nombre de la regla"
                />
              </Field>
              <Field label="Objetivo *">
                <Textarea
                  value={form.objective}
                  onChange={(e) => set('objective')(e.target.value)}
                  placeholder="¿Qué automatiza esta regla?"
                  rows={2}
                />
              </Field>
              <Field label="Trigger">
                <Input
                  value={form.trigger}
                  onChange={(e) => set('trigger')(e.target.value)}
                  placeholder="¿Qué lo activa?"
                />
              </Field>
              <Field label="Herramienta">
                <Input
                  value={form.tool}
                  onChange={(e) => set('tool')(e.target.value)}
                  placeholder="Make, Zapier, Claude..."
                />
              </Field>
              <Field label="Entrada">
                <Input
                  value={form.input}
                  onChange={(e) => set('input')(e.target.value)}
                  placeholder="¿Qué recibe?"
                />
              </Field>
              <Field label="Salida">
                <Input
                  value={form.output}
                  onChange={(e) => set('output')(e.target.value)}
                  placeholder="¿Qué produce?"
                />
              </Field>
              <Field label="Responsable">
                <Input
                  value={form.responsible ?? ''}
                  onChange={(e) => set('responsible')(e.target.value)}
                  placeholder="¿Quién la mantiene?"
                />
              </Field>
              <Field label="Riesgo">
                <Input
                  value={form.risk ?? ''}
                  onChange={(e) => set('risk')(e.target.value)}
                  placeholder="Nivel de riesgo"
                />
              </Field>
              <Field label="Estado">
                <Select
                  value={form.status}
                  onChange={(e) => set('status')(e.target.value as AutomationStatus)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Próxima revisión">
                <Input
                  type="date"
                  value={form.next_review ?? ''}
                  onChange={(e) => set('next_review')(e.target.value)}
                />
              </Field>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm font-medium border border-black/10 rounded-xl hover:bg-black/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium bg-amtme-navy text-white rounded-xl hover:bg-amtme-navy/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear regla'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
