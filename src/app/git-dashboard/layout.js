import "../globals.css";

export const metadata = {
  title: "Git Dashboard",
  description: "Manage Git branches - Checkout & Pull",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function GitDashboardLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
