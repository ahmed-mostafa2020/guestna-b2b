import "../globals.css";

export const metadata = {
  title: "Git Dashboard",
  description: "Manage Git branches - Checkout & Pull",
};

export default function GitDashboardLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
