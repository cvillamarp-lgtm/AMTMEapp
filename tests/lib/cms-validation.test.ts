import { describe, it, expect } from 'vitest';
import {
  validateSectionKey,
  validateUrl,
  validatePayloadHasRequiredFields,
  validateSectionReorder,
  validateSeoMetadata,
} from '@/lib/cms/validation';
import { LANDING_SECTION_KEYS } from '@/lib/cms/types';

describe('CMS Validation', () => {
  describe('validateSectionKey', () => {
    it('should accept valid section keys', () => {
      LANDING_SECTION_KEYS.forEach((key) => {
        expect(validateSectionKey(key)).toBe(true);
      });
    });

    it('should reject invalid keys', () => {
      expect(validateSectionKey('invalid')).toBe(false);
      expect(validateSectionKey(123)).toBe(false);
    });
  });

  describe('validateUrl', () => {
    it('should accept valid URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://example.com/path')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validateUrl('not a url')).toBe(false);
      expect(validateUrl('')).toBe(false);
      expect(validateUrl(123)).toBe(false);
    });
  });

  describe('validatePayloadHasRequiredFields', () => {
    it('should return true if all required fields present', () => {
      const payload = { title: 'Test', description: 'Test desc' };
      expect(validatePayloadHasRequiredFields(payload, ['title', 'description'])).toBe(true);
    });

    it('should return false if required field missing', () => {
      const payload = { title: 'Test' };
      expect(validatePayloadHasRequiredFields(payload, ['title', 'description'])).toBe(false);
    });

    it('should return false if required field is empty string', () => {
      const payload = { title: '', description: 'Test' };
      expect(validatePayloadHasRequiredFields(payload, ['title', 'description'])).toBe(false);
    });
  });

  describe('validateSectionReorder', () => {
    it('should accept exactly 10 unique valid section keys', () => {
      const keys = [...LANDING_SECTION_KEYS];
      expect(validateSectionReorder(keys)).toBe(true);
    });

    it('should reject if less than 10 sections', () => {
      const keys = LANDING_SECTION_KEYS.slice(0, 9);
      expect(validateSectionReorder(keys)).toBe(false);
    });

    it('should reject if more than 10 sections', () => {
      const keys = [...LANDING_SECTION_KEYS, 'hero']; // Duplicate
      expect(validateSectionReorder(keys)).toBe(false);
    });

    it('should reject if duplicate sections', () => {
      const keys = [...LANDING_SECTION_KEYS];
      keys[9] = 'hero'; // Replace last with duplicate
      expect(validateSectionReorder(keys)).toBe(false);
    });

    it('should reject if invalid section key', () => {
      const keys = [...LANDING_SECTION_KEYS];
      keys[0] = 'invalid' as any;
      expect(validateSectionReorder(keys)).toBe(false);
    });
  });

  describe('validateSeoMetadata', () => {
    it('should accept valid SEO metadata', () => {
      const seo = {
        title: 'Test Title',
        description: 'Test Description',
        ogTitle: 'OG Title',
        ogImage: 'https://example.com/image.jpg',
      };
      expect(validateSeoMetadata(seo)).toBe(true);
    });

    it('should reject if title missing', () => {
      const seo = { description: 'Test' };
      expect(validateSeoMetadata(seo)).toBe(false);
    });

    it('should reject if description missing', () => {
      const seo = { title: 'Test' };
      expect(validateSeoMetadata(seo)).toBe(false);
    });

    it('should accept with optional ogImage', () => {
      const seo = {
        title: 'Test',
        description: 'Test',
        ogImage: 'https://example.com/og.jpg',
      };
      expect(validateSeoMetadata(seo)).toBe(true);
    });
  });
});
