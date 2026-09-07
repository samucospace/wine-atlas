import type { Metadata } from "next";
import "./globals.css";
import "./design-system.css";

export const metadata: Metadata = {
  title: "Wine Atlas",
  description: "An independent reference for wine-growing regions.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
