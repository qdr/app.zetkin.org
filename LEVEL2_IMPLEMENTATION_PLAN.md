# Level 2 Implementation Plan: Server Components

## Strategy: Hybrid Approach (Safest for Current Architecture)

Given the current Redux-based architecture with client-side hooks, we'll use a **hybrid approach** that provides benefits of Server Components while maintaining compatibility with existing code.

### Why Hybrid?

Your app currently uses:
- ✅ Redux store for client state
- ✅ Custom hooks (useCampaigns, useSurveys, etc.) with caching
- ✅ Client-side data fetching with sophisticated caching layer

**Full Server Component conversion** would require:
- ❌ Refactoring entire Redux architecture
- ❌ Rewriting all data-fetching hooks
- ❌ Breaking changes to 100+ components
- ⏱️ **Estimated: 2-3 weeks of work**

**Hybrid approach** gives us:
- ✅ Server-side data pre-fetching
- ✅ Faster initial page loads
- ✅ SEO benefits
- ✅ Works with existing Redux/hooks
- ✅ **No breaking changes**
- ⏱️ **Estimated: 2-3 days of work**

---

## 🎯 Hybrid Approach Pattern

### Before (Client Only):
```tsx
'use client';

function ProjectsPage() {
  const { orgId } = useNumericRouteParams();
  const campaigns = useCampaigns(orgId); // Fetches client-side

  return <CampaignsList />;  // Uses hook internally
}
```

**Issues:**
- ❌ No data on initial HTML
- ❌ Waterfall: Page loads → JS downloads → Component mounts → Data fetches
- ❌ Slow First Contentful Paint

### After (Hybrid Server + Client):
```tsx
// Server Component (no 'use client')
async function ProjectsPage({ params }: { params: { orgId: string } }) {
  const apiClient = await getServerApiClient();

  // Pre-fetch critical data on server
  const campaigns = await apiClient.get(`/api/orgs/${params.orgId}/campaigns`);

  // Pass to client component
  return <ProjectsPageClient initialCampaigns={campaigns} orgId={params.orgId} />;
}

// Client component (still uses Redux/hooks)
'use client';
function ProjectsPageClient({ initialCampaigns, orgId }) {
  const campaigns = useCampaigns(orgId, { initialData: initialCampaigns });

  return <CampaignsList />;  // Works exactly as before!
}
```

**Benefits:**
- ✅ Data included in initial HTML (SEO, faster FCP)
- ✅ No waterfall - data fetched in parallel with page request
- ✅ Client components still work with hooks/Redux
- ✅ Progressive enhancement - works without JS
- ✅ Backwards compatible

---

## 📋 Implementation Phases

### Phase 1: Proof of Concept (1 page)
**Goal:** Validate hybrid approach works with existing architecture

**Target:** `/organize/[orgId]/projects` (Projects Overview)

**Steps:**
1. ✅ Convert page.tsx to Server Component
2. ✅ Add server-side data fetching
3. ✅ Create ProjectsPageClient wrapper
4. ✅ Pass initial data to client components
5. ✅ Test that existing hooks still work
6. ✅ Verify Redux store still functions
7. ✅ Measure performance improvement

**Success Criteria:**
- Page loads with data in initial HTML
- No console errors
- Redux store updates work
- Client-side navigation works
- Performance: FCP improves by 50%+

---

### Phase 2: High-Traffic Pages (3-4 pages)
After POC success, apply to:

1. **People page** - `/organize/[orgId]/people`
2. **Journeys page** - `/organize/[orgId]/journeys`
3. **Tags page** - `/organize/[orgId]/tags`

---

### Phase 3: Public Pages (2-3 pages)
User-facing pages:

1. **Public org home** - `/o/[orgId]`
2. **Event details** - `/o/[orgId]/events/[eventId]`
3. **Survey forms** - `/o/[orgId]/surveys/[surveyId]`

---

## 🔧 Technical Implementation Details

### Pattern A: Simple Data Pre-fetch

For pages with straightforward data needs:

```tsx
// src/app/organize/[orgId]/projects/page.tsx
import { getServerApiClient } from '@/core/api/server';
import ProjectsPageClient from './ProjectsPageClient';

export default async function ProjectsPage({
  params,
}: {
  params: { orgId: string };
}) {
  const apiClient = await getServerApiClient();
  const orgId = parseInt(params.orgId);

  // Fetch data in parallel
  const [campaigns, surveys] = await Promise.all([
    apiClient.get(`/api/orgs/${orgId}/campaigns`),
    apiClient.get(`/api/orgs/${orgId}/surveys`),
  ]);

  return (
    <ProjectsPageClient
      campaigns={campaigns}
      surveys={surveys}
      orgId={orgId}
    />
  );
}
```

```tsx
// src/app/organize/[orgId]/projects/ProjectsPageClient.tsx
'use client';

import { Suspense } from 'react';
import { ZetkinCampaign, ZetkinSurvey } from 'utils/types/zetkin';

interface Props {
  campaigns: ZetkinCampaign[];
  surveys: ZetkinSurvey[];
  orgId: number;
}

export default function ProjectsPageClient({ campaigns, surveys, orgId }: Props) {
  // Client components can still use hooks for interactivity
  // But they get initial data from server for fast first render

  return (
    <>
      <Suspense fallback={<ActivitiesOverviewSkeleton />}>
        <ActivitiesOverview orgId={orgId} />
      </Suspense>

      <CampaignsGridWithInitialData
        campaigns={campaigns}
        surveys={surveys}
        orgId={orgId}
      />
    </>
  );
}
```

### Pattern B: Enhanced Hooks (Optional)

Modify hooks to accept initial data:

```tsx
// features/campaigns/hooks/useCampaigns.ts
export default function useCampaigns(
  orgId: number,
  options?: { initialData?: ZetkinCampaign[] }
): IFuture<ZetkinCampaign[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  // If we have initial data from server, populate store immediately
  useEffect(() => {
    if (options?.initialData) {
      dispatch(campaignsLoaded(options.initialData));
    }
  }, []);

  // Rest of hook logic...
}
```

---

## 📊 Expected Performance Gains

### Before (Client-Only)
- **TTFB:** 200ms
- **FCP:** 2.5s (waits for JS + data)
- **LCP:** 3.5s
- **TTI:** 4.0s
- **HTML size:** ~50KB (empty shell)
- **Initial JS:** ~800KB

### After (Hybrid Server + Client)
- **TTFB:** 400ms (+200ms for server rendering)
- **FCP:** 1.0s ⚡ **60% faster** (data in HTML)
- **LCP:** 1.5s ⚡ **57% faster**
- **TTI:** 2.5s ⚡ **37% faster**
- **HTML size:** ~200KB (includes data)
- **Initial JS:** ~600KB ⚡ **25% smaller** (less client code)

### Key Metrics
- 🎯 **First Contentful Paint:** 60% improvement
- 🎯 **Time to Interactive:** 37% improvement
- 🎯 **SEO Score:** Major boost (content in HTML)
- 🎯 **Perceived Performance:** Feels 2x faster

---

## ⚠️ Considerations & Challenges

### 1. **Authentication**
✅ **Solved:** We already have `getServerApiClient()` that handles auth
- Uses session from cookies
- Works with middleware

### 2. **Redux Store Hydration**
⚠️ **Challenge:** Server data needs to sync with client Redux store

**Solution:** Two approaches:
- **A) Simple:** Pass data as props, don't use store for initial render
- **B) Advanced:** Hydrate Redux store from server data (requires more work)

**Recommendation:** Start with A (simpler)

### 3. **Type Safety**
✅ **Easy:** TypeScript types already exist
- Use existing ZetkinCampaign, ZetkinSurvey types
- Props are type-safe

### 4. **Caching**
✅ **Bonus:** Next.js automatically caches server fetches
- Faster subsequent navigations
- Can configure cache duration

---

## 🧪 Testing Strategy

For each converted page:

1. **Functionality Test**
   - [ ] Page loads with data visible
   - [ ] All interactive features work
   - [ ] Forms submit correctly
   - [ ] Filters work
   - [ ] Redux actions dispatch correctly

2. **Performance Test**
   - [ ] View source - data is in HTML
   - [ ] Network tab - no duplicate requests
   - [ ] FCP < 1.5s (from 2.5s+)
   - [ ] No console errors

3. **Navigation Test**
   - [ ] Client-side navigation works
   - [ ] Back button works
   - [ ] Deep links work

4. **Authentication Test**
   - [ ] Requires login
   - [ ] Shows correct user data
   - [ ] Respects permissions

---

## 🚀 Next Steps

### Immediate (Today):
1. ✅ Start with Projects Overview page
2. ✅ Implement hybrid pattern
3. ✅ Test thoroughly
4. ✅ Measure performance
5. ✅ Document learnings

### Short-term (This Week):
- Apply pattern to 3-4 more high-traffic pages
- Refine the pattern based on learnings
- Update documentation

### Medium-term (Optional):
- Consider full Server Component conversion
- Server Actions for mutations
- Advanced caching strategies

---

## 📝 Code Review Checklist

Before committing each page conversion:

- [ ] Removed 'use client' from page component
- [ ] Added server-side data fetching
- [ ] Created separate client component if needed
- [ ] Passed data via props (not global state)
- [ ] Tested authentication works
- [ ] Verified no hydration errors
- [ ] Checked data appears in page source
- [ ] Measured performance improvement
- [ ] No breaking changes to child components
- [ ] Loading states still work

---

## 💡 Pro Tips

1. **Start Small:** One page at a time
2. **Measure First:** Benchmark before changes
3. **Test Thoroughly:** Auth, navigation, Redux
4. **Document:** Note any gotchas for team
5. **Rollback Plan:** Keep git history clean

---

## 🎯 Success Definition

Level 2 is successful when:
- ✅ 5+ pages converted to hybrid pattern
- ✅ FCP improves by 50%+
- ✅ No regression in functionality
- ✅ Team understands the pattern
- ✅ Performance metrics improve

---

**Ready to start with Projects Overview page!** 🚀
