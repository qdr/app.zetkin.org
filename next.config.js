/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Block cross-origin requests during development.
   *
   * Without this, when running next dev, malicious website can:
   * - Initiate a WebSocket connection to localhost and interact
   *   with the local development server, potentially exposing
   *   internal component code.
   * - Inject a <script> tag referencing predictable paths for
   *   development scripts (e.g., /app/page.js), which are then
   *   executed in the attacker's origin.
   *
   * See https://vercel.com/changelog/cve-2025-48068
   */
  allowedDevOrigins: [],

  // Performance optimizations
  // Note: compiler.removeConsole is not compatible with Turbopack
  // Use a babel plugin or eslint rule to remove console logs if needed

  // Optimize imports for Material-UI and other large libraries
  // Note: modularizeImports can cause issues with re-exported utilities
  // Using optimizePackageImports in experimental section instead
  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}',
    },
  },

  // Enable SWC minification (faster than Terser)
  swcMinify: true,

  experimental: {
    // Note: esmExternals is not compatible with Turbopack
    // If you need to disable Turbopack, uncomment the line below:
    // esmExternals: "loose",
    serverComponentsExternalPackages: ["mjml", "mongoose"],

    // Optimize package imports (reduces bundle size and improves HMR)
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'lodash'],

    // Turbopack-specific optimizations
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    domains: [
      `files.${process.env.ZETKIN_API_DOMAIN}`,
  // Moved from experimental in Next.js 15
  serverExternalPackages: ['mjml', 'mongoose', 'canvas'],

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Optimize production builds
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.zetkin.org',
      },
      {
        protocol: 'http',
        hostname: '**.zetkin.org',
      },
      {
        // localhost added for playwright testing
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Turbopack configuration for faster development
  turbopack: {
    root: process.cwd(),
  },

  // Webpack configuration for production optimization
  webpack: (config, { isServer }) => {
    // Optimize production builds
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for node_modules
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk for shared code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/storybook',
        destination: '/storybook/index.html',
        permanent: true,
      },
      {
        source: '/docs',
        destination: '/docs/index.html',
        permanent: true,
      },
      {
        source: '/my',
        destination: '/my/home',
        permanent: false,
      },
      {
        source: '/:prevPath*/calendar/events',
        destination: '/:prevPath*/calendar',
        permanent: false,
      },
      {
        source: '/:prevPath*/calendar/tasks',
        destination: '/:prevPath*/calendar',
        permanent: false,
      },
      {
        source: `/organize/:orgId/people/views`,
        destination: '/organize/:orgId/people',
        permanent: true,
      },
      {
        source: `/organize/:orgId`,
        destination: '/organize/:orgId/projects',
        permanent: false,
      },
      // redirects to Gen2 for MVP August 2021
      {
        source: '/organize/:orgId(\\d{1,})',
        destination: '/legacy?orgId=:orgId',
        permanent: false,
      },
      {
        source:
          '/organize/:orgId(\\d{1,})/projects/calendar/events/:eventId(\\d{1,})',
        destination: '/legacy?path=/campaign/action%3A:eventId&orgId=:orgId',
        permanent: false,
      },
      {
        source:
          '/organize/:orgId(\\d{1,})/projects/:campId(\\d{1,})/calendar/events/:eventId(\\d{1,})',
        destination: '/legacy?path=/campaign/action%3A:eventId&orgId=:orgId',
        permanent: false,
      },
      {
        source: '/organize/:orgId/campaigns/:path*',
        destination: '/organize/:orgId/projects/:path*',
        permanent: false,
      },
      {
        source: '/organize/:orgId/people/views/:path*',
        destination: '/organize/:orgId/people/lists/:path*',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
