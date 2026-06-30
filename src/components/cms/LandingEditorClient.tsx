'use client';

import { useState } from 'react';
import type { SitePage, SiteSection } from '@/lib/cms/types';
import { SectionListPanel } from './SectionListPanel';
import { SectionEditorForm } from './SectionEditorForm';
import { LivePreviewPanel } from './LivePreviewPanel';
import { SaveStatus } from './SaveStatus';

interface LandingEditorClientProps {
  initialData: {
    page: SitePage | null;
    sections: SiteSection[];
  };
}

export function LandingEditorClient({ initialData }: LandingEditorClientProps) {
  const [sections] = useState<SiteSection[]>(initialData.sections);
  const [selectedSection, setSelectedSection] = useState<string | null>(
    sections.length > 0 ? sections[0].section_key : null
  );
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const page = initialData.page;

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="font-semibold text-gray-900">Landing page not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="max-w-[1920px] mx-auto">
          <h1 className="text-2xl font-bold">Landing Editor</h1>
          <p className="text-sm text-gray-600 mt-1">Edit your landing page sections</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: Section list */}
        <div className="w-64 border-r bg-gray-50 overflow-y-auto">
          <SectionListPanel
            sections={sections}
            selectedSection={selectedSection}
            onSelectSection={setSelectedSection}
          />
        </div>

        {/* Center: Editor form */}
        <div className="flex-1 overflow-y-auto">
          {selectedSection && (
            <div className="max-w-4xl mx-auto p-6">
              <SectionEditorForm
                section={sections.find((s) => s.section_key === selectedSection) || null}
                onSaveStart={() => setSaveStatus('saving')}
                onSaveComplete={(success) => {
                  setSaveStatus(success ? 'saved' : 'error');
                  setTimeout(() => setSaveStatus('idle'), 3000);
                }}
              />
            </div>
          )}
        </div>

        {/* Right panel: Preview */}
        <div className="w-96 border-l bg-gray-50 overflow-y-auto">
          <LivePreviewPanel
            section={sections.find((s) => s.section_key === selectedSection) || null}
          />
        </div>
      </div>

      {/* Save status */}
      <SaveStatus status={saveStatus} />
    </div>
  );
}
