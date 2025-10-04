import * as Sentry from '@sentry/nextjs';

// Initialize Sentry client
import './sentry.client.config';

// Export router transition hook for navigation instrumentation
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
