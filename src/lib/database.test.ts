import { describe, it, expect, beforeEach, vi } from 'vitest';

// P0: database.ts debe exigir ownership real (user_id = auth.uid()) en toda
// operación CRUD. Estos tests protegen contra:
//  - insertOne con user_id null cuando no hay sesión.
//  - updateOne / deleteOne que operen solo por `id`, sin filtrar por usuario (IDOR).
//  - getAll que devuelva datos de otros usuarios cuando no hay sesión.

type QueryBuilder = {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
};

function createQueryBuilder(result: { data: unknown; error: unknown }): QueryBuilder {
  const builder: Partial<QueryBuilder> = {};
  builder.select = vi.fn(() => builder as QueryBuilder);
  builder.insert = vi.fn(() => builder as QueryBuilder);
  builder.update = vi.fn(() => builder as QueryBuilder);
  builder.delete = vi.fn(() => builder as QueryBuilder);
  builder.eq = vi.fn(() => builder as QueryBuilder);
  builder.order = vi.fn(() => Promise.resolve(result));
  builder.single = vi.fn(() => Promise.resolve(result));
  return builder as QueryBuilder;
}

const mockAuthClient = {
  auth: {
    getSession: vi.fn(),
  },
  from: vi.fn(),
};

vi.mock('./supabase/auth-browser', () => ({
  getSupabaseAuthBrowserClient: () => mockAuthClient,
}));

describe('database.ts ownership enforcement (P0)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAll devuelve [] cuando no hay sesión activa (no expone datos)', async () => {
    mockAuthClient.auth.getSession.mockResolvedValue({ data: { session: null } });

    const { getEpisodes } = await import('./database');
    const result = await getEpisodes();

    expect(result).toEqual([]);
    expect(mockAuthClient.from).not.toHaveBeenCalled();
  });

  it('getAll filtra por user_id = auth.uid() cuando hay sesión', async () => {
    mockAuthClient.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
    });
    const qb = createQueryBuilder({ data: [], error: null });
    mockAuthClient.from.mockReturnValue(qb);

    const { getEpisodes } = await import('./database');
    await getEpisodes();

    expect(mockAuthClient.from).toHaveBeenCalledWith('episodes');
    expect(qb.eq).toHaveBeenCalledWith('user_id', 'user-1');
  });

  it('createEpisode lanza error explícito sin sesión (nunca inserta user_id null)', async () => {
    mockAuthClient.auth.getSession.mockResolvedValue({ data: { session: null } });

    const { createEpisode } = await import('./database');

    await expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createEpisode({ title: 'x' } as any)
    ).rejects.toThrow(/No autenticado/);
    expect(mockAuthClient.from).not.toHaveBeenCalled();
  });

  it('updateEpisode filtra por id + user_id (evita IDOR)', async () => {
    mockAuthClient.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
    });
    const qb = createQueryBuilder({
      data: { payload: {}, id: 'ep-1', user_id: 'user-1' },
      error: null,
    });
    mockAuthClient.from.mockReturnValue(qb);

    const { updateEpisode } = await import('./database');
    await updateEpisode('ep-1', { title: 'nuevo' });

    expect(qb.eq).toHaveBeenCalledWith('id', 'ep-1');
    expect(qb.eq).toHaveBeenCalledWith('user_id', 'user-1');
  });

  it('updateEpisode lanza error explícito sin sesión', async () => {
    mockAuthClient.auth.getSession.mockResolvedValue({ data: { session: null } });

    const { updateEpisode } = await import('./database');

    await expect(updateEpisode('ep-1', { title: 'x' })).rejects.toThrow(/No autenticado/);
    expect(mockAuthClient.from).not.toHaveBeenCalled();
  });

  it('deleteEpisode filtra por id + user_id (evita IDOR)', async () => {
    mockAuthClient.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
    });
    const qb = createQueryBuilder({ data: null, error: null });
    mockAuthClient.from.mockReturnValue(qb);

    const { deleteEpisode } = await import('./database');
    await deleteEpisode('ep-1');

    expect(qb.eq).toHaveBeenCalledWith('id', 'ep-1');
    expect(qb.eq).toHaveBeenCalledWith('user_id', 'user-1');
  });

  it('deleteEpisode lanza error explícito sin sesión', async () => {
    mockAuthClient.auth.getSession.mockResolvedValue({ data: { session: null } });

    const { deleteEpisode } = await import('./database');

    await expect(deleteEpisode('ep-1')).rejects.toThrow(/No autenticado/);
    expect(mockAuthClient.from).not.toHaveBeenCalled();
  });
});
