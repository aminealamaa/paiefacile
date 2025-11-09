import * as Sentry from '@sentry/nextjs';

// Initialize Sentry server with the same configuration
Sentry.init({
  dsn: "https://7eacab2c3c01caa0ef4ac4d9937cea6d@o4510131738247168.ingest.de.sentry.io/4510131740999760",
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

export async function register() {
  // Sentry is already initialized above
}

// Export request error hook for server-side error capture
export const onRequestError = Sentry.captureRequestError;
