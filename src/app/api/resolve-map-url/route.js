import { NextResponse } from "next/server";
import { extractCoordsFromMapUrl } from "@utils/helpers/mapHelpers";

const ALLOWED_HOSTS = [
  "maps.app.goo.gl",
  "goo.gl",
  "maps.google.com",
  "google.com",
  "www.google.com",
];

const isAllowedHost = (hostname) => {
  const host = hostname.toLowerCase();
  return (
    ALLOWED_HOSTS.includes(host) ||
    host.endsWith(".google.com") ||
    host.endsWith(".goo.gl")
  );
};

/**
 * POST /api/resolve-map-url
 *
 * Resolves a Google Maps short URL (maps.app.goo.gl, goo.gl/maps)
 * by following redirects server-side with SSRF protection and returning the final URL
 * and parsed coordinates.
 */
export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    // Parse URL and enforce strict hostname validation to prevent SSRF
    let parsedUrl;
    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    if (
      !["http:", "https:"].includes(parsedUrl.protocol) ||
      !isAllowedHost(parsedUrl.hostname)
    ) {
      return NextResponse.json(
        { error: "Only Google Maps URLs are supported" },
        { status: 400 }
      );
    }

    // Follow redirects with a 6-second timeout
    let finalUrl = targetUrl;
    try {
      const response = await fetch(targetUrl, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(6000),
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
      finalUrl = response.url || targetUrl;
    } catch (fetchErr) {
      // If network error or timeout, proceed with initial targetUrl to attempt regex parsing
      console.warn("URL redirect resolution failed:", fetchErr?.message || fetchErr);
    }

    const coords = extractCoordsFromMapUrl(finalUrl);

    return NextResponse.json({
      resolvedUrl: finalUrl,
      coords: coords || null,
    });
  } catch (error) {
    console.error("Failed to resolve map URL:", error);
    return NextResponse.json(
      { error: "Failed to resolve URL" },
      { status: 500 }
    );
  }
}

