# P1 UX Dashboard Implementation Plan
**AMTME OS — Next.js 16 + TypeScript + Tailwind + Supabase**

**Rama:** `p1/ux-dashboard-operativa`  
**Base:** `main` en `273e44c` (P0 production)  
**Timeline estimado:** 10-12 días (sprints de 2-3 días por fase)

---

## OBJETIVO P1
Crear un dashboard operativo funcional con **UX mínima viable pero completa**:
- Dashboard principal robusto con datos reales de Supabase
- Componentes core reutilizables (cards, formularios, inputs, modales)
- Sistema de rutas operativo
- Validación de formularios con react-hook-form + zod
- Integración Supabase (mock → real)
- Tests unitarios 80%+
- E2E críticos
- Documentación P1

---

## RESTRICCIONES P1
- ❌ NO cambiar schema Supabase (solo lectura/escritura via payload)
- ❌ NO deploy a producción (preview only)
- ❌ NO agregar nuevas páginas fuera del grupo `(studio)`
- ✅ Usar componentes shadcn/ui existentes
- ✅ Mantener colores AMTME: navy `#0c1f36`, amarillo `#e8ff40`, crema `#F5F2EA`, rojo `#E0211E`
- ✅ Español neutro, sin cursivas

---

## ESTADO ACTUAL

### ✅ Existente
- **Dashboard actual:** `/src/app/(studio)/dashboard/page.tsx` (funcional pero rudimentario)
  - Carga datos Supabase (episodes, content_pieces, monetization_leads)
  - KPIs estáticos (4 cards)
  - Acciones rápidas (6 botones link)
  - Widget "IA útil" y "Energía creativa"
  - Episodios recientes (5 últimos)
- **Componentes base:** ui.tsx, studio-shell.tsx, studio-provider.tsx
- **shadcn/ui:** ~30 componentes instalados (button, input, dialog, etc.)
- **Hooks:** use-next-best-actions, use-notifications, use-global-search, use-idle-logout
- **Supabase:** schema con payload jsonb (episodes, content_pieces, monetization_leads)
- **Validación:** zod + react-hook-form ya instalados

### ⚠️ Brechas
1. **No hay componentes form reutilizables** — cada page implementa su propia lógica
2. **No hay data hooks genéricos** — useEpisodes, useContentPieces, etc.
3. **No hay modales/drawers operativos** — edit, create workflows
4. **Dashboard es "read-only"** — no hay CUD, solo lectura
5. **Tests escasos** — vitest setup existe pero <20% cobertura
6. **Validación fragmentada** — no hay pattern global para formularios

---

## FASES IMPLEMENTACIÓN

### FASE 0: Análisis & Setup (1-2 días)
**Objetivo:** Mapear componentes necesarios y arquitectura

**Tareas:**
1. ✅ Analizar dashboard actual
2. ✅ Mapear tablas Supabase (schema, campos en payload)
3. **→ Crear plan detallado de componentes** (en este doc)
4. **→ Crear test suite scaffold**
5. **→ Documentar patterns (form, data hook, list item)**

**Archivos a revisar:**
- `src/app/(studio)/dashboard/page.tsx` — dashboard actual
- `supabase/migrations/*` — schema
- `src/lib/studio-types.ts` — tipos definidos
- `src/components/studio-shell.tsx` — layout principal

**Entregables:**
- Este documento (arquitectura + files to create)
- `docs/COMPONENT_MAP.md` — lista de componentes P1
- `docs/TESTING_STRATEGY.md` — cobertura y approach

---

### FASE 1: Componentes Core (2-3 días)
**Objetivo:** Crear componentes reutilizables base

**Componentes a crear:**

#### 1. **Data-Fetching Hooks** (`src/hooks/`)
```
use-episodes.ts
├─ fetchEpisodes(filters?: { status, page })
├─ createEpisode(data)
├─ updateEpisode(id, data)
├─ deleteEpisode(id)
└─ useEpisodes() → { data, loading, error, refetch }

use-content-pieces.ts
├─ Similar a episodes

use-monetization-leads.ts
├─ Similar a episodes

use-studio-state.ts
├─ Singleton para estado global (current section, user settings)
└─ Integración con StudioProvider
```

**Patrón de hook:**
```typescript
export function useEpisodes(filters?: EpisodeFilters) {
  const [data, setData] = useState<Episode[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  
  const fetch = useCallback(async () => {
    try {
      const supabase = getSupabaseAuthBrowserClient();
      const query = supabase.from('episodes').select('*');
      // Apply filters...
      const { data: rows } = await query;
      setData(rows?.map(fromRow) || []);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [filters]);
  
  useEffect(() => { fetch(); }, [fetch]);
  
  return { data, error, loading, refetch: fetch };
}
```

#### 2. **Form Components** (`src/components/forms/`)
```
form-wrapper.tsx
├─ Envuelve react-hook-form + zod
├─ onSubmit handler + loading state
└─ Propiedades: schema, onSubmit, children

form-input.tsx
├─ Wrapper de @radix-ui/react-label + input
├─ Error display
└─ Propiedades: label, error, required

form-select.tsx
├─ Wrapper de @radix-ui/react-select
├─ Options mapping
└─ Error display

form-textarea.tsx
├─ Similar a input

episode-form.tsx
├─ Formulario create/edit episode
├─ Campos: title, theme, status, cta, spotify_description
└─ Validación con Zod

content-piece-form.tsx
├─ Similar a episode

lead-form.tsx
├─ Similar a episode
```

#### 3. **Display Components** (`src/components/cards/`)
```
episode-card.tsx
├─ Card para episode
├─ Muestra: número, título, tema, status badge, acciones
└─ Link a detail page

episode-list.tsx
├─ Usa episode-card.tsx
├─ Paginación
├─ Filtros por status

content-piece-card.tsx
├─ Similar a episode-card

monetization-lead-card.tsx
├─ Similar a episode-card

stat-card.tsx
├─ Ya existe, refactorizar si es necesario

table-component.tsx (opcional P1)
├─ Tabla genérica reutilizable
├─ Sorting + filtering
├─ Páginación
```

#### 4. **Modal/Drawer Components** (`src/components/modals/`)
```
episode-modal.tsx
├─ Dialog wrapper
├─ Props: mode ('create' | 'edit'), episodeId?, onClose
├─ Contiene: episode-form.tsx

content-piece-modal.tsx
├─ Similar

lead-modal.tsx
├─ Similar

confirm-dialog.tsx
├─ Dialog generic para delete confirmations
├─ Props: title, description, onConfirm, loading
```

**Files to create (Phase 1):**
```
src/hooks/
  ├─ use-episodes.ts (100 lines)
  ├─ use-content-pieces.ts (80 lines)
  ├─ use-monetization-leads.ts (80 lines)
  ├─ use-studio-state.ts (60 lines)
  └─ index.ts (exports)

src/components/forms/
  ├─ form-wrapper.tsx (80 lines)
  ├─ form-input.tsx (60 lines)
  ├─ form-select.tsx (70 lines)
  ├─ form-textarea.tsx (60 lines)
  ├─ episode-form.tsx (150 lines)
  ├─ content-piece-form.tsx (120 lines)
  ├─ lead-form.tsx (120 lines)
  └─ index.ts (exports)

src/components/cards/
  ├─ episode-card.tsx (80 lines)
  ├─ content-piece-card.tsx (80 lines)
  ├─ monetization-lead-card.tsx (80 lines)
  ├─ stat-card.tsx (refactor existing)
  └─ index.ts (exports)

src/components/modals/
  ├─ episode-modal.tsx (60 lines)
  ├─ content-piece-modal.tsx (60 lines)
  ├─ lead-modal.tsx (60 lines)
  ├─ confirm-dialog.tsx (80 lines)
  └─ index.ts (exports)

src/lib/schemas/
  ├─ episode-schema.ts (30 lines)
  ├─ content-piece-schema.ts (30 lines)
  ├─ lead-schema.ts (30 lines)
  └─ index.ts (exports)
```

**Tests (Phase 1):**
```
src/hooks/__tests__/
  ├─ use-episodes.test.ts (120 lines)
  ├─ use-content-pieces.test.ts (100 lines)
  ├─ use-monetization-leads.test.ts (100 lines)
  └─ use-studio-state.test.ts (80 lines)

src/components/forms/__tests__/
  ├─ form-wrapper.test.tsx (100 lines)
  ├─ form-input.test.tsx (80 lines)
  ├─ episode-form.test.tsx (150 lines)
  └─ content-piece-form.test.tsx (120 lines)

src/components/cards/__tests__/
  ├─ episode-card.test.tsx (100 lines)
  ├─ content-piece-card.test.tsx (100 lines)
  └─ monetization-lead-card.test.tsx (100 lines)

src/components/modals/__tests__/
  ├─ episode-modal.test.tsx (120 lines)
  └─ confirm-dialog.test.tsx (100 lines)
```

---

### FASE 2: Dashboard Refactoring (2 días)
**Objetivo:** Refactorizar dashboard actual con componentes P1

**Cambios en `/src/app/(studio)/dashboard/page.tsx`:**

1. **Reemplazar data fetching → usar hooks**
   ```typescript
   const { data: episodes, loading: epLoading, refetch } = useEpisodes();
   const { data: content, loading: ctLoading } = useContentPieces();
   const { data: leads, loading: ldLoading } = useMonetizationLeads();
   const loading = epLoading || ctLoading || ldLoading;
   ```

2. **Reemplazar StatCard inline → usar <StatCard />**
   ```typescript
   <StatCard label="Episodios en curso" value={inProgress} />
   ```

3. **Agregar modales para acciones**
   ```typescript
   const [episodeModal, setEpisodeModal] = useState<{mode: 'create'|'edit', id?: string} | null>(null);
   
   // En JSX:
   <button onClick={() => setEpisodeModal({ mode: 'create' })}>
     Crear episodio
   </button>
   {episodeModal && (
     <EpisodeModal
       mode={episodeModal.mode}
       episodeId={episodeModal.id}
       onClose={() => setEpisodeModal(null)}
     />
   )}
   ```

4. **Refactorizar "Producción actual" → usar <EpisodeList />**
   ```typescript
   <EpisodeList episodes={recent} onEdit={...} onDelete={...} />
   ```

5. **Agregar filtros**
   ```typescript
   const [filters, setFilters] = useState({ status: 'all' });
   const filteredEpisodes = filterByStatus(episodes, filters.status);
   ```

**Resultado:**
- Dashboard refactorizado, sin lógica de form/modal inline
- Reutilizable (componentes pueden usarse en otras páginas)
- Testeado (>80% cobertura)

---

### FASE 3: List Pages & Routing (2 días)
**Objetivo:** Crear páginas operativas para cada entidad

**Páginas a crear:**

#### 1. `/src/app/(studio)/episodios/page.tsx` (refactorizar)
- **Layout:** Header + Filters + CreateButton + List/Table
- **Components:** EpisodeList, EpisodeFilters, EpisodeModal
- **Features:**
  - Listar episodios con paginación
  - Filtrar por status
  - Buscar por título
  - Crear/Editar/Eliminar con modal
  - Navegar a detail page

**Code sketch:**
```typescript
export default function EpisodiosPage() {
  const [filters, setFilters] = useState({ status: 'all', search: '' });
  const [episodeModal, setEpisodeModal] = useState<{...} | null>(null);
  
  const { data: episodes } = useEpisodes(filters);
  
  return (
    <div className="space-y-6">
      <Header title="Episodios" action="Crear episodio" onClick={...} />
      <EpisodeFilters {...} />
      <EpisodeList episodes={episodes} onEdit={...} onDelete={...} />
      {episodeModal && <EpisodeModal {...episodeModal} />}
    </div>
  );
}
```

#### 2. `/src/app/(studio)/contenido/page.tsx` (refactorizar)
- **Layout:** Similar a episodios
- **Components:** ContentPieceList, ContentPieceFilters, ContentPieceModal

#### 3. `/src/app/(studio)/monetizacion/page.tsx` (refactorizar)
- **Layout:** Similar a episodios
- **Components:** LeadList, LeadFilters, LeadModal

#### 4. `/src/app/(studio)/episodios/[episodeId]/page.tsx` (detail page)
- **Layout:** Header + Tabs (detalles, contenido, métricas)
- **Features:**
  - Ver/editar detalles del episodio
  - Listar content_pieces relacionados
  - Timeline de cambios
  - Acciones rápidas (publish, archive, etc.)

**Code sketch:**
```typescript
export default function EpisodeDetailPage({ params }) {
  const episodeId = params.episodeId;
  const { data: episode } = useEpisodes({ id: episodeId });
  const { data: content } = useContentPieces({ episodeId });
  
  return (
    <div className="space-y-6">
      <EpisodeHeader episode={episode} />
      <Tabs defaultValue="detalles">
        <TabsContent value="detalles">
          <EpisodeForm mode="edit" episode={episode} />
        </TabsContent>
        <TabsContent value="contenido">
          <ContentPieceList episodeId={episodeId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

**Files to create (Phase 3):**
```
src/app/(studio)/episodios/page.tsx (refactored, 250 lines)
src/app/(studio)/episodios/[episodeId]/page.tsx (150 lines)
src/app/(studio)/contenido/page.tsx (refactored, 250 lines)
src/app/(studio)/monetizacion/page.tsx (refactored, 250 lines)

src/components/
  ├─ episode-filters.tsx (100 lines)
  ├─ content-piece-filters.tsx (100 lines)
  ├─ lead-filters.tsx (100 lines)
  ├─ page-header.tsx (60 lines)
  └─ ...
```

---

### FASE 4: Validación & Schemas (1-2 días)
**Objetivo:** Crear y testear validación de formularios

**Zod schemas (en `src/lib/schemas/`):**

```typescript
// episode-schema.ts
export const episodeSchema = z.object({
  episode_number: z.string().min(1),
  title: z.string().min(3).max(200),
  theme: z.string().min(3),
  status: z.enum(['Idea', 'En investigación', 'Guion', '...', 'Archivado']),
  cta: z.string().nullable().optional(),
  spotify_description: z.string().max(500).nullable().optional(),
});

export type Episode = z.infer<typeof episodeSchema>;

// content-piece-schema.ts
export const contentPieceSchema = z.object({
  episode_id: z.string(),
  type: z.enum(['clip', 'art', 'post', '...']),
  status: z.enum(['Borrador', 'Listo', '...']),
  // ...
});

// lead-schema.ts
export const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  status: z.enum(['Nuevo lead', '...', 'Seguimiento']),
  // ...
});
```

**Integración en form components:**
```typescript
export function EpisodeForm({ mode, episode, onSubmit }: Props) {
  const form = useForm<Episode>({
    resolver: zodResolver(episodeSchema),
    defaultValues: episode || {},
  });
  
  return (
    <FormWrapper onSubmit={form.handleSubmit(onSubmit)}>
      <FormInput
        label="Título"
        {...form.register('title')}
        error={form.formState.errors.title?.message}
      />
      {/* ... rest of form */}
    </FormWrapper>
  );
}
```

**Tests for validation:**
```typescript
// src/lib/schemas/__tests__/episode-schema.test.ts
describe('episodeSchema', () => {
  it('validates valid episode', () => {
    const valid = {
      episode_number: '1',
      title: 'Test Episode',
      theme: 'Tech',
      status: 'Idea',
    };
    expect(episodeSchema.parse(valid)).toEqual(valid);
  });
  
  it('rejects title < 3 chars', () => {
    const invalid = {
      ...validEpisode,
      title: 'Te',
    };
    expect(() => episodeSchema.parse(invalid)).toThrow();
  });
  // ... more tests
});
```

---

### FASE 5: Tests (2-3 días)
**Objetivo:** Alcanzar 80%+ cobertura

**Estrategia de testing:**

1. **Unit tests** (hooks, schemas, utils)
   ```bash
   npm run test -- src/hooks/__tests__
   npm run test -- src/lib/schemas/__tests__
   ```

2. **Component tests** (forms, cards, modals)
   ```bash
   npm run test -- src/components/__tests__
   ```

3. **Integration tests** (full form flow: hook + form + submit)
   ```bash
   npm run test -- src/components/forms/__tests__/episode-form.test.tsx
   ```

4. **E2E tests** (Playwright — críticos)
   ```typescript
   // tests/e2e/dashboard.spec.ts
   test('user can create episode from dashboard', async ({ page }) => {
     await page.goto('/dashboard');
     await page.click('button:has-text("Crear episodio")');
     await page.fill('input[name="title"]', 'New Episode');
     await page.click('button:has-text("Guardar")');
     await expect(page).toHaveURL('/episodios');
   });
   ```

**Coverage targets:**
- Hooks: 85%+
- Components: 80%+
- Schemas: 90%+
- Pages: 75%+ (E2E + snapshot tests)
- Overall: 80%+

---

### FASE 6: Documentation (1 día)
**Objetivo:** Documentar patrones y decisiones

**Documentos a crear:**

1. **`docs/COMPONENT_MAP.md`** — Lista completa de componentes P1
   - Propiedades
   - Uso ejemplos
   - Dependencias

2. **`docs/TESTING_STRATEGY.md`** — Cómo testear
   - Unit test patterns
   - Component test patterns
   - E2E test patterns
   - Cobertura targets

3. **`docs/DATA_FETCHING.md`** — Cómo crear data hooks
   - Pattern estándar
   - Error handling
   - Loading states
   - Refetch strategy

4. **`docs/FORM_PATTERNS.md`** — Cómo crear formularios
   - Zod schema
   - FormWrapper usage
   - Validación
   - Submit handling

5. **`docs/ROUTING.md`** — Rutas operativas P1
   - Rutas del grupo (studio)
   - Links entre páginas
   - Modal routing (state vs URL)

6. **`docs/API_RESPONSES.md`** — Estructura de datos Supabase
   - Payload structure
   - Field mappings
   - fromRow / toRow patterns

---

### FASE 7: Final Polish & Commit (1 día)
**Objetivo:** Validar, testear, documentar y commitear

**Checklist:**
- [ ] All tests passing: `npm run test`
- [ ] Type check passing: `npx tsc --noEmit`
- [ ] Lint passing: `npm run lint`
- [ ] Build passing: `npx next build`
- [ ] E2E passing: `npx playwright test` (si está setup)
- [ ] Dashboard funcional en dev: `npm run dev`
- [ ] Documentación actualizada
- [ ] CHANGELOG.md actualizado
- [ ] Commit messages semánticos

**Commit:**
```bash
git add -A
git commit -m "feat: P1 UX Dashboard — core components, forms, list pages, 80%+ tests"
```

---

## COMPONENTES DETALLADOS P1

### 1. **Hooks (Data Layer)**

#### `use-episodes.ts`
```typescript
interface EpisodeFilters {
  status?: EpisodeStatus;
  search?: string;
  page?: number;
  limit?: number;
}

interface UseEpisodesResult {
  data: Episode[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  create: (data: EpisodeInput) => Promise<Episode>;
  update: (id: string, data: Partial<EpisodeInput>) => Promise<Episode>;
  delete: (id: string) => Promise<void>;
}

export function useEpisodes(filters?: EpisodeFilters): UseEpisodesResult
```

**Implementation:**
- Fetch from Supabase `episodes` table
- Apply filters (status, search)
- Paginate (limit + offset)
- Handle loading/error states
- Provide CRUD operations
- Memoize queries with React Query (future: tanstack-query)

---

### 2. **Form Components**

#### `form-wrapper.tsx`
```typescript
interface FormWrapperProps {
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
  error?: string;
  children: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
}
```

**Features:**
- Wraps form submission
- Shows loading state on button
- Displays error message
- Auto-focuses first input

---

#### `form-input.tsx`
```typescript
interface FormInputProps {
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'number' | 'password';
  // Standard input props...
}
```

---

### 3. **Display Components**

#### `episode-card.tsx`
```typescript
interface EpisodeCardProps {
  episode: Episode;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
}

// Renders:
// - Episode number + title
// - Theme
// - Status badge (colored)
// - Created date
// - Action buttons (Edit, Delete, View)
```

---

#### `episode-list.tsx`
```typescript
interface EpisodeListProps {
  episodes: Episode[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  pagination?: {
    page: number;
    total: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
}

// Renders:
// - Grid or list of episode-cards
// - Pagination controls
// - Empty state message
```

---

### 4. **Modal Components**

#### `episode-modal.tsx`
```typescript
interface EpisodeModalProps {
  mode: 'create' | 'edit';
  episodeId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

// Renders:
// - Dialog with episode-form
// - Title: "Crear episodio" or "Editar episodio"
// - Submit button: "Crear" or "Guardar"
```

---

## DATA FLOW DIAGRAM

```
Dashboard Page
  ├─ useEpisodes() → hook fetches from Supabase
  ├─ useState(episodeModal) → manage modal visibility
  └─ Render:
      ├─ <StatCard /> (KPIs)
      ├─ <EpisodeList episodes={...} />
      │   └─ Episode items click → setEpisodeModal({ mode: 'edit', id })
      ├─ Buttons "Crear" → setEpisodeModal({ mode: 'create' })
      └─ {episodeModal && <EpisodeModal onClose={...} />}
          └─ <EpisodeForm mode={...} />
              └─ Form submit → useEpisodes.create() or .update()
                  └─ onSuccess → refetch episodes, close modal
```

---

## TESTING STRATEGY

### Unit Tests (60% of tests)
- **Hooks:** Validate fetch logic, filters, CRUD operations
- **Schemas:** Validate Zod schemas with valid/invalid inputs
- **Utils:** Date formatting, status helpers, etc.

### Component Tests (25% of tests)
- **Forms:** Render, validation, submit
- **Cards:** Render props, click handlers
- **Lists:** Render list, pagination, empty state

### Integration Tests (10% of tests)
- **Full form flow:** Hook fetch → Form render → Submit → Refetch
- **Dashboard:** Load data → Click card → Open modal → Submit → Verify

### E2E Tests (5% of tests)
- **Critical user flows:**
  1. Create episode (dashboard button → modal form → list update)
  2. Edit episode (list click → detail page → edit form → save)
  3. Delete episode (list delete button → confirm → refetch)

---

## BUILD & DEPLOYMENT

### Local development
```bash
npm run dev
# Dashboard: http://localhost:3000/dashboard
```

### Type checking
```bash
npx tsc --noEmit
```

### Tests
```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test -- --coverage  # Coverage report
```

### Build
```bash
npx next build  # NOT npm run build (hangs with pre-commit hook)
```

### Lint
```bash
npm run lint
npm run format
```

### Pre-flight checklist before commit
```bash
npx tsc --noEmit && npm run test && npm run lint
```

---

## GIT WORKFLOW

### Branch
```bash
git checkout p1/ux-dashboard-operativa
```

### Commit pattern
```bash
git commit -m "feat: create episode-form component with Zod validation"
git commit -m "test: add episode-form unit tests (95% coverage)"
git commit -m "refactor: integrate hooks into dashboard page"
```

### Push & PR
```bash
git push origin p1/ux-dashboard-operativa
# Create PR on GitHub: main ← p1/ux-dashboard-operativa
```

---

## TIMELINE ESTIMATE

| Fase | Tarea | Días | Personas |
|------|-------|------|----------|
| 0 | Análisis & setup | 1-2 | 1 |
| 1 | Componentes core | 2-3 | 1 |
| 2 | Dashboard refactor | 2 | 1 |
| 3 | List pages & routing | 2 | 1 |
| 4 | Validación & schemas | 1-2 | 1 |
| 5 | Tests (80%+) | 2-3 | 1 |
| 6 | Documentación | 1 | 1 |
| 7 | Polish & commit | 1 | 1 |
| **TOTAL** | | **10-12** | 1 |

---

## PRÓXIMOS PASOS (P2+)

- [ ] Agregar filtros avanzados (date ranges, multi-select)
- [ ] Implementar search global (ElasticSearch o full-text Supabase)
- [ ] Agregar soft delete + restore workflows
- [ ] Batch operations (multi-select + bulk edit)
- [ ] Histórico de cambios (audit log por fila)
- [ ] Exportar datos (CSV, PDF)
- [ ] Real-time updates (WebSocket/Supabase realtime)
- [ ] Integración con IA (AI suggestions, auto-fill)
- [ ] Calendario visual (drag-drop episodes)
- [ ] Notificaciones en tiempo real

---

## NOTAS & LANDMINES

### Supabase payload jsonb
- Todos los campos de negocio están EN payload
- fromRow debe hacer `{ id, created_at, updated_at, user_id, ...row.payload }`
- toRow debe ser `{ user_id: null, payload: { ...campos } }`

### Next.js build
- Usar `npx next build`, NO `npm run build` (cuelga con pre-commit hook)
- Type check por separado: `npx tsc --noEmit`

### Colores AMTME
- Navy: `#0c1f36`
- Amarillo: `#e8ff40`
- Crema: `#F5F2EA`
- Rojo: `#E0211E`

### Route groups
- `(public)` = sin auth, sin StudioShell
- `(studio)` = con auth, con StudioShell
- No mover páginas sin actualizar layouts

---

**Documento vivo:** Actualizar cuando hay cambios de scope o bloqueadores.
