# Migration Testing Guide

This guide explains how to use the automated migration testing tools to systematically test the Pages Router to App Router migration.

## Tools Available

### 1. Route Discovery Script
Automatically discovers all routes in your application (both Pages and App Router).

**Location:** `scripts/discover-routes.ts`

**Usage:**
```bash
npx ts-node scripts/discover-routes.ts
```

**Output:**
- Console summary of all discovered routes
- `discovered-routes.json` - JSON file with all routes for programmatic use
- Suggested test routes with example IDs

### 2. Migration Error Checker (Playwright)
Automated test suite that visits pages and collects errors.

**Location:** `integrationTesting/tests/migration-checker.spec.ts`

**What it checks:**
- Console errors
- Hydration errors
- Network errors (404s, 500s)
- Unhandled exceptions

**Usage:**
```bash
# Run the migration checker
yarn playwright:migration

# Or run with Playwright UI
yarn playwright test --ui integrationTesting/tests/migration-checker.spec.ts
```

**Output:**
- Console logs with detailed error reports for each page
- `integrationTesting/migration-error-report.json` - Detailed JSON report

## Quick Start

### Step 1: Discover Routes
First, discover all routes in your application:

```bash
npx ts-node scripts/discover-routes.ts
```

This will show you:
- All Pages Router routes
- All App Router routes
- Which routes are static vs dynamic
- Suggested test routes with example IDs

### Step 2: Configure Test Routes
Edit `integrationTesting/tests/migration-checker.spec.ts` and update the `ROUTES_TO_TEST` array with:
- Routes you want to test
- Real IDs from your test database

Example:
```typescript
const ROUTES_TO_TEST = [
  { path: '/', description: 'Home page' },
  { path: '/o/1', description: 'Org home' },
  { path: '/o/1/events/123', description: 'Event detail' },
  // Add more routes...
];
```

### Step 3: Start Dev Server
Make sure your dev server is running:

```bash
yarn devserver
```

### Step 4: Run Migration Tests
Run the Playwright migration checker:

```bash
yarn playwright:migration
```

### Step 5: Review Results
Check the outputs:

1. **Console logs** - See real-time errors as tests run
2. **HTML Report** - Open `playwright-report/index.html` for visual results
3. **JSON Report** - Check `integrationTesting/migration-error-report.json` for programmatic access

## Understanding the Results

### Error Types

#### 🔥 Hydration Errors
```
Hydration failed because the server rendered HTML didn't match the client
```
**Common causes:**
- Client-side only code running during SSR
- Using `Date.now()`, `Math.random()`, or `new Date()` without memoization
- Inconsistent data between server and client

#### ⚠️ Console Errors
Any `console.error()` calls or React errors in the console.

#### 🌐 Network Errors
- 404: Page or API endpoint not found
- 500: Server error
- 403: Authentication issues

#### 💥 Exceptions
Unhandled JavaScript exceptions that crash the page.

### Summary Report
At the end of the test run, you'll see:
```
📊 MIGRATION ERROR SUMMARY
==========================================
Total pages tested: 25
Pages with errors: 3
Pages with hydration errors: 1

🔥 HYDRATION ERRORS:
  - http://localhost:3000/o/1/events/123
```

## Customizing Tests

### Adding More Routes
Edit `ROUTES_TO_TEST` in `migration-checker.spec.ts`:

```typescript
const ROUTES_TO_TEST = [
  { path: '/your/route', description: 'Your route description' },
];
```

### Filtering Expected Errors
Some errors might be expected or known. To filter them out:

```typescript
page.on('console', (msg) => {
  if (msg.type() === 'error') {
    const text = msg.text();

    // Filter out known/expected errors
    if (text.includes('Expected error message')) {
      return;
    }

    report.consoleErrors.push(text);
  }
});
```

### Adjusting Timeouts
If pages take longer to load, adjust the timeout:

```typescript
await page.goto(url, {
  waitUntil: 'networkidle',
  timeout: 30000, // Increase to 30 seconds
});
```

## CI/CD Integration

### GitHub Actions
Add to your workflow:

```yaml
- name: Run Migration Tests
  run: yarn playwright:migration

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: migration-test-results
    path: |
      playwright-report/
      integrationTesting/migration-error-report.json
```

## Best Practices

### 1. Test Incrementally
Don't try to test all routes at once. Start with critical pages:
- Home page
- Main navigation pages
- Most used features

### 2. Use Real Test Data
Use real IDs from your test database for dynamic routes. Create seed data if needed.

### 3. Run Tests Regularly
Run the migration checker after each batch of changes:
```bash
# After fixing some pages
yarn playwright:migration
```

### 4. Track Progress
Use the JSON report to track errors over time:
```bash
# Save reports with timestamps
cp integrationTesting/migration-error-report.json \
   reports/migration-$(date +%Y%m%d-%H%M%S).json
```

### 5. Prioritize Hydration Errors
Hydration errors are critical and should be fixed first, as they indicate mismatches between server and client rendering.

## Troubleshooting

### "Map container is already initialized"
Leaflet maps need special handling. See the fix in:
- `src/features/areaAssignments/components/OrganizerMap.tsx`

### "Hydration failed"
Check for:
- `new Date()` calls during render (use `useMemo` or `useEffect`)
- `localStorage` access during SSR (use `useEffect`)
- Conditional rendering based on `typeof window`

### Tests timing out
Increase timeout or check if dev server is running:
```typescript
await page.goto(url, {
  waitUntil: 'networkidle',
  timeout: 30000,
});
```

## Resources

- [Next.js App Router Migration Docs](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [React Hydration Errors](https://nextjs.org/docs/messages/react-hydration-error)
- [Playwright Testing Docs](https://playwright.dev/docs/intro)
