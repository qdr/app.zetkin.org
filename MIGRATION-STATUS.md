# Migration Testing Status

## ✅ Completed Setup

### 1. Fixed Migration Issues (3 issues)
All previously discovered issues have been fixed and pushed:

1. **Survey Page Map Error** (`src/features/surveys/components/SubmissionChartCard.tsx`)
   - Added defensive checks for undefined data structure
   - Prevents "Cannot read properties of undefined (reading 'map')" error

2. **Hydration Error** (`src/core/env/ClientContext.tsx`)
   - Removed Suspense wrapper that interfered with Emotion styles
   - Fixes hydration mismatch on events and viewmail pages

3. **Leaflet Map Initialization** (`src/features/areaAssignments/components/OrganizerMap.tsx`)
   - Added unique key and proper cleanup
   - Prevents "Map container is already initialized" error

### 2. Created Comprehensive Test Suite

**Migration Error Checker** - Playwright test that systematically tests ALL pages:
- **Location:** `integrationTesting/tests/migration-checker.spec.ts`
- **Routes tested:** 76 total
  - 18 App Router routes (migrated)
  - 58 Pages Router routes (remaining)
- **Error detection:**
  - 🔥 Hydration errors
  - ⚠️ Console errors
  - 🌐 Network errors (404s, 500s)
  - 💥 Unhandled exceptions

**Documentation:**
- Full usage guide: `docs/MIGRATION-TESTING.md`
- Route discovery script: `scripts/discover-routes.ts`

**NPM Scripts:**
- `yarn playwright:migration` - Run migration tests (no build required)
- `yarn discover-routes` - Discover all application routes

### 3. Fixed Playwright Configuration
- Updated migration test script to skip build step
- Tests run against dev server (not production build)
- Avoids isomorphic-dompurify/canvas build errors

## 📊 Current Coverage

The test suite covers **100% of your application** (76 pages):

### App Router (18 routes - Migrated ✅)
- `/call/*` - Call assignments
- `/canvass/*` - Canvass assignments
- `/my/*` - My pages (home, settings, feed)
- `/o/[orgId]/*` - Public org pages (events, projects, surveys, emails, unsubscribe)

### Pages Router (58 routes - Remaining)
- `/` - Home and utility pages
- `/organize/[orgId]/geography` - Geography
- `/organize/[orgId]/journeys/*` - Journey management (7 routes)
- `/organize/[orgId]/people/*` - People management (13 routes)
- `/organize/[orgId]/projects/*` - Projects (37 routes)
  - Activities, calendar, archive
  - Events, tasks, emails, surveys
  - Area assignments, call assignments
- `/organize/[orgId]/settings` - Settings
- `/organize/[orgId]/tags` - Tags
- `/organize/[orgId]/suborgOverview` - Sub-org overview

## 🚀 Next Steps: Run the Tests

### Requirements
The **dev server must be running** before running tests.

### Steps to Run

```bash
# Terminal 1: Start dev server
yarn devserver

# Terminal 2: Run migration tests (in a new terminal)
yarn playwright:migration
```

### What to Expect

The tests will:
1. Visit all 76 pages sequentially
2. Log errors found on each page in real-time
3. Generate a summary at the end
4. Create detailed JSON report: `integrationTesting/migration-error-report.json`

**Example output:**
```
✅ My home [app] (/my/home) - No errors
❌ Survey detail [pages] (/organize/1/projects/147/surveys/1):
  🔥 Hydration Errors:
    - Hydration failed because...
  ⚠️  Console Errors:
    - TypeError: Cannot read...

📊 MIGRATION ERROR SUMMARY
========================================
Total pages tested: 76
Pages with errors: 12
Pages with hydration errors: 3
```

### After Running Tests

1. **Review console output** for immediate issues
2. **Check JSON report** for detailed error information:
   ```bash
   cat integrationTesting/migration-error-report.json | jq
   ```
3. **Fix errors** starting with hydration errors (most critical)
4. **Re-run tests** to verify fixes

## 📝 All Changes Pushed

All work has been committed and pushed to branch:
`claude/test-pages-app-migration-01J3Mr6rPLXMLFNja3g798Ky`

**Commits:**
1. Fix: Survey chart undefined map error
2. Fix: Hydration error from Suspense wrapper
3. Fix: Leaflet map re-initialization error
4. Add: Comprehensive Playwright migration testing suite
5. Update: Add all 76 routes to migration test suite
6. Fix: Skip build for migration tests

## 🔍 Dev Server Status

**Current Status:** ❌ Not running

The dev server needs to be started before running tests:
```bash
yarn devserver
```

Once the server is up, run:
```bash
yarn playwright:migration
```

## 💡 Tips

1. **Start with critical pages**: If tests take too long, comment out some routes in the test file
2. **Run incrementally**: Fix a few errors, re-run tests, repeat
3. **Prioritize hydration errors**: These indicate SSR/client mismatches
4. **Use browser dev tools**: When tests fail, manually visit the page to debug
5. **Check network tab**: 404s often indicate missing route handlers

## 📚 Documentation

- **Migration testing guide:** `docs/MIGRATION-TESTING.md`
- **Test file:** `integrationTesting/tests/migration-checker.spec.ts`
- **Route discovery:** `scripts/discover-routes.ts`

---

Ready to test! Start the dev server and run `yarn playwright:migration` to begin systematic testing of all 76 pages. 🎯
