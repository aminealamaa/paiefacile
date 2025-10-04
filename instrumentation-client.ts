import * as Sentry from '@sentry/nextjs';

// Initialize Sentry client with the same configuration as sentry.client.config.ts
Sentry.init({
  dsn: "https://7eacab2c3c01caa0ef4ac4d9937cea6d@o4510131738247168.ingest.de.sentry.io/4510131740999760",
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  replaysOnErrorSampleRate: 1.0,
  
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,
  
  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});

// Export router transition hook for navigation instrumentation
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
