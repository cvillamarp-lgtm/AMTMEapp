/**
 * Editorial Component Wrappers
 * Keep CMS adapter compatibility while rendering the editorial landing system.
 */

import { EditorialHero } from '@/components/editorial/EditorialHero';
import { EditorialFeaturedEpisode } from '@/components/editorial/EditorialFeaturedEpisode';
import { EditorialAboutSection } from '@/components/editorial/EditorialAboutSection';
import { EditorialTopicsGrid } from '@/components/editorial/EditorialTopicsGrid';
import { EditorialRecentEpisodes } from '@/components/editorial/EditorialRecentEpisodes';
import { EditorialManifesto } from '@/components/editorial/EditorialManifesto';
import { EditorialAboutChristian } from '@/components/editorial/EditorialAboutChristian';
import { EditorialNewsletter } from '@/components/editorial/EditorialNewsletter';
import { EditorialPlatforms } from '@/components/editorial/EditorialPlatforms';
import { EditorialFooter } from '@/components/editorial/EditorialFooter';

type CmsWrapperProps = {
  cmsData?: Record<string, unknown>;
  fallbackData?: Record<string, unknown>;
};

export function WrappedEditorialHero({ cmsData, fallbackData }: CmsWrapperProps) {
  return <EditorialHero cmsData={cmsData} fallbackData={fallbackData} />;
}

export function WrappedEditorialFeaturedEpisode(_props: CmsWrapperProps) {
  return <EditorialFeaturedEpisode />;
}

export function WrappedEditorialAboutSection(_props: CmsWrapperProps) {
  return <EditorialAboutSection />;
}

export function WrappedEditorialTopicsGrid(_props: CmsWrapperProps) {
  return <EditorialTopicsGrid />;
}

export function WrappedEditorialRecentEpisodes(_props: CmsWrapperProps) {
  return <EditorialRecentEpisodes />;
}

export function WrappedEditorialManifesto(_props: CmsWrapperProps) {
  return <EditorialManifesto />;
}

export function WrappedEditorialAboutChristian(_props: CmsWrapperProps) {
  return <EditorialAboutChristian />;
}

export function WrappedEditorialNewsletter(_props: CmsWrapperProps) {
  return <EditorialNewsletter />;
}

export function WrappedEditorialPlatforms(_props: CmsWrapperProps) {
  return <EditorialPlatforms />;
}

export function WrappedEditorialFooter(_props: CmsWrapperProps) {
  return <EditorialFooter />;
}
