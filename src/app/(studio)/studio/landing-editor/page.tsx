'use client';

import { useEffect, useState } from 'react';
import type { LandingPage, LandingSection } from '@/types/database';

export default function LandingEditorPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<LandingPage | null>(null);
  const [sections, setSections] = useState<LandingSection[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load landing page on mount
  useEffect(() => {
    async function loadLandingPage() {
      try {
        const response = await fetch('/api/cms/landing/get-admin?slug=home');

        if (!response.ok) {
          if (response.status === 403) {
            setError('No tienes permisos para editar. Requiere acceso de administrador.');
          } else {
            setError('Error al cargar la página de aterrizaje');
          }
          return;
        }

        const data = await response.json();
        setPage(data.data.page);
        setSections(data.data.sections);
        setActiveSection(data.data.sections[0]?.section_key || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    loadLandingPage();
  }, []);

  async function handlePublish() {
    try {
      setIsSaving(true);
      const response = await fetch('/api/cms/landing/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'home' }),
      });

      if (!response.ok) {
        setError('Error al publicar');
        return;
      }

      const data = await response.json();
      setPage(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Cargando editor de landing...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6 p-8">
      {/* Sidebar */}
      <div className="col-span-1 space-y-4">
        <h2 className="text-xl font-bold">Secciones</h2>
        <div className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.section_key)}
              className={`w-full text-left p-3 rounded ${
                activeSection === section.section_key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="font-medium capitalize">{section.section_key.replace(/_/g, ' ')}</div>
              <div className="text-sm opacity-75">Orden: {section.section_order}</div>
            </button>
          ))}
        </div>

        <div className="pt-4 border-t space-y-2">
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isSaving ? 'Publicando...' : 'Publicar cambios'}
          </button>
          <div className="text-sm bg-blue-50 p-2 rounded">
            Estado: <strong>{page?.is_published ? 'Publicado' : 'Borrador'}</strong>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="col-span-2">
        {activeSection && (
          <SectionEditor
            section={sections.find((s) => s.section_key === activeSection)}
            onSave={() => {
              // Refrescar la sección después de guardar
              setActiveSection(activeSection);
            }}
          />
        )}
      </div>
    </div>
  );
}

interface SectionEditorProps {
  section?: LandingSection;
  onSave?: () => void;
}

function SectionEditor({ section, onSave }: SectionEditorProps) {
  const [content, setContent] = useState(section?.content || {});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!section) {
    return <div>Selecciona una sección para editar</div>;
  }

  // Type assertion after guard
  const currentSection = section;

  async function handleSave() {
    try {
      setIsSaving(true);
      const response = await fetch('/api/cms/landing/update-section', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'home',
          sectionKey: currentSection.section_key,
          content,
        }),
      });

      if (!response.ok) {
        setMessage({ type: 'error', text: 'Error al guardar sección' });
        return;
      }

      setMessage({ type: 'success', text: 'Sección guardada correctamente' });
      onSave?.();

      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error desconocido',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 capitalize">
          {currentSection.section_key.replace(/_/g, ' ')}
        </h2>
        <p className="text-gray-600">Edita el contenido de esta sección</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(content).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1 capitalize">
              {key.replace(/_/g, ' ')}
            </label>
            {typeof value === 'string' && value.length < 200 ? (
              <input
                type="text"
                value={value}
                onChange={(e) =>
                  setContent({
                    ...content,
                    [key]: e.target.value,
                  })
                }
                className="w-full border rounded p-2 font-mono text-sm"
              />
            ) : typeof value === 'string' ? (
              <textarea
                value={value}
                onChange={(e) =>
                  setContent({
                    ...content,
                    [key]: e.target.value,
                  })
                }
                rows={4}
                className="w-full border rounded p-2 font-mono text-sm"
              />
            ) : typeof value === 'number' ? (
              <input
                type="number"
                value={value}
                onChange={(e) =>
                  setContent({
                    ...content,
                    [key]: parseInt(e.target.value, 10),
                  })
                }
                className="w-full border rounded p-2 font-mono text-sm"
              />
            ) : typeof value === 'boolean' ? (
              <input
                type="checkbox"
                checked={value}
                onChange={(e) =>
                  setContent({
                    ...content,
                    [key]: e.target.checked,
                  })
                }
                className="border rounded p-2"
              />
            ) : (
              <pre className="bg-gray-50 p-2 rounded overflow-auto text-sm">
                {JSON.stringify(value, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSaving ? 'Guardando...' : 'Guardar sección'}
      </button>
    </div>
  );
}
