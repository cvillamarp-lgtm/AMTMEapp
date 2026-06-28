import { redirect } from 'next/navigation';
import { checkIsAdmin, getAdminLandingPage } from '@/lib/cms/queries';
import { LandingEditorClient } from '@/components/cms/LandingEditorClient';

export const dynamic = 'force-dynamic';

export default async function LandingEditorPage() {
  // Server-side admin gate — enforced before any client code runs
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    redirect('/auth/sign-in?next=/studio/landing-editor');
  }

  const { page, sections } = await getAdminLandingPage();

  return (
    <LandingEditorClient
      initialPage={page}
      initialSections={sections}
    />
  );
}
