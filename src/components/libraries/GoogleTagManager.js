"use client";

import { GoogleTagManager as NextGTM } from "@next/third-parties/google";

export default function GoogleTagManager({ gtmId }) {
  // Using the official Next.js third-parties library automatically handles
  // both the script and the noscript iframe fallback safely and optimally.
  return <NextGTM gtmId={gtmId || "GTM-PLN2P4N6"} />;
}
