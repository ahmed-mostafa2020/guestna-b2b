import { NextResponse } from "next/server";

const locales = ["en", "ar"];
const defaultLocale = "ar";

export function middleware(request) {
  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname;

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If there's no locale in the pathname, redirect to the default locale
  if (!pathnameHasLocale) {
    // Create the new URL with the default locale
    const newUrl = new URL(
      `/${defaultLocale}${pathname === "/" ? "" : pathname}`,
      request.url
    );

    // Return a redirect response
    return NextResponse.redirect(newUrl);
  }
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
