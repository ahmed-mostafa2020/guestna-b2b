"use client";

import GoogleTagManager from "./GoogleTagManager";

export default function GoogleAnalytics({ measurementId }) {
  return <GoogleTagManager gtmId={measurementId} />;
}
