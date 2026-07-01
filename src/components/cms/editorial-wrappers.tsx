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

export function WrappedEditorialFeaturedEpisode({ cmsData, fallbackData }: CmsWrapperProps) {
  void cmsData;
  void fallbackData;
  return <EditorialFeaturedEpisode />;
}

export function WrappedEditorialAboutSection({ cmsData, fallbackData }: CmsWrapperProps) {
  void cmsData;
  void fallbackData;
  return <EditorialAboutSection />;
}

export function WrappedEditorialTopicsGrid({ cmsData, fallbackData }: CmsWrapperProps) {
  void cmsData;
  void fallbackData;
  return <EditorialTopicsGrid />;
}

export function WrappedEditorialRecentEpisodes({ cmsData, fallbackData }: CmsWrapperProps) {
  void cmsData;
  void fallbackData;
  return <EditorialRecentEpisodes />;
}

export function WrappedEditorialManifesto({ cmsData, fallbackData }: CmsWrapperProps) {
  void cmsData;
  void fallbackData;
  return <EditorialManifesto />;
}

export function WrappedEditorialAboutChristian({ cmsData, fallbackData }: CmsWrapperProps) {
  void cmsData;
  void fallbackData;
  return <EditorialAboutChristian />;
}

export function WrappedEditorialNewsletter({ cmsData, fallbackData }: CmsWrapperProps) {
  void cmsData;
  void fallbackData;
  return <EditorialNewsletter />;
}

export function WrappedEditorialPlatforms({ cmsData, fallbackData }: CmsWrapperProps) {
  void cmsData;
  void fallbackData;
  return <EditorialPlatforms />;
}

export function WrappedEditorialFooter({ cmsData, fallbackData }: CmsWrapperProps) {
  void cmsData;
  void fallbackData;
  return <EditorialFooter />;
}
