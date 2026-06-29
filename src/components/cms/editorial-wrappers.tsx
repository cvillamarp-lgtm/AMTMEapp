/**
 * Editorial Component Wrappers
 * Wraps editorial components to accept CMS data while maintaining backward compatibility
 * TODO: Update components to accept and use cmsData/fallbackData props
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

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

/**
 * Hero wrapper accepts CMS data
 * For now, passes directly through since Hero has been updated
 */
export function WrappedEditorialHero({
  cmsData,
  fallbackData,
}: {
  cmsData?: Record<string, unknown>;
  fallbackData?: Record<string, unknown>;
}) {
  return <EditorialHero cmsData={cmsData} fallbackData={fallbackData} />;
}

/**
 * Featured Episode wrapper
 * Passes through CMS data but component will use hardcoded fallback if not provided
 */
export function WrappedEditorialFeaturedEpisode({
  cmsData,
  fallbackData,
}: {
  cmsData?: Record<string, unknown>;
  fallbackData?: Record<string, unknown>;
}) {
  // For now, render the original component
  // Future: pass cmsData to component once it's updated to accept props
  return <EditorialFeaturedEpisode />;
}

export function WrappedEditorialAboutSection({
  cmsData,
  fallbackData,
}: {
  cmsData?: Record<string, unknown>;
  fallbackData?: Record<string, unknown>;
}) {
  return <EditorialAboutSection />;
}

export function WrappedEditorialTopicsGrid({
  cmsData,
  fallbackData,
}: {
  cmsData?: Record<string, unknown>;
  fallbackData?: Record<string, unknown>;
}) {
  return <EditorialTopicsGrid />;
}

export function WrappedEditorialRecentEpisodes({
  cmsData,
  fallbackData,
}: {
  cmsData?: Record<string, unknown>;
  fallbackData?: Record<string, unknown>;
}) {
  return <EditorialRecentEpisodes />;
}

export function WrappedEditorialManifesto({
  cmsData,
  fallbackData,
}: {
  cmsData?: Record<string, unknown>;
  fallbackData?: Record<string, unknown>;
}) {
  return <EditorialManifesto />;
}

export function WrappedEditorialAboutChristian({
  cmsData,
  fallbackData,
}: {
  cmsData?: Record<string, unknown>;
  fallbackData?: Record<string, unknown>;
}) {
  return <EditorialAboutChristian />;
}

export function WrappedEditorialNewsletter({
  cmsData,
  fallbackData,
}: {
  cmsData?: Record<string, unknown>;
  fallbackData?: Record<string, unknown>;
}) {
  return <EditorialNewsletter />;
}

export function WrappedEditorialPlatforms({
  cmsData,
  fallbackData,
}: {
  cmsData?: Record<string, unknown>;
  fallbackData?: Record<string, unknown>;
}) {
  return <EditorialPlatforms />;
}

export function WrappedEditorialFooter({
  cmsData,
  fallbackData,
}: {
  cmsData?: Record<string, unknown>;
  fallbackData?: Record<string, unknown>;
}) {
  return <EditorialFooter />;
}
