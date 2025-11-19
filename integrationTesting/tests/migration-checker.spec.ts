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
// Using real test data from the database
const ROUTES_TO_TEST = [
  // APP ROUTER - Public routes (migrated)
  { path: '/', description: 'Home page', router: 'app' },

  // APP ROUTER - My routes (migrated)
  { path: '/my/home', description: 'My home', router: 'app' },
  { path: '/my/settings', description: 'My settings', router: 'app' },
  { path: '/my/feed', description: 'My feed', router: 'app' },

  // APP ROUTER - Organization routes (migrated)
  { path: '/o/1', description: 'Org home', router: 'app' },
  { path: '/o/1/suborgs', description: 'Sub-organizations', router: 'app' },
  { path: '/o/1/events/123', description: 'Event detail', router: 'app' },
  { path: '/o/1/projects/147', description: 'Project detail', router: 'app' },
  { path: '/o/1/viewmail/40', description: 'View email', router: 'app' },
  { path: '/o/1/surveys/1', description: 'Survey public page', router: 'app' },

  // PAGES ROUTER - Organize routes (critical pages to test)
  { path: '/organize/1/people', description: 'People page', router: 'pages' },
  { path: '/organize/1/geography', description: 'Geography page', router: 'pages' },
  { path: '/organize/1/projects/147', description: 'Organize project', router: 'pages' },
  { path: '/organize/1/projects/147/calendar', description: 'Project calendar', router: 'pages' },
  { path: '/organize/1/projects/147/events', description: 'Project events', router: 'pages' },
  { path: '/organize/1/projects/147/surveys/1', description: 'Survey overview', router: 'pages' },
  { path: '/organize/1/projects/339/areaassignments/58/map', description: 'Area assignment map', router: 'pages' },
  { path: '/organize/1/projects/147/tasks', description: 'Tasks overview', router: 'pages' },
  { path: '/organize/1/projects/147/emails', description: 'Emails overview', router: 'pages' },
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
