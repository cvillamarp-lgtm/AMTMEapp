'use client';

import { useEffect, useState } from 'react';
import { Badge, Button, Card, Field, Input, Textarea } from '@/components/ui';
import { Skeleton } from '@/components/shadcn/skeleton';
import {
  getArchiveItems,
  createArchiveItem,
  updateArchiveItem,
  deleteArchiveItem,
} from '@/lib/database';
import type { ArchiveItem } from '@/types/database';

const EMPTY: Omit<ArchiveItem, 'id' | 'created_at' | 'updated_at' | 'user_id'> = {
  name: '',
  type: '',
  origin: '',
  archive_reason: '',
  archived_at: new Date().toISOString().split('T')[0],
  recoverable: false,
  status: 'archivado',
  notes: null,
};

export default function HistoricoPage() {
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ArchiveItem | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getArchiveItems()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.type.toLowerCase().includes(search.toLowerCase()) ||
      i.origin.toLowerCase().includes(search.toLowerCase())
  );

  function openNew() {
    setEditing(null);
    setForm({ ...EMPTY, archived_at: new Date().toISOString().split('T')[0] });
    setOpen(true);
  }

  function openEdit(item: ArchiveItem) {
    setEditing(item);
    setForm({
      name: item.name,
      type: item.type,
      origin: item.origin,
      archive_reason: item.archive_reason,
      archived_at: item.archived_at,
      recoverable: item.recoverable,
      status: item.status,
      notes: item.notes,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateArchiveItem(editing.id, form);
        setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      } else {
        const created = await createArchiveItem(form);
        setItems((prev) => [created, ...prev]);
      }
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    await deleteArchiveItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const set = (k: keyof typeof form) => (v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">Histórico</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0C1F36]">
              Material de referencia
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="neutral">{items.length} elementos</Badge>
            <Button onClick={openNew}>+ Archivar</Button>
          </div>
        </div>

        <div className="mt-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar en histórico..."
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[#0C1F36]/20"
          />
        </div>

        {loading ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-3xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 text-center text-sm text-black/40">
            <p>{search ? 'Sin resultados para esa búsqueda.' : 'No hay material archivado.'}</p>
            {!search && (
              <button
                onClick={openNew}
                className="mt-2 text-[#0C1F36] underline underline-offset-2"
              >
                Archivar primer elemento
              </button>
            )}
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <div key={item.id} className="rounded-3xl border border-black/8 bg-[#F5F2EA] p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-[#0C1F36]">{item.name}</h3>
                    <p className="mt-0.5 text-xs text-black/40">{item.type}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Badge tone={item.recoverable ? 'warning' : 'neutral'}>{item.status}</Badge>
                  </div>
                </div>
                <div className="mt-3 grid gap-1 text-xs text-black/55">
                  <span>
                    <span className="font-medium text-black/70">Origen:</span> {item.origin}
                  </span>
                  <span>
                    <span className="font-medium text-black/70">Motivo:</span> {item.archive_reason}
                  </span>
                  <span>
                    <span className="font-medium text-black/70">Archivado:</span> {item.archived_at}
                  </span>
                  <span>
                    <span className="font-medium text-black/70">Recuperable:</span>{' '}
                    {item.recoverable ? 'Sí' : 'No'}
                  </span>
                </div>
                {item.notes && <p className="mt-2 text-xs text-black/40 leading-5">{item.notes}</p>}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="text-xs text-black/40 hover:text-black/70"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-[#0C1F36]">
              {editing ? 'Editar elemento' : 'Archivar elemento'}
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Nombre *">
                <Input
                  value={form.name}
                  onChange={(e) => set('name')(e.target.value)}
                  placeholder="Nombre del elemento"
                />
              </Field>
              <Field label="Tipo">
                <Input
                  value={form.type}
                  onChange={(e) => set('type')(e.target.value)}
                  placeholder="episodio, herramienta, copy..."
                />
              </Field>
              <Field label="Origen">
                <Input
                  value={form.origin}
                  onChange={(e) => set('origin')(e.target.value)}
                  placeholder="¿De dónde viene?"
                />
              </Field>
              <Field label="Motivo de archivo">
                <Textarea
                  value={form.archive_reason}
                  onChange={(e) => set('archive_reason')(e.target.value)}
                  placeholder="¿Por qué se archiva?"
                  rows={2}
                />
              </Field>
              <Field label="Fecha archivo">
                <Input
                  type="date"
                  value={form.archived_at}
                  onChange={(e) => set('archived_at')(e.target.value)}
                />
              </Field>
              <Field label="Estado">
                <Input
                  value={form.status}
                  onChange={(e) => set('status')(e.target.value)}
                  placeholder="archivado, pausado..."
                />
              </Field>
              <Field label="Notas">
                <Textarea
                  value={form.notes ?? ''}
                  onChange={(e) => set('notes')(e.target.value)}
                  placeholder="Contexto adicional"
                  rows={2}
                />
              </Field>
              <div className="flex items-center gap-2 col-span-2">
                <input
                  type="checkbox"
                  id="recoverable"
                  checked={form.recoverable}
                  onChange={(e) => set('recoverable')(e.target.checked)}
                  className="h-4 w-4 rounded border-black/20"
                />
                <label htmlFor="recoverable" className="text-sm text-black/70">
                  ¿Recuperable?
                </label>
              </div>
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
                className="px-4 py-2 text-sm font-medium bg-[#0C1F36] text-white rounded-xl hover:bg-[#0C1F36]/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Archivar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
