# P1 UX Dashboard — Quick Start Guide

**Status:** Plan Ready | **Branch:** `p1/ux-dashboard-operativa` | **Timeline:** 10-12 days

---

## WHAT'S INCLUDED

Three comprehensive planning documents have been created to guide P1 implementation:

1. **`P1_DASHBOARD_IMPLEMENTATION_PLAN.md`** (Main plan — 400+ lines)
   - 7-phase implementation roadmap
   - Detailed component specifications
   - File-by-file breakdown with line counts
   - Data flow diagrams
   - Git workflow instructions

2. **`COMPONENT_MAP.md`** (Component reference — 300+ lines)
   - Complete hook signatures
   - Form component templates
   - Card component specs
   - Modal component patterns
   - Filter and header component designs
   - Zod schema examples
   - Color palette reference

3. **`TESTING_STRATEGY.md`** (Test specifications — 350+ lines)
   - Testing pyramid breakdown
   - 80%+ coverage targets
   - ~130-150 test examples (unit, component, integration, E2E)
   - Sample test code for each component type
   - CI/CD integration examples
   - Debug instructions

---

## AT A GLANCE

### Scope P1
✅ Dashboard refactored with components  
✅ Core hooks for data fetching (episodes, content, leads)  
✅ Reusable form components with Zod validation  
✅ Card/list components for displaying data  
✅ Modal workflows for create/edit  
✅ List pages (/episodios, /contenido, /monetizacion)  
✅ 80%+ test coverage  
✅ Complete documentation  

### Not in P1
❌ Advanced filters (date ranges, multi-select)  
❌ Real-time updates (Supabase realtime)  
❌ Export/import (CSV, PDF)  
❌ Batch operations (multi-select + bulk edit)  
❌ Search global (ElasticSearch)  
❌ Audit log / soft delete  
❌ Visual/design system enhancements  

---

## FILES TO CREATE (PHASE 1)

### Data Layer (src/hooks/)
```
use-episodes.ts          (100 lines)
use-content-pieces.ts    (80 lines)
use-monetization-leads.ts (80 lines)
use-studio-state.ts      (60 lines)
index.ts                 (exports)
```

### Forms (src/components/forms/)
```
form-wrapper.tsx         (80 lines)
form-input.tsx           (60 lines)
form-select.tsx          (70 lines)
form-textarea.tsx        (60 lines)
episode-form.tsx         (150 lines)
content-piece-form.tsx   (120 lines)
lead-form.tsx            (120 lines)
index.ts                 (exports)
```

### Cards (src/components/cards/)
```
episode-card.tsx         (80 lines)
content-piece-card.tsx   (80 lines)
monetization-lead-card.tsx (80 lines)
stat-card.tsx            (refactor)
index.ts                 (exports)
```

### Lists & Filters (src/components/)
```
lists/episode-list.tsx              (100 lines)
filters/episode-filters.tsx         (80 lines)
filters/content-piece-filters.tsx   (80 lines)
filters/lead-filters.tsx            (80 lines)
page-header.tsx                     (60 lines)
```

### Modals (src/components/modals/)
```
episode-modal.tsx        (60 lines)
content-piece-modal.tsx  (60 lines)
lead-modal.tsx           (60 lines)
confirm-dialog.tsx       (80 lines)
index.ts                 (exports)
```

### Schemas (src/lib/schemas/)
```
episode-schema.ts        (30 lines)
content-piece-schema.ts  (30 lines)
lead-schema.ts           (30 lines)
index.ts                 (exports)
```

### Tests (src/**/__tests__/)
```
~130-150 test files across:
- hooks/__tests__/        (4 files × 6-8 tests = 24-32 tests)
- components/forms/__tests__/  (7 files × 5-6 tests = 35-42 tests)
- components/cards/__tests__/  (4 files × 4-5 tests = 16-20 tests)
- components/modals/__tests__/ (4 files × 3-5 tests = 12-20 tests)
- lib/schemas/__tests__/  (3 files × 8 tests = 24 tests)
- integration tests       (4-6 tests)
- e2e tests (playwright)  (4-7 tests)
```

### Pages (src/app/(studio)/)
```
dashboard/page.tsx       (refactor — 200-250 lines)
episodios/page.tsx       (refactor — 250 lines)
episodios/[id]/page.tsx  (new — 150 lines)
contenido/page.tsx       (refactor — 250 lines)
monetizacion/page.tsx    (refactor — 250 lines)
```

---

## PHASE BREAKDOWN

| Phase | Duration | Output | Dependencies |
|-------|----------|--------|--------------|
| **0: Analysis** | 1-2 days | Plan docs (THIS!) | None |
| **1: Core Components** | 2-3 days | Hooks + Forms + Cards + Modals | Phase 0 complete |
| **2: Dashboard Refactor** | 2 days | Refactored dashboard page | Phase 1 complete |
| **3: List Pages** | 2 days | /episodios, /contenido, /monetizacion pages | Phase 1-2 complete |
| **4: Validation & Schemas** | 1-2 days | Zod schemas + integration | Phase 1 complete |
| **5: Tests (80%+)** | 2-3 days | Unit + Component + Integration + E2E tests | Phase 1-4 complete |
| **6: Documentation** | 1 day | READMEs + Component guides | All phases |
| **7: Polish & Commit** | 1 day | Final QA + Semantic commit | All phases |

---

## GETTING STARTED

### 1. Read the Plan Documents (30 min)
```bash
# In priority order:
1. This file (P1_QUICK_START.md)
2. docs/P1_DASHBOARD_IMPLEMENTATION_PLAN.md (main plan)
3. docs/COMPONENT_MAP.md (component specs)
4. docs/TESTING_STRATEGY.md (test examples)
```

### 2. Review Current Code (30 min)
```bash
# Understand existing patterns:
cat src/app/\(studio\)/dashboard/page.tsx
cat src/components/studio-shell.tsx
cat src/components/studio-provider.tsx
cat src/lib/studio-types.ts

# Check existing components:
ls src/components/shadcn/
ls src/hooks/
```

### 3. Start Phase 0 Analysis (1-2 days)
```bash
# Verify Supabase schema:
cat supabase/migrations/*

# Check package versions:
cat package.json | grep -E "react|next|zod|react-hook-form"

# Run current dashboard:
npm run dev
# Visit http://localhost:3000/dashboard
```

### 4. Implement Phase 1 (2-3 days)
```bash
# Create hooks directory structure:
mkdir -p src/hooks/__tests__

# Start with one hook (use-episodes.ts):
# - Copy pattern from COMPONENT_MAP.md
# - Test with vitest
# - Verify with dashboard

# Then create form components:
mkdir -p src/components/forms/__tests__

# Then card components:
mkdir -p src/components/cards/__tests__

# Then modals:
mkdir -p src/components/modals/__tests__
```

### 5. Run Tests After Each Component
```bash
npm run test -- src/hooks/__tests__/use-episodes.test.ts --watch
npm run test -- src/components/forms/__tests__/form-wrapper.test.tsx
```

### 6. Refactor Dashboard (Phase 2)
```bash
# Once Phase 1 hooks + components are working:
# 1. Replace inline data fetching → use hooks
# 2. Replace StatCard inline → use component
# 3. Add modal for create episode
# 4. Verify dashboard still works

npm run dev
# Test at http://localhost:3000/dashboard
```

---

## KEY PATTERNS

### Data Fetching (Hook Pattern)
```typescript
// See COMPONENT_MAP.md for full signature
const { data, loading, error, create, update, delete: deleteItem } = useEpisodes({
  status: 'Idea',
  page: 1,
});
```

### Form Validation (Zod + react-hook-form)
```typescript
const form = useForm<EpisodeInput>({
  resolver: zodResolver(episodeSchema),
  defaultValues: episode,
});

return (
  <FormWrapper onSubmit={form.handleSubmit(onSubmit)}>
    <FormInput label="Title" {...form.register('title')} />
  </FormWrapper>
);
```

### Component Props (Type-Safe)
```typescript
interface EpisodeCardProps {
  episode: Episode;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}
```

### Modal Workflow
```typescript
const [modal, setModal] = useState<{ mode: 'create' | 'edit'; id?: string } | null>(null);

// Open modal:
setModal({ mode: 'create' });

// In JSX:
{modal && <EpisodeModal mode={modal.mode} episodeId={modal.id} onClose={() => setModal(null)} />}
```

---

## TESTING APPROACH

### Unit Tests (60% of tests)
```bash
npm run test -- src/hooks/__tests__
npm run test -- src/lib/schemas/__tests__
```

### Component Tests (25%)
```bash
npm run test -- src/components/forms/__tests__
npm run test -- src/components/cards/__tests__
```

### Integration Tests (10%)
```bash
npm run test -- src/components/forms/__tests__/episode-form-integration.test.tsx
```

### E2E Tests (5%)
```bash
npx playwright test tests/e2e/dashboard.spec.ts
```

### Coverage Report
```bash
npm run test -- --coverage
```

---

## COMMAND REFERENCE

### Development
```bash
npm run dev              # Start dev server
npm run build           # (Use npx next build instead)
npm run type-check      # Type check
npx tsc --noEmit        # Standalone type check
```

### Testing
```bash
npm run test            # Run all tests
npm run test:watch      # Watch mode
npm run test -- --coverage  # Coverage report
npm run test -- --grep "pattern"  # Run specific tests
```

### Code Quality
```bash
npm run lint            # Run ESLint
npm run format          # Format with Prettier
npm run verify          # Full check (lint + type + test + build)
```

### Git
```bash
git status              # Check changes
git add .               # Stage all
git commit -m "feat: message"  # Commit
git push origin p1/ux-dashboard-operativa  # Push to branch
```

---

## COMMON ISSUES & SOLUTIONS

### Issue: Build hangs
```bash
# WRONG:
npm run build

# RIGHT:
npx next build
npx tsc --noEmit
```

### Issue: Git locked
```bash
pkill -9 git
sleep 2
rm -f .git/index.lock
```

### Issue: Tests failing due to missing mock
```bash
# Add to test file:
jest.mock('@/lib/supabase/auth-browser');
jest.mock('@/hooks/use-episodes');
```

### Issue: Supabase query not working
```typescript
// Remember: fields are in payload!
const { data: rows } = await supabase
  .from('episodes')
  .select('*')
  .is('user_id', null);  // Query public data

// Convert from row to object:
const episodes = rows?.map(row => ({
  id: row.id,
  created_at: row.created_at,
  updated_at: row.updated_at,
  user_id: row.user_id,
  ...row.payload  // Spread payload fields
})) || [];
```

---

## DELIVERABLES CHECKLIST

### Phase 0 (Analysis)
- [x] Main implementation plan
- [x] Component map
- [x] Testing strategy
- [x] This quick start guide

### Phase 1 (Components)
- [ ] 4 data hooks (use-episodes, use-content-pieces, use-monetization-leads, use-studio-state)
- [ ] 7 form components (form-wrapper, form-input, form-select, form-textarea, episode-form, content-piece-form, lead-form)
- [ ] 4 card components (stat-card, episode-card, content-piece-card, lead-card)
- [ ] 4 modal components (episode-modal, content-piece-modal, lead-modal, confirm-dialog)
- [ ] 3 filter components (episode-filters, content-piece-filters, lead-filters)
- [ ] 1 header component (page-header)
- [ ] 3 Zod schemas (episode-schema, content-piece-schema, lead-schema)
- [ ] Unit tests for all above (coverage: 85%+)

### Phase 2 (Dashboard Refactor)
- [ ] Refactor `/src/app/(studio)/dashboard/page.tsx` with new components
- [ ] Add create/edit/delete modal workflows
- [ ] Integration tests for dashboard flows

### Phase 3 (List Pages)
- [ ] Refactor `/src/app/(studio)/episodios/page.tsx`
- [ ] Create `/src/app/(studio)/episodios/[episodeId]/page.tsx` detail page
- [ ] Refactor `/src/app/(studio)/contenido/page.tsx`
- [ ] Refactor `/src/app/(studio)/monetizacion/page.tsx`
- [ ] Add filters + pagination to all list pages

### Phase 4 (Validation)
- [ ] Create 3 Zod schemas with validations
- [ ] Integrate schemas into forms
- [ ] Unit tests for schemas (coverage: 90%+)

### Phase 5 (Tests)
- [ ] ~30 unit tests (hooks, schemas, utils)
- [ ] ~70 component tests (forms, cards, modals, lists)
- [ ] ~10 integration tests (form flows, page loads)
- [ ] ~5 E2E tests (critical flows: create, edit, delete)
- [ ] Overall coverage: 80%+

### Phase 6 (Documentation)
- [ ] Update CLAUDE.md with P1 patterns
- [ ] Add component usage examples to each component file
- [ ] Create COMPONENT_USAGE.md with recipes
- [ ] Update README with testing guide

### Phase 7 (Polish)
- [ ] All tests passing: `npm run test`
- [ ] Type check passing: `npx tsc --noEmit`
- [ ] Lint passing: `npm run lint`
- [ ] Build passing: `npx next build`
- [ ] Dev server working: `npm run dev`
- [ ] Semantic commit with detailed message
- [ ] PR description with test plan

---

## SUCCESS CRITERIA

P1 is **COMPLETE** when:

1. ✅ All 80+ components and hooks created
2. ✅ All 130-150 tests passing
3. ✅ Coverage report shows 80%+ overall
4. ✅ Dashboard page refactored and working
5. ✅ List pages (/episodios, /contenido, /monetizacion) operational
6. ✅ Forms validate with Zod schemas
7. ✅ E2E tests pass for critical flows
8. ✅ Documentation complete
9. ✅ Type check passing: `npx tsc --noEmit`
10. ✅ Lint passing: `npm run lint`
11. ✅ Build passing: `npx next build`
12. ✅ Dev server working: `npm run dev`
13. ✅ Semantic commit on p1/ux-dashboard-operativa branch
14. ✅ Ready for code review

---

## NEXT STEPS AFTER P1 (P2+)

**Priority 1:**
- [ ] Real-time updates (Supabase realtime subscriptions)
- [ ] Advanced filters (date ranges, multi-select)
- [ ] Global search (Supabase full-text or ElasticSearch)

**Priority 2:**
- [ ] Batch operations (select multiple + bulk edit/delete)
- [ ] Export data (CSV, PDF)
- [ ] Audit log (who changed what, when)
- [ ] Soft delete + restore workflows

**Priority 3:**
- [ ] Visual/UI enhancements
- [ ] Dark mode
- [ ] Mobile responsiveness
- [ ] Accessibility audit (WCAG)

---

## RESOURCES

### Documentation
- Main plan: `docs/P1_DASHBOARD_IMPLEMENTATION_PLAN.md`
- Components: `docs/COMPONENT_MAP.md`
- Testing: `docs/TESTING_STRATEGY.md`

### Code References
- Existing dashboard: `src/app/(studio)/dashboard/page.tsx`
- Existing components: `src/components/`
- Existing hooks: `src/hooks/`
- Existing types: `src/lib/studio-types.ts`
- Supabase schema: `supabase/migrations/`

### External Docs
- Next.js 16: https://nextjs.org/docs
- React Hook Form: https://react-hook-form.com/
- Zod: https://zod.dev/
- Vitest: https://vitest.dev/
- Playwright: https://playwright.dev/

---

## QUESTIONS?

Refer to the detailed plan documents:
1. **"How do I structure a hook?"** → `COMPONENT_MAP.md` → Hooks section
2. **"What should the form component look like?"** → `COMPONENT_MAP.md` → Form Components section
3. **"How do I write tests?"** → `TESTING_STRATEGY.md` → Examples section
4. **"What files do I need to create?"** → `P1_DASHBOARD_IMPLEMENTATION_PLAN.md` → Phase 1-7 sections
5. **"How do I commit my work?"** → `P1_DASHBOARD_IMPLEMENTATION_PLAN.md` → Final Polish & Commit section

---

**Ready to start? Begin with Phase 0 (Analysis) and read `P1_DASHBOARD_IMPLEMENTATION_PLAN.md` in full.**

**Good luck! 🚀**
