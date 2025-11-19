# Level 2 Optimization Rollout Plan

**Status**: Rolling out Server Component optimizations across the application

**Goal**: Apply the proven Level 2 hybrid pattern to all high-traffic pages for 2-3x performance improvement

---

## ✅ Completed (POC)

1. **Projects Overview** (`/organize/[orgId]/projects`)
   - Status: ✅ Complete
   - Performance: Stunning improvements reported
   - Pattern: Server fetch → Redux hydration → Client render
   - Files: page.tsx, ProjectsPageClient.tsx, CampaignsGridWithInitialData.tsx

---

## 🎯 Prioritized Rollout (High → Low Impact)

### Phase 1: High-Traffic Organize Pages (Week 1)

**Priority 1 - People Page** (Highest Impact)
- Path: `/organize/[orgId]/people`
- Data: People list (often 1000s of records)
- Redux Actions: `peopleLoad()`, `peopleLoaded()`
- Estimated Effort: 2-3 hours
- Impact: ⭐⭐⭐⭐⭐ (Most data-heavy page)

**Priority 2 - Journeys Page**
- Path: `/organize/[orgId]/journeys`
- Data: Journeys list
- Redux Actions: `journeysLoad()`, `journeysLoaded()`
- Estimated Effort: 1-2 hours
- Impact: ⭐⭐⭐⭐

**Priority 3 - Tags Page**
- Path: `/organize/[orgId]/tags`
- Data: Tags list
- Redux Actions: To be determined
- Estimated Effort: 1-2 hours
- Impact: ⭐⭐⭐

**Priority 4 - Geography Page**
- Path: `/organize/[orgId]/geography`
- Data: Geography data
- Estimated Effort: 2-3 hours (map data complexity)
- Impact: ⭐⭐⭐

### Phase 2: Individual Resource Pages (Week 2)

**Priority 5 - Campaign Detail**
- Path: `/organize/[orgId]/projects/[campId]`
- Data: Single campaign + activities
- Estimated Effort: 1-2 hours
- Impact: ⭐⭐⭐

**Priority 6 - Person Profile**
- Path: `/organize/[orgId]/people/[personId]`
- Data: Person details + tags + journeys
- Estimated Effort: 2-3 hours (multiple data sources)
- Impact: ⭐⭐⭐⭐

**Priority 7 - Journey Detail**
- Path: `/organize/[orgId]/journeys/[journeyId]`
- Data: Journey + instances + milestones
- Estimated Effort: 2-3 hours
- Impact: ⭐⭐⭐

### Phase 3: User-Facing Pages (Week 2-3)

**Priority 8 - My Home**
- Path: `/my/home`
- Data: User activities
- Estimated Effort: 1-2 hours
- Impact: ⭐⭐⭐⭐ (User-facing!)

**Priority 9 - My Feed**
- Path: `/my/feed`
- Data: Events feed
- Estimated Effort: 1-2 hours
- Impact: ⭐⭐⭐

**Priority 10 - Public Org Page**
- Path: `/o/[orgId]`
- Data: Public org events
- Estimated Effort: 1-2 hours
- Impact: ⭐⭐⭐⭐ (Public-facing SEO!)

---

## 🔧 Systematic Conversion Process

For each page, follow these steps:

### Step 1: Analysis (15-30 min)
1. ✅ Identify current page location
2. ✅ List all data fetching hooks used
3. ✅ Identify Redux actions for data loading
4. ✅ Check for dependencies between data sources
5. ✅ Note any special cases (auth, redirects, etc.)

### Step 2: Server Component (30-45 min)
1. ✅ Remove `'use client'` from page.tsx
2. ✅ Make page component async
3. ✅ Change `useParams()` to `params` prop
4. ✅ Add server-side data fetching with `getServerApiClient()`
5. ✅ Fetch data in parallel with `Promise.all()`
6. ✅ Pass data to new Client component

### Step 3: Client Component (30-45 min)
1. ✅ Create `[PageName]Client.tsx` with `'use client'`
2. ✅ Move page logic from page.tsx
3. ✅ Accept server data as props
4. ✅ Create or use hydration wrapper component
5. ✅ Maintain existing Suspense boundaries

### Step 4: Redux Hydration (30-60 min)
1. ✅ Create `[Component]WithInitialData.tsx` wrapper
2. ✅ Use `useEffect` to dispatch loaded actions
3. ✅ Match data transformation from hooks (e.g., color generation)
4. ✅ Render existing component

### Step 5: Testing (30-45 min)
1. ✅ Page loads without errors
2. ✅ Data displays correctly
3. ✅ No duplicate API requests in Network tab
4. ✅ Redux DevTools shows pre-populated data
5. ✅ View source shows data in HTML
6. ✅ Client-side navigation works
7. ✅ All interactions function normally

**Total Time per Page: 2-4 hours**

---

## 📋 Conversion Template

### File Structure Pattern

```
src/app/[route]/page.tsx          → Server Component (async)
src/app/[route]/PageClient.tsx    → Client Component (NEW)
src/features/[domain]/components/
  [Component]WithInitialData.tsx  → Redux Hydration (NEW, reusable)
```

### Code Template: Server Component

```tsx
import { getServerApiClient } from 'core/api/server';
import { [DataType] } from 'utils/types/zetkin';
import [PageName]Client from './[PageName]Client';

interface PageProps {
  params: {
    [paramName]: string;
  };
}

export default async function [PageName]({ params }: PageProps) {
  const [paramName] = parseInt(params.[paramName]);

  // Pre-fetch data on server
  const apiClient = await getServerApiClient();
  const data = await apiClient.get<[DataType][]>(
    `/api/orgs/${orgId}/[endpoint]`
  );

  return <[PageName]Client data={data} [paramName]={[paramName]} />;
}
```

### Code Template: Client Component

```tsx
'use client';

import { Suspense } from 'react';
import [Component]WithInitialData from 'features/[domain]/components/[Component]WithInitialData';
import { [DataType] } from 'utils/types/zetkin';

interface [PageName]ClientProps {
  data: [DataType][];
  [paramName]: number;
}

export default function [PageName]Client({
  data,
  [paramName]
}: [PageName]ClientProps) {
  return (
    <[Component]WithInitialData
      data={data}
      [paramName]={[paramName]}
    />
  );
}
```

### Code Template: Redux Hydration Component

```tsx
'use client';

import { useEffect } from 'react';
import [ExistingComponent] from './[ExistingComponent]';
import { [dataLoaded] } from '../store';
import { useAppDispatch } from 'core/hooks';
import { [DataType] } from 'utils/types/zetkin';

interface [Component]WithInitialDataProps {
  data: [DataType][];
  [paramName]: number;
}

export default function [Component]WithInitialData({
  data,
  [paramName],
}: [Component]WithInitialDataProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hydrate Redux store with server-fetched data
    // Match any data transformations from the original hook
    dispatch([dataLoaded](data));
  }, [data, dispatch]);

  // Render existing component which will use hydrated store
  return <[ExistingComponent] [paramName]={[paramName]} />;
}
```

---

## 🚀 Semi-Automated Helper Script

While full automation isn't possible, we can create helper scripts:

### Analysis Script

```bash
#!/bin/bash
# analyze-page.sh - Analyzes a page for Level 2 conversion

PAGE_PATH=$1

echo "🔍 Analyzing: $PAGE_PATH"
echo ""

echo "📦 Current imports:"
grep "^import" "$PAGE_PATH" | head -20

echo ""
echo "🪝 Hooks used:"
grep -oE "use[A-Z][a-zA-Z]*\(" "$PAGE_PATH" | sort -u

echo ""
echo "📡 API calls:"
grep -E "apiClient\.(get|post|put|patch|delete)" "$PAGE_PATH"

echo ""
echo "🎯 Redux dispatches:"
grep "dispatch(" "$PAGE_PATH" | head -10
```

### Validation Script

```bash
#!/bin/bash
# validate-conversion.sh - Validates Level 2 conversion

PAGE_DIR=$1

echo "✅ Validation Checklist for: $PAGE_DIR"
echo ""

# Check for Server Component
if [ -f "$PAGE_DIR/page.tsx" ]; then
  if grep -q "'use client'" "$PAGE_DIR/page.tsx"; then
    echo "❌ page.tsx still has 'use client'"
  else
    echo "✅ page.tsx is Server Component"
  fi

  if grep -q "async function" "$PAGE_DIR/page.tsx"; then
    echo "✅ page.tsx is async"
  else
    echo "⚠️  page.tsx should be async"
  fi

  if grep -q "getServerApiClient" "$PAGE_DIR/page.tsx"; then
    echo "✅ page.tsx fetches data on server"
  else
    echo "⚠️  page.tsx should fetch data"
  fi
fi

# Check for Client Component
CLIENT_FILES=$(find "$PAGE_DIR" -name "*Client.tsx" 2>/dev/null)
if [ -n "$CLIENT_FILES" ]; then
  echo "✅ Client component exists: $CLIENT_FILES"

  if grep -q "'use client'" $CLIENT_FILES; then
    echo "✅ Client component has 'use client'"
  else
    echo "❌ Client component missing 'use client'"
  fi
else
  echo "⚠️  No Client component found"
fi

echo ""
echo "📊 Manual checks required:"
echo "  - Test page loads without errors"
echo "  - Check Network tab for duplicate requests"
echo "  - Verify Redux DevTools shows pre-populated data"
echo "  - View source for data in HTML"
```

---

## 📊 Progress Tracking

| Page | Priority | Status | Effort | Performance Gain | Completed |
|------|----------|--------|--------|------------------|-----------|
| Projects Overview | ✅ POC | ✅ Done | 4h | Stunning (reported) | ✅ 2025-01-18 |
| People List | 🔥 High | ✅ Done | 1.5h | Expected: 70% | ✅ 2025-01-18 |
| Journeys List | 🔥 High | ✅ Done | 1h | Expected: 60% | ✅ 2025-01-18 |
| Tags List | 📌 Med | ✅ Done | 1.5h | Expected: 50% | ✅ 2025-01-18 |
| Geography | 📌 Med | ⏳ Pending | 2-3h | Expected: 55% | - |
| Campaign Detail | 📌 Med | ⏳ Pending | 1-2h | Expected: 50% | - |
| Person Profile | 🔥 High | ⏳ Pending | 2-3h | Expected: 65% | - |
| Journey Detail | 📌 Med | ⏳ Pending | 2-3h | Expected: 55% | - |
| My Home | 🔥 High | ⏳ Pending | 1-2h | Expected: 60% | - |
| My Feed | 📌 Med | ⏳ Pending | 1-2h | Expected: 50% | - |
| Public Org | 🔥 High | ⏳ Pending | 1-2h | Expected: 70% | - |

**Progress**: 4 of 11 pages complete (36%)
**Completed in this session**: ~4 hours actual (vs 6-9h estimated)
**Remaining Effort**: 12-21 hours (1.5-3 weeks)

---

## 💡 Key Insights

### Reusable Patterns

Hydration components created (can be reused):
- ✅ `CampaignsGridWithInitialData` - For campaign/project pages
- ✅ `ViewBrowserWithInitialData` - For People/view browser pages (REUSABLE!)
- ✅ `JourneysGridWithInitialData` - For journeys pages
- ✅ `TagGroupsDisplayWithInitialData` - For tags pages

### Quick Wins (1-2 hours each)

Start with simpler pages to build momentum:
1. Journeys List (straightforward data)
2. Tags List (simple structure)
3. My Feed (single data source)

### Complex Cases (2-3 hours each)

Save these for later when pattern is well-understood:
1. People List (large datasets, filtering)
2. Person Profile (multiple data sources)
3. Geography (map data complexity)

---

## 🎯 Recommended Approach

### Week 1: Build Confidence
- Day 1: People List (biggest impact)
- Day 2: Journeys List (quick win)
- Day 3: Tags List (quick win)
- Day 4: Testing & refinement
- Day 5: Document learnings

### Week 2: Scale Up
- Day 1-2: Campaign Detail + Person Profile
- Day 3: Journey Detail
- Day 4-5: User-facing pages (My Home, My Feed)

### Week 3: Complete Rollout
- Day 1-2: Public Org Page + Geography
- Day 3-4: Performance testing & documentation
- Day 5: Team review & knowledge sharing

---

## ✅ Success Criteria

For each page conversion:
- ✅ Zero TypeScript/compilation errors
- ✅ No duplicate network requests
- ✅ Redux store pre-populated on load
- ✅ Data visible in HTML source
- ✅ All user interactions work
- ✅ Performance metrics improved (FCP, LCP, TTI)

Overall rollout success:
- ✅ 10+ pages converted
- ✅ Average 50%+ FCP improvement
- ✅ Zero regressions
- ✅ Team understands pattern
- ✅ Documentation complete

---

**Ready to start with the People page (highest impact!)** 🚀
