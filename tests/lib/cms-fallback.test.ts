import { describe, it, expect } from 'vitest';
import {
  LANDING_FALLBACK_PAGE,
  LANDING_FALLBACK_SECTIONS,
  getLandingPageWithFallback,
  getSectionPayloadWithFallback,
} from '@/lib/cms/fallback';
import { LANDING_SECTION_KEYS } from '@/lib/cms/types';

describe('CMS Fallback', () => {
  describe('LANDING_FALLBACK_SECTIONS', () => {
    it('should contain exactly 10 sections', () => {
      expect(LANDING_FALLBACK_SECTIONS.length).toBe(10);
    });

    it('should have all required sections', () => {
      const sectionKeys = new Set(LANDING_FALLBACK_SECTIONS.map((s) => s.section_key));
      LANDING_SECTION_KEYS.forEach((key) => {
        expect(sectionKeys.has(key)).toBe(true);
      });
    });

    it('should have complete section data', () => {
      LANDING_FALLBACK_SECTIONS.forEach((section) => {
        expect(Object.keys(section.payload).length).toBeGreaterThan(0);
        expect(section.id).toBeTruthy();
        expect(section.section_key).toBeTruthy();
      });
    });

    it('should have complete payload for each section', () => {
      LANDING_FALLBACK_SECTIONS.forEach((section) => {
        expect(Object.keys(section.payload).length).toBeGreaterThan(0);
      });
    });
  });

  describe('getLandingPageWithFallback', () => {
    it('should return fallback if page is null', () => {
      const result = getLandingPageWithFallback(null);
      expect(result).toBe(LANDING_FALLBACK_PAGE);
    });

    it('should return fallback if page has no id', () => {
      const page = { ...LANDING_FALLBACK_PAGE, id: '' };
      const result = getLandingPageWithFallback(page);
      expect(result).toBe(LANDING_FALLBACK_PAGE);
    });

    it('should return fallback if page has no payload', () => {
      const page = { ...LANDING_FALLBACK_PAGE, payload: null };
      const result = getLandingPageWithFallback(page as any);
      expect(result).toBe(LANDING_FALLBACK_PAGE);
    });

    it('should return page if all fields are valid', () => {
      const page = LANDING_FALLBACK_PAGE;
      const result = getLandingPageWithFallback(page);
      expect(result).toBe(page);
    });
  });

  describe('getSectionPayloadWithFallback', () => {
    it('should return fallback payload if section is null', () => {
      const result = getSectionPayloadWithFallback(null, 'hero');
      const expected = LANDING_FALLBACK_SECTIONS.find((s) => s.section_key === 'hero');
      expect(result).toEqual(expected?.payload);
    });

    it('should return fallback if section payload is empty', () => {
      const section = { ...LANDING_FALLBACK_SECTIONS[0], payload: {} };
      const result = getSectionPayloadWithFallback(section, 'hero');
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    it('should return section payload if valid', () => {
      const section = LANDING_FALLBACK_SECTIONS[0];
      const result = getSectionPayloadWithFallback(section, 'hero');
      expect(result).toEqual(section.payload);
    });
  });
});
