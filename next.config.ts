import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Ensure proper build output for Vercel
  output: 'standalone',
  // External packages for server components
  serverExternalPackages: ['@supabase/ssr']
};

export default withNextIntl(nextConfig);
