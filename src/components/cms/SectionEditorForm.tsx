'use client';

import { useEffect, useState } from 'react';
import type { SiteSection } from '@/lib/cms/types';

interface SectionEditorFormProps {
  section: SiteSection | null;
  onSaveStart: () => void;
  onSaveComplete: (success: boolean) => void;
}

export function SectionEditorForm({
  section,
  onSaveStart,
  onSaveComplete,
}: SectionEditorFormProps) {
  const [payload, setPayload] = useState<Record<string, unknown>>(section?.payload || {});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setPayload(section?.payload || {});
  }, [section?.section_key]);

  const handleSave = async () => {
    if (!section) return;

    try {
      setIsSaving(true);
      onSaveStart();

      const response = await fetch('/api/cms/save-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionKey: section.section_key,
          payload,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save');
      }

      onSaveComplete(true);
    } catch (error) {
      console.error('Save error:', error);
      onSaveComplete(false);
    } finally {
      setIsSaving(false);
    }
  };

  if (!section) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Select a section to edit</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold">{section.section_key}</h2>
        <p className="text-sm text-gray-600">
          Last updated: {new Date(section.updated_at).toLocaleString()}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <div className="space-y-6">
          {/* Display raw payload for now - will be enhanced */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Payload (JSON)</label>
            <textarea
              value={JSON.stringify(payload, null, 2)}
              onChange={(e) => {
                try {
                  setPayload(JSON.parse(e.target.value));
                } catch {
                  // Invalid JSON, skip update
                }
              }}
              className="w-full h-64 p-3 border rounded font-mono text-sm"
              placeholder="Edit section payload..."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
