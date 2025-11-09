import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  // Ensure proper build output for Vercel
  output: 'standalone',
  // External packages for server components
  serverExternalPackages: ['@supabase/ssr'],
  // Allow build to complete with ESLint warnings
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

// Sentry configuration
const sentryWebpackPluginOptions = {
  org: "your-sentry-org",
  project: "paiefacile",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
