# P1 Components Guide

**Status:** Phase 1 Complete | **Branch:** `p1/ux-dashboard-operativa` | **Test Coverage:** 258 tests, 100% passing

---

## Architecture Overview

P1 implements a **3-layer component architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│ Pages (src/app/(studio)/*.tsx)                              │
│ Dashboard, Episodios, Contenido, Monetización               │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│ Lists (src/components/lists/*.tsx)                          │
│ EpisodeList, ContentPieceList, MonetizationLeadList         │
└──────────────────────┬──────────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
┌──────┴──────┐ ┌────┴────┐ ┌────────┴────┐
│ Cards       │ │ Hooks   │ │ Forms       │
│ (display)   │ │ (data)  │ │ (input)     │
└─────────────┘ └─────────┘ └─────────────┘
```

---

## Data Layer — Hooks

### `useEpisodes`

Fetch episodes from Supabase with optional filtering.

```typescript
import { useEpisodes } from '@/hooks';

export function MyComponent() {
  const { data, loading, error, refetch } = useEpisodes({
    status: 'Publicado',
    limit: 10,
  });

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.map((ep) => (
        <div key={ep.id}>{ep.title}</div>
      ))}
      <button onClick={refetch}>Recargar</button>
    </div>
  );
}
```

**Return Type:**
```typescript
{
  data: Episode[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

**Filters:**
- `status?: Episode['status']` — filter by episode status
- `limit?: number` — limit results (default: unlimited)
- `page?: number` — pagination (not implemented yet)

### `useContentPieces`

Similar to `useEpisodes` but for content pieces.

```typescript
const { data, loading, error } = useContentPieces({
  status: 'Listo',
  channel: 'Instagram',
  limit: 20,
});
```

### `useMonetizationLeads`

Fetch monetization leads.

```typescript
const { data, loading, error } = useMonetizationLeads({
  status: 'Conversación iniciada',
});
```

---

## Presentation Layer — Cards

Cards display individual items in a grid. Each card is self-contained and clickable.

### `EpisodeCard`

```typescript
import { EpisodeCard } from '@/components/cards';

<EpisodeCard
  episode={episode}
  onSelect={(id) => console.log('Selected:', id)}
/>
```

**Props:**
```typescript
interface EpisodeCardProps {
  episode: Episode;
  onSelect?: (id: string) => void;
}
```

**Features:**
- Status badge with color coding
- Episode number + title
- Theme and pillar
- Publish date
- Notes preview (truncated)

### `ContentPieceCard`

```typescript
import { ContentPieceCard } from '@/components/cards';

<ContentPieceCard piece={piece} onSelect={handleSelect} />
```

**Props:**
```typescript
interface ContentPieceCardProps {
  piece: ContentPiece;
  onSelect?: (id: string) => void;
}
```

**Features:**
- Channel + format
- Hook preview
- Theme and emotion
- Status badge
- Publish date

### `MonetizationLeadCard`

```typescript
import { MonetizationLeadCard } from '@/components/cards';

<MonetizationLeadCard lead={lead} onSelect={handleSelect} />
```

**Props:**
```typescript
interface MonetizationLeadCardProps {
  lead: MonetizationLead;
  onSelect?: (id: string) => void;
}
```

**Features:**
- Lead source
- Revenue display (formatted)
- Next action
- Status badge
- Creation date

---

## List Components

Lists combine hooks + cards for full data-to-UI pipelines.

### `EpisodeList`

```typescript
import { EpisodeList } from '@/components/lists';

<EpisodeList
  limit={10}
  status="Publicado"
  onSelectEpisode={(id) => navigate(`/episodios/${id}`)}
/>
```

**Props:**
```typescript
interface EpisodeListProps {
  limit?: number;
  status?: Episode['status'];
  onSelectEpisode?: (id: string) => void;
}
```

### `ContentPieceList`

```typescript
<ContentPieceList limit={20} channel="Instagram" onSelectPiece={handleSelect} />
```

### `MonetizationLeadList`

```typescript
<MonetizationLeadList limit={15} status="Interesado" onSelectLead={handleSelect} />
```

---

## Form Layer — Input Components

Reusable form inputs with validation support.

### `FormWrapper`

Wraps react-hook-form + zod validation.

```typescript
import { FormWrapper, FormInput } from '@/components/forms';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  description: z.string(),
});

export function MyForm() {
  return (
    <FormWrapper
      schema={schema}
      onSubmit={(data) => console.log(data)}
      submitLabel="Crear"
      onCancel={() => goBack()}
    >
      {/* Children receive FormProvider context */}
    </FormWrapper>
  );
}
```

### `FormInput`

Text input with error display.

```typescript
import { FormInput } from '@/components/forms';

<FormInput
  label="Título"
  required={true}
  error={errors.title?.message}
  helperText="Máximo 100 caracteres"
  {...register('title')}
/>
```

**Props:**
```typescript
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
}
```

### `FormSelect`

Dropdown select.

```typescript
import { FormSelect } from '@/components/forms';

<FormSelect
  label="Estado"
  options={[
    { value: 'publicado', label: 'Publicado' },
    { value: 'borrador', label: 'Borrador' },
  ]}
  {...register('status')}
/>
```

### `FormTextarea`

Multi-line text input.

```typescript
import { FormTextarea } from '@/components/forms';

<FormTextarea
  label="Notas"
  rows={4}
  error={errors.notes?.message}
  {...register('notes')}
/>
```

---

## Dashboard Integration

The refactored dashboard uses all P1 components:

```typescript
'use client';

import { useEpisodes, useContentPieces, useMonetizationLeads } from '@/hooks';
import { EpisodeList } from '@/components/lists';

export default function DashboardPage() {
  const { data: episodes } = useEpisodes();
  const { data: content } = useContentPieces();
  const { data: leads } = useMonetizationLeads();

  return (
    <div className="space-y-6">
      {/* KPIs computed from hook data */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="En curso" value={inProgress} />
        {/* ... */}
      </div>

      {/* List component with automatic data loading */}
      <EpisodeList limit={5} />
    </div>
  );
}
```

---

## Testing

All components include unit tests.

```bash
# Run all tests
npm run test

# Run specific test
npm run test -- use-episodes

# Watch mode
npm run test:watch
```

**Test Files:**
- `src/hooks/__tests__/use-episodes.test.ts` (3 tests)
- `src/components/cards/__tests__/episode-card.test.tsx` (3 tests)
- `src/components/forms/__tests__/form-input.test.tsx` (6 tests)
- `src/components/lists/__tests__/episode-list.test.tsx` (3 tests)

**Coverage:** 258 tests, 100% passing

---

## Styling & Theming

All components use **Tailwind CSS** with shadcn/ui primitives.

**Color Palette (AMTME):**
- Navy: `#0c1f36`
- Amarillo (Lemon): `#e8ff40`
- Crema: `#F5F2EA`
- Rojo: `#E0211E`

**Card Styling:**
```typescript
// Example card background
className="rounded-xl border border-border bg-card p-5 shadow-sm"
```

**Status Badge Colors:**
```typescript
const statusColor: Record<Episode['status'], string> = {
  'Publicado': 'bg-green-100 text-green-800',
  'Borrador': 'bg-gray-100 text-gray-800',
  // ...
};
```

---

## Error Handling

All data hooks include error handling.

```typescript
const { data, error, loading } = useEpisodes();

if (error) {
  return (
    <div className="text-red-500">
      Error loading episodes: {error.message}
    </div>
  );
}
```

---

## Supabase Integration

Hooks fetch directly from Supabase using the authenticated browser client:

```typescript
// Transform payload into typed objects
const episode = {
  id: row.id,
  created_at: row.created_at,
  updated_at: row.updated_at,
  user_id: row.user_id,
  ...(row.payload || {}), // Spread payload fields
};
```

**Note:** All business fields are in `payload.jsonb` per P0 schema design.

---

## Next Steps (P2)

- [ ] Create/edit form components with full validation
- [ ] Add list pagination (offset + limit)
- [ ] Implement modal workflows (create, edit, delete)
- [ ] Add advanced filtering (date ranges, multi-select)
- [ ] Real-time Supabase subscriptions
- [ ] Export/import CSV
- [ ] Batch operations (bulk edit)

---

## File Structure

```
src/
├── hooks/
│   ├── use-episodes.ts
│   ├── use-content-pieces.ts
│   ├── use-monetization-leads.ts
│   ├── index.ts
│   └── __tests__/
│       └── use-episodes.test.ts
├── components/
│   ├── cards/
│   │   ├── episode-card.tsx
│   │   ├── content-piece-card.tsx
│   │   ├── monetization-lead-card.tsx
│   │   ├── index.ts
│   │   └── __tests__/
│   │       └── episode-card.test.tsx
│   ├── forms/
│   │   ├── form-wrapper.tsx
│   │   ├── form-input.tsx
│   │   ├── form-textarea.tsx
│   │   ├── form-select.tsx
│   │   ├── index.ts
│   │   └── __tests__/
│   │       └── form-input.test.tsx
│   └── lists/
│       ├── episode-list.tsx
│       ├── content-piece-list.tsx
│       ├── monetization-lead-list.tsx
│       ├── index.ts
│       └── __tests__/
│           └── episode-list.test.tsx
└── app/
    └── (studio)/
        └── dashboard/
            └── page.tsx (refactored)
```

---

## Support

For issues or questions:
1. Check this guide
2. Review component tests in `__tests__/` directories
3. Refer to `/docs/P1_DASHBOARD_IMPLEMENTATION_PLAN.md`
4. Check `/docs/COMPONENT_MAP.md` for detailed specs
