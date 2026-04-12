export const metadata = {
  title: 'Email Templates Preview — Guestna B2B',
  description: 'Internal preview page for Guestna B2B email templates',
  robots: { index: false, follow: false },
};

export default function EmailTemplatesLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`* { box-sizing: border-box; } body { margin: 0; padding: 0; }`}</style>
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
