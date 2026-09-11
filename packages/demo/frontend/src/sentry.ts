import * as Sentry from "@sentry/react";

if (
  typeof window !== "undefined" &&
  window.location.hostname === "nusr.github.io" &&
  !Sentry.isInitialized()
) {
  Sentry.init({
    dsn: "https://b292d91ba509038c141ecfc7d10e7bb7@o4506851168092160.ingest.us.sentry.io/4506851171041280",
    integrations: [
      // If you're using react router, use the integration for your react router version instead.
      // Learn more at
      // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for tracing.
    // Learn more at
    // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
    tracesSampleRate: 1.0,
    // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
    tracePropagationTargets: [/^https:\/\/nusr\.github\.io/],
    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    // Learn more at
    // https://docs.sentry.io/platforms/javascript/session-replay/configuration/#general-integration-configuration
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    release: window.__bundle_info?.commit_id,
  });
}
