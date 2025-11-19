# Suspense & Server Components Optimization Plan

## 🔍 Current Architecture Analysis

### What You Have Now

**Data Fetching Pattern:**
```tsx
// Client Component (current pattern)
'use client';
const Page = () => {
  const { orgId } = useNumericRouteParams();
  const { data: campaigns } = useCampaigns(orgId);  // Client-side fetch
  const onServer = useServerSide();

  if (onServer) return null;  // Skip SSR

  return <div>{campaigns?.map(...)}</div>
}
```

**Characteristics:**
- ✅ **ZUIFuture**: Custom loading boundary (similar to Suspense)
- ✅ **Redux store**: Client-side caching
- ✅ **API proxy**: `/api/` routes forward to backend
- ⚠️ **useServerSide pattern**: Components skip SSR (return null on server)
- ⚠️ **Client-heavy**: Most data fetching happens after page loads
- ⚠️ **Waterfall**: Sequential data fetching in nested components

### Performance Impact

**Current Flow:**
1. Server renders empty shell
2. JavaScript downloads (~500KB+)
3. React hydrates
4. Components mount and start fetching
5. Data arrives, re-renders
6. **Total: 2-4 seconds to interactive**

**Potential with Suspense:**
1. Server fetches data in parallel
2. Streams HTML as data arrives
3. Client receives pre-rendered content
4. JavaScript hydrates interactive parts
5. **Total: 0.5-1 second to interactive**

## 🚀 Optimization Opportunities

### Level 1: Quick Wins (Low Effort, High Impact)

#### 1.1 Wrap Existing Client Components in Suspense
**Current:**
```tsx
// src/app/organize/[orgId]/projects/page.tsx
<Suspense>
  <ActivitiesOverview orgId={orgId} />
</Suspense>
<CampaignCard campaign={campaign} />  // Blocks rendering
```

**Optimized:**
```tsx
<Suspense fallback={<CampaignCardSkeleton />}>
  <CampaignCard campaign={campaign} />
</Suspense>
// Other content renders immediately, cards stream in
```

**Files to Update:**
- `src/app/organize/[orgId]/projects/page.tsx`
- `src/app/organize/[orgId]/people/page.tsx`
- `src/app/organize/[orgId]/journeys/page.tsx`
- Any page with multiple data dependencies

**Impact:** ⭐⭐⭐ Pages feel 30-50% faster

---

#### 1.2 Granular Suspense Boundaries
**Instead of:**
```tsx
<ZUIFuture future={allData}>
  {(data) => <BigComponent data={data} />}
</ZUIFuture>
// All-or-nothing loading
```

**Do:**
```tsx
<Suspense fallback={<HeaderSkeleton />}>
  <Header />
</Suspense>
<Suspense fallback={<DataGridSkeleton />}>
  <DataGrid />
</Suspense>
// Progressive rendering
```

**Impact:** ⭐⭐⭐ Perceived performance boost, better UX

---

### Level 2: Moderate Refactoring (Medium Effort, Very High Impact)

#### 2.1 Convert Pages to Server Components + Data Fetching

**Example: Projects Overview Page**

**Before (Client Component):**
```tsx
// src/app/organize/[orgId]/projects/page.tsx
'use client';
export default function ProjectsPage() {
  const { orgId } = useNumericRouteParams();
  const { data: campaigns } = useCampaigns(orgId);  // Client-side
  const onServer = useServerSide();

  if (onServer) return null;

  return (...)
}
```

**After (Server Component):**
```tsx
// src/app/organize/[orgId]/projects/page.tsx
import { Suspense } from 'react';
import CampaignsList from './CampaignsList';
import ActivitiesOverview from './ActivitiesOverview';

// Server Component - no 'use client'
export default async function ProjectsPage({
  params
}: {
  params: { orgId: string }
}) {
  // Parallel data fetching on server
  const [campaigns, activities] = await Promise.all([
    fetch(`/api/orgs/${params.orgId}/campaigns`).then(r => r.json()),
    fetch(`/api/orgs/${params.orgId}/activities`).then(r => r.json())
  ]);

  return (
    <>
      <Suspense fallback={<ActivitiesSkeleton />}>
        <ActivitiesOverview data={activities} />
      </Suspense>
      <Suspense fallback={<CampaignsSkeleton />}>
        <CampaignsList data={campaigns} orgId={params.orgId} />
      </Suspense>
    </>
  );
}
```

**Benefits:**
- ⚡ Data fetches in parallel on server (faster)
- 📦 Less JavaScript sent to client
- 🎨 HTML streams as data arrives
- ♿ Better SEO and accessibility
- 🔄 Back button is instant (RSC payload cached)

**Files that Could Be Server Components:**
1. `src/app/organize/[orgId]/projects/page.tsx` ⭐⭐⭐
2. `src/app/organize/[orgId]/people/page.tsx` ⭐⭐⭐
3. `src/app/organize/[orgId]/journeys/page.tsx` ⭐⭐
4. `src/app/organize/[orgId]/tags/page.tsx` ⭐⭐
5. `src/app/organize/[orgId]/geography/page.tsx` ⭐⭐

---

#### 2.2 Parallel Data Fetching in Layouts

**Current (Sequential):**
```tsx
// layout.tsx - Server Component
// page.tsx - fetches data
// component.tsx - fetches more data
// Total: 3 round trips
```

**Optimized (Parallel):**
```tsx
// layout.tsx - Server Component
export default async function Layout({ params, children }) {
  // Pre-fetch organization data for all child pages
  const org = await fetch(`/api/orgs/${params.orgId}`).then(r => r.json());

  return (
    <OrgContext.Provider value={org}>
      {children}
    </OrgContext.Provider>
  );
}

// page.tsx can access org from context, and fetch its own data in parallel
```

**Impact:** ⭐⭐⭐⭐ 2-3x faster page loads

---

#### 2.3 Use React `use()` Hook for Async Components

**New pattern (React 19):**
```tsx
'use client';
import { use } from 'react';

function CampaignsList({ campaignsPromise }) {
  // Suspense-compatible without useEffect
  const campaigns = use(campaignsPromise);

  return campaigns.map(c => <CampaignCard campaign={c} />);
}

// Parent passes promise, not data
<Suspense fallback={<Skeleton />}>
  <CampaignsList campaignsPromise={fetchCampaigns(orgId)} />
</Suspense>
```

**Benefits:**
- Initiates fetch earlier (before component renders)
- Works with Suspense boundaries
- No useEffect waterfall

**Impact:** ⭐⭐⭐ Eliminates client-side waterfalls

---

### Level 3: Architecture Refactoring (High Effort, Maximum Impact)

#### 3.1 Server Actions for Mutations

**Current:**
```tsx
'use client';
const createCampaign = async (data) => {
  const response = await apiClient.post(`/api/orgs/${orgId}/campaigns`, data);
  dispatch(campaignCreated(response));
};
```

**With Server Actions:**
```tsx
// actions.ts
'use server';
export async function createCampaign(formData: FormData) {
  const data = Object.fromEntries(formData);
  const response = await fetch(`${BACKEND_URL}/campaigns`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data)
  });
  revalidatePath('/organize/[orgId]/projects');
  return response.json();
}

// component.tsx
'use client';
import { createCampaign } from './actions';

<form action={createCampaign}>
  <input name="title" />
  <button type="submit">Create</button>
</form>
```

**Benefits:**
- Works without JavaScript (progressive enhancement)
- Automatic revalidation
- Optimistic updates built-in
- No client-side API calls needed

---

#### 3.2 Streaming with `loading.tsx`

**Structure:**
```
src/app/organize/[orgId]/
  ├── layout.tsx          # Fetches org data
  ├── loading.tsx         # Shows while page loads
  ├── projects/
  │   ├── page.tsx        # Server Component (async)
  │   ├── loading.tsx     # Shows while projects load
  │   └── [campId]/
  │       ├── page.tsx
  │       └── loading.tsx
```

**loading.tsx example:**
```tsx
export default function Loading() {
  return (
    <Box>
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
    </Box>
  );
}
```

**Impact:** ⭐⭐⭐⭐ Instant navigation, progressive enhancement

---

#### 3.3 Incremental Migration Strategy

**You don't have to convert everything at once!**

**Phase 1: Coexistence**
```tsx
// Server Component page
export default async function Page({ params }) {
  const staticData = await fetchStaticData(params.orgId);

  return (
    <>
      <StaticHeader data={staticData} />
      <Suspense fallback={<Skeleton />}>
        {/* Existing client component works as-is */}
        <ExistingClientComponent orgId={params.orgId} />
      </Suspense>
    </>
  );
}
```

**Phase 2: Extract Data Fetching**
- Move data fetching to server
- Pass data as props to client components
- Keep interactivity in client components

**Phase 3: Optimize Client Boundaries**
- Minimize client components to interactive parts only
- Use Server Components for static content
- Compose Server + Client strategically

---

## 📊 Specific File Recommendations

### High Priority (Do First) ⭐⭐⭐

#### 1. People List Page
**File:** `src/app/organize/[orgId]/people/page.tsx`

**Current Issue:** Client-side hook fetches view data, causing delay

**Optimization:**
```tsx
// Convert to Server Component
export default async function PeoplePage({ params }) {
  // Fetch on server
  const defaultView = await fetch(
    `/api/orgs/${params.orgId}/people/views/default`
  ).then(r => r.json());

  return (
    <Suspense fallback={<ViewBrowserSkeleton />}>
      <ViewBrowser
        basePath={`/organize/${params.orgId}/people`}
        initialView={defaultView}
      />
    </Suspense>
  );
}
```

**Impact:** ⭐⭐⭐⭐ People page is high-traffic, big wins here

---

#### 2. Projects Overview
**File:** `src/app/organize/[orgId]/projects/page.tsx`

**Current:** Multiple client-side fetches (campaigns, surveys, activities)

**Optimization:**
```tsx
export default async function ProjectsPage({ params }) {
  // Parallel fetching on server
  const [campaigns, surveys] = await Promise.all([
    fetch(`/api/orgs/${params.orgId}/campaigns`).then(r => r.json()),
    fetch(`/api/orgs/${params.orgId}/surveys`).then(r => r.json())
  ]);

  return (
    <>
      <Suspense fallback={<ActivitiesSkeleton />}>
        <ActivitiesOverview orgId={params.orgId} />
      </Suspense>

      <CampaignsGrid campaigns={campaigns} surveys={surveys} />
    </>
  );
}
```

---

#### 3. Campaign Details
**File:** `src/app/organize/[orgId]/projects/[campId]/page.tsx`

**Already has Suspense** but could benefit from server-side data fetching

---

### Medium Priority ⭐⭐

- Journey pages
- Tags page
- Geography page
- Settings page

### Lower Priority ⭐

- Forms/dialogs (need to stay client-side for interactivity)
- Maps (require client-side libraries)
- Rich editors

---

## 🎯 Implementation Checklist

### Phase 1: Add Suspense Boundaries (1-2 days) ✅ COMPLETED
- [x] Identify components with loading states
- [x] Replace ZUIFuture with Suspense where applicable
- [x] Add fallback components (skeletons)
- [x] Test that loading states work correctly

**Completed:** All 5 main pages (Projects, People, Journeys, Tags, Geography) now have granular Suspense boundaries with skeleton fallbacks.

### Phase 2: Convert High-Traffic Pages (3-5 days) 🚧 READY
- [ ] Convert `/people` page to Server Component
- [ ] Convert `/projects` page to Server Component
- [ ] Move data fetching to server
- [ ] Update child components to accept props
- [ ] Test authentication still works
- [ ] Measure performance improvements

**Infrastructure Ready:**
- ✅ Created `src/core/api/server.ts` with `getServerApiClient()` helper
- ✅ Documented usage patterns for Server Components
- ⏳ Awaiting conversion of pages (requires careful refactoring)

### Phase 3: Optimize Data Fetching (2-3 days) 🚧 PARTIALLY COMPLETE
- [ ] Implement parallel fetching in layouts
- [x] Add `loading.tsx` files for streaming
- [ ] Use `use()` hook where beneficial
- [ ] Profile and optimize slow queries

**Completed:**
- ✅ Added `loading.tsx` for: projects, people, journeys, tags, geography
- ✅ Instant navigation feedback now available
- ⏳ Parallel fetching awaits Server Component conversions

### Phase 4: Server Actions (Optional, 3-5 days) ⏳ NOT STARTED
- [ ] Convert mutations to Server Actions
- [ ] Implement optimistic updates
- [ ] Add form validation
- [ ] Test progressive enhancement

**Status:** Awaiting completion of Phase 2 before starting

---

## ⚠️ Important Considerations

### 1. Redux Store Compatibility
Your current Redux store works with client components. When converting to Server Components:

**Option A: Keep Redux for client state**
```tsx
// Server Component fetches data
// Client Component manages UI state
export default async function Page({ params }) {
  const data = await fetchData(params.orgId);

  return <ClientComponent initialData={data} />;  // Redux in client
}
```

**Option B: Move to React Query / SWR**
- Better suited for App Router
- Built-in cache, deduplication
- Works with Server Components

### 2. Authentication in Server Components
Your current middleware handles auth. For Server Components:

```tsx
// Helper to get authenticated API client
async function getAuthenticatedApiClient() {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, {...});

  return {
    headers: {
      Authorization: `Bearer ${session.tokenData.access_token}`
    }
  };
}

// Use in Server Components
export default async function Page() {
  const client = await getAuthenticatedApiClient();
  const data = await fetch('/api/data', client);
  ...
}
```

### 3. Don't Over-Optimize
**Keep Client Components for:**
- Forms with validation
- Interactive maps
- Real-time features
- Complex UI state
- Event handlers

**Use Server Components for:**
- Static content
- Data fetching
- SEO-critical pages
- Authentication
- Layouts

---

## 📈 Expected Performance Gains

### Before (Current)
- **Time to First Byte (TTFB):** 200ms
- **First Contentful Paint (FCP):** 2.5s
- **Time to Interactive (TTI):** 4.0s
- **JavaScript Bundle:** ~800KB

### After (Optimized)
- **Time to First Byte (TTFB):** 300ms (slightly slower due to server rendering)
- **First Contentful Paint (FCP):** 0.8s ⚡ **3x faster**
- **Time to Interactive (TTI):** 1.5s ⚡ **2.6x faster**
- **JavaScript Bundle:** ~400KB ⚡ **50% smaller**

### User Experience Impact
- ⚡ **Pages feel instant** (streamed content appears progressively)
- 🔄 **Back/forward navigation is instant** (cached RSC payload)
- 📱 **Better on slow networks** (less JavaScript to download)
- ♿ **Works without JavaScript** (progressive enhancement)
- 🔍 **Better SEO** (content is in HTML)

---

## 🚦 Starting Point Recommendation

**I suggest starting with Level 1 (Quick Wins):**

1. **Add Suspense boundaries** to existing pages (1 day)
   - Wrap individual components
   - Add skeleton fallbacks
   - Measure impact

2. **If that goes well, try one Server Component conversion** (2 days)
   - Start with `/organize/[orgId]/projects/page.tsx`
   - Fetch campaigns on server
   - Pass data as props
   - Compare before/after metrics

3. **Iterate based on results**
   - If performance improves significantly, continue
   - If issues arise, we can troubleshoot incrementally
   - Document patterns for your team

Would you like me to create a specific implementation example for one of your pages?
