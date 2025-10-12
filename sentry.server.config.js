// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://47dd633ac91bb97e9ceefca2a80344c0@o4505710840709120.ingest.us.sentry.io/4510176638599168",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  // Reduced from 1.0 to 0.1 (10%) to improve server performance
  tracesSampleRate: 0.1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
