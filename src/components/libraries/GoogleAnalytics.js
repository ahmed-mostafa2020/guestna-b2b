import { GoogleAnalytics as NextGA } from "@next/third-parties/google";

export default function GoogleAnalytics({ measurementId, nonce }) {
  if (!measurementId) return null;
  return <NextGA gaId={measurementId} nonce={nonce} />;
}
