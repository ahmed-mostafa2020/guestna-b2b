import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";
import BugsnagPerformance from "@bugsnag/browser-performance";

const BugsnagKey = process.env.NEXT_PUBLIC_BUGSNAG_KEY;

// Initialize Bugsnag only on the client side
if (typeof window !== "undefined") {
  Bugsnag.start({
    apiKey: BugsnagKey,
    plugins: [new BugsnagPluginReact()],
    enabledReleaseStages: ["production", "staging", "development"],
    releaseStage: process.env.NODE_ENV,
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    collectUserIp: false,
    onError: function (event) {
      // Add custom metadata
      event.addMetadata("app", {
        name: "Guestna B2B",
        locale:
          typeof window !== "undefined"
            ? window.location.pathname.split("/")[1]
            : "unknown",
      });
    },
  });

  // Initialize performance monitoring
  BugsnagPerformance.start({
    apiKey: BugsnagKey,
  });
}

export default Bugsnag;
