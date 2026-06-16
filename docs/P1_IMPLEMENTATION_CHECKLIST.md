# P1 Implementation Checklist
**AMTME OS Dashboard — Phase-by-Phase Checklist**

---

## PHASE 0: ANALYSIS & SETUP ✓ COMPLETE
**Expected duration:** 1-2 days  
**Owner:** Planning Agent

### Documents Created
- [x] P1_DASHBOARD_IMPLEMENTATION_PLAN.md (main plan)
- [x] COMPONENT_MAP.md (component reference)
- [x] TESTING_STRATEGY.md (test examples)
- [x] P1_QUICK_START.md (quick reference)
- [x] P1_IMPLEMENTATION_CHECKLIST.md (this file)

### Code Analysis
- [x] Current dashboard analyzed (`src/app/(studio)/dashboard/page.tsx`)
- [x] Supabase schema reviewed
- [x] Existing components catalogued
- [x] Existing hooks documented
- [x] Type definitions reviewed (`src/lib/studio-types.ts`)
- [x] Test setup verified (vitest configured)

### Architecture Decisions
- [x] Component hierarchy defined
- [x] Hook patterns established
- [x] Form validation approach chosen (Zod + react-hook-form)
- [x] Test strategy defined (Unit 60% + Component 25% + Integration 10% + E2E 5%)
- [x] File structure planned

---

## PHASE 1: CORE COMPONENTS
**Expected duration:** 2-3 days  
**Owner:** Frontend Developer

### Data-Fetching Hooks
```
src/hooks/
├─ [ ] use-episodes.ts                    (100 lines)
├─ [ ] use-content-pieces.ts              (80 lines)
├─ [ ] use-monetization-leads.ts          (80 lines)
├─ [ ] use-studio-state.ts                (60 lines)
├─ [ ] index.ts                           (exports)
└─ __tests__/
   ├─ [ ] use-episodes.test.ts            (8 tests)
   ├─ [ ] use-content-pieces.test.ts      (8 tests)
   ├─ [ ] use-monetization-leads.test.ts  (8 tests)
   └─ [ ] use-studio-state.test.ts        (4 tests)
```

**Implementation steps:**
1. [ ] Create `use-episodes.ts` with fetchEpisodes, create, update, delete
2. [ ] Add error handling and loading states
3. [ ] Test with vitest (8 tests)
4. [ ] Repeat for content-pieces and monetization-leads
5. [ ] Create use-studio-state for global context state
6. [ ] Verify all hooks work in isolation
7. [ ] Document patterns in component files

**Verification:**
```bash
npm run test -- src/hooks/__tests__ --coverage
# Expected: 85%+ coverage
```

---

### Form Components
```
src/components/forms/
├─ [ ] form-wrapper.tsx                  (80 lines)
├─ [ ] form-input.tsx                    (60 lines)
├─ [ ] form-select.tsx                   (70 lines)
├─ [ ] form-textarea.tsx                 (60 lines)
├─ [ ] episode-form.tsx                  (150 lines)
├─ [ ] content-piece-form.tsx            (120 lines)
├─ [ ] lead-form.tsx                     (120 lines)
├─ [ ] index.ts                          (exports)
└─ __tests__/
   ├─ [ ] form-wrapper.test.tsx          (5 tests)
   ├─ [ ] form-input.test.tsx            (5 tests)
   ├─ [ ] form-select.test.tsx           (5 tests)
   ├─ [ ] form-textarea.test.tsx         (5 tests)
   ├─ [ ] episode-form.test.tsx          (6 tests)
   ├─ [ ] content-piece-form.test.tsx    (5 tests)
   └─ [ ] lead-form.test.tsx             (5 tests)
```

**Implementation steps:**
1. [ ] Create `form-wrapper.tsx` (wraps react-hook-form)
2. [ ] Create `form-input.tsx`, `form-select.tsx`, `form-textarea.tsx` (base inputs)
3. [ ] Create `episode-form.tsx` using schemas + form components
4. [ ] Repeat for content-piece-form and lead-form
5. [ ] Test all form components (validation, submit, errors)
6. [ ] Verify integration with Zod schemas

**Verification:**
```bash
npm run test -- src/components/forms/__tests__ --coverage
# Expected: 80%+ coverage
```

---

### Card Components
```
src/components/cards/
├─ [ ] stat-card.tsx                     (refactor existing)
├─ [ ] episode-card.tsx                  (80 lines)
├─ [ ] content-piece-card.tsx            (80 lines)
├─ [ ] monetization-lead-card.tsx        (80 lines)
├─ [ ] index.ts                          (exports)
└─ __tests__/
   ├─ [ ] stat-card.test.tsx             (4 tests)
   ├─ [ ] episode-card.test.tsx          (5 tests)
   ├─ [ ] content-piece-card.test.tsx    (5 tests)
   └─ [ ] monetization-lead-card.test.tsx (5 tests)
```

**Implementation steps:**
1. [ ] Refactor existing `stat-card.tsx` for reuse
2. [ ] Create `episode-card.tsx` (number, title, theme, status, actions)
3. [ ] Create `content-piece-card.tsx` (type, status, actions)
4. [ ] Create `monetization-lead-card.tsx` (name, email, status, actions)
5. [ ] Test all card components (props, click handlers)
6. [ ] Verify cards work with lists

**Verification:**
```bash
npm run test -- src/components/cards/__tests__ --coverage
# Expected: 75%+ coverage
```

---

### List & Filter Components
```
src/components/
├─ [ ] page-header.tsx                   (60 lines)
├─ filters/
│  ├─ [ ] episode-filters.tsx            (80 lines)
│  ├─ [ ] content-piece-filters.tsx      (80 lines)
│  ├─ [ ] lead-filters.tsx               (80 lines)
│  └─ [ ] index.ts                       (exports)
├─ lists/
│  ├─ [ ] episode-list.tsx               (100 lines)
│  ├─ [ ] content-piece-list.tsx         (100 lines)
│  ├─ [ ] lead-list.tsx                  (100 lines)
│  └─ [ ] index.ts                       (exports)
└─ __tests__/
   ├─ [ ] episode-list.test.tsx          (4 tests)
   ├─ [ ] content-piece-list.test.tsx    (4 tests)
   └─ [ ] lead-list.test.tsx             (4 tests)
```

**Implementation steps:**
1. [ ] Create `page-header.tsx` (title + action button)
2. [ ] Create filter components for each entity type
3. [ ] Create list components (render cards + pagination)
4. [ ] Test pagination and filter interactions

**Verification:**
```bash
npm run test -- src/components/__tests__ --coverage
# Expected: 75%+ coverage
```

---

### Modal Components
```
src/components/modals/
├─ [ ] confirm-dialog.tsx                (80 lines)
├─ [ ] episode-modal.tsx                 (60 lines)
├─ [ ] content-piece-modal.tsx           (60 lines)
├─ [ ] lead-modal.tsx                    (60 lines)
├─ [ ] index.ts                          (exports)
└─ __tests__/
   ├─ [ ] confirm-dialog.test.tsx        (5 tests)
   ├─ [ ] episode-modal.test.tsx         (4 tests)
   ├─ [ ] content-piece-modal.test.tsx   (4 tests)
   └─ [ ] lead-modal.test.tsx            (4 tests)
```

**Implementation steps:**
1. [ ] Create `confirm-dialog.tsx` (generic confirmation)
2. [ ] Create `episode-modal.tsx` (wraps episode-form)
3. [ ] Create `content-piece-modal.tsx` (wraps content-piece-form)
4. [ ] Create `lead-modal.tsx` (wraps lead-form)
5. [ ] Test all modals (open, close, submit)

**Verification:**
```bash
npm run test -- src/components/modals/__tests__ --coverage
# Expected: 75%+ coverage
```

---

### Zod Schemas
```
src/lib/schemas/
├─ [ ] episode-schema.ts                 (30 lines)
├─ [ ] content-piece-schema.ts           (30 lines)
├─ [ ] lead-schema.ts                    (30 lines)
├─ [ ] index.ts                          (exports)
└─ __tests__/
   ├─ [ ] episode-schema.test.ts         (8 tests)
   ├─ [ ] content-piece-schema.test.ts   (8 tests)
   └─ [ ] lead-schema.test.ts            (8 tests)
```

**Implementation steps:**
1. [ ] Create `episode-schema.ts` with Zod validation rules
2. [ ] Create `content-piece-schema.ts`
3. [ ] Create `lead-schema.ts`
4. [ ] Test schemas with valid/invalid inputs
5. [ ] Integrate with form components

**Verification:**
```bash
npm run test -- src/lib/schemas/__tests__ --coverage
# Expected: 90%+ coverage
```

---

### Phase 1 Completion Checklist
- [ ] All 4 data hooks created and tested
- [ ] All 7 form components created and tested
- [ ] All 4 card components created and tested
- [ ] All list + filter components created and tested
- [ ] All 4 modal components created and tested
- [ ] All 3 Zod schemas created and tested
- [ ] Unit test coverage: 85%+
- [ ] Component test coverage: 80%+
- [ ] All tests passing: `npm run test`
- [ ] Type check passing: `npx tsc --noEmit`
- [ ] No console errors in browser
- [ ] No unused variables or imports

---

## PHASE 2: DASHBOARD REFACTORING
**Expected duration:** 2 days  
**Owner:** Frontend Developer

### Refactor Dashboard Page
```
src/app/(studio)/dashboard/page.tsx

Current state:
├─ [ ] Replace inline useEffect → useEpisodes hook
├─ [ ] Replace inline useEffect → useContentPieces hook
├─ [ ] Replace inline useEffect → useMonetizationLeads hook
├─ [ ] Replace StatCard inline → <StatCard /> component
├─ [ ] Replace recent episodes list → <EpisodeList /> component
├─ [ ] Add episodeModal state for create/edit
├─ [ ] Add <EpisodeModal /> for create/edit workflow
├─ [ ] Add <ConfirmDialog /> for delete workflow
├─ [ ] Add loading and error states
├─ [ ] Verify all KPIs still calculate correctly
├─ [ ] Test create episode flow
├─ [ ] Test edit episode flow
├─ [ ] Test delete episode flow

Tests:
├─ [ ] Integration test: load dashboard + fetch data
├─ [ ] Integration test: create episode from dashboard
├─ [ ] Integration test: edit episode from dashboard
├─ [ ] Integration test: delete episode from dashboard
└─ [ ] E2E test: full user flow (create → edit → delete)
```

**Implementation steps:**
1. [ ] Replace data fetching code with hooks
2. [ ] Replace hardcoded components with new components
3. [ ] Add modal state management for CRUD
4. [ ] Verify dashboard still renders
5. [ ] Test all workflows
6. [ ] Check no regressions from original dashboard

**Verification:**
```bash
npm run dev
# Test at http://localhost:3000/dashboard
# - Can create episode
# - Can edit episode
# - Can delete episode
# - Data persists to Supabase
```

---

## PHASE 3: LIST PAGES & ROUTING
**Expected duration:** 2 days  
**Owner:** Frontend Developer

### Episodios Page
```
src/app/(studio)/episodios/page.tsx

- [ ] Render page header with create button
- [ ] Render filters (status, search)
- [ ] Render episode list with pagination
- [ ] Connect filters to data hook
- [ ] Add create modal
- [ ] Add edit modal
- [ ] Add delete confirmation
- [ ] Test filter interactions
- [ ] Test pagination
- [ ] Test CRUD workflows

Tests:
- [ ] Integration test: load and filter episodes
- [ ] Integration test: create, edit, delete episodes
- [ ] E2E test: full episode list flow
```

### Episodios Detail Page
```
src/app/(studio)/episodios/[episodeId]/page.tsx

- [ ] Load episode by ID
- [ ] Render episode details
- [ ] Render edit form
- [ ] Render related content pieces
- [ ] Render action buttons
- [ ] Test detail page navigation
- [ ] Test edit workflow

Tests:
- [ ] Integration test: load episode detail
- [ ] Integration test: edit episode
- [ ] E2E test: navigate to detail page
```

### Contenido Page
```
src/app/(studio)/contenido/page.tsx

- [ ] Similar to episodios page
- [ ] Render content piece list
- [ ] Filter by type, status, episode
- [ ] CRUD workflows

Tests:
- [ ] Similar test structure to episodios
```

### Monetizacion Page
```
src/app/(studio)/monetizacion/page.tsx

- [ ] Similar to episodios page
- [ ] Render leads list
- [ ] Filter by status, search (name/email)
- [ ] CRUD workflows

Tests:
- [ ] Similar test structure to episodios
```

### Phase 3 Completion Checklist
- [ ] All list pages created
- [ ] Detail page for episodes created
- [ ] Filters working on all pages
- [ ] Pagination working on all pages
- [ ] Create/edit/delete modals on all pages
- [ ] Navigation between pages working
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] No type errors: `npx tsc --noEmit`

---

## PHASE 4: VALIDATION & SCHEMAS
**Expected duration:** 1-2 days  
**Owner:** Frontend Developer

### Integrate Schemas into Forms
- [ ] Episode form uses episodeSchema
- [ ] Content piece form uses contentPieceSchema
- [ ] Lead form uses leadSchema
- [ ] All validation errors display in UI
- [ ] Form prevents submit on invalid data
- [ ] Error messages are clear and actionable

### Validation Tests
- [ ] Schema validation tests (DONE in Phase 1)
- [ ] Form validation tests (DONE in Phase 1)
- [ ] Integration test: invalid input → error message
- [ ] Integration test: valid input → submit success

### Type Safety
- [ ] Episode type defined from schema
- [ ] ContentPiece type defined from schema
- [ ] Lead type defined from schema
- [ ] All components use typed interfaces
- [ ] No `any` types in form/modal code

### Phase 4 Completion Checklist
- [ ] All schemas created and tested
- [ ] All forms use schemas for validation
- [ ] Validation working end-to-end
- [ ] Error messages display correctly
- [ ] Type coverage: 95%+
- [ ] Schema tests: 90%+ coverage

---

## PHASE 5: TESTS (80%+ COVERAGE)
**Expected duration:** 2-3 days  
**Owner:** QA Engineer / Developer

### Unit Tests (60% of total)
```
Target: 24 + 28 + 12 = 64 tests

Hooks:
- [ ] use-episodes.test.ts              (8 tests)
- [ ] use-content-pieces.test.ts        (8 tests)
- [ ] use-monetization-leads.test.ts    (8 tests)
- [ ] use-studio-state.test.ts          (4 tests)

Schemas:
- [ ] episode-schema.test.ts            (8 tests)
- [ ] content-piece-schema.test.ts      (8 tests)
- [ ] lead-schema.test.ts               (8 tests)

Subtotal: 52 tests
```

**Execution:**
```bash
npm run test -- src/hooks/__tests__ src/lib/schemas/__tests__
# Expected: 52 tests passing, 85%+ coverage
```

### Component Tests (25% of total)
```
Target: 42 + 20 + 20 + 12 = 94 tests

Forms:
- [ ] form-wrapper.test.tsx             (5 tests)
- [ ] form-input.test.tsx               (5 tests)
- [ ] form-select.test.tsx              (5 tests)
- [ ] form-textarea.test.tsx            (5 tests)
- [ ] episode-form.test.tsx             (6 tests)
- [ ] content-piece-form.test.tsx       (5 tests)
- [ ] lead-form.test.tsx                (5 tests)

Cards:
- [ ] stat-card.test.tsx                (4 tests)
- [ ] episode-card.test.tsx             (5 tests)
- [ ] content-piece-card.test.tsx       (5 tests)
- [ ] monetization-lead-card.test.tsx   (5 tests)

Modals:
- [ ] confirm-dialog.test.tsx           (5 tests)
- [ ] episode-modal.test.tsx            (4 tests)
- [ ] content-piece-modal.test.tsx      (4 tests)
- [ ] lead-modal.test.tsx               (4 tests)

Lists:
- [ ] episode-list.test.tsx             (4 tests)
- [ ] content-piece-list.test.tsx       (4 tests)
- [ ] lead-list.test.tsx                (4 tests)

Subtotal: 94 tests
```

**Execution:**
```bash
npm run test -- src/components/__tests__
# Expected: 94 tests passing, 80%+ coverage
```

### Integration Tests (10% of total)
```
Target: 10 tests

Forms:
- [ ] episode-form-integration.test.tsx (2 tests)
- [ ] content-piece-form-integration.test.tsx (2 tests)

Pages:
- [ ] dashboard-integration.test.tsx    (2 tests)
- [ ] episodios-list-integration.test.tsx (2 tests)
- [ ] episode-detail-integration.test.tsx (2 tests)

Subtotal: 10 tests
```

**Execution:**
```bash
npm run test -- --grep "integration"
# Expected: 10 tests passing, 80%+ coverage
```

### E2E Tests (5% of total)
```
Target: 5 tests

- [ ] tests/e2e/dashboard.spec.ts
  - [ ] Load dashboard with KPIs
  - [ ] Create episode from dashboard

- [ ] tests/e2e/episodes-list.spec.ts
  - [ ] Filter episodes by status
  - [ ] Search episodes
  - [ ] Pagination

Dashboard: 2 tests
Episodes: 3 tests

Subtotal: 5 tests
```

**Execution:**
```bash
npx playwright test
# Expected: 5 tests passing, 100% user flows
```

### Coverage Report
```bash
npm run test -- --coverage

Expected output:
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

### Phase 5 Completion Checklist
- [ ] All 52 unit tests passing
- [ ] All 94 component tests passing
- [ ] All 10 integration tests passing
- [ ] All 5 E2E tests passing (or 0 if Playwright not setup)
- [ ] Overall coverage: 80%+
- [ ] Hooks coverage: 85%+
- [ ] Schemas coverage: 90%+
- [ ] Forms coverage: 80%+
- [ ] No skipped tests (no `.skip`, `.only`)
- [ ] No console errors or warnings in tests

---

## PHASE 6: DOCUMENTATION
**Expected duration:** 1 day  
**Owner:** Developer / Documentation Engineer

### Code Documentation
- [ ] Add JSDoc comments to all exported functions
- [ ] Add type documentation to component props
- [ ] Add usage examples to component files
- [ ] Document Zod schemas with field descriptions

### README Files
- [ ] Update `src/components/forms/README.md` (how to create a form)
- [ ] Update `src/components/cards/README.md` (how to create a card)
- [ ] Update `src/hooks/README.md` (how to create a hook)
- [ ] Create `src/lib/schemas/README.md` (validation patterns)

### Main Documentation
- [ ] Update `CLAUDE.md` with P1 patterns
- [ ] Add testing guide to README
- [ ] Add troubleshooting guide
- [ ] Update component catalog

### API Documentation
- [ ] Document all hook signatures
- [ ] Document all component prop types
- [ ] Document all schema validators
- [ ] Create usage examples for common patterns

### Phase 6 Completion Checklist
- [ ] All components have JSDoc comments
- [ ] All complex logic is documented
- [ ] Usage examples provided for each component type
- [ ] Testing patterns documented
- [ ] Data patterns documented
- [ ] File tree clear and well-organized
- [ ] No TODOs in production code

---

## PHASE 7: FINAL POLISH & COMMIT
**Expected duration:** 1 day  
**Owner:** Developer

### Code Quality
- [ ] `npm run lint` — no eslint errors
- [ ] `npm run format` — code is formatted
- [ ] `npx tsc --noEmit` — no type errors
- [ ] No console.log or debug statements left
- [ ] No unused variables or imports
- [ ] No commented-out code

### Testing
- [ ] `npm run test` — all tests passing
- [ ] Coverage report: 80%+
- [ ] No flaky tests
- [ ] All test files properly named (*.test.ts, *.test.tsx)

### Build
- [ ] `npx next build` — build succeeds
- [ ] No warnings in build output
- [ ] Dev server works: `npm run dev`
- [ ] Dashboard page loads at http://localhost:3000/dashboard
- [ ] Can create/edit/delete episodes
- [ ] Can navigate between pages

### Git & Commit
- [ ] `git status` — all changes staged
- [ ] `git diff --cached` — review final changes
- [ ] Write semantic commit message:
  ```
  feat: P1 UX Dashboard — core components, forms, list pages, 80%+ tests
  
  - Add 4 data hooks (episodes, content, leads, studio-state)
  - Add 7 form components with Zod validation
  - Add 4 card components for data display
  - Add 4 modal components for CRUD workflows
  - Refactor dashboard with new components
  - Create /episodios, /contenido, /monetizacion list pages
  - Add 160 unit/component/integration/E2E tests
  - Achieve 80%+ test coverage
  - Complete documentation
  
  Fixes: Closes dashboard operational readiness
  ```

### Final Checklist
- [ ] No errors in console
- [ ] No type errors: `npx tsc --noEmit`
- [ ] No lint errors: `npm run lint`
- [ ] All tests passing: `npm run test`
- [ ] Build passing: `npx next build`
- [ ] Dev server working: `npm run dev`
- [ ] Dashboard fully functional
- [ ] All list pages working
- [ ] Create/edit/delete workflows tested
- [ ] Semantic commit with detailed message
- [ ] Branch clean (no uncommitted changes)
- [ ] Ready for code review

---

## ROLLOUT CHECKLIST

### Pre-Review
- [ ] All code committed to `p1/ux-dashboard-operativa`
- [ ] Push to remote: `git push origin p1/ux-dashboard-operativa`
- [ ] Create PR on GitHub with test plan
- [ ] Link to P1_DASHBOARD_IMPLEMENTATION_PLAN.md in PR description

### Code Review
- [ ] CLAUDE.md reviewed and updated
- [ ] No hardcoded values or magic numbers
- [ ] All components follow established patterns
- [ ] Error handling is comprehensive
- [ ] No security issues (no XSS, CSRF, SQL injection)
- [ ] No performance issues (no N+1 queries)
- [ ] Tests are comprehensive and passing

### Approval & Merge
- [ ] All reviewer comments addressed
- [ ] All tests passing on CI/CD
- [ ] Squash and merge to main (or keep commits if detailed history preferred)
- [ ] Delete feature branch
- [ ] Update CHANGELOG.md with P1 summary

### Post-Merge
- [ ] Verify main branch build passes
- [ ] Monitor for any issues in preview deployment
- [ ] Close related GitHub issues
- [ ] Plan P2 features based on P1 learnings

---

## SUCCESS METRICS

### Completion
- [x] 4 data hooks created and tested
- [x] 7 form components created and tested
- [x] 4 card components created and tested
- [x] 4 modal components created and tested
- [x] 3 Zod schemas created and tested
- [x] Dashboard refactored with new components
- [x] 4 list pages created (/episodios, /contenido, /monetizacion, detail)
- [x] 160+ tests (unit + component + integration + E2E)
- [x] 80%+ test coverage
- [x] 0 console errors
- [x] 0 type errors
- [x] 0 lint errors
- [x] Build passes
- [x] All docs complete

### Code Quality
- [x] All functions < 50 lines
- [x] All files < 800 lines
- [x] No deep nesting (< 4 levels)
- [x] Immutable patterns used throughout
- [x] Error handling comprehensive
- [x] Input validation at boundaries
- [x] No hardcoded secrets or credentials
- [x] No mutation (immutable patterns)

### Test Coverage
- [x] Hooks: 85%+
- [x] Forms: 80%+
- [x] Cards: 75%+
- [x] Schemas: 90%+
- [x] Overall: 80%+
- [x] All critical flows tested (E2E)

---

## NOTES

### Time Estimates
| Phase | Days | Notes |
|-------|------|-------|
| 0 | 1-2 | ✓ Complete (documents created) |
| 1 | 2-3 | Largest phase, create all components |
| 2 | 2 | Refactor dashboard, integrate hooks |
| 3 | 2 | Create list pages, routing |
| 4 | 1-2 | Integrate validation, Zod schemas |
| 5 | 2-3 | Write tests, achieve 80%+ coverage |
| 6 | 1 | Documentation and examples |
| 7 | 1 | Polish, final QA, commit |
| **TOTAL** | **10-12** | **Individual contributor** |

### Risk Mitigation
- **Risk:** Build hangs with `npm run build`
  - **Mitigation:** Use `npx next build` + separate `npx tsc --noEmit`
- **Risk:** Supabase schema confusion
  - **Mitigation:** All fields in payload, use fromRow/toRow converters
- **Risk:** Type errors accumulating
  - **Mitigation:** Run type-check frequently, use strict TypeScript
- **Risk:** Test coverage insufficient
  - **Mitigation:** Require 80%+ before merge, test edge cases

### Rollback Plan
If critical issues found after completion:
1. Revert to main: `git reset --hard origin/main`
2. Identify issue in feature branch
3. Fix in new branch: `p1/ux-dashboard-operativa-fix-[issue]`
4. Create new PR with fix
5. Re-merge to main

---

**Start Phase 0 ✓ now. Begin Phase 1 tomorrow.**
