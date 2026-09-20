// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration(),
  ],

  // Suppress noise we cannot fix from our codebase:
  // - SW register failures: still happen in private mode / locked storage / extensions
  // - sw.js script load: transient during deploys; auto-recovers on next load
  // - "onion": injected by some browser extensions (Brave, wallet plugins)
  // - HTMLDialogElement: Google Maps internals on very old Safari/iOS
  ignoreErrors: [
    /Service ?Worker.*register/i,
    /Failed to register a ServiceWorker/i,
    /sw\.js.*load failed/i,
    /Script.*sw\.js/i,
    /Could not load ["']?onion["']?/i,
    /Can't find variable: HTMLDialogElement/i,
    /HTMLDialogElement is not defined/i,
    // Common third-party / browser noise — not actionable from app code
    /Non-Error promise rejection captured/i,
    /ResizeObserver loop limit exceeded/i,
    /ResizeObserver loop completed with undelivered notifications/i,
    // Google Maps Legacy Marker touch-event bug on Android
    /Cannot read properties of null \(reading 'clientX'\)/i,
    // Safari SW registration rejection (no details provided)
    /^Rejected$/,
    // Brave browser privacy protection injects __firefox__ variable
    /__firefox__/i,
    /Can't find variable: __firefox__/i,
    // Transient PWA / workbox errors (offline, deploy, storage full)
    /Failed to execute 'put' on 'Cache'/i,
    /Cannot read properties of undefined \(reading 'waiting'\)/i,
    // Browser extensions (MetaMask, wallets, ad blockers, VPNs)
    /MetaMask/i,
    /Cannot read properties of undefined \(reading 'M_ID'\)/i,
    // Webpack chunk load failures during deployments
    /ChunkLoadError/i,
    /Loading chunk [\d]+ failed/i,
  ],

  // Deny errors originating from browser extensions injected into pages
  denyUrls: [
    /extensions\//i,
    /^chrome-extension:\/\//i,
    /^moz-extension:\/\//i,
    /^safari-web-extension:\/\//i,
    /executors\//i,
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  // Reduced from 1.0 to 0.1 (10%) to improve performance - only sample 10% of transactions
  tracesSampleRate: 0.1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 5%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  // Reduced from 0.1 to 0.05 (5%) to reduce performance overhead
  replaysSessionSampleRate: 0.05,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;