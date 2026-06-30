import { describe, it, expect } from 'vitest';
import { LANDING_SECTION_KEYS, isSectionKey, isSitePage, isSiteSection } from '@/lib/cms/types';

describe('CMS Types', () => {
  describe('LANDING_SECTION_KEYS', () => {
    it('should have exactly 10 sections', () => {
      expect(LANDING_SECTION_KEYS.length).toBe(10);
    });

    it('should contain exact sections in order', () => {
      const expected = [
        'hero',
        'featured_episode',
        'about',
        'topics',
        'recent_episodes',
        'manifesto',
        'about_christian',
        'newsletter',
        'platforms',
        'footer',
      ];
      expect(LANDING_SECTION_KEYS).toEqual(expected);
    });
  });

  describe('isSectionKey', () => {
    it('should return true for valid section keys', () => {
      LANDING_SECTION_KEYS.forEach((key) => {
        expect(isSectionKey(key)).toBe(true);
      });
    });

    it('should return false for invalid keys', () => {
      expect(isSectionKey('invalid')).toBe(false);
      expect(isSectionKey(123)).toBe(false);
      expect(isSectionKey(null)).toBe(false);
    });
  });

  describe('isSitePage', () => {
    it('should return true for valid SitePage', () => {
      const page = {
        id: 'test-id',
        user_id: 'user-id',
        slug: 'home',
        payload: {},
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };
      expect(isSitePage(page)).toBe(true);
    });

    it('should return false for invalid SitePage', () => {
      expect(isSitePage(null)).toBe(false);
      expect(isSitePage({})).toBe(false);
      expect(isSitePage({ id: 'test', slug: 'home' })).toBe(false);
    });
  });

  describe('isSiteSection', () => {
    it('should return true for valid SiteSection', () => {
      const section = {
        id: 'section-id',
        page_id: 'page-id',
        user_id: 'user-id',
        section_key: 'hero',
        is_visible: true,
        sort_order: 1,
        payload: {},
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };
      expect(isSiteSection(section)).toBe(true);
    });

    it('should return false for invalid SiteSection', () => {
      expect(isSiteSection(null)).toBe(false);
      expect(isSiteSection({})).toBe(false);
      expect(isSiteSection({ id: 'test', section_key: 'invalid' })).toBe(false);
    });
  });
});
