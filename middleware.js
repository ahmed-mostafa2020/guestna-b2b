import { NextResponse } from "next/server";

const locales = ["en", "ar"];
const defaultLocale = "ar";

/**
 * Build a full Content-Security-Policy string with a per-request nonce.
 * The nonce replaces 'unsafe-inline' for scripts, eliminating XSS risk
 * from inline script injection while still allowing our own inline scripts.
 */
function buildCSP(nonce) {
  return [
    // Block everything not explicitly allowed
    "default-src 'self'",

    // Scripts: only our domain + nonce-verified inlines + trusted CDNs
    // 'strict-dynamic' trusts scripts loaded by a nonce-verified script (Next.js chunks)
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://*.googletagmanager.com https://tagmanager.google.com https://www.google-analytics.com https://cdn.moyasar.com https://cdn.tamara.co`,

    // Styles: unsafe-inline kept — CSS-in-JS and Tailwind require it
    // GTM hosts: Tag Assistant / Preview mode badge styles
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.googletagmanager.com https://tagmanager.google.com",

    // Fonts: Google Fonts CDN (data: for GTM Preview mode)
    "font-src 'self' data: https://fonts.gstatic.com",

    // Images: trusted CDNs + data URIs for base64
    "img-src 'self' data: blob: https://res.cloudinary.com https://ik.imagekit.io https://storage.googleapis.com https://drive.google.com https://*.googletagmanager.com https://*.google-analytics.com https://*.g.doubleclick.net https://*.google.com https://*.google.com.sa https://ssl.gstatic.com https://www.gstatic.com",

    // API calls: payment gateways + error tracking + analytics
    // GA4 sends hits to regional hosts (region1.google-analytics.com, *.analytics.google.com),
    // and Google Signals uses doubleclick / google.<tld> — per Google's GA4 CSP guide
    "connect-src 'self' https://api.moyasar.com https://cdn.tamara.co https://*.sentry.io https://sentry.io https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.g.doubleclick.net https://*.google.com https://*.google.com.sa",

    // Iframes: Moyasar payment widget only
    "frame-src 'self' https://api.moyasar.com https://cdn.moyasar.com",

    // Prevent this site from being embedded in foreign pages (clickjacking)
    "frame-ancestors 'self' https://api.moyasar.com",

    // Block form submissions to external domains
    "form-action 'self'",

    // Auto-upgrade any accidental http:// requests to https://
    "upgrade-insecure-requests",
  ].join("; ");
}

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Redirect to default locale if missing
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const newUrl = new URL(
      `/${defaultLocale}${pathname === "/" ? "" : pathname}`,
      request.url
    );
    return NextResponse.redirect(newUrl);
  }

  // Generate a cryptographically random nonce for this request
  const nonce = btoa(crypto.randomUUID());

  // Forward the nonce to the layout via a request header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Attach the CSP with the nonce to the response
  response.headers.set("Content-Security-Policy", buildCSP(nonce));

  return response;
}

// Only match routes that don't have file extensions and don't start with excluded paths
export const config = {
  matcher: [
    // Match all paths except those that:
    // - Start with /api, /_next, /static
    // - End with a file extension (e.g., .jpg, .png)
    "/((?!api|_next|static|.*\\..*).*)",
  ],
};
