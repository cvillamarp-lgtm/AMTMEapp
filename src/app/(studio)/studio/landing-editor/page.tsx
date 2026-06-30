import { redirect } from 'next/navigation';
import { checkIsCMSAdmin, getAdminLandingPage } from '@/lib/cms/queries';
import { LandingEditorClient } from '@/components/cms/LandingEditorClient';
import type { SitePage, SiteSection } from '@/lib/cms/types';

export const metadata = {
  title: 'Landing Editor — AMTME Studio',
  description: 'Edit your landing page content',
};

export default async function LandingEditorPage() {
  // Check admin access
  const isAdmin = await checkIsCMSAdmin();

  if (!isAdmin) {
    redirect('/studio');
  }

  // Load data server-side
  const { page, sections } = await getAdminLandingPage();

  const initialData: { page: SitePage | null; sections: SiteSection[] } = {
    page,
    sections: sections.sort((a, b) => a.sort_order - b.sort_order),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingEditorClient initialData={initialData} />
    </div>
  );
}
