/**
 * Route Discovery Script
 *
 * Scans the /pages and /app directories to find all routes in the application
 * Useful for comprehensive migration testing
 *
 * Usage: npx ts-node scripts/discover-routes.ts
 */

import fs from 'fs';
import path from 'path';

type RouteInfo = {
  path: string;
  filePath: string;
  isDynamic: boolean;
  isLayout: boolean;
  router: 'pages' | 'app';
};

const routes: RouteInfo[] = [];

function convertFilePathToRoute(
  filePath: string,
  baseDir: string,
  router: 'pages' | 'app'
): string {
  // Remove base directory and file extension
  let route = filePath
    .replace(baseDir, '')
    .replace(/\.(tsx?|jsx?)$/, '')
    .replace(/\/index$/, '');

  // Handle dynamic segments
  route = route.replace(/\[([^\]]+)\]/g, ':$1');

  // Handle catch-all routes
  route = route.replace(/\[\.\.\.(.*?)\]/g, '*');

  // Ensure route starts with /
  if (!route.startsWith('/')) {
    route = '/' + route;
  }

  // Root index becomes /
  if (route === '' || route === '/') {
    route = '/';
  }

  return route;
}

function scanDirectory(dir: string, baseDir: string, router: 'pages' | 'app') {
  if (!fs.existsSync(dir)) {
    return;
  }

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip special Next.js directories
      if (file === 'api' || file === '_app' || file === '_document') {
        continue;
      }
      scanDirectory(filePath, baseDir, router);
    } else if (stat.isFile()) {
      // Skip non-page files
      if (
        file.startsWith('_') ||
        file === 'middleware.ts' ||
        file === 'middleware.js' ||
        file.includes('.test.') ||
        file.includes('.spec.')
      ) {
        continue;
      }

      // Only process page/layout files
      const isLayout = file.startsWith('layout.');
      const isPage =
        file.startsWith('page.') ||
        file === 'index.tsx' ||
        file === 'index.ts' ||
        file.match(/^[^.]+\.(tsx?|jsx?)$/);

      if (isPage || isLayout) {
        const route = convertFilePathToRoute(filePath, baseDir, router);
        const isDynamic = route.includes(':') || route.includes('*');

        routes.push({
          path: route,
          filePath: filePath.replace(process.cwd(), ''),
          isDynamic,
          isLayout,
          router,
        });
      }
    }
  }
}

// Scan both directories
const pagesDir = path.join(process.cwd(), 'src', 'pages');
const appDir = path.join(process.cwd(), 'src', 'app');

console.log('🔍 Discovering routes...\n');

scanDirectory(pagesDir, pagesDir, 'pages');
scanDirectory(appDir, appDir, 'app');

// Sort routes
routes.sort((a, b) => a.path.localeCompare(b.path));

// Group by router
const pageRoutes = routes.filter((r) => r.router === 'pages' && !r.isLayout);
const appRoutes = routes.filter((r) => r.router === 'app' && !r.isLayout);
const staticRoutes = routes.filter((r) => !r.isDynamic && !r.isLayout);
const dynamicRoutes = routes.filter((r) => r.isDynamic && !r.isLayout);

console.log('📊 Route Discovery Summary:');
console.log('═'.repeat(80));
console.log(`Total routes found: ${routes.filter((r) => !r.isLayout).length}`);
console.log(`  - Pages Router: ${pageRoutes.length}`);
console.log(`  - App Router: ${appRoutes.length}`);
console.log(`  - Static routes: ${staticRoutes.length}`);
console.log(`  - Dynamic routes: ${dynamicRoutes.length}`);
console.log('═'.repeat(80));

console.log('\n📄 PAGES ROUTER ROUTES:');
console.log('-'.repeat(80));
pageRoutes.forEach((route) => {
  const indicator = route.isDynamic ? '🔄' : '📄';
  console.log(`${indicator} ${route.path}`);
  console.log(`   ${route.filePath}`);
});

console.log('\n📱 APP ROUTER ROUTES:');
console.log('-'.repeat(80));
appRoutes.forEach((route) => {
  const indicator = route.isDynamic ? '🔄' : '📄';
  console.log(`${indicator} ${route.path}`);
  console.log(`   ${route.filePath}`);
});

console.log('\n💡 DYNAMIC ROUTES (need test data):');
console.log('-'.repeat(80));
dynamicRoutes.forEach((route) => {
  console.log(`${route.path} (${route.router})`);
  // Extract parameter names
  const params = [...route.path.matchAll(/:(\w+)/g)].map((m) => m[1]);
  if (params.length > 0) {
    console.log(`   Parameters: ${params.join(', ')}`);
  }
});

// Generate a test data template
console.log('\n🧪 SUGGESTED TEST ROUTES:');
console.log('-'.repeat(80));
console.log('// Add these to your migration-checker.spec.ts:');
console.log('const ROUTES_TO_TEST = [');

// Static routes
staticRoutes.slice(0, 10).forEach((route) => {
  console.log(`  { path: '${route.path}', description: '${path.basename(route.filePath, path.extname(route.filePath))}' },`);
});

// Dynamic routes with example IDs
console.log('  // Dynamic routes (replace with real test IDs):');
dynamicRoutes.slice(0, 10).forEach((route) => {
  const testPath = route.path
    .replace(/:orgId/g, '1')
    .replace(/:campId/g, '147')
    .replace(/:projId/g, '147')
    .replace(/:eventId/g, '123')
    .replace(/:surveyId/g, '1')
    .replace(/:emailId/g, '40')
    .replace(/:callAssId/g, '1')
    .replace(/:areaAssId/g, '1')
    .replace(/:areaId/g, '1')
    .replace(/:id/g, '1');

  console.log(`  { path: '${testPath}', description: '${path.basename(route.filePath, path.extname(route.filePath))}' },`);
});

console.log('];');

// Save to JSON for programmatic use
const outputPath = path.join(process.cwd(), 'discovered-routes.json');
fs.writeFileSync(
  outputPath,
  JSON.stringify(
    {
      summary: {
        total: routes.filter((r) => !r.isLayout).length,
        pagesRouter: pageRoutes.length,
        appRouter: appRoutes.length,
        static: staticRoutes.length,
        dynamic: dynamicRoutes.length,
      },
      routes: routes.filter((r) => !r.isLayout),
    },
    null,
    2
  )
);

console.log(`\n💾 Routes saved to: ${outputPath}`);
