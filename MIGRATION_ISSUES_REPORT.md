# App Router Migration - Issues Requiring User Decisions

This document outlines all the migration issues that require your decision or input to resolve.

## Summary of Work Completed

✅ **Completed:**
- Migrated 39 files from `next/router` to `next/navigation`
- Updated 7 layout files with proper App Router hooks
- Migrated 26+ component files across features
- Replaced router.query with useParams()
- Replaced router.pathname with usePathname()
- Updated navigation methods (push, replace, back)
- All changes committed to branch

---

## Critical Issues Requiring Decisions

### 1. Six Page Stubs with Missing Components

**Issue:** These pages were partially migrated and now have undefined component references.

**Affected Files:**
1. `/src/app/organize/[orgId]/projects/[campId]/events/page.tsx`
2. `/src/app/organize/[orgId]/projects/[campId]/emails/page.tsx`
3. `/src/app/organize/[orgId]/projects/[campId]/emails/[emailId]/compose/page.tsx`
4. `/src/app/organize/[orgId]/projects/calendar/page.tsx`
5. `/src/app/organize/[orgId]/people/lists/[viewId]/page.tsx`
6. `/src/app/organize/[orgId]/people/[personId]/manage/page.tsx`

**Current State:**
```tsx
export const metadata = {
  title: 'getServerSideProps - Zetkin',  // ❌ Wrong title
};

export default async function getServerSideProps({  // ❌ Wrong function name
  params,
}: {
  params: { orgId: string };
}) {
  return <getServerSidePropsClient {...params} />;  // ❌ Undefined component
}
```

**What's Needed:**
- Determine what each page should display
- Implement proper page components
- Fix metadata titles to match page content
- Rename functions appropriately

**Options:**
1. Complete the migration by implementing the missing functionality
2. Remove these pages if they're not needed
3. Copy implementations from the old Pages Router if they still exist

---

### 2. Broken CampaignSummaryPage Export

**File:** `/src/app/organize/[orgId]/projects/[campId]/page.tsx`

**Issue:** The file has 'use client' directive and imports but exports an undefined component:
```tsx
'use client';

import { Box, Grid, Typography } from '@mui/material';
import { Suspense } from 'react';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import BackendApiClient from 'core/api/client/BackendApiClient';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import useCampaign from 'features/campaigns/hooks/useCampaign';
import { useParams } from 'next/navigation';
import useServerSide from 'core/useServerSide';
import { ZetkinCampaign } from 'utils/types/zetkin';

export default CampaignSummaryPage;  // ❌ Component is never defined
```

**What's Needed:**
- Implement the actual CampaignSummaryPage component
- Or determine what this page should display

---

### 3. Conflicting Routes in Pages Directory

**Issue:** These routes exist in both `/pages/organize` and `/app/organize`, causing conflicts.

**Affected Files:**
1. `/src/pages/organize/[orgId]/projects/[campId]/tasks/index.tsx`
2. `/src/pages/organize/[orgId]/projects/[campId]/tasks/[taskId]/index.tsx`
3. `/src/pages/organize/[orgId]/projects/[campId]/tasks/[taskId]/assignees.tsx`
4. `/src/pages/organize/[orgId]/projects/[campId]/tasks/[taskId]/insights.tsx`
5. `/src/pages/organize/[orgId]/projects/[campId]/calendar/tasks/[taskId]/index.ts`

**What's Needed:**
**Decision:** Should these pages be:
1. Migrated to App Router (`/app` directory)?
2. Deleted (if already migrated)?
3. Kept temporarily for a phased migration?

**Recommendation:** These should likely be deleted if equivalent App Router pages exist, or migrated if they don't.

---

### 4. API Routes Migration

**Issue:** 14 API routes still in `/src/pages/api` directory.

**Current Location:** `/src/pages/api/*`
**Target Location:** `/src/app/api/*` (for App Router)

**What's Needed:**
**Decision:** API routes migration strategy:
1. Migrate all 14 routes to `/app/api` now?
2. Migrate incrementally as needed?
3. Leave in `/pages/api` for now (they still work in App Router)?

**Note:** API routes in `/pages/api` continue to work even with App Router, so this isn't urgent unless you want full App Router adoption.

---

## Non-Critical Issues (Informational)

### 5. Hydration Workarounds (useServerSide)

**Files with useServerSide() workaround:** 14 files

These files use `useServerSide()` to return `null` on the server, preventing SSR:
- `/src/app/organize/[orgId]/people/duplicates/page.tsx`
- `/src/app/organize/[orgId]/people/lists/[viewId]/ViewDataTableClient.tsx`
- `/src/app/organize/[orgId]/projects/ProjectsClient.tsx`
- 11 other page files

**Current Pattern:**
```tsx
const onServer = useServerSide();
if (onServer) {
  return null;
}
```

**Why It Exists:** Prevents hydration mismatches between server and client rendering.

**Impact:** No server-side rendering for these components (CSR only).

**Future Consideration:** These could be refactored to support proper SSR once the migration is more stable, but they work fine for now.

---

### 6. Client/Server Component Boundaries

**Issue:** Some files have 'use client' but might benefit from being Server Components.

**Example:** Several simple layout pages have 'use client' but might not need it.

**Future Consideration:** Review and optimize client/server boundaries after core functionality is stable.

---

## Recommended Next Steps

### Immediate (Before Testing):
1. **Fix the 6 page stubs** - Decide what content they should show
2. **Fix CampaignSummaryPage** - Implement or remove
3. **Remove conflicting routes** - Delete old Pages Router routes if migrated

### Can Wait:
4. **API routes** - Migrate when convenient (they work as-is)
5. **Hydration workarounds** - Optimize later for better performance
6. **Component boundaries** - Optimize after everything works

---

## Questions for You

Please answer these questions so I can complete the migration:

1. **For the 6 page stubs:** What should these pages display? Should I:
   - Look for old implementations to port over?
   - Create new basic implementations?
   - Delete them entirely?

2. **For conflicting Pages Router routes:** Should I:
   - Delete all 5 conflicting routes in `/pages/organize`?
   - Migrate them to App Router first?

3. **For CampaignSummaryPage:** What should this page show?

4. **For API routes:** Should I:
   - Leave them in `/pages/api` (they work fine there)?
   - Migrate them to `/app/api` now?

Once you answer these, I can complete all remaining work!
