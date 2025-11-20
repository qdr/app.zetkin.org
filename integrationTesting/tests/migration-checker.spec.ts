import { test, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Migration Error Checker
 *
 * This test suite visits all specified routes and collects:
 * - Console errors
 * - Hydration errors
 * - Network errors (404s, 500s)
 * - Unhandled exceptions
 *
 * Results are logged to help identify issues during Pages Router -> App Router migration
 */

type ErrorReport = {
  url: string;
  consoleErrors: string[];
  hydrationErrors: string[];
  networkErrors: string[];
  exceptions: string[];
};

// Define routes to test
// Comprehensive list of all routes in the application (76 total)
const ROUTES_TO_TEST = [
  // APP ROUTER - 18 routes (migrated from Pages Router)
  { path: '/call/1', description: 'Call assignment', router: 'app' },
  { path: '/call', description: 'Call redirect', router: 'app' },
  { path: '/canvass/58/areas/1', description: 'Canvass area detail', router: 'app' },
  { path: '/canvass/58/areas', description: 'Canvass areas', router: 'app' },
  { path: '/canvass/58', description: 'Canvass assignment', router: 'app' },
  { path: '/my/feed', description: 'My feed', router: 'app' },
  { path: '/my/home', description: 'My home', router: 'app' },
  { path: '/my/settings', description: 'My settings', router: 'app' },
  { path: '/o/1', description: 'Organization home', router: 'app' },
  { path: '/o/1/suborgs', description: 'Sub-organizations', router: 'app' },
  { path: '/o/1/embedjoinform/test', description: 'Embed join form', router: 'app' },
  { path: '/o/1/events/123', description: 'Public event', router: 'app' },
  { path: '/o/1/joinformverified', description: 'Join form verified', router: 'app' },
  { path: '/o/1/projects/147', description: 'Public project', router: 'app' },
  { path: '/o/1/surveys/1', description: 'Public survey', router: 'app' },
  { path: '/o/1/unsubscribe', description: 'Unsubscribe page', router: 'app' },
  { path: '/o/1/unsubscribed', description: 'Unsubscribed confirmation', router: 'app' },
  { path: '/o/1/viewmail/40', description: 'View email', router: 'app' },

  // PAGES ROUTER - 58 routes (remaining to be migrated)
  { path: '/', description: 'Home page', router: 'pages' },
  { path: '/404', description: '404 page', router: 'pages' },
  { path: '/legacy', description: 'Legacy redirect', router: 'pages' },
  { path: '/login', description: 'Login page', router: 'pages' },
  { path: '/logout', description: 'Logout page', router: 'pages' },
  { path: '/organize', description: 'Organize redirect', router: 'pages' },
  { path: '/organize/1/geography', description: 'Geography page', router: 'pages' },
  { path: '/organize/1/journeys', description: 'Journeys overview', router: 'pages' },
  { path: '/organize/1/journeys/1', description: 'Journey detail', router: 'pages' },
  { path: '/organize/1/journeys/1/new', description: 'New journey instance', router: 'pages' },
  { path: '/organize/1/journeys/1/closed', description: 'Closed journey instances', router: 'pages' },
  { path: '/organize/1/journeys/1/1', description: 'Journey instance', router: 'pages' },
  { path: '/organize/1/journeys/1/1/milestones', description: 'Journey milestones', router: 'pages' },
  { path: '/organize/1/people', description: 'People overview', router: 'pages' },
  { path: '/organize/1/people/1', description: 'Person detail', router: 'pages' },
  { path: '/organize/1/people/1/manage', description: 'Manage person', router: 'pages' },
  { path: '/organize/1/people/duplicates', description: 'Duplicate people', router: 'pages' },
  { path: '/organize/1/people/folders/1', description: 'People folder', router: 'pages' },
  { path: '/organize/1/people/incoming', description: 'Incoming people', router: 'pages' },
  { path: '/organize/1/people/joinforms', description: 'Join forms', router: 'pages' },
  { path: '/organize/1/people/lists/1', description: 'People list', router: 'pages' },
  { path: '/organize/1/people/lists/1/shared', description: 'Shared people list', router: 'pages' },
  { path: '/organize/1/people/lists/callblocked', description: 'Call blocked list', router: 'pages' },
  { path: '/organize/1/projects', description: 'Projects overview', router: 'pages' },
  { path: '/organize/1/projects/147', description: 'Project detail', router: 'pages' },
  { path: '/organize/1/projects/147/activities', description: 'Project activities', router: 'pages' },
  { path: '/organize/1/projects/147/archive', description: 'Project archive', router: 'pages' },
  { path: '/organize/1/projects/147/calendar', description: 'Project calendar', router: 'pages' },
  { path: '/organize/1/projects/147/calendar/tasks/1', description: 'Calendar task detail', router: 'pages' },
  { path: '/organize/1/projects/147/areaassignments/58', description: 'Area assignment detail', router: 'pages' },
  { path: '/organize/1/projects/147/areaassignments/58/instructions', description: 'Area assignment instructions', router: 'pages' },
  { path: '/organize/1/projects/147/areaassignments/58/map', description: 'Area assignment map', router: 'pages' },
  { path: '/organize/1/projects/147/areaassignments/58/report', description: 'Area assignment report', router: 'pages' },
  { path: '/organize/1/projects/147/callassignments/1', description: 'Call assignment detail', router: 'pages' },
  { path: '/organize/1/projects/147/callassignments/1/callers', description: 'Call assignment callers', router: 'pages' },
  { path: '/organize/1/projects/147/callassignments/1/conversation', description: 'Call conversation', router: 'pages' },
  { path: '/organize/1/projects/147/emails', description: 'Emails overview', router: 'pages' },
  { path: '/organize/1/projects/147/emails/40', description: 'Email detail', router: 'pages' },
  { path: '/organize/1/projects/147/emails/40/compose', description: 'Compose email', router: 'pages' },
  { path: '/organize/1/projects/147/emails/40/insights', description: 'Email insights', router: 'pages' },
  { path: '/organize/1/projects/147/events', description: 'Project events', router: 'pages' },
  { path: '/organize/1/projects/147/events/123', description: 'Event detail', router: 'pages' },
  { path: '/organize/1/projects/147/events/123/participants', description: 'Event participants', router: 'pages' },
  { path: '/organize/1/projects/147/surveys/1', description: 'Survey detail', router: 'pages' },
  { path: '/organize/1/projects/147/surveys/1/questions', description: 'Survey questions', router: 'pages' },
  { path: '/organize/1/projects/147/surveys/1/submissions', description: 'Survey submissions', router: 'pages' },
  { path: '/organize/1/projects/147/tasks', description: 'Tasks overview', router: 'pages' },
  { path: '/organize/1/projects/147/tasks/1', description: 'Task detail', router: 'pages' },
  { path: '/organize/1/projects/147/tasks/1/assignees', description: 'Task assignees', router: 'pages' },
  { path: '/organize/1/projects/147/tasks/1/insights', description: 'Task insights', router: 'pages' },
  { path: '/organize/1/projects/activities', description: 'All projects activities', router: 'pages' },
  { path: '/organize/1/projects/archive', description: 'All projects archive', router: 'pages' },
  { path: '/organize/1/projects/calendar', description: 'All projects calendar', router: 'pages' },
  { path: '/organize/1/projects/shared', description: 'Shared projects', router: 'pages' },
  { path: '/organize/1/projects/shared/activities', description: 'Shared projects activities', router: 'pages' },
  { path: '/organize/1/projects/shared/archive', description: 'Shared projects archive', router: 'pages' },
  { path: '/organize/1/settings', description: 'Organization settings', router: 'pages' },
  { path: '/organize/1/suborgOverview', description: 'Sub-org overview', router: 'pages' },
  { path: '/organize/1/tags', description: 'Tags management', router: 'pages' },
];

const errorReports: ErrorReport[] = [];

async function setupErrorListeners(page: Page, url: string): Promise<ErrorReport> {
  const report: ErrorReport = {
    url,
    consoleErrors: [],
    hydrationErrors: [],
    networkErrors: [],
    exceptions: [],
  };

  // Listen for console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      report.consoleErrors.push(text);

      // Detect hydration errors
      if (text.includes('Hydration') || text.includes('hydration')) {
        report.hydrationErrors.push(text);
      }
    }
  });

  // Listen for page errors
  page.on('pageerror', (error) => {
    report.exceptions.push(error.message);
  });

  // Listen for failed requests
  page.on('response', (response) => {
    if (response.status() >= 400) {
      report.networkErrors.push(
        `${response.status()} ${response.url()}`
      );
    }
  });

  return report;
}

test.describe('Migration Error Checker', () => {
  test.beforeEach(async ({ page }) => {
    // Suppress expected errors in console if needed
    page.on('console', (msg) => {
      // You can filter out known/expected errors here
    });
  });

  for (const route of ROUTES_TO_TEST) {
    test(`should check ${route.description} [${route.router}] (${route.path})`, async ({ page }) => {
      const url = `http://localhost:3000${route.path}`;
      const report = await setupErrorListeners(page, url);

      try {
        // Navigate to the page with a reasonable timeout
        await page.goto(url, {
          waitUntil: 'networkidle',
          timeout: 10000,
        });

        // Wait a bit for any async errors to surface
        await page.waitForTimeout(2000);

        // Check if page loaded
        const title = await page.title();
        expect(title).toBeTruthy();

      } catch (error) {
        report.exceptions.push(`Navigation failed: ${error}`);
      }

      // Store report
      errorReports.push(report);

      // Log errors for this page
      if (
        report.consoleErrors.length > 0 ||
        report.hydrationErrors.length > 0 ||
        report.networkErrors.length > 0 ||
        report.exceptions.length > 0
      ) {
        console.log(`\n❌ Errors found on ${route.description} (${route.path}):`);

        if (report.hydrationErrors.length > 0) {
          console.log('  🔥 Hydration Errors:');
          report.hydrationErrors.forEach((err) => {
            console.log(`    - ${err.substring(0, 150)}...`);
          });
        }

        if (report.consoleErrors.length > 0) {
          console.log('  ⚠️  Console Errors:');
          report.consoleErrors.forEach((err) => {
            console.log(`    - ${err.substring(0, 150)}...`);
          });
        }

        if (report.networkErrors.length > 0) {
          console.log('  🌐 Network Errors:');
          report.networkErrors.forEach((err) => {
            console.log(`    - ${err}`);
          });
        }

        if (report.exceptions.length > 0) {
          console.log('  💥 Exceptions:');
          report.exceptions.forEach((err) => {
            console.log(`    - ${err.substring(0, 150)}...`);
          });
        }
      } else {
        console.log(`✅ ${route.description} (${route.path}) - No errors`);
      }

      // Don't fail the test, just collect data
      // Remove this line if you want tests to fail on errors
      // expect(report.consoleErrors.length).toBe(0);
    });
  }

  test.afterAll(async () => {
    // Generate summary report
    console.log('\n\n📊 MIGRATION ERROR SUMMARY');
    console.log('=' .repeat(80));

    const pagesWithErrors = errorReports.filter(
      (r) =>
        r.consoleErrors.length > 0 ||
        r.hydrationErrors.length > 0 ||
        r.networkErrors.length > 0 ||
        r.exceptions.length > 0
    );

    const pagesWithHydrationErrors = errorReports.filter(
      (r) => r.hydrationErrors.length > 0
    );

    console.log(`\nTotal pages tested: ${errorReports.length}`);
    console.log(`Pages with errors: ${pagesWithErrors.length}`);
    console.log(`Pages with hydration errors: ${pagesWithHydrationErrors.length}`);

    if (pagesWithHydrationErrors.length > 0) {
      console.log('\n🔥 HYDRATION ERRORS:');
      pagesWithHydrationErrors.forEach((report) => {
        console.log(`  - ${report.url}`);
      });
    }

    // Save detailed report to file
    const reportPath = path.join(
      __dirname,
      '..',
      'migration-error-report.json'
    );
    fs.writeFileSync(reportPath, JSON.stringify(errorReports, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    console.log('=' .repeat(80));
  });
});
