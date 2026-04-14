import { GoogleAnalytics as NextGA } from "@next/third-parties/google";

export default function GoogleAnalytics({ measurementId }) {
  if (!measurementId) return null;
  return <NextGA gaId={measurementId} />;
}
