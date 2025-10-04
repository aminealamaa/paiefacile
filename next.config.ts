import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { withSentryConfig } from '@sentry/nextjs';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Ensure proper build output for Vercel
  output: 'standalone',
  // External packages for server components
  serverExternalPackages: ['@supabase/ssr']
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

export default withSentryConfig(withNextIntl(nextConfig), sentryWebpackPluginOptions);
