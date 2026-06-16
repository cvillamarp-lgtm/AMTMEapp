# P1 Testing Strategy
**AMTME OS Dashboard — Target: 80%+ Coverage**

---

## TESTING PYRAMID

```
          E2E Tests (5%)
         /            \
        /              \
       /                \
      /  Integration (10%)
     /____________________\
    /                      \
   /                        \
  /  Unit Tests (60%) + Components (25%)
 /________________________________\
```

---

## COVERAGE TARGETS

| Layer | Type | Target | Count |
|-------|------|--------|-------|
| **Unit** | Hooks | 85%+ | 4 hooks × 5-6 tests = 20-24 |
| **Unit** | Schemas | 90%+ | 3 schemas × 3-4 tests = 9-12 |
| **Unit** | Utils | 80%+ | ~5 utils × 2-3 tests = 10-15 |
| **Component** | Forms | 80%+ | 7 forms × 4-5 tests = 28-35 |
| **Component** | Cards | 75%+ | 4 cards × 3-4 tests = 12-16 |
| **Component** | Modals | 75%+ | 4 modals × 3 tests = 12 |
| **Component** | Lists | 75%+ | 3 lists × 3-4 tests = 9-12 |
| **Integration** | Form flows | 80%+ | 4 flows × 2-3 tests = 8-12 |
| **Integration** | Page loads | 75%+ | 3 pages × 2-3 tests = 6-9 |
| **E2E** | Critical flows | 100% | 3 flows × 1 test = 3 |
| | | **TOTAL: ~80%+** | **~130-150 tests** |

---

## UNIT TESTS

### Hook Tests (4 hooks)

#### `src/hooks/__tests__/use-episodes.test.ts`
```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { useEpisodes } from '../use-episodes';

describe('useEpisodes', () => {
  // SETUP
  const mockSupabase = {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: [
            {
              id: '1',
              created_at: '2024-01-01',
              updated_at: '2024-01-01',
              user_id: null,
              payload: {
                episode_number: '1',
                title: 'Test Episode',
                theme: 'Tech',
                status: 'Idea',
              },
            },
          ],
          error: null,
        }),
      }),
    }),
  };

  // TESTS
  it('should fetch episodes on mount', async () => {
    const { result } = renderHook(() => useEpisodes());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data.length).toBe(1);
    expect(result.current.data[0].title).toBe('Test Episode');
  });

  it('should apply filters (status)', async () => {
    const { result } = renderHook(() => useEpisodes({ status: 'Publicado' }));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(mockSupabase.from).toHaveBeenCalledWith('episodes');
  });

  it('should handle errors', async () => {
    // Mock error response
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: null,
        error: new Error('Supabase error'),
      }),
    });
    
    const { result } = renderHook(() => useEpisodes());
    
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });

  it('should create episode', async () => {
    const { result } = renderHook(() => useEpisodes());
    
    await act(async () => {
      const newEpisode = await result.current.create({
        episode_number: '2',
        title: 'New Episode',
        theme: 'AI',
        status: 'Idea',
      });
      expect(newEpisode.id).toBeDefined();
    });
  });

  it('should update episode', async () => {
    const { result } = renderHook(() => useEpisodes());
    
    await act(async () => {
      const updated = await result.current.update('1', {
        title: 'Updated Title',
      });
      expect(updated.title).toBe('Updated Title');
    });
  });

  it('should delete episode', async () => {
    const { result } = renderHook(() => useEpisodes());
    
    await act(async () => {
      await result.current.delete('1');
    });
    
    await waitFor(() => {
      expect(result.current.data.length).toBe(0);
    });
  });

  it('should refetch episodes', async () => {
    const { result } = renderHook(() => useEpisodes());
    
    const initialLength = result.current.data.length;
    
    await act(async () => {
      await result.current.refetch();
    });
    
    // Data should be refreshed
    expect(mockSupabase.from).toHaveBeenCalled();
  });
});
```

**Test count:** 8 tests

---

#### `src/hooks/__tests__/use-content-pieces.test.ts`
**Similar to use-episodes.test.ts**
- Fetch content pieces
- Filter by episodeId, type, status
- Create, update, delete
- Error handling
- Refetch

**Test count:** 8 tests

---

#### `src/hooks/__tests__/use-monetization-leads.test.ts`
**Similar pattern**
- Fetch leads
- Filter by status, search (name/email)
- CRUD
- Error handling

**Test count:** 8 tests

---

#### `src/hooks/__tests__/use-studio-state.test.ts`
```typescript
describe('useStudioState', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useStudioState());
    expect(result.current.density).toBe('estandar');
    expect(result.current.currentSection).toBe('dashboard');
  });

  it('should update density', () => {
    const { result } = renderHook(() => useStudioState());
    
    act(() => {
      result.current.setDensity('compacta');
    });
    
    expect(result.current.density).toBe('compacta');
  });

  it('should persist to localStorage', () => {
    const { result } = renderHook(() => useStudioState());
    
    act(() => {
      result.current.setDensity('compacta');
    });
    
    expect(localStorage.getItem('studio-state')).toContain('compacta');
  });

  it('should restore from localStorage on mount', () => {
    localStorage.setItem('studio-state', JSON.stringify({ density: 'compacta' }));
    
    const { result } = renderHook(() => useStudioState());
    expect(result.current.density).toBe('compacta');
  });
});
```

**Test count:** 4 tests

---

### Schema Tests (3 schemas)

#### `src/lib/schemas/__tests__/episode-schema.test.ts`
```typescript
import { episodeSchema, type EpisodeInput } from '../episode-schema';

describe('episodeSchema', () => {
  const validInput: EpisodeInput = {
    episode_number: '1',
    title: 'Test Episode',
    theme: 'Technology',
    status: 'Idea',
    cta: null,
    spotify_description: null,
  };

  // VALID CASES
  it('should parse valid episode', () => {
    expect(episodeSchema.parse(validInput)).toEqual(validInput);
  });

  it('should allow optional fields', () => {
    const result = episodeSchema.parse({
      episode_number: '1',
      title: 'Test',
      theme: 'Tech',
      status: 'Idea',
    });
    expect(result.cta).toBeNull();
  });

  // INVALID CASES
  it('should reject title < 3 characters', () => {
    expect(() =>
      episodeSchema.parse({ ...validInput, title: 'Te' })
    ).toThrow();
  });

  it('should reject title > 200 characters', () => {
    const longTitle = 'a'.repeat(201);
    expect(() =>
      episodeSchema.parse({ ...validInput, title: longTitle })
    ).toThrow();
  });

  it('should reject invalid status', () => {
    expect(() =>
      episodeSchema.parse({ ...validInput, status: 'InvalidStatus' as any })
    ).toThrow();
  });

  it('should reject spotify_description > 500 chars', () => {
    const longDesc = 'a'.repeat(501);
    expect(() =>
      episodeSchema.parse({ ...validInput, spotify_description: longDesc })
    ).toThrow();
  });

  it('should reject missing required fields', () => {
    const { title, ...incomplete } = validInput;
    expect(() => episodeSchema.parse(incomplete)).toThrow();
  });

  it('should coerce episode_number to string', () => {
    const result = episodeSchema.parse({
      ...validInput,
      episode_number: 1 as any,
    });
    expect(typeof result.episode_number).toBe('string');
  });
});
```

**Test count:** 8 tests

---

#### `src/lib/schemas/__tests__/content-piece-schema.test.ts`
```typescript
describe('contentPieceSchema', () => {
  // Similar structure to episode-schema
  // Valid cases:
  // - Parse valid content piece
  // - Optional description and platform_urls
  
  // Invalid cases:
  // - Missing episode_id
  // - Invalid type
  // - Invalid status
  // - Title required
});
```

**Test count:** 8 tests

---

#### `src/lib/schemas/__tests__/lead-schema.test.ts`
```typescript
describe('leadSchema', () => {
  // Similar structure
  // Valid cases:
  // - Parse valid lead
  // - Optional phone, notes
  
  // Invalid cases:
  // - Name < 2 chars
  // - Invalid email
  // - Invalid status
  // - Missing required fields
});
```

**Test count:** 8 tests

---

## COMPONENT TESTS

### Form Component Tests

#### `src/components/forms/__tests__/form-wrapper.test.tsx`
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormWrapper } from '../form-wrapper';

describe('FormWrapper', () => {
  it('should render form with children', () => {
    render(
      <FormWrapper onSubmit={jest.fn()}>
        <input data-testid="test-input" />
      </FormWrapper>
    );
    
    expect(screen.getByTestId('test-input')).toBeInTheDocument();
  });

  it('should call onSubmit with form data', async () => {
    const onSubmit = jest.fn();
    render(
      <form onSubmit={(e) => { e.preventDefault(); onSubmit({}); }}>
        <button type="submit">Submit</button>
      </form>
    );
    
    fireEvent.click(screen.getByText('Submit'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should show loading state on submit button', async () => {
    const { rerender } = render(
      <FormWrapper onSubmit={jest.fn()} loading={false}>
        <button type="submit">Submit</button>
      </FormWrapper>
    );
    
    rerender(
      <FormWrapper onSubmit={jest.fn()} loading={true}>
        <button type="submit" disabled>
          Submit
        </button>
      </FormWrapper>
    );
    
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should display error message', () => {
    render(
      <FormWrapper
        onSubmit={jest.fn()}
        error="Form submission failed"
      >
        <input />
      </FormWrapper>
    );
    
    expect(screen.getByText('Form submission failed')).toBeInTheDocument();
  });

  it('should call onCancel when cancel button clicked', () => {
    const onCancel = jest.fn();
    render(
      <FormWrapper onSubmit={jest.fn()} onCancel={onCancel}>
        <button type="button" onClick={onCancel}>Cancel</button>
      </FormWrapper>
    );
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
});
```

**Test count:** 5 tests

---

#### `src/components/forms/__tests__/form-input.test.tsx`
```typescript
describe('FormInput', () => {
  it('should render label', () => {
    render(<FormInput label="Title" name="title" />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
  });

  it('should render error message', () => {
    render(<FormInput label="Title" error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should show required indicator', () => {
    const { container } = render(<FormInput label="Title" required />);
    expect(container.textContent).toContain('*');
  });

  it('should pass through input props', () => {
    render(
      <FormInput
        label="Email"
        type="email"
        placeholder="your@email.com"
        name="email"
      />
    );
    
    const input = screen.getByPlaceholderText('your@email.com') as HTMLInputElement;
    expect(input.type).toBe('email');
  });

  it('should display hint text', () => {
    render(
      <FormInput label="Title" hint="Must be 3-200 characters" />
    );
    expect(screen.getByText('Must be 3-200 characters')).toBeInTheDocument();
  });
});
```

**Test count:** 5 tests

---

#### `src/components/forms/__tests__/episode-form.test.tsx`
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EpisodeForm } from '../episode-form';

describe('EpisodeForm', () => {
  const mockSubmit = jest.fn();

  it('should render all fields for create mode', () => {
    render(
      <EpisodeForm
        mode="create"
        onSubmit={mockSubmit}
      />
    );
    
    expect(screen.getByLabelText(/Número de episodio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tema/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Estado/i)).toBeInTheDocument();
  });

  it('should pre-fill form in edit mode', () => {
    const episode = {
      id: '1',
      episode_number: '1',
      title: 'Test Episode',
      theme: 'Tech',
      status: 'Idea' as const,
      cta: null,
      spotify_description: null,
    };
    
    render(
      <EpisodeForm
        mode="edit"
        episode={episode}
        onSubmit={mockSubmit}
      />
    );
    
    expect(screen.getByDisplayValue('Test Episode')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Tech')).toBeInTheDocument();
  });

  it('should validate on submit', async () => {
    const user = userEvent.setup();
    render(
      <EpisodeForm mode="create" onSubmit={mockSubmit} />
    );
    
    // Leave title empty and submit
    const submitBtn = screen.getByRole('button', { name: /Crear|Guardar/i });
    await user.click(submitBtn);
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/Mín 3 caracteres/i)).toBeInTheDocument();
    });
    
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with form data', async () => {
    const user = userEvent.setup();
    render(
      <EpisodeForm mode="create" onSubmit={mockSubmit} />
    );
    
    // Fill form
    await user.type(screen.getByLabelText(/Número/i), '1');
    await user.type(screen.getByLabelText(/Título/i), 'My Episode');
    await user.type(screen.getByLabelText(/Tema/i), 'Tech');
    
    // Submit
    await user.click(screen.getByRole('button', { name: /Crear/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          episode_number: '1',
          title: 'My Episode',
          theme: 'Tech',
        })
      );
    });
  });

  it('should show loading state during submit', async () => {
    render(
      <EpisodeForm
        mode="create"
        onSubmit={async () => {
          await new Promise(r => setTimeout(r, 100));
        }}
      />
    );
    
    const submitBtn = screen.getByRole('button');
    expect(submitBtn).not.toBeDisabled();
    
    // Submit and check for disabled state during loading
    // (depends on implementation)
  });

  it('should display submission error', () => {
    render(
      <EpisodeForm
        mode="create"
        onSubmit={mockSubmit}
        error="Failed to create episode"
      />
    );
    
    expect(screen.getByText('Failed to create episode')).toBeInTheDocument();
  });
});
```

**Test count:** 6 tests

---

#### `src/components/forms/__tests__/content-piece-form.test.tsx`
Similar to episode-form, but with fields: type, status, platform_urls, etc.
**Test count:** 5 tests

---

### Card Component Tests

#### `src/components/cards/__tests__/episode-card.test.tsx`
```typescript
describe('EpisodeCard', () => {
  const mockEpisode = {
    id: '1',
    episode_number: '1',
    title: 'Test Episode',
    theme: 'Tech',
    status: 'Idea' as const,
    cta: null,
    spotify_description: null,
  };

  it('should render episode information', () => {
    render(<EpisodeCard episode={mockEpisode} />);
    
    expect(screen.getByText(/#1: Test Episode/)).toBeInTheDocument();
    expect(screen.getByText(/Tech/)).toBeInTheDocument();
    expect(screen.getByText(/Idea/i)).toBeInTheDocument();
  });

  it('should call onClick handler', () => {
    const onClick = jest.fn();
    render(<EpisodeCard episode={mockEpisode} onClick={onClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledWith('1');
  });

  it('should call onEdit handler', () => {
    const onEdit = jest.fn();
    render(<EpisodeCard episode={mockEpisode} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByText(/Editar/i));
    expect(onEdit).toHaveBeenCalledWith('1');
  });

  it('should call onDelete handler', () => {
    const onDelete = jest.fn();
    render(<EpisodeCard episode={mockEpisode} onDelete={onDelete} />);
    
    fireEvent.click(screen.getByText(/Eliminar|Delete/i));
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('should apply hover state when hoverable prop is true', () => {
    const { container } = render(
      <EpisodeCard episode={mockEpisode} hoverable={true} />
    );
    
    expect(container.querySelector('.hover\\:shadow-lg')).toBeInTheDocument();
  });
});
```

**Test count:** 5 tests

---

#### `src/components/cards/__tests__/stat-card.test.tsx`
```typescript
describe('StatCard', () => {
  it('should render label and value', () => {
    render(<StatCard label="Episodes" value={5} />);
    
    expect(screen.getByText('Episodes')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should show trend indicator', () => {
    render(
      <StatCard label="Growth" value="10%" trend={{ direction: 'up', value: 5 }} />
    );
    
    expect(screen.getByText(/up|↑/i)).toBeInTheDocument();
  });

  it('should show loading skeleton', () => {
    const { container } = render(<StatCard label="Loading" value={0} loading={true} />);
    
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should render icon if provided', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;
    render(
      <StatCard label="Test" value={1} icon={<TestIcon />} />
    );
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });
});
```

**Test count:** 4 tests

---

### Modal Component Tests

#### `src/components/modals/__tests__/confirm-dialog.test.tsx`
```typescript
describe('ConfirmDialog', () => {
  it('should render title and description', () => {
    render(
      <ConfirmDialog
        title="Delete episode?"
        description="This cannot be undone"
        onConfirm={jest.fn()}
      />
    );
    
    expect(screen.getByText('Delete episode?')).toBeInTheDocument();
    expect(screen.getByText('This cannot be undone')).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button clicked', async () => {
    const onConfirm = jest.fn();
    render(
      <ConfirmDialog
        title="Confirm?"
        description="Are you sure?"
        onConfirm={onConfirm}
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /Confirmar|Confirm/i }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('should call onCancel when cancel button clicked', () => {
    const onCancel = jest.fn();
    render(
      <ConfirmDialog
        title="Confirm?"
        description="Are you sure?"
        onConfirm={jest.fn()}
        onCancel={onCancel}
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /Cancelar|Cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('should show destructive variant styling', () => {
    const { container } = render(
      <ConfirmDialog
        title="Delete?"
        description="Permanent action"
        onConfirm={jest.fn()}
        variant="destructive"
      />
    );
    
    const btn = screen.getByRole('button', { name: /Confirmar/i });
    expect(btn.className).toContain('destructive');
  });

  it('should show loading state', () => {
    render(
      <ConfirmDialog
        title="Deleting..."
        description="Please wait"
        onConfirm={jest.fn()}
        loading={true}
      />
    );
    
    const btn = screen.getByRole('button', { name: /Confirmar/i });
    expect(btn).toBeDisabled();
  });
});
```

**Test count:** 5 tests

---

## INTEGRATION TESTS

### Form Flow Integration

#### `src/components/forms/__tests__/episode-form-integration.test.tsx`
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EpisodeForm } from '../episode-form';
import { useEpisodes } from '@/hooks/use-episodes';

// Mock the hook
jest.mock('@/hooks/use-episodes');

describe('EpisodeForm Integration', () => {
  it('should create episode via hook on form submit', async () => {
    const user = userEvent.setup();
    const mockCreate = jest.fn().mockResolvedValue({
      id: '2',
      episode_number: '2',
      title: 'New Episode',
      theme: 'AI',
      status: 'Idea',
    });
    
    (useEpisodes as jest.Mock).mockReturnValue({
      create: mockCreate,
      update: jest.fn(),
      delete: jest.fn(),
    });
    
    const onSuccess = jest.fn();
    
    render(
      <EpisodeForm
        mode="create"
        onSubmit={mockCreate}
      />
    );
    
    // Fill form
    await user.type(screen.getByLabelText(/Número/i), '2');
    await user.type(screen.getByLabelText(/Título/i), 'New Episode');
    await user.type(screen.getByLabelText(/Tema/i), 'AI');
    
    // Submit
    await user.click(screen.getByRole('button', { name: /Crear/i }));
    
    // Verify hook was called
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          episode_number: '2',
          title: 'New Episode',
          theme: 'AI',
        })
      );
    });
  });
});
```

**Test count:** 1-2 tests

---

## E2E TESTS

### Critical User Flows (Playwright)

#### `tests/e2e/dashboard.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
  });

  test('should load dashboard with KPIs', async ({ page }) => {
    // Check KPI cards
    expect(page.locator('text=Episodios en curso')).toBeVisible();
    expect(page.locator('text=Episodios publicados')).toBeVisible();
    expect(page.locator('text=Contenido pendiente')).toBeVisible();
    expect(page.locator('text=Leads activos')).toBeVisible();
    
    // Check that values are numbers
    const kpiValues = page.locator('[data-testid="kpi-value"]');
    expect(kpiValues.count()).toBe(4);
  });

  test('should create episode from dashboard', async ({ page }) => {
    // Click create button
    await page.click('button:has-text("Crear episodio")');
    
    // Fill form
    await page.fill('input[name="episode_number"]', '10');
    await page.fill('input[name="title"]', 'New Podcast Episode');
    await page.fill('input[name="theme"]', 'Technology');
    await page.selectOption('select[name="status"]', 'Idea');
    
    // Submit
    await page.click('button:has-text("Crear")');
    
    // Verify modal closed and episode appears in list
    await expect(page.locator('text=New Podcast Episode')).toBeVisible();
  });

  test('should edit episode from dashboard', async ({ page }) => {
    // Find first episode card and click edit
    const firstCard = page.locator('[data-testid="episode-card"]').first();
    await firstCard.locator('button:has-text("Editar")').click();
    
    // Update title
    const titleInput = page.locator('input[name="title"]');
    await titleInput.clear();
    await titleInput.fill('Updated Episode Title');
    
    // Save
    await page.click('button:has-text("Guardar")');
    
    // Verify update
    await expect(page.locator('text=Updated Episode Title')).toBeVisible();
  });

  test('should delete episode with confirmation', async ({ page }) => {
    // Find first episode card and click delete
    const firstCard = page.locator('[data-testid="episode-card"]').first();
    const episodeTitle = await firstCard.locator('p').first().textContent();
    
    await firstCard.locator('button:has-text("Eliminar")').click();
    
    // Confirm deletion
    await page.click('button:has-text("Confirmar")');
    
    // Verify episode is gone
    await expect(page.locator(`text=${episodeTitle}`)).not.toBeVisible();
  });
});
```

**Test count:** 4 tests

---

#### `tests/e2e/episodes-list.spec.ts`
```typescript
test.describe('Episodes List', () => {
  test('should filter episodes by status', async ({ page }) => {
    await page.goto('http://localhost:3000/episodios');
    
    // Select status filter
    await page.selectOption('select[name="status"]', 'Publicado');
    
    // Verify only published episodes shown
    const cards = page.locator('[data-testid="episode-card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    
    // Check that all visible episodes have "Publicado" status
    for (let i = 0; i < count; i++) {
      const status = await cards.nth(i).locator('.status-badge').textContent();
      expect(status).toBe('Publicado');
    }
  });

  test('should search episodes by title', async ({ page }) => {
    await page.goto('http://localhost:3000/episodios');
    
    // Search for episode
    await page.fill('input[placeholder*="Buscar"]', 'Technology');
    
    // Verify results
    const cards = page.locator('[data-testid="episode-card"]');
    const count = await cards.count();
    
    // All results should contain "Technology"
    for (let i = 0; i < count; i++) {
      const title = await cards.nth(i).textContent();
      expect(title).toContain('Technology');
    }
  });

  test('should paginate episodes list', async ({ page }) => {
    await page.goto('http://localhost:3000/episodios');
    
    // Check pagination controls visible
    expect(page.locator('button:has-text("Siguiente")')).toBeVisible();
    
    // Get initial episodes
    const initialCards = await page.locator('[data-testid="episode-card"]').count();
    
    // Go to next page
    await page.click('button:has-text("Siguiente")');
    
    // Verify new episodes loaded
    const newCards = await page.locator('[data-testid="episode-card"]').count();
    expect(newCards).toBeGreaterThan(0);
  });
});
```

**Test count:** 3 tests

---

## TEST EXECUTION

### Run all tests
```bash
npm run test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run specific test file
```bash
npm run test -- src/hooks/__tests__/use-episodes.test.ts
```

### Generate coverage report
```bash
npm run test -- --coverage
```

### Run E2E tests
```bash
npx playwright test
```

### Run E2E with UI
```bash
npx playwright test --ui
```

---

## COVERAGE REPORT

**Expected output:**
```
---------------------------------|----------|----------|----------|----------|
File                            | % Stmts  | % Branch | % Funcs  | % Lines  |
---------------------------------|----------|----------|----------|----------|
All files                       |    82.5  |   78.3   |   84.2   |   81.9   |
 src/hooks                      |    85.0  |   82.0   |   87.0   |   85.5   |
 src/components/forms           |    82.0  |   78.0   |   84.0   |   81.5   |
 src/components/cards           |    80.0  |   76.0   |   82.0   |   79.5   |
 src/lib/schemas               |    90.0  |   88.0   |   92.0   |   89.5   |
---------------------------------|----------|----------|----------|----------|
```

---

## CI/CD INTEGRATION

### Pre-commit hook
```bash
# .husky/pre-commit
npx tsc --noEmit
npm run test -- --silent --passWithNoTests
npm run lint
```

### GitHub Actions (optional P2)
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test -- --coverage
      - run: npx playwright test
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## TEST DATA MANAGEMENT

### Mock Supabase data
```typescript
// src/test/__mocks__/supabase.ts
export const mockEpisodes = [
  {
    id: '1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    user_id: null,
    payload: {
      episode_number: '1',
      title: 'Episode 1',
      theme: 'Tech',
      status: 'Idea',
      cta: null,
      spotify_description: null,
    },
  },
  // ...
];

export const mockContentPieces = [
  // ...
];

export const mockLeads = [
  // ...
];
```

### Seeding test database
```bash
# In CI/CD, seed test data before running tests
npx supabase seed run
```

---

## DEBUGGING TESTS

### Run single test
```bash
npm run test -- --grep "should create episode"
```

### Debug mode
```bash
node --inspect-brk node_modules/.bin/vitest
```

### Visual debugging (E2E)
```bash
npx playwright test --headed --debug
```

---

## COVERAGE CHECKLIST

- [ ] All hooks have 85%+ coverage
- [ ] All schemas have 90%+ coverage
- [ ] All form components have 80%+ coverage
- [ ] All card components have 75%+ coverage
- [ ] All modals have 75%+ coverage
- [ ] Integration tests cover full form flows
- [ ] E2E tests cover critical user flows (create, edit, delete)
- [ ] Overall coverage is 80%+
- [ ] No skipped tests (no `.skip`, `.only`)
- [ ] All tests passing on CI/CD

---

## NEXT STEPS (P2+)

- [ ] Add snapshot tests for components
- [ ] Add visual regression tests
- [ ] Add performance tests (Lighthouse)
- [ ] Add accessibility tests (axe)
- [ ] Set up code coverage tracking (codecov)
- [ ] Set up mutation testing (stryker)
