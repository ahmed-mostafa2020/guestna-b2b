import { GoogleTagManager as NextGTM } from "@next/third-parties/google";

export default function GoogleTagManager({ gtmId, nonce }) {
  if (!gtmId) return null;
  // nonce is required: the inline GTM bootstrap is blocked by the nonce-based CSP without it
  return <NextGTM gtmId={gtmId} nonce={nonce} />;
}
