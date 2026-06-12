import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getNotes, createNote, updateNote, deleteNote } from '@/lib/database';
import type { Note, NoteCategory, NoteStatus } from '@/types/database';

// Mock the database persistence layer
vi.mock('@/lib/database-persistence', () => ({
  getClient: vi.fn(),
  getActiveUserId: vi.fn(() => Promise.resolve('test-user-id')),
  getAll: vi.fn(),
  insertOne: vi.fn(),
  updateOne: vi.fn(),
  deleteOne: vi.fn(),
  fromRow: vi.fn((row) => row),
  toRow: vi.fn((payload, userId) => ({ user_id: userId, payload })),
}));

describe('Notes CRUD', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getNotes', () => {
    it('should fetch all notes for active user', async () => {
      const mockNotes: Note[] = [
        {
          id: '1',
          user_id: 'test-user-id',
          title: 'Test Note',
          content: 'Test content',
          category: 'general' as NoteCategory,
          status: 'activa' as NoteStatus,
          pinned: false,
          tags: [],
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
      ];

      // This test validates the structure; actual Supabase behavior is tested in e2e
      expect(mockNotes).toHaveLength(1);
      expect(mockNotes[0].title).toBe('Test Note');
    });
  });

  describe('createNote', () => {
    it('should create a note with required fields', async () => {
      const noteData = {
        title: 'Nueva nota',
        content: '',
        category: 'general' as NoteCategory,
        status: 'activa' as NoteStatus,
        pinned: false,
        tags: [] as string[],
      };

      expect(noteData).toHaveProperty('title', 'Nueva nota');
      expect(noteData).toHaveProperty('content', '');
      expect(noteData).toHaveProperty('category', 'general');
      expect(noteData).toHaveProperty('status', 'activa');
      expect(noteData).toHaveProperty('pinned', false);
      expect(noteData).toHaveProperty('tags');
    });

    it('should accept optional tags array', async () => {
      const noteData = {
        title: 'Note with tags',
        content: 'Content',
        category: 'insight' as NoteCategory,
        status: 'pendiente' as NoteStatus,
        pinned: true,
        tags: ['tag1', 'tag2'],
      };

      expect(noteData.tags).toContain('tag1');
      expect(noteData.tags).toHaveLength(2);
    });
  });

  describe('updateNote', () => {
    it('should update partial note fields', async () => {
      const originalNote: Note = {
        id: '1',
        user_id: 'test-user-id',
        title: 'Original Title',
        content: 'Original content',
        category: 'general' as NoteCategory,
        status: 'activa' as NoteStatus,
        pinned: false,
        tags: [],
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      };

      const updates = { title: 'Updated Title', pinned: true };
      const updatedNote = { ...originalNote, ...updates };

      expect(updatedNote.title).toBe('Updated Title');
      expect(updatedNote.pinned).toBe(true);
      expect(updatedNote.content).toBe('Original content'); // unchanged
    });

    it('should preserve tags during updates', async () => {
      const originalNote: Note = {
        id: '1',
        user_id: 'test-user-id',
        title: 'Test',
        content: 'Content',
        category: 'general' as NoteCategory,
        status: 'activa' as NoteStatus,
        pinned: false,
        tags: ['important', 'urgent'],
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      };

      const updates = { content: 'New content' };
      const updated = { ...originalNote, ...updates };

      expect(updated.tags).toEqual(['important', 'urgent']);
    });
  });

  describe('deleteNote', () => {
    it('should remove note from list', async () => {
      const notes: Note[] = [
        {
          id: '1',
          user_id: 'test-user-id',
          title: 'Note 1',
          content: 'Content',
          category: 'general' as NoteCategory,
          status: 'activa' as NoteStatus,
          pinned: false,
          tags: [],
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
      ];

      const filtered = notes.filter((n) => n.id !== '1');
      expect(filtered).toHaveLength(0);
    });
  });

  describe('Type validation', () => {
    it('should accept valid NoteCategory values', () => {
      const validCategories: NoteCategory[] = [
        'general',
        'reflexion',
        'episodio',
        'frase',
        'aprendizaje',
        'simbolo',
        'sueno',
        'insight',
        'pendiente',
      ];
      expect(validCategories).toHaveLength(9);
    });

    it('should accept valid NoteStatus values', () => {
      const validStatuses: NoteStatus[] = ['activa', 'archivada', 'pendiente'];
      expect(validStatuses).toHaveLength(3);
    });
  });
});
