# Pages Router → App Router Migration Battle Plan
## Complete /organize/ Section Migration

**Total Pages to Migrate:** 53 pages
**Estimated Time:** 6-8 hours (with this plan)
**Target:** Re-enable Turbopack after migration

---

## 🎯 Phase 0: Pre-Migration Setup (30 mins)

### Create Migration Branch
```bash
git checkout -b migrate-organize-to-app-router
git push -u origin migrate-organize-to-app-router
```

### Backup Current State
```bash
# Create a backup of the pages directory
cp -r src/pages/organize src/pages/organize.backup
```

### Create Helper Files

**File 1: `src/app/organize/auth.ts`** (Replacement for scaffold pattern)
```typescript
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinUser } from 'utils/types/zetkin';

export async function requireAuth(requiredLevel: number = 2) {
  const headersList = await headers();
  const headersObject = Object.fromEntries(headersList.entries());
  const apiClient = new BackendApiClient(headersObject);

  let user: ZetkinUser | null;
  try {
    user = await apiClient.get<ZetkinUser>('/api/users/me');
  } catch (e) {
    // Not authenticated - redirect to login
    const path = headersList.get('x-requested-path') || '/organize';
    redirect(`/login?level=${requiredLevel}&redirect=${path}`);
  }

  return { user, apiClient, headersList };
}

export async function getOrgAccess(apiClient: BackendApiClient, orgId: string) {
  // Check if user has access to this org
  const memberships = await apiClient.get('/api/users/me/memberships');
  const hasAccess = memberships.some((m: any) => m.organization.id === parseInt(orgId));

  if (!hasAccess) {
    throw new Error('No access to organization');
  }

  return true;
}
```

**File 2: `scripts/migrate-page.sh`** (Automation helper)
```bash
#!/bin/bash
# Usage: ./scripts/migrate-page.sh src/pages/organize/[orgId]/projects/index.tsx

OLD_PATH="$1"
NEW_PATH="${OLD_PATH/pages/app}"
NEW_PATH="${NEW_PATH/index.tsx/page.tsx}"

echo "Migrating: $OLD_PATH"
echo "       to: $NEW_PATH"

# Create directory structure
mkdir -p "$(dirname "$NEW_PATH")"

# Copy file
cp "$OLD_PATH" "$NEW_PATH"

echo "✓ File created at: $NEW_PATH"
echo "  Next steps:"
echo "  1. Replace getServerSideProps with async function"
echo "  2. Add 'await params' for route parameters"
echo "  3. Replace scaffold with requireAuth()"
echo "  4. Test the route"
```

---

## 🚀 Phase 1: Simple Pages First (1-2 hours)

**Strategy:** Start with pages that have minimal complexity

### Priority 1a: Settings & Overview (30 mins)
```
✓ /organize/index.tsx                        → Simple redirect page
✓ /organize/[orgId]/settings/index.tsx       → Simple form page
✓ /organize/[orgId]/suborgOverview/index.tsx → Simple list page
```

**Migration Pattern:**
```typescript
// BEFORE (Pages Router)
export const getServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params;
  const apiClient = new BackendApiClient(ctx.req.headers);
  const org = await apiClient.get(`/api/orgs/${orgId}`);
  return { props: { org } };
}, { authLevelRequired: 2 });

// AFTER (App Router)
export default async function Page({ params }: { params: { orgId: string } }) {
  const { orgId } = await params;
  const { apiClient } = await requireAuth(2);
  await getOrgAccess(apiClient, orgId);

  const org = await apiClient.get(`/api/orgs/${orgId}`);

  return <SettingsPageClient org={org} />;
}
```

### Priority 1b: Projects Overview (30 mins)
```
✓ /organize/[orgId]/projects/index.tsx       → Campaign list
✓ /organize/[orgId]/projects/archive/index.tsx
✓ /organize/[orgId]/projects/activities/index.tsx
✓ /organize/[orgId]/projects/calendar/index.tsx
```

### Testing Checkpoint 1
```bash
# Test these routes work:
- /organize/1/settings
- /organize/1/projects
- /organize/1/projects/archive
```

---

## 🏃 Phase 2: Medium Complexity Pages (2-3 hours)

### Priority 2a: Single Campaign Pages (1 hour)
```
✓ /organize/[orgId]/projects/[campId]/index.tsx
✓ /organize/[orgId]/projects/[campId]/calendar/index.tsx
✓ /organize/[orgId]/projects/[campId]/activities/index.tsx
✓ /organize/[orgId]/projects/[campId]/archive/index.tsx
```

**Key Change:** Nested params
```typescript
const { orgId, campId } = await params;
```

### Priority 2b: Events & Tasks (1 hour)
```
✓ /organize/[orgId]/projects/[campId]/events/index.tsx
✓ /organize/[orgId]/projects/[campId]/events/[eventId]/index.tsx
✓ /organize/[orgId]/projects/[campId]/events/[eventId]/participants.tsx
✓ /organize/[orgId]/projects/[campId]/tasks/index.tsx
✓ /organize/[orgId]/projects/[campId]/tasks/[taskId]/index.tsx
✓ /organize/[orgId]/projects/[campId]/tasks/[taskId]/assignees.tsx
✓ /organize/[orgId]/projects/[campId]/tasks/[taskId]/insights.tsx
```

### Priority 2c: Emails & Surveys (1 hour)
```
✓ /organize/[orgId]/projects/[campId]/emails/index.tsx
✓ /organize/[orgId]/projects/[campId]/emails/[emailId]/index.tsx
✓ /organize/[orgId]/projects/[campId]/emails/[emailId]/compose/index.tsx
✓ /organize/[orgId]/projects/[campId]/emails/[emailId]/insights.tsx
✓ /organize/[orgId]/projects/[campId]/surveys/[surveyId]/index.tsx
✓ /organize/[orgId]/projects/[campId]/surveys/[surveyId]/questions.tsx
✓ /organize/[orgId]/projects/[campId]/surveys/[surveyId]/submissions.tsx
```

### Testing Checkpoint 2
```bash
# Test complex nested routes:
- /organize/1/projects/123
- /organize/1/projects/123/events
- /organize/1/projects/123/emails/456
```

---

## 🔥 Phase 3: Complex Pages (2-3 hours)

### Priority 3a: People Section (1.5 hours)
**⚠️ Most complex - DataGrid Pro heavy**
```
✓ /organize/[orgId]/people/index.tsx
✓ /organize/[orgId]/people/lists/[viewId]/index.tsx
✓ /organize/[orgId]/people/lists/[viewId]/shared.tsx
✓ /organize/[orgId]/people/lists/callblocked.tsx
✓ /organize/[orgId]/people/[personId]/index.tsx
✓ /organize/[orgId]/people/[personId]/manage/index.tsx
✓ /organize/[orgId]/people/duplicates/index.tsx
✓ /organize/[orgId]/people/folders/[folderId].tsx
✓ /organize/[orgId]/people/incoming/index.tsx
✓ /organize/[orgId]/people/joinforms/index.tsx
```

**Special Consideration:** These pages use MUI DataGrid Pro extensively
- Test with real data
- Check performance
- Verify filtering/sorting works

### Priority 3b: Call Assignments (45 mins)
```
✓ /organize/[orgId]/projects/[campId]/callassignments/[callAssId]/index.tsx
✓ /organize/[orgId]/projects/[campId]/callassignments/[callAssId]/callers.tsx
✓ /organize/[orgId]/projects/[campId]/callassignments/[callAssId]/conversation.tsx
```

### Priority 3c: Area Assignments (45 mins)
```
✓ /organize/[orgId]/projects/[campId]/areaassignments/[areaAssId]/index.tsx
✓ /organize/[orgId]/projects/[campId]/areaassignments/[areaAssId]/instructions.tsx
✓ /organize/[orgId]/projects/[campId]/areaassignments/[areaAssId]/map.tsx
✓ /organize/[orgId]/projects/[campId]/areaassignments/[areaAssId]/report.tsx
```

### Priority 3d: Journeys (45 mins)
```
✓ /organize/[orgId]/journeys/index.tsx
✓ /organize/[orgId]/journeys/[journeyId]/index.tsx
✓ /organize/[orgId]/journeys/[journeyId]/new.tsx
✓ /organize/[orgId]/journeys/[journeyId]/closed.tsx
✓ /organize/[orgId]/journeys/[journeyId]/[instanceId]/index.tsx
✓ /organize/[orgId]/journeys/[journeyId]/[instanceId]/milestones/index.tsx
```

### Priority 3e: Remaining (30 mins)
```
✓ /organize/[orgId]/tags/index.tsx
✓ /organize/[orgId]/geography/index.tsx
✓ /organize/[orgId]/projects/shared/* (3 files)
```

### Testing Checkpoint 3
```bash
# Full smoke test of all sections:
- People list loading
- DataGrid filtering/sorting
- Call assignments
- Area assignments
- Journeys
```

---

## 🧹 Phase 4: Cleanup & Optimization (1 hour)

### Remove Old Pages Router Files
```bash
# Once everything is verified working:
rm -rf src/pages/organize
rm -rf src/pages/organize.backup  # If tests pass
```

### Re-enable Turbopack
```json
// package.json
"devserver": "cross-env NODE_OPTIONS='--inspect' next dev -p 3000 --turbo"
```

### Update Redirects
```javascript
// next.config.js - Remove Pages Router redirects that are now handled by App Router
// Keep only the redirects that actually redirect to different URLs
```

### Create Layouts (Optional but recommended)
```typescript
// src/app/organize/[orgId]/layout.tsx
export default async function OrganizeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgId: string };
}) {
  const { orgId } = await params;
  const { apiClient, user } = await requireAuth(2);

  // Pre-fetch org data for all child routes
  const org = await apiClient.get(`/api/orgs/${orgId}`);

  return (
    <OrganizeLayoutClient org={org} user={user}>
      {children}
    </OrganizeLayoutClient>
  );
}
```

---

## 📋 Common Migration Patterns

### Pattern 1: Basic Page
```typescript
// BEFORE
export const getServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params;
  return { props: {} };
}, { authLevelRequired: 2 });

// AFTER
export default async function Page({ params }: PageProps) {
  const { orgId } = await params;
  await requireAuth(2);
  return <YourComponent />;
}
```

### Pattern 2: Page with Data Fetching
```typescript
// BEFORE
export const getServerSideProps = scaffold(async (ctx) => {
  const apiClient = new BackendApiClient(ctx.req.headers);
  const data = await apiClient.get('/api/data');
  return { props: { data } };
}, { authLevelRequired: 2 });

// AFTER
export default async function Page() {
  const { apiClient } = await requireAuth(2);
  const data = await apiClient.get('/api/data');
  return <YourPageClient data={data} />;
}
```

### Pattern 3: Client Component Wrapper
```typescript
// Create Client Component (e.g., YourPageClient.tsx)
'use client';

export default function YourPageClient({ data }: Props) {
  // All your existing component logic
  return <YourExistingComponent />;
}
```

---

## ⚠️ Common Pitfalls & Solutions

### Pitfall 1: Hooks in Server Components
**Error:** `createContext only works in Client Components`
**Solution:** Add `'use client'` to the file

### Pitfall 2: Direct params Access
**Error:** `params is a Promise`
**Solution:** `const { orgId } = await params;`

### Pitfall 3: Forgot to await headers()
**Error:** `headers().get is not a function`
**Solution:** `const headersList = await headers();`

### Pitfall 4: Redux in Server Components
**Error:** `useDispatch is not a function`
**Solution:** Use Client Component wrapper with `WithInitialData` pattern

### Pitfall 5: next/router in App Router
**Error:** `useRouter is not defined`
**Solution:** Import from `next/navigation` instead: `import { useRouter } from 'next/navigation'`

---

## 🧪 Testing Strategy

### During Migration
- [ ] Test each section after completing it
- [ ] Check authentication still works
- [ ] Verify data loads correctly
- [ ] Check DataGrid functionality (sorting, filtering)

### Before Enabling Turbopack
- [ ] Full smoke test of all /organize routes
- [ ] Test with real user accounts
- [ ] Verify no console errors
- [ ] Check network requests are correct

### After Enabling Turbopack
- [ ] Clear all caches: `rm -rf .next .turbo node_modules/.cache`
- [ ] Restart dev server
- [ ] Re-test all main routes
- [ ] Verify faster compilation times

---

## 🔄 Rollback Plan

If something goes wrong:

```bash
# Option 1: Revert specific file
git checkout src/app/organize/[orgId]/some-page/page.tsx

# Option 2: Revert entire migration
git checkout main -- src/pages/organize
rm -rf src/app/organize

# Option 3: Revert branch entirely
git checkout main
git branch -D migrate-organize-to-app-router
```

---

## 📊 Progress Tracking

Use this checklist during migration:

**Phase 1: Simple Pages (Target: 2 hours)**
- [ ] organize/index.tsx
- [ ] settings/index.tsx
- [ ] suborgOverview/index.tsx
- [ ] projects/index.tsx
- [ ] projects/archive/index.tsx
- [ ] projects/activities/index.tsx
- [ ] projects/calendar/index.tsx

**Phase 2: Medium Complexity (Target: 3 hours)**
- [ ] projects/[campId]/index.tsx
- [ ] Events section (4 files)
- [ ] Tasks section (4 files)
- [ ] Emails section (4 files)
- [ ] Surveys section (3 files)

**Phase 3: Complex Pages (Target: 3 hours)**
- [ ] People section (10 files) ⚠️ TEST THOROUGHLY
- [ ] Call assignments (3 files)
- [ ] Area assignments (4 files)
- [ ] Journeys (6 files)
- [ ] Tags, Geography, Shared (5 files)

**Phase 4: Cleanup (Target: 1 hour)**
- [ ] Remove old pages
- [ ] Enable Turbopack
- [ ] Update redirects
- [ ] Final smoke test

---

## 🎯 Success Criteria

✅ All 53 pages migrated
✅ Authentication works
✅ Data loads correctly
✅ DataGrid Pro functions properly
✅ Turbopack enabled
✅ Dev server faster
✅ No console errors
✅ All tests pass

---

## 💡 Pro Tips

1. **Work in small batches** - Migrate 3-5 pages, test, commit
2. **Commit frequently** - Every successful section
3. **Test as you go** - Don't wait until the end
4. **Use the helper script** - Automates file creation
5. **Keep Pages Router as reference** - Don't delete until 100% sure
6. **Take breaks** - This is a marathon, not a sprint

---

## 📞 Emergency Contacts (Claude)

If you get stuck:
- "Claude, I'm getting error X on page Y"
- "Claude, how do I convert this scaffold pattern?"
- "Claude, DataGrid isn't working after migration"

Good luck! 🚀
