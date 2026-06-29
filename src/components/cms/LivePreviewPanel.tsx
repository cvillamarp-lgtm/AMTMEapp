'use client';

import type { SiteSection } from '@/lib/cms/types';

interface LivePreviewPanelProps {
  section: SiteSection | null;
}

export function LivePreviewPanel({ section }: LivePreviewPanelProps) {
  if (!section) {
    return (
      <div className="p-6 flex items-center justify-center h-full text-gray-500">
        <p>Select a section to preview</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Preview</h3>

      <div className="bg-white p-4 rounded border space-y-3 text-sm">
        <div>
          <p className="text-xs text-gray-500 mb-1">Section Key</p>
          <p className="font-mono text-gray-900">{section.section_key}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Visibility</p>
          <p className="text-gray-900">{section.is_visible ? 'Visible' : 'Hidden'}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Sort Order</p>
          <p className="text-gray-900">{section.sort_order}</p>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500 mb-2">Content Preview</p>
          <div className="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700 max-h-40 overflow-auto">
            <pre>{JSON.stringify(section.payload, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
