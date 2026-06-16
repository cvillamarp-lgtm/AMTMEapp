# P1 Component Map
**AMTME OS Dashboard — Componentes Reutilizables**

---

## HOOKS (Data Layer)

### `src/hooks/use-episodes.ts`
```typescript
// Manages all episode CRUD operations
export function useEpisodes(filters?: EpisodeFilters): UseEpisodesResult {
  // Implementation...
}

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
```

**Usage:**
```typescript
const { data, loading, create, update, delete: deleteEpisode } = useEpisodes({ status: 'Idea' });
```

---

### `src/hooks/use-content-pieces.ts`
```typescript
// Manages content pieces (clips, art, posts, etc.)
export function useContentPieces(filters?: ContentPieceFilters): UseContentPiecesResult
```

**Filters:**
```typescript
interface ContentPieceFilters {
  episodeId?: string;
  type?: 'clip' | 'art' | 'post' | 'script';
  status?: ContentStatus;
  page?: number;
  limit?: number;
}
```

---

### `src/hooks/use-monetization-leads.ts`
```typescript
// Manages monetization leads
export function useMonetizationLeads(filters?: LeadFilters): UseLeadsResult
```

**Filters:**
```typescript
interface LeadFilters {
  status?: MonetizationStatus;
  search?: string; // name or email
  page?: number;
  limit?: number;
}
```

---

### `src/hooks/use-studio-state.ts`
```typescript
// Singleton for global studio state (in context)
export function useStudioState(): StudioStateResult {
  // Current section, user preferences, etc.
}

interface StudioStateResult {
  currentSection: string;
  density: InterfaceDensity; // 'compacta' | 'estandar'
  theme: 'light' | 'dark';
  setCurrentSection: (section: string) => void;
  setDensity: (density: InterfaceDensity) => void;
}
```

---

## FORM COMPONENTS

### `src/components/forms/form-wrapper.tsx`
```typescript
interface FormWrapperProps {
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
  error?: string;
  children: ReactNode;
  submitLabel?: string;        // Default: "Guardar"
  cancelLabel?: string;        // Default: "Cancelar"
  onCancel?: () => void;
  className?: string;
}

// Wraps react-hook-form logic, handles loading state, error display
export function FormWrapper({ onSubmit, loading, error, children, ...props }: FormWrapperProps) {
  // Implementation...
}
```

**Usage:**
```typescript
<FormWrapper
  onSubmit={async (data) => await episodesHook.create(data)}
  loading={isLoading}
  error={error}
  submitLabel="Crear episodio"
>
  {/* Form inputs as children */}
</FormWrapper>
```

---

### `src/components/forms/form-input.tsx`
```typescript
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

export function FormInput({ label, error, required, hint, ...props }: FormInputProps) {
  // Renders label + input + error message + hint
}
```

**Usage:**
```typescript
<FormInput
  label="Título del episodio"
  placeholder="ej. La IA en 2025"
  error={errors.title?.message}
  required
  {...register('title')}
/>
```

---

### `src/components/forms/form-select.tsx`
```typescript
interface FormSelectProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export function FormSelect({ label, options, error, ...props }: FormSelectProps) {
  // Renders label + @radix-ui/react-select + error
}
```

**Usage:**
```typescript
<FormSelect
  label="Estado"
  options={[
    { value: 'Idea', label: 'Idea' },
    { value: 'Guion', label: 'Guion' },
    // ...
  ]}
  error={errors.status?.message}
  {...register('status')}
/>
```

---

### `src/components/forms/form-textarea.tsx`
```typescript
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
  rows?: number;
}

export function FormTextarea({ label, error, required, rows = 4, ...props }: FormTextareaProps) {
  // Similar to form-input
}
```

---

### `src/components/forms/episode-form.tsx`
```typescript
interface EpisodeFormProps {
  mode: 'create' | 'edit';
  episode?: Episode;
  onSubmit: (data: EpisodeInput) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export function EpisodeForm({ mode, episode, onSubmit, loading, error }: EpisodeFormProps) {
  const form = useForm<EpisodeInput>({
    resolver: zodResolver(episodeSchema),
    defaultValues: episode,
  });
  
  return (
    <FormWrapper onSubmit={form.handleSubmit(onSubmit)} loading={loading} error={error}>
      <FormInput label="Número de episodio" {...form.register('episode_number')} />
      <FormInput label="Título" {...form.register('title')} />
      <FormInput label="Tema" {...form.register('theme')} />
      <FormSelect label="Estado" {...form.register('status')} options={statusOptions} />
      <FormTextarea label="Descripción Spotify" {...form.register('spotify_description')} />
      {/* CTA field optional */}
    </FormWrapper>
  );
}
```

---

### `src/components/forms/content-piece-form.tsx`
```typescript
interface ContentPieceFormProps {
  mode: 'create' | 'edit';
  contentPiece?: ContentPiece;
  episodeId: string;
  onSubmit: (data: ContentPieceInput) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export function ContentPieceForm({ ...props }: ContentPieceFormProps) {
  // Similar structure to episode-form
}
```

---

### `src/components/forms/lead-form.tsx`
```typescript
interface LeadFormProps {
  mode: 'create' | 'edit';
  lead?: MonetizationLead;
  onSubmit: (data: LeadInput) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export function LeadForm({ ...props }: LeadFormProps) {
  // Similar structure to episode-form
}
```

---

## CARD COMPONENTS

### `src/components/cards/stat-card.tsx`
```typescript
interface StatCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: { direction: 'up' | 'down'; value: number };
  loading?: boolean;
}

export function StatCard({ label, value, icon, trend, loading }: StatCardProps) {
  // Render in card: label, value (large font), optional icon, optional trend indicator
}
```

**Usage:**
```typescript
<StatCard label="Episodios en curso" value={5} icon={<Sparkle />} />
```

---

### `src/components/cards/episode-card.tsx`
```typescript
interface EpisodeCardProps {
  episode: Episode;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  hoverable?: boolean;
}

export function EpisodeCard({ episode, onEdit, onDelete, onClick, hoverable }: EpisodeCardProps) {
  // Render:
  // - Episode number + title
  // - Theme
  // - Status badge (color by status)
  // - Created date
  // - Action buttons (Edit, Delete, View)
}
```

**Usage:**
```typescript
<EpisodeCard
  episode={episode}
  onEdit={(id) => setModal({ mode: 'edit', id })}
  onDelete={(id) => setDeleteConfirm(id)}
  onClick={(id) => router.push(`/episodios/${id}`)}
/>
```

---

### `src/components/cards/content-piece-card.tsx`
```typescript
interface ContentPieceCardProps {
  contentPiece: ContentPiece;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ContentPieceCard({ ...props }: ContentPieceCardProps) {
  // Similar to episode-card
  // Show type badge (clip, art, post, etc.)
}
```

---

### `src/components/cards/monetization-lead-card.tsx`
```typescript
interface MonetizationLeadCardProps {
  lead: MonetizationLead;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function MonetizationLeadCard({ ...props }: MonetizationLeadCardProps) {
  // Similar to episode-card
  // Show name, email, status, next action
}
```

---

## LIST COMPONENTS

### `src/components/lists/episode-list.tsx`
```typescript
interface EpisodeListProps {
  episodes: Episode[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  pagination?: PaginationState & {
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  emptyMessage?: string;
}

export function EpisodeList({ episodes, loading, onEdit, onDelete, onClick, pagination }: EpisodeListProps) {
  // Render:
  // - Loading spinner if loading
  // - Grid or list of episode-cards
  // - Pagination controls
  // - Empty state message
}
```

**Usage:**
```typescript
<EpisodeList
  episodes={episodes}
  loading={loading}
  onEdit={(id) => setModal({ mode: 'edit', id })}
  onDelete={(id) => deleteEpisode(id)}
  onClick={(id) => router.push(`/episodios/${id}`)}
  pagination={{
    page: filters.page,
    pageSize: 10,
    total: episodes.length,
    onPageChange: (page) => setFilters({ ...filters, page }),
  }}
/>
```

---

## FILTER COMPONENTS

### `src/components/filters/episode-filters.tsx`
```typescript
interface EpisodeFiltersProps {
  filters: EpisodeFilters;
  onFilterChange: (filters: EpisodeFilters) => void;
}

export function EpisodeFilters({ filters, onFilterChange }: EpisodeFiltersProps) {
  // Render filter controls:
  // - Status select (multi-select or dropdown)
  // - Search input
  // - Date range (optional P1)
  // - Clear filters button
}
```

**Usage:**
```typescript
const [filters, setFilters] = useState<EpisodeFilters>({ status: 'all', search: '' });
<EpisodeFilters filters={filters} onFilterChange={setFilters} />
```

---

## MODAL COMPONENTS

### `src/components/modals/episode-modal.tsx`
```typescript
interface EpisodeModalProps {
  mode: 'create' | 'edit';
  episodeId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EpisodeModal({ mode, episodeId, onClose, onSuccess }: EpisodeModalProps) {
  const { data: episode } = useEpisodes({ id: episodeId });
  const { create, update } = useEpisodes();
  
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Crear episodio' : 'Editar episodio'}
          </DialogTitle>
        </DialogHeader>
        <EpisodeForm
          mode={mode}
          episode={episode}
          onSubmit={async (data) => {
            mode === 'create' ? await create(data) : await update(episodeId!, data);
            onSuccess?.();
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
```

---

### `src/components/modals/content-piece-modal.tsx`
```typescript
interface ContentPieceModalProps {
  mode: 'create' | 'edit';
  contentPieceId?: string;
  episodeId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ContentPieceModal({ ...props }: ContentPieceModalProps) {
  // Similar to episode-modal
}
```

---

### `src/components/modals/lead-modal.tsx`
```typescript
interface LeadModalProps {
  mode: 'create' | 'edit';
  leadId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LeadModal({ ...props }: LeadModalProps) {
  // Similar to episode-modal
}
```

---

### `src/components/modals/confirm-dialog.tsx`
```typescript
interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmText?: string;        // Default: "Confirmar"
  cancelText?: string;         // Default: "Cancelar"
  onConfirm: () => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  variant?: 'default' | 'destructive';
}

export function ConfirmDialog({ title, description, onConfirm, onCancel, loading, variant }: ConfirmDialogProps) {
  // Simple confirmation dialog
}
```

**Usage:**
```typescript
{deleteConfirm && (
  <ConfirmDialog
    title="Eliminar episodio"
    description={`¿Estás seguro? No se puede deshacer.`}
    onConfirm={() => deleteEpisode(deleteConfirm)}
    onCancel={() => setDeleteConfirm(null)}
    variant="destructive"
  />
)}
```

---

## HEADER COMPONENTS

### `src/components/page-header.tsx`
```typescript
interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  breadcrumbs?: Array<{ label: string; href: string }>;
}

export function PageHeader({ title, description, action, breadcrumbs }: PageHeaderProps) {
  // Render:
  // - Breadcrumbs (optional)
  // - Title + description
  // - Action button (optional, top right)
}
```

**Usage:**
```typescript
<PageHeader
  title="Episodios"
  description="Gestiona todos tus episodios"
  action={{
    label: "Crear episodio",
    onClick: () => setModal({ mode: 'create' }),
  }}
/>
```

---

## SCHEMA COMPONENTS

### `src/lib/schemas/episode-schema.ts`
```typescript
export const episodeSchema = z.object({
  episode_number: z.string().min(1, 'Requerido'),
  title: z.string().min(3, 'Mín 3 caracteres').max(200),
  theme: z.string().min(3, 'Mín 3 caracteres'),
  status: z.enum([
    'Idea', 'En investigación', 'Guion', 'Grabación', 'Edición',
    'Publicado', 'Distribuido', 'Medido', 'Archivado'
  ]),
  cta: z.string().nullable().optional(),
  spotify_description: z.string().max(500).nullable().optional(),
});

export type EpisodeInput = z.infer<typeof episodeSchema>;
```

---

### `src/lib/schemas/content-piece-schema.ts`
```typescript
export const contentPieceSchema = z.object({
  episode_id: z.string().min(1),
  type: z.enum(['clip', 'art', 'post', 'script', 'thumbnail']),
  status: z.enum(['Borrador', 'Listo', 'Publicado', 'Medido', 'Archivado']),
  title: z.string().min(1),
  description: z.string().optional(),
  platform_urls: z.record(z.string()).optional(),
});

export type ContentPieceInput = z.infer<typeof contentPieceSchema>;
```

---

### `src/lib/schemas/lead-schema.ts`
```typescript
export const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  status: z.enum([
    'Nuevo lead', 'Conversación iniciada', 'Interesado', 'Sesión ofrecida',
    'Sesión agendada', 'Pagado', 'Perdido', 'Seguimiento'
  ]),
  next_action: z.string().optional(),
  notes: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
```

---

## SUMMARY TABLE

| Component | Type | Props | Key Features |
|-----------|------|-------|--------------|
| `useEpisodes` | Hook | `filters?: EpisodeFilters` | CRUD, loading, error |
| `useContentPieces` | Hook | `filters?: ContentPieceFilters` | CRUD, loading, error |
| `useMonetizationLeads` | Hook | `filters?: LeadFilters` | CRUD, loading, error |
| `FormWrapper` | Form | `onSubmit, loading, error` | Wraps form logic |
| `FormInput` | Form | `label, error, required` | Renders input + label |
| `FormSelect` | Form | `label, options, error` | Renders select + label |
| `FormTextarea` | Form | `label, error, rows` | Renders textarea + label |
| `EpisodeForm` | Form | `mode, episode, onSubmit` | Full episode form |
| `StatCard` | Card | `label, value, icon, trend` | KPI display |
| `EpisodeCard` | Card | `episode, onEdit, onDelete` | Episode summary card |
| `EpisodeList` | List | `episodes, pagination, onEdit` | Paginated list of cards |
| `EpisodeFilters` | Filter | `filters, onFilterChange` | Filter controls |
| `EpisodeModal` | Modal | `mode, episodeId, onClose` | Create/edit modal |
| `ConfirmDialog` | Modal | `title, onConfirm, variant` | Confirmation dialog |
| `PageHeader` | Header | `title, description, action` | Page title + action |

---

## COLORES AMTME

```css
--amtme-navy: #0c1f36;
--amtme-amarillo: #e8ff40;
--amtme-crema: #F5F2EA;
--amtme-rojo: #E0211E;
```

**Status badge colors:**
- `Publicado` → `--amtme-amarillo`
- `En progreso` → `--primary`
- `Archivado` → `--muted-foreground`
- `Error/Perdido` → `--amtme-rojo`

---

## PRÓXIMAS ITERACIONES (P2+)

- [ ] Table component (sortable, filterable)
- [ ] Batch operations (multi-select + bulk edit)
- [ ] Advanced filters (date range, multi-select)
- [ ] Export (CSV, PDF)
- [ ] Real-time updates (Supabase realtime)
- [ ] Soft delete + restore
- [ ] Audit log
- [ ] Search global (ElasticSearch)
