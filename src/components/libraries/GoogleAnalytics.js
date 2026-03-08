"use client";

import { GoogleAnalytics as NextGA } from "@next/third-parties/google";

export default function GoogleAnalytics({ measurementId }) {
  // Use the native Next.js Google Analytics component instead of 
  // incorrectly passing a GA Measurement ID (G-...) to the GTM component.
  return <NextGA gaId={measurementId} />;
}
