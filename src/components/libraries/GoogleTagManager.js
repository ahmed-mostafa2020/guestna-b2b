import { GoogleTagManager as NextGTM } from "@next/third-parties/google";

export default function GoogleTagManager({ gtmId }) {
  if (!gtmId) return null;
  return <NextGTM gtmId={gtmId} />;
}
